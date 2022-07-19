import { init } from "./commands/init.ts";
import { startProject } from "./commands/startProject.ts";
import { stopProject } from "./commands/stopProject.ts";
import { replaceProject } from "./commands/replaceProject.ts";
import { getConfig, ProjectConfig, ProjectName, ViaConfig, ServiceName } from "./config.ts";
import { abort } from "./utils.ts";

function ensureValidProjectName(config: ViaConfig, potentialProjectName: string): void {
  if(!getProjectNames(config).includes(potentialProjectName)) {
    abort(`${potentialProjectName} is not a project name. Valid project names are: ${getProjectNames(config).join(', ')}`)
  }
}

function ensureValidServiceName(projectConfig: ProjectConfig, potentialServiceName: string): void {
  if(!getServiceNames(projectConfig).includes(potentialServiceName)) {
    abort(`${potentialServiceName} is not a service name for this project. Valid service names are: ${getServiceNames(projectConfig).join(', ')}`)
  }
}

function getServiceNames(projectConfig: ProjectConfig): ServiceName[] {
  return Object.keys(projectConfig.services)
}

function getProjectNames(config: ViaConfig): ProjectName[] {
  return Object.keys(config)
}

const projectWideActions = ["start", "stop", "replace"]

export async function getCommandByArguments(args: string[]) {
  if(args.length === 0) {
    abort('Welcome to via! Run v init to get started.')
  }
  
  if (args[0] === 'init') {
    args.shift
    return init(args)
  }

  const config = await getConfig()

  ensureValidProjectName(config, args[1])

  const projectName = args[1]
  let command = args[2]
  const projectConfig = config[projectName]

  if(projectWideActions.includes(command)) {
    switch(command) {
      case 'start':
        return startProject(projectConfig)
      case 'stop':
        return stopProject(projectConfig)
      case 'replace':
        return replaceProject(config, projectConfig)
    }
  }

  const serviceName = args[2]
  ensureValidServiceName(projectConfig, serviceName)
  command = args[3]
  
  const service = projectConfig.services[serviceName]
  return runServiceCommand(service.actions[command], service.path)
}