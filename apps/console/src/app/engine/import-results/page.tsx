'use client';

import { useState } from 'react';
import { extractZipText } from '../zip-utils';

type EngineOutput = {
  schema_version: string;
  tool_version: string;
  normalization_summary: {
    records_processed: number;
    records_skipped: number;
    warnings: string[];
  };
  variance_summary: {
    total: number;
    counts_by_type: Record<string, number>;
  };
  variance_items_path: string;
  evidence_manifest: {
    generated_at: string;
    tool_version: string;
    schema_version: string;
    files: Array<{ path: string; sha256: string; bytes: number }>;
  };
  deterministic_statement: string;
};

type VarianceItem = {
  key: string;
  type: string;
  currency: string;
  amounts_by_source?: Array<{ source: string; amount_cents: number }>;
  missing_sources?: string[];
};

const REQUIRED_FIELDS = [
  'schema_version',
  'tool_version',
  'normalization_summary',
  'variance_summary',
  'variance_items_path',
  'evidence_manifest',
  'deterministic_statement'
];

export default function ImportResultsPage() {
  const [engineOutput, setEngineOutput] = useState<EngineOutput | null>(null);
  const [variances, setVariances] = useState<VarianceItem[]>([]);
  const [error, setError] = useState<string>('');

  const validateOutput = (output: EngineOutput) => {
    const missing = REQUIRED_FIELDS.filter((field) => !(field in output));
    if (missing.length > 0) {
      return `Missing required fields: ${missing.join(', ')}`;
    }
    return '';
  };

  const parseVariances = (contents: string) => {
    const lines = contents.split(/\r?\n/).filter(Boolean);
    return lines.map((line) => JSON.parse(line)) as VarianceItem[];
  };

  const handleEngineOutputUpload = async (file: File) => {
    const text = await file.text();
    const output = JSON.parse(text) as EngineOutput;
    const validationError = validateOutput(output);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setEngineOutput(output);
    localStorage.setItem('settlerEngineOutput', JSON.stringify(output));
  };

  const handleEvidenceUpload = async (file: File) => {
    try {
      const contents = await extractZipText(file, 'evidence/variances.jsonl');
      const items = parseVariances(contents);
      setVariances(items);
      localStorage.setItem('settlerVariances', JSON.stringify(items));
      setError('');
    } catch (zipError) {
      setError(
        zipError instanceof Error
          ? zipError.message
          : 'Unable to read evidence bundle. Upload variances.jsonl instead.'
      );
    }
  };

  const handleVariancesUpload = async (file: File) => {
    const contents = await file.text();
    const items = parseVariances(contents);
    setVariances(items);
    localStorage.setItem('settlerVariances', JSON.stringify(items));
    setError('');
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Import Results</h1>
      <p style={{ marginTop: '1rem', color: '#555' }}>
        Upload the engine_output.json and evidence bundle to visualize variances
        locally. This flow works without any server dependency.
      </p>

      <section style={{ marginTop: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          engine_output.json
        </label>
        <input
          type="file"
          accept="application/json"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              handleEngineOutputUpload(file);
            }
          }}
        />
      </section>

      <section style={{ marginTop: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Evidence bundle zip (optional)
        </label>
        <input
          type="file"
          accept="application/zip"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              handleEvidenceUpload(file);
            }
          }}
        />
      </section>

      <section style={{ marginTop: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          variances.jsonl (optional)
        </label>
        <input
          type="file"
          accept="application/json"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              handleVariancesUpload(file);
            }
          }}
        />
      </section>

      {error ? (
        <p style={{ color: '#b00', marginTop: '1rem' }}>{error}</p>
      ) : null}

      {engineOutput ? (
        <section style={{ marginTop: '2rem' }}>
          <h2>Variance Summary</h2>
          <p>Total variances: {engineOutput.variance_summary.total}</p>
          <ul>
            {Object.entries(engineOutput.variance_summary.counts_by_type).map(
              ([type, count]) => (
                <li key={type}>
                  {type}: {count}
                </li>
              )
            )}
          </ul>
          <h3>Deterministic Statement</h3>
          <p style={{ color: '#555' }}>{engineOutput.deterministic_statement}</p>
          <h3>Evidence Manifest</h3>
          <ul>
            {engineOutput.evidence_manifest.files.map((file) => (
              <li key={file.path}>
                {file.path} — {file.sha256} ({file.bytes} bytes)
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {variances.length > 0 ? (
        <section style={{ marginTop: '2rem' }}>
          <h2>Variance Items</h2>
          <p>Showing {variances.length} items.</p>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {variances.map((item, index) => (
              <div
                key={`${item.key}-${index}`}
                style={{ border: '1px solid #ddd', padding: '1rem' }}
              >
                <strong>{item.key}</strong>
                <div>Type: {item.type}</div>
                <div>Currency: {item.currency}</div>
                {item.missing_sources ? (
                  <div>Missing: {item.missing_sources.join(', ')}</div>
                ) : null}
                {item.amounts_by_source ? (
                  <div>
                    Amounts:{' '}
                    {item.amounts_by_source
                      .map((entry) => `${entry.source}: ${entry.amount_cents}`)
                      .join(', ')}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
