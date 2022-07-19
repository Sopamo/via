import { getCommandByArguments } from "./commandFactory.ts";
import { runCommand } from "./runCommand.ts";

const command = getCommandByArguments(Deno.args)


async function stopAllProjects() {
  const projectProcesses = Object.keys(config).filter(p => p !== project).map((p) => {
    const processes = Object.values(config[p].services).map(async service => {
      await runCommand(service.actions["stop"], service.path)
    })
    return Promise.all(processes)
  })
  await Promise.all(projectProcesses)
}

if(projectWideActions.includes(command)) {
  if(command === "start") {
    await stopAllProjects()
  }

  // Run the selected command in the selected project
  const processes = Object.values(config[project].services).map(async service => {
    await runCommand(service.actions[command], service.path)
  })

  await Promise.all(processes)
} else {
  const serviceName = args[1]
  const command = args[2]
  const service = config[project].services[serviceName]
  await runCommand(service.actions[command], service.path)
}
