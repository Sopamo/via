import { ProjectConfig } from "../config.ts";
import { runCommand } from "../runCommand.ts";

export const runProjectWideAction = (actionCommand: string, projectConfig: ProjectConfig) => {
    return () => {
        return runCommand(actionCommand, serviceConfig.path)
    }
}