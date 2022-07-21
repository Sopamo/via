import { ProjectConfig } from "../config.ts";
import { runCommand } from "../runCommand.ts";

export const stopProject = (projectConfig: ProjectConfig) => {
    return () => {
        const runningCommands = Object.values(projectConfig.services)
            .filter(service => {
                return Object.keys(service.actions).includes('stop')
            })
            .map(service => {
                return runCommand(service.actions['stop'], service.path)
            })
        return Promise.all(runningCommands)
    }
}