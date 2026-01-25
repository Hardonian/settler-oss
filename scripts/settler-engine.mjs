import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, isAbsolute } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');

const args = process.argv.slice(2);
const inputIndex = args.indexOf('--input');
if (inputIndex === -1 || !args[inputIndex + 1]) {
  console.error('Usage: node scripts/settler-engine.mjs --input path/to/engine_input.json');
  process.exit(1);
}

const inputPath = resolve(repoRoot, args[inputIndex + 1]);
const inputPayload = JSON.parse(readFileSync(inputPath, 'utf8'));

const binaryName = process.platform === 'win32' ? 'settler-engine.exe' : 'settler-engine';
const binaryPath = resolve(repoRoot, 'tools', 'settler-engine', 'bin', binaryName);

if (!existsSync(binaryPath)) {
  console.log('settler-engine binary not found; building from source...');
  const buildResult = spawnSync('go', ['-C', 'tools/settler-engine', 'build', '-o', binaryPath, '.'], {
    cwd: repoRoot,
    stdio: 'inherit'
  });
  if (buildResult.status !== 0) {
    process.exit(buildResult.status ?? 1);
  }
}

const runResult = spawnSync(binaryPath, ['-input', inputPath], { stdio: 'inherit' });
if (runResult.status !== 0) {
  process.exit(runResult.status ?? 1);
}

const baseDir = dirname(inputPath);
const outputDir = isAbsolute(inputPayload.output_dir)
  ? inputPayload.output_dir
  : resolve(baseDir, inputPayload.output_dir);
const outputPath = join(outputDir, 'engine_output.json');
const outputPayload = JSON.parse(readFileSync(outputPath, 'utf8'));

console.log('\nRun complete.');
console.log(`Output: ${outputPath}`);
console.log(`Variance total: ${outputPayload.variance_summary.total}`);
console.log(`Evidence manifest: ${join(outputDir, 'evidence', 'manifest.json')}`);
