import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = process.cwd();
const readmePath = resolve(repoRoot, 'README.md');
const contributingPath = resolve(repoRoot, 'CONTRIBUTING.md');
const packageJsonPath = resolve(repoRoot, 'package.json');

const readme = readFileSync(readmePath, 'utf8');
const contributing = readFileSync(contributingPath, 'utf8');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const scripts = packageJson.scripts ?? {};

const errors = [];

const todoCheck = (content, label) => {
  if (content.includes('TODO')) {
    errors.push(`${label} contains TODO markers. Remove them or resolve the TODO.`);
  }
};

todoCheck(readme, 'README.md');
todoCheck(contributing, 'CONTRIBUTING.md');

const quickStartMatch = readme.match(/^## Quick Start[\s\S]*?(?=^##\s|\s*\Z)/m);
if (!quickStartMatch) {
  errors.push('README.md must contain a "## Quick Start" section.');
} else {
  const quickStart = quickStartMatch[0];
  const codeBlocks = [...quickStart.matchAll(/```[a-zA-Z]*\n([\s\S]*?)```/g)];
  if (codeBlocks.length === 0) {
    errors.push('Quick Start section must include at least one code block with commands.');
  }

  const allowedCommands = new Set([
    'npm',
    'pnpm',
    'yarn',
    'node',
    'npx',
    'cat',
    'echo',
    'printf',
    'mkdir',
    'rm',
    'cp',
    'mv'
  ]);

  const validateCommand = (commandLine) => {
    const trimmed = commandLine.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const withoutPrompt = trimmed.startsWith('$ ') ? trimmed.slice(2) : trimmed;
    const segments = withoutPrompt.split(/&&|;/).map((segment) => segment.trim()).filter(Boolean);
    for (const segment of segments) {
      const parts = segment.split(/\s+/);
      const cmd = parts[0];
      const args = parts.slice(1);

      if (!allowedCommands.has(cmd)) {
        errors.push(`Quick Start command uses unsupported executable "${cmd}". Add it to allowlist or update the README.`);
        continue;
      }

      if (cmd === 'npm') {
        if (args[0] === 'run' && args[1]) {
          const scriptName = args[1];
          if (!scripts[scriptName]) {
            errors.push(`README references npm script "${scriptName}" but it is not defined in package.json.`);
          }
        }
      }

      if (cmd === 'pnpm') {
        if (args[0] === 'run' && args[1]) {
          const scriptName = args[1];
          if (!scripts[scriptName]) {
            errors.push(`README references pnpm script "${scriptName}" but it is not defined in package.json.`);
          }
        } else if (args[0] && scripts[args[0]]) {
          continue;
        } else if (args[0] && args[0] !== 'install' && args[0] !== 'add' && args[0] !== 'dlx') {
          errors.push(`README references pnpm command "${args[0]}" that is not a known script.`);
        }
      }

      if (cmd === 'node' && args[0]) {
        const targetPath = resolve(repoRoot, args[0]);
        if (!existsSync(targetPath)) {
          errors.push(`README references node script "${args[0]}" but the file does not exist.`);
        }
      }
    }
  };

  for (const block of codeBlocks) {
    const lines = block[1].split('\n');
    for (const line of lines) {
      validateCommand(line);
    }
  }
}

const linkMatches = [...readme.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)];
for (const match of linkMatches) {
  const link = match[1];
  if (link.startsWith('http') || link.startsWith('#') || link.startsWith('mailto:')) {
    continue;
  }
  const cleaned = link.split('#')[0];
  const targetPath = resolve(repoRoot, cleaned);
  if (!existsSync(targetPath)) {
    errors.push(`README link target does not exist: ${link}`);
  }
}

if (errors.length) {
  console.error('Documentation verification failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Documentation verification passed.');
