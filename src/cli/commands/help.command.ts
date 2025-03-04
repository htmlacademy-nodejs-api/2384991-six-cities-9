import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
      (' A programme for preparing data for REST API server. ')

      ${chalk.green('Example:')}
      ${chalk.cyan('cli.js --<command> [--arguments]')}

      ${chalk.yellow('Commands:')}
        ${chalk.blue('--version:')}     ${chalk.gray('# shows the version number of this application')}
        ${chalk.blue('--help:')}        ${chalk.gray('# prints this help-text')}
        ${chalk.blue('--import <path>:')} ${chalk.gray('# imports data from TSV passed in the first parameter')}
        ${chalk.blue('--generate <n> <path> <url>')} ${chalk.gray('# generates any number of test data')}
    `);
  }
}
