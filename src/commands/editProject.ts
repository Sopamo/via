import { exists} from "https://deno.land/std/fs/mod.ts";
import { getConfigRoot, ProjectName } from "../config.ts";
import { runCommand } from "../runCommand.ts";

export const editProject = (projectName: ProjectName) => {
    return async () => {
        const configRoot = getConfigRoot()
        
        const potentialConfigFileNames = [
            `${configRoot}/projects/${projectName}.yaml`,
            `${configRoot}/projects/${projectName}.yml`,
        ]

        for(let i = 0; i < potentialConfigFileNames.length; i++) {
            const fileName = potentialConfigFileNames[i]
            if(await exists(fileName)) {
                return runCommand(`editor ${fileName}`, configRoot)
            }
        }
    }
}