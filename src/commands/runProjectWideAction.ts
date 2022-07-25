import { ProjectConfig } from "../config.ts";
import { runCommand } from "../runCommand.ts";
import { runAction } from "./runAction.ts";

export const runProjectWideAction = (actionConfig: ProjecWideActionString | ProjectWideActionString[], projectConfig: ProjectConfig) => {
    return async () => {
        if(!Array.isArray(actionConfig)) {
            actionConfig = [actionConfig]
        }
        return await Promise.all(actionConfig.map((actionString) => {
            return runAction()
        }))
    }
}