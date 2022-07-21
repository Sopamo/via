import { ServiceConfig } from "../config.ts";
import { runCommand } from "../runCommand.ts";

export const runAction = (actionCommand: string, serviceConfig: ServiceConfig) => {
    return () => {
        return runCommand(actionCommand, serviceConfig.path)
    }
}