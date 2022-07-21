import { getConfigRoot } from "../config.ts"
import { ensureDir, exists } from "https://deno.land/std/fs/mod.ts"

const initConfigDirectory = () => {
  return ensureDir(`${getConfigRoot()}/projects`)
}

const initProjectConfigFile = async (projectName: string) => {
  const projectConfigFilePath = `${getConfigRoot()}/projects/${projectName}.yaml`
  if (await exists(projectConfigFilePath)) {
    console.log(`configuration file for project "${projectName}" already exists`)
    return
  }

  const exampleProjectConfigContent = `services:
  your-service-name:
    path: ${Deno.env.get("HOME")}/path/to/service
    actions:
      start: docker-compose up -d
      stop: docker-compose down
`
    await Deno.writeTextFile(projectConfigFilePath, exampleProjectConfigContent)

  console.log(`configuration file for project was created at "${projectConfigFilePath}"`)
  console.log('Edit this config for your needs')
}


export const init = (projectName: string) => {
  return async () => {

    if(!projectName) {
      console.log('please specify a project name')
      return
    }

    await initConfigDirectory()
    await initProjectConfigFile(projectName)
  }
}