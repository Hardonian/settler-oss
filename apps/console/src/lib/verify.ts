export type VerificationResult = {
  ok: boolean;
  errors: string[];
};

export type VerificationOutcome =
  | (VerificationResult & { unavailable: false })
  | { ok: false; errors: string[]; unavailable: true };

export async function verifyManifest(
  manifestJson: string,
  files: Record<string, Uint8Array>
): Promise<VerificationOutcome> {
  try {
    const wasmModule = await import(
      /* webpackIgnore: true */ '/wasm/settler_verify_wasm.js'
    );

    if (typeof wasmModule.default === 'function') {
      await wasmModule.default();
    }

    if (typeof wasmModule.verify_manifest !== 'function') {
      return {
        ok: false,
        errors: ['Verifier module loaded without verify_manifest export.'],
        unavailable: true,
      };
    }

    const result = wasmModule.verify_manifest(manifestJson, files) as VerificationResult;
    return { ...result, unavailable: false };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to load wasm verifier.';
    return {
      ok: false,
      errors: [
        'Verification is unavailable in this environment.',
        `Details: ${message}`,
      ],
      unavailable: true,
    };
  }
}
