import { exists } from "https://deno.land/std/fs/mod.ts";
import { getConfigRoot, ProjectName } from "../config.ts";
import { runCommand } from "../runCommand.ts";

/**
 * determins the users default editor
 * * use the `editor` command if it exists
 * * otherwise use the EDITOR-Variable if set
 * * use vi as fallback if nothing is set
 */
const getEditorCommand = async (): Promise<string> => {
    const process = Deno.run({
        cmd: ['sh', '-c', 'if [ command -v editor 2> /dev/null ]; then echo "editor"; else echo "${EDITOR:-vi}"; fi'],
        stdout: 'piped'
    })

    const output = await process.output();
    const editor = new TextDecoder().decode(output).trim();
    process.close()

    return editor
}

export const editProject = (projectName: ProjectName) => {
    return async () => {
        const configRoot = getConfigRoot()

        const potentialConfigFileNames = [
            `${configRoot}/projects/${projectName}.yaml`,
            `${configRoot}/projects/${projectName}.yml`,
        ]
        const editorCommand = await getEditorCommand()
        for(let i = 0; i < potentialConfigFileNames.length; i++) {
            const fileName = potentialConfigFileNames[i]
            if(await exists(fileName)) {
                return runCommand(`${editorCommand} ${fileName}`, configRoot)
            }
        }
    }
}