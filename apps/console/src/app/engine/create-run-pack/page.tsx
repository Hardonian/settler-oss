'use client';

import { useState } from 'react';
import { createZip } from '../zip-utils';

const defaultRuleset = `{
  \"schema_version\": \"1.0.0\",
  \"sources\": [\"source_a\", \"source_b\"],
  \"key_fields\": [\"transaction_id\"],
  \"amount_field\": \"amount\",
  \"currency_field\": \"currency\",
  \"timestamp_field\": \"timestamp\",
  \"account_field\": \"account\"
}
`;

const defaultMapping = `{
  "sources": {
    "source_a": {
      "id": "transaction_id",
      "amount": "amount",
      "currency": "currency",
      "timestamp": "timestamp",
      "account": "account"
    },
    "source_b": {
      "id": "transaction_id",
      "amount": "amount",
      "currency": "currency",
      "timestamp": "timestamp",
      "account": "account"
    }
  }
}
`;

export default function CreateRunPackPage() {
  const [inputFiles, setInputFiles] = useState<FileList | null>(null);
  const [includeMapping, setIncludeMapping] = useState(true);
  const [status, setStatus] = useState<string>('');

  const createRunPack = async () => {
    if (!inputFiles || inputFiles.length === 0) {
      setStatus('Select at least one input file to create a run pack.');
      return;
    }

    const entries: Array<{ name: string; data: Uint8Array }> = [];
    for (const file of Array.from(inputFiles)) {
      const buffer = await file.arrayBuffer();
      entries.push({ name: `inputs/${file.name}`, data: new Uint8Array(buffer) });
    }

    entries.push({ name: 'ruleset.json', data: new TextEncoder().encode(defaultRuleset) });
    if (includeMapping) {
      entries.push({ name: 'mapping.json', data: new TextEncoder().encode(defaultMapping) });
    }

    const engineInput = {
      input_files: Array.from(inputFiles).map((file) => `inputs/${file.name}`),
      input_format: 'auto',
      mapping_config_path: includeMapping ? 'mapping.json' : null,
      ruleset_path: 'ruleset.json',
      rounding_mode: 'bankers',
      timezone: 'UTC',
      output_dir: 'output',
      mode: 'local',
      determinism: {
        sort_keys: ['key', 'source'],
        rounding: 'bankers',
        timezone: 'UTC'
      }
    };

    entries.push({
      name: 'engine_input.json',
      data: new TextEncoder().encode(JSON.stringify(engineInput, null, 2))
    });

    const readme = `Settler Engine Run Pack\n\n1) Unzip this run pack.\n2) Run the engine locally:\n   pnpm settler:run --input engine_input.json\n\nThe engine surfaces discrepancies deterministically and writes outputs to ./output.`;
    entries.push({ name: 'README.txt', data: new TextEncoder().encode(readme) });

    const blob = createZip(entries);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settler-run-pack.zip';
    link.click();
    URL.revokeObjectURL(url);
    setStatus('Run pack created.');
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Create Run Pack</h1>
      <p style={{ marginTop: '1rem', color: '#555' }}>
        Build a local run pack that includes your inputs, ruleset, and mapping
        config so reconciliation can run without any server dependency.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Input files (CSV or JSON)
        </label>
        <input
          type="file"
          multiple
          onChange={(event) => setInputFiles(event.target.files)}
        />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={includeMapping}
            onChange={(event) => setIncludeMapping(event.target.checked)}
          />
          Include mapping.json
        </label>
      </div>
      <button
        style={{ marginTop: '1.5rem', padding: '0.75rem 1.25rem' }}
        onClick={createRunPack}
      >
        Create Run Pack
      </button>
      {status ? (
        <p style={{ marginTop: '1rem', color: '#0a5' }}>{status}</p>
      ) : null}
      <section style={{ marginTop: '2rem' }}>
        <h2>Manual import mode</h2>
        <p style={{ color: '#555' }}>
          If you already ran the engine, go to Import Results to upload the
          engine_output.json and evidence bundle.
        </p>
      </section>
    </main>
  );
}
