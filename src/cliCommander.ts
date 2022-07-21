import { init } from "./commands/init.ts";
import { startProject } from "./commands/startProject.ts";
import { stopProject } from "./commands/stopProject.ts";
import { replaceProject } from "./commands/replaceProject.ts";
import { runAction } from "./commands/runAction.ts";
import { ProjectConfig, ServiceConfig, ViaConfig, ProjectName } from "./config.ts";

import { Commander } from './commander.ts';
import { editProject } from "./commands/editProject.ts";

const createProjectCommands = (commander: Commander, viaConfig: ViaConfig, projectName: string, projectConfig: ProjectConfig) => {
  const projectCommander = commander
      .command(projectName)
      .description('<Project>')
      .forwardSubcommands()
  
  createDefaultCommands(projectCommander, projectConfig, projectName, viaConfig)

  Object.entries(projectConfig.services).forEach(([serviceName, serviceConfig]) => {
    createServiceCommands(projectCommander, serviceName, serviceConfig)
  })
}

const createDefaultCommands = (projectCommander: Commander, projectConfig: ProjectConfig, projectName: ProjectName, viaConfig: ViaConfig) => {
  projectCommander
    .command('start')
    .description('start project')
    .action(startProject(projectConfig))

  projectCommander.command('stop')
    .description('stop project')
    .action(stopProject(projectConfig))

  projectCommander.command('replace')
    .description('replace project')
    .action(replaceProject(viaConfig, projectConfig))

  projectCommander.command('edit')
    .description('change your project configuration')
    .action(editProject(projectName))
}

const createServiceCommands = (commander: Commander, serviceName: string, serviceConfig: ServiceConfig) => {
  const serviceCommander = commander
      .command(serviceName)
      .description('<Service>')
      .forwardSubcommands()

      Object.entries(serviceConfig.actions).forEach(([actionName, actionCommand]) => {
        serviceCommander
          .command(actionName)
          .description('<Action>')
          .action(runAction(actionCommand, serviceConfig))
      })
}

export const createViaCommander = (config: ViaConfig) => {
  const viaCommander = new Commander('v')

  viaCommander.version('0.0.1')

  viaCommander
    .command('init <Project>')
    .description('create a new project config file')
    .action(async (projectName: string) => {
      await init(projectName)()
      editProject(projectName)()
    })

  Object.entries(config).forEach(([projectName, projectConfig]) => {
    createProjectCommands(viaCommander, config, projectName, projectConfig)
  })

  return viaCommander
}