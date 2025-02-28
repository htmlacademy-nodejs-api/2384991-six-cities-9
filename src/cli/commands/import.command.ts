import { Command } from './command.interface.js';

export class ImportCommand implements Command {
    public getName(): string {
        return '--import';
    }

    public execute(...parameters: string[]): void {
        //  imports data from *.tsv-file. The result of the import command should be output to the console.
    }
}