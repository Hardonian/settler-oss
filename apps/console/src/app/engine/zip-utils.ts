const encoder = new TextEncoder();

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true);
}

function writeUint16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}

function toArrayBuffer(data: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(data.byteLength);
  new Uint8Array(buffer).set(data);
  return buffer;
}

export type ZipEntryInput = {
  name: string;
  data: Uint8Array;
};

export function createZip(entries: ZipEntryInput[]): Blob {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  entries.forEach((entry) => {
    const nameBytes = encoder.encode(entry.name);
    const crc = crc32(entry.data);
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);

    writeUint32(localView, 0, 0x04034b50);
    writeUint16(localView, 4, 20);
    writeUint16(localView, 6, 0);
    writeUint16(localView, 8, 0);
    writeUint16(localView, 10, 0);
    writeUint16(localView, 12, 0);
    writeUint32(localView, 14, crc);
    writeUint32(localView, 18, entry.data.length);
    writeUint32(localView, 22, entry.data.length);
    writeUint16(localView, 26, nameBytes.length);
    writeUint16(localView, 28, 0);
    localHeader.set(nameBytes, 30);

    localParts.push(localHeader, entry.data);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);

    writeUint32(centralView, 0, 0x02014b50);
    writeUint16(centralView, 4, 20);
    writeUint16(centralView, 6, 20);
    writeUint16(centralView, 8, 0);
    writeUint16(centralView, 10, 0);
    writeUint16(centralView, 12, 0);
    writeUint16(centralView, 14, 0);
    writeUint32(centralView, 16, crc);
    writeUint32(centralView, 20, entry.data.length);
    writeUint32(centralView, 24, entry.data.length);
    writeUint16(centralView, 28, nameBytes.length);
    writeUint16(centralView, 30, 0);
    writeUint16(centralView, 32, 0);
    writeUint16(centralView, 34, 0);
    writeUint16(centralView, 36, 0);
    writeUint32(centralView, 38, 0);
    writeUint32(centralView, 42, offset);
    centralHeader.set(nameBytes, 46);

    centralParts.push(centralHeader);
    offset += localHeader.length + entry.data.length;
  });

  const centralDirectorySize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const centralDirectoryOffset = offset;

  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  writeUint32(endView, 0, 0x06054b50);
  writeUint16(endView, 4, 0);
  writeUint16(endView, 6, 0);
  writeUint16(endView, 8, entries.length);
  writeUint16(endView, 10, entries.length);
  writeUint32(endView, 12, centralDirectorySize);
  writeUint32(endView, 16, centralDirectoryOffset);
  writeUint16(endView, 20, 0);

  const allParts = [...localParts, ...centralParts, endRecord].map((part) =>
    toArrayBuffer(part)
  );
  return new Blob(allParts, { type: 'application/zip' });
}

type ZipEntry = {
  name: string;
  compression: number;
  compressedSize: number;
  uncompressedSize: number;
  dataOffset: number;
};

function findEndOfCentralDir(data: Uint8Array): number {
  for (let i = data.length - 22; i >= 0 && i >= data.length - 65558; i -= 1) {
    if (
      data[i] === 0x50 &&
      data[i + 1] === 0x4b &&
      data[i + 2] === 0x05 &&
      data[i + 3] === 0x06
    ) {
      return i;
    }
  }
  return -1;
}

async function decompressDeflate(data: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('Zip compression not supported in this browser.');
  }
  const stream = new DecompressionStream('deflate-raw');
  const blob = new Blob([toArrayBuffer(data)]);
  const decompressed = await new Response(blob.stream().pipeThrough(stream)).arrayBuffer();
  return new Uint8Array(decompressed);
}

export async function extractZipText(file: File, targetPath: string): Promise<string> {
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  const endOffset = findEndOfCentralDir(data);
  if (endOffset < 0) {
    throw new Error('Invalid zip archive.');
  }

  const view = new DataView(buffer);
  const totalEntries = view.getUint16(endOffset + 10, true);
  const centralOffset = view.getUint32(endOffset + 16, true);

  let pointer = centralOffset;
  const entries: ZipEntry[] = [];
  for (let i = 0; i < totalEntries; i += 1) {
    if (view.getUint32(pointer, true) !== 0x02014b50) {
      break;
    }
    const compression = view.getUint16(pointer + 10, true);
    const compressedSize = view.getUint32(pointer + 20, true);
    const uncompressedSize = view.getUint32(pointer + 24, true);
    const nameLength = view.getUint16(pointer + 28, true);
    const extraLength = view.getUint16(pointer + 30, true);
    const commentLength = view.getUint16(pointer + 32, true);
    const localHeaderOffset = view.getUint32(pointer + 42, true);
    const name = new TextDecoder().decode(
      data.slice(pointer + 46, pointer + 46 + nameLength)
    );
    entries.push({
      name,
      compression,
      compressedSize,
      uncompressedSize,
      dataOffset: localHeaderOffset
    });
    pointer += 46 + nameLength + extraLength + commentLength;
  }

  const entry = entries.find((item) => item.name === targetPath);
  if (!entry) {
    throw new Error(`${targetPath} not found in zip.`);
  }

  const localNameLength = view.getUint16(entry.dataOffset + 26, true);
  const localExtraLength = view.getUint16(entry.dataOffset + 28, true);
  const dataStart = entry.dataOffset + 30 + localNameLength + localExtraLength;
  const compressedData = data.slice(dataStart, dataStart + entry.compressedSize);

  let payload: Uint8Array;
  if (entry.compression === 0) {
    payload = compressedData;
  } else if (entry.compression === 8) {
    payload = await decompressDeflate(compressedData);
  } else {
    throw new Error(`Unsupported compression method: ${entry.compression}`);
  }

  if (payload.length !== entry.uncompressedSize) {
    throw new Error('Zip entry size mismatch.');
  }

  return new TextDecoder().decode(payload);
}
