import { bgRed, bgRgb24 } from "https://deno.land/std/fmt/colors.ts";
import { init } from "./commands/init.ts";
import { startProject } from "./commands/startProject.ts";
import { stopProject } from "./commands/stopProject.ts";
import { replaceProject } from "./commands/replaceProject.ts";
import { runAction } from "./commands/runAction.ts";
import { ServiceConfig, ViaConfig, ProjectName, isValidProjectName } from "./config.ts";

import { Commander } from './commander.ts';
import { editProject } from "./commands/editProject.ts";

const createProjectCommands = (projectCommander: Commander, viaConfig: ViaConfig, projectName: string) => {

  const projectConfig = viaConfig[projectName]
  createDefaultCommands(projectCommander, projectName, viaConfig)

  Object.entries(projectConfig.services)
    .filter(([serviceName]) => !projectCommander.hasCommand(serviceName))
    .forEach(([serviceName, serviceConfig]) => {
      const serviceCommander = projectCommander
        .command(serviceName)
        .description('<Service>')
        .forwardSubcommands()
      createServiceCommands(serviceCommander, serviceConfig)
    })
}

const createDefaultCommands = (projectCommander: Commander, projectName: ProjectName, viaConfig: ViaConfig) => {
  const projectConfig = viaConfig[projectName]
  if (!projectCommander.hasCommand('start')) {
    projectCommander
      .command('start')
      .description('start project')
      .action(startProject(projectName, projectConfig))
  }

  if (!projectCommander.hasCommand('stop')) {
    projectCommander.command('stop')
    .description('stop project')
    .action(stopProject(projectConfig))
  }

  if (!projectCommander.hasCommand('replace')) {
    projectCommander.command('replace')
    .description('replace project')
    .action(replaceProject(viaConfig, projectName, projectConfig))
  }

  if (!projectCommander.hasCommand('edit')) {
    projectCommander.command('edit')
    .description('change your project configuration')
    .action(editProject(projectName))
  }
}

const createServiceCommands = (serviceCommander: Commander, serviceConfig: ServiceConfig) => {
  Object.entries(serviceConfig.actions)
    .filter(([actionName]) => !serviceCommander.hasCommand(actionName))
    .forEach(([actionName, actionCommand]) => {
      serviceCommander
        .command(actionName)
        .description('<Action>')
        .action(runAction(actionCommand, serviceConfig))
        .allowUnknownOption()
    })
}

export const createViaCommander = (config: ViaConfig, currentProjectName: ProjectName | null) => {
  const viaCommander = new Commander('v')
  // handle version output manually only on top level
  // do not use .version() of commander.js because it could cause errors with
  // action commands where arguments and options are getting passed through
  viaCommander
    .option('-V, --version', 'output the version of via')
    .action((cmd, args: string[] = []) => {
      const options = cmd.opts()
      // if arguments are passed in here, the arguments does not match any other command
      // in this case we just print the help text
      if (args.length === 0 && 'version' in options && options.version === undefined) {
        console.log('0.0.1', options);
      } else {
        cmd._helpAndError()
      }
    })

  viaCommander
    .command('init <Project>')
    .description('create a new project config file')
    .action(async (projectName: string) => {
      await init(projectName)()
      editProject(projectName)()
    })

  const invalidProjectNames = Object.keys(config).filter((projectName) => viaCommander.hasCommand(projectName))
  if(invalidProjectNames.length > 0) {
    console.warn(bgRed('⚠ Some projects use reserved keywords'))
    console.warn(bgRed(`Invalid project names: ${invalidProjectNames.join(', ')}`))
    console.warn()
  }

  Object.keys(config)
    .filter((projectName) => !viaCommander.hasCommand(projectName))
    .forEach((projectName) => {
      const projectCommander = viaCommander
        .command(projectName)
        .description('<Project>')
        .forwardSubcommands()
      createProjectCommands(projectCommander, config, projectName)
    })

  if (isValidProjectName(config, currentProjectName)) {
    viaCommander.command('⠀') // braille pattern blank
    .action(() => {
      console.log()
      console.log(' ' + bgRgb24('                          ', 0xff69b4) + ' ')
      console.log(bgRgb24('                            ', 0xff69b4))
      console.log(bgRgb24('          🐇  🐰  🐣        ', 0xff69b4))
      console.log(bgRgb24('                            ', 0xff69b4))
      console.log(bgRgb24('         Made with ❤️        ', 0xff69b4))
      console.log(bgRgb24('       by Fiete & Paul      ', 0xff69b4))
      console.log(bgRgb24('                            ', 0xff69b4))
      console.log(' ' + bgRgb24('                          ', 0xff69b4) + ' ')
      console.log()
    })
    viaCommander.command('#####⠀⠀⠀current:⠀' + currentProjectName.replace(/[^a-z0-9]/ig,'') + '⠀').description('#####')
    createProjectCommands(viaCommander, config, currentProjectName)
  }

  return viaCommander
}