'use client';

import { useState } from 'react';
import { verifyManifest, type VerificationOutcome } from '@/lib/verify';

type FileState = {
  manifest?: File;
  evidenceFiles: File[];
};

export default function VerifyPage() {
  const [files, setFiles] = useState<FileState>({ evidenceFiles: [] });
  const [result, setResult] = useState<VerificationOutcome | null>(null);
  const [status, setStatus] = useState<string>('');

  const handleManifestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFiles((prev) => ({ ...prev, manifest: file }));
  };

  const handleEvidenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files ? Array.from(event.target.files) : [];
    setFiles((prev) => ({ ...prev, evidenceFiles: selected }));
  };

  const handleVerify = async () => {
    setStatus('Preparing verification inputs...');
    setResult(null);

    if (!files.manifest) {
      setStatus('Select a manifest.json file before verifying.');
      return;
    }

    if (files.evidenceFiles.length === 0) {
      setStatus('Select the evidence files referenced in the manifest.');
      return;
    }

    const manifestJson = await files.manifest.text();
    const fileMap: Record<string, Uint8Array> = {};

    for (const file of files.evidenceFiles) {
      const buffer = await file.arrayBuffer();
      fileMap[file.name] = new Uint8Array(buffer);
    }

    setStatus('Running deterministic verification...');
    const outcome = await verifyManifest(manifestJson, fileMap);
    setResult(outcome);
    setStatus(outcome.ok ? 'Verification complete.' : 'Verification finished with discrepancies.');
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold">Verify evidence bundle</h1>
        <p className="text-sm text-gray-600">
          This page runs local, deterministic verification in your browser. It
          surfaces discrepancies between evidence files and the manifest without
          modifying data.
        </p>
      </section>

      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="manifest">
            Manifest (evidence-manifest.json)
          </label>
          <input
            id="manifest"
            type="file"
            accept="application/json"
            onChange={handleManifestChange}
            className="block w-full text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="evidence">
            Evidence files (use names referenced in the manifest)
          </label>
          <input
            id="evidence"
            type="file"
            multiple
            onChange={handleEvidenceChange}
            className="block w-full text-sm"
          />
        </div>

        <button
          type="button"
          onClick={handleVerify}
          className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Verify bundle
        </button>

        {status && <p className="text-sm text-gray-700">{status}</p>}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Results</h2>
        {!result && (
          <p className="text-sm text-gray-600">
            Upload files and run verification to see results.
          </p>
        )}
        {result?.unavailable && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Verification unavailable</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {result.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
            <p className="mt-3">
              Use the offline verifier CLI or build the wasm verifier to enable
              in-browser verification.
            </p>
          </div>
        )}
        {result && !result.unavailable && (
          <div
            className={`rounded-md border p-4 text-sm ${
              result.ok
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                : 'border-rose-300 bg-rose-50 text-rose-900'
            }`}
          >
            <p className="font-semibold">
              {result.ok
                ? 'Verification passed.'
                : 'Verification failed: discrepancies surfaced.'}
            </p>
            {result.errors.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {result.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
