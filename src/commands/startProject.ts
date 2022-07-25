import { ProjectConfig, ProjectName, setCurrentProjectName } from "../config.ts";
import { runCommand } from "../runCommand.ts";

export const startProject = (projectName: ProjectName, projectConfig: ProjectConfig) => {
    return async () => {
        const runningCommands = Object.values(projectConfig.services)
            .filter(service => {
                return Object.keys(service.actions).includes('start')
            })
            .map(service => {
                return runCommand(service.actions['start'], service.path)
            })
        await Promise.all(runningCommands)
        await setCurrentProjectName(projectName)
    }
}