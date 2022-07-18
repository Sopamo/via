import { parse as yamlParse } from "https://deno.land/std/encoding/yaml.ts"
import { ensureDir, exists as fileExists } from "https://deno.land/std/fs/mod.ts"

type ServiceConfig = {
  path: string,
  actions: {"start": string, "stop": string} & Record<string, string>
}

type ProjectConfig = {
  services: Record<string, ServiceConfig>
}

async function initConfigDirectory(projectName: string) {
  if(!projectName) {
    console.log('please specify a project name')
  }
  await ensureDir(`${viaRoot}/projects`)
  const projectConfigFilePath = `${viaRoot}/projects/${projectName}.yaml`
  if (await fileExists(projectConfigFilePath)) {
    console.log(`configuration file for project "${projectName}" already exists`)
    return
  }

  const exampleProjectConfigContent = `services:
  database:
    path: ${Deno.env.get("HOME")}/path/to/service
    actions:
      start: docker-compose up -d
      stop: docker-compose down
`
    await Deno.writeTextFile(projectConfigFilePath, exampleProjectConfigContent)

  console.log(`configuration file for project was created at "${projectConfigFilePath}"`)
  console.log('Edit this config for your needs')
}

const viaRoot = Deno.env.get("HOME") + '/.via'

async function getConfig() {
  const config: Record<string, ProjectConfig> = {}
  const decoder = new TextDecoder("utf-8");
  const viaProjectConfigPath = viaRoot + '/projects';
  if (!await fileExists(viaProjectConfigPath)) {
    console.error('The config directory does not exists')
    console.error('Create your first project configuration by running "v init <project name>"')
    Deno.exit(1)
  }
  for await (const dirEntry of Deno.readDir(viaRoot + '/projects')) {
    const extension = dirEntry.name.split('.').pop()
    if(!dirEntry.isFile || !extension || !['yaml', 'yml'].includes(extension)) {
      continue
    }

    const projectName = dirEntry.name.replace(new RegExp(`\.${extension}$`), '') // remove extension
    const fileContent = decoder.decode(await Deno.readFile(viaRoot + '/projects/' + dirEntry.name))

    config[projectName] = yamlParse(fileContent) as ProjectConfig
  }

  return config
}

if (Deno.args[0] === 'init') {
  const projectName = Deno.args[1]
  await initConfigDirectory(projectName)
  Deno.exit()
}

const config = await getConfig()

function abort(msg: string) {
  console.error(msg)
  Deno.exit(-1)
}

const args = Deno.args
if(args.length === 0) {
  abort('specify a project and a command')
}

const project = args[0]
let command = "start"
if(args[1]) {
  command = args[1]
}

const projectWideActions = ["start", "stop"]

async function runCommand(cmd: string, cwd: string) {
  console.log(`Running ${cmd} in ${cwd}`)
  const p = Deno.run({
    cmd: ['sh', '-c', cmd],
    cwd,
  });
  await p.status()
}

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
