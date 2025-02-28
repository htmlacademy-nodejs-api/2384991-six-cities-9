import { Command } from './command.interface.js';

export class HelpCommand implements Command {
    public getName(): string {
        return '--help';
    }

    public async execute(..._parameters: string[]): Promise<void> {
        console.info(`
            A programme for preparing data for REST API server.
            Example:
                cli.js --<command> [--arguments]
            Commands:
                --version:                   # shows the version number
                --help:                      # prints this text
                --import <path>:             # imports data from TSV
                --generate <n> <path> <url>  # generates any number of test data
        `);
    };
};