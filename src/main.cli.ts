import { CLIApplication, HelpCommand, VersionCommand, ImportCommand } from "./cli/index.js";

const bootstrap = () => {
    const cliApplication = new CLIApplication();

    cliApplication.registerCommands([
        new HelpCommand(),
        new VersionCommand(),
        new ImportCommand()
    ]);
	console.log('Аргументы process.argv:', process.argv);
    cliApplication.processCommand(process.argv);
};

bootstrap();