#!/usr/bin/env node

/**
 * Settler CLI - Command-line interface for Settler
 */

import { Command } from 'commander';
import { doctor } from './commands/doctor';
import { init } from './commands/init';
import { reconcileCommand } from './commands/reconcile';
import { adapters } from './commands/adapters';
import { demo } from './commands/demo';

const program = new Command();

program
  .name('settler')
  .description('Settler CLI - Open-source financial reconciliation tool')
  .version('0.1.0');

// Doctor command
program
  .command('doctor')
  .description('Check environment and dependencies')
  .action(() => {
    doctor();
  });

// Init command
program
  .command('init')
  .description('Create sample config and data files')
  .action(() => {
    init();
  });

// Reconcile command
program
  .command('reconcile')
  .description('Reconcile transactions from two CSV files')
  .option('-s, --source <file>', 'Source CSV file path')
  .option('-t, --target <file>', 'Target CSV file path')
  .option('-f, --format <type>', 'Output format: json or table (default: table)', 'table')
  .option('-o, --out <file>', 'Output file path (default: stdout)')
  .option('--tolerance <amount>', 'Amount tolerance for matching (default: 0.01)', parseFloat)
  .action((options) => {
    reconcileCommand(options);
  });

// Adapters command
program
  .command('adapters')
  .description('List available adapters')
  .action(() => {
    adapters();
  });

// Demo command
program
  .command('demo')
  .description('Run a canned demo reconciliation')
  .action(() => {
    demo();
  });

// Help examples
program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('  $ settler doctor');
  console.log('  $ settler init');
  console.log('  $ settler demo');
  console.log('  $ settler reconcile --source data/source.csv --target data/target.csv');
  console.log('  $ settler reconcile -s a.csv -t b.csv --format json --out results.json');
  console.log('  $ settler adapters');
  console.log('');
  console.log('Documentation:');
  console.log('  https://docs.settler.dev/cli');
  console.log('');
});

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
