import { Command as OriginalCommand } from 'https://deno.land/x/cmd@v1.2.0/mod.ts'
import { process } from 'https://deno.land/x/cmd@v1.2.0/deps.ts'

export class Commander extends OriginalCommand {
    /**
     * Factory routine to create a new unattached command.
     *
     * See .command() for creating an attached subcommand, which uses this routine to
     * create the command. You can override createCommand to customise subcommands.
     */
    public createCommand(name?: string) {
        return new Commander(name);
    }

    public hasCommand(command: string): boolean {
        return this.commands.some(cmd => cmd._name === command)
    }

    /**
     * This function overrides the outputHelpIfRequested function
     * the help options should only be handled if the help option is the first
     * argument of the current command
     */
    _outputHelpIfRequested() {
        // the help option will only respected if it is the first argument
        const hasHelpOption = [this._helpLongFlag, this._helpShortFlag].includes(this.args[0])
        if (hasHelpOption) {
            this.outputHelp();
            // (Do not have all displayed text available so only passing placeholder.)
            this._exit(0, 'commander.helpDisplayed', '(outputHelp)');
        }
    }

    /**
     * no logic was tampered
     * This function is only overitten because we needed to overide to call the _outputHelpIfRequested
     * method instead of the original function outputHelpIfRequested
     */
    _parseCommand(operands: any, unknown: any) {
        const parsed = this.parseOptions(unknown);
        operands = operands.concat(parsed.operands);
        unknown = parsed.unknown;
        this.args = operands.concat(unknown);

        if (operands && this._findCommand(operands[0])) {
            this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
        } else if (this._lazyHasImplicitHelpCommand() && operands[0] === this._helpCommandName) {
            if (operands.length === 1) {
                this.help();
            } else {
                this._dispatchSubcommand(operands[1], [], [this._helpLongFlag]);
            }
        } else if (this._defaultCommandName) {
            this._outputHelpIfRequested(); // Run the help for default command from parent rather than passing to default command
            this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
        } else {
            if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
                // probaby missing subcommand and no handler, user needs help
                this._helpAndError();
            }

            this._outputHelpIfRequested();
            this._checkForMissingMandatoryOptions();
            if (parsed.unknown.length > 0) {
                this.unknownOption(parsed.unknown[0]);
            }

            if (this._actionHandler) {
                const args: any[] = this.args.slice();
                this._args.forEach((arg: any, i: number) => {
                    if (arg.required && args[i] == null) {
                        this.missingArgument(arg.name);
                    } else if (arg.variadic) {
                        args[i] = args.splice(i);
                    }
                });

                this._actionHandler(args);
                this.emit('command:' + this.name(), operands, unknown);
            } else if (operands.length) {
                if (this._findCommand('*')) {
                    this._dispatchSubcommand('*', operands, unknown);
                } else if (this.listenerCount('command:*')) {
                    this.emit('command:*', operands, unknown);
                } else if (this.commands.length) {
                    this.unknownCommand();
                }
            } else if (this.commands.length) {
                // This command has subcommands and nothing hooked up at this level, so display help.
                this._helpAndError();
            } else {
                // fall through for caller to handle after calling .parse()
            }
        }
    }

    /**
     * @see https://github.com/tj/commander.js/issues/764
     */
    public forwardSubcommands() {
        const listener = (args: string[], unknown: string[]) => {
            // Parse any so-far unknown options
            args = args || [];
            unknown = unknown || [];

            const parsed = this.parseOptions(unknown);
            if (parsed.args.length) args = parsed.args.concat(args);
            unknown = parsed.unknown;

            // Output help if necessary
            if (unknown.includes('--help') || unknown.includes('-h')) {
                this.outputHelp();
                process.exit(0);
            }

            this.parseArgs(args, unknown);
        };

        if (this._args.length > 0) {
            console.error('forwardSubcommands cannot be applied to command with explicit args');
        }

        const parent = this.parent || this;
        const name = parent === this ? '*' : this._name;
        parent.on('command:' + name, listener);
        if (this._alias) parent.on('command:' + this._alias, listener);
        return this;
    }
}
