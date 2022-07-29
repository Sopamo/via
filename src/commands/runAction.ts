import { Commander } from "../commander.ts";
import { ServiceConfig } from "../config.ts";
import { runCommand } from "../runCommand.ts";

export const runAction = (actionCommand: string, serviceConfig: ServiceConfig) => {
    return (_commander: Commander, commandArgs: string[]) => {
        return runCommand(actionCommand, serviceConfig.path, commandArgs)
    }
}