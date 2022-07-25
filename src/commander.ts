import { Command as OriginalCommand } from 'https://deno.land/x/cmd@v1.2.0/mod.ts'

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
     * @see 
     */
    public forwardSubcommands() {
        const listener = ( args: string[], unknown: string[]) => {
            // Parse any so-far unknown options
            args = args || [];
            unknown = unknown || [];

            const parsed = this.parseOptions( unknown );
            if( parsed.args.length ) args = parsed.args.concat( args );
            unknown = parsed.unknown;

            // Output help if necessary
            if( unknown.includes( '--help' ) || unknown.includes( '-h' ) ){
                this.outputHelp();
                process.exit( 0 );
            }

            this.parseArgs( args, unknown );
        };

        if( this._args.length > 0 ){
            console.error( 'forwardSubcommands cannot be applied to command with explicit args' );
        }

        const parent = this.parent || this;
        const name = parent === this ? '*' : this._name;
        parent.on( 'command:' + name, listener );
        if( this._alias ) parent.on( 'command:' + this._alias, listener );
        return this;
    }
}
