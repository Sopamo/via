import { parse as yamlParse } from "https://deno.land/std/encoding/yaml.ts"
import { exists } from "https://deno.land/std/fs/mod.ts"

export type ServiceConfig = {
  path: string,
  actions: {"start": string, "stop": string} & Record<string, string>
}

export type ProjectName = string

export type ServiceName = string

export type ActionName = string

export type ProjectWideActionString = string // dot notation path to service action `services.backend.actions.migrate`

export type ProjectConfig = {
  services: Record<ServiceName, ServiceConfig>
  actions?: Record<ActionName, ProjectWideActionString | ProjectWideActionString[]>
}

export type ViaConfig = Record<ProjectName, ProjectConfig>

export function getConfigRoot() {
  return Deno.env.get("HOME") + '/.via'
}

export async function getConfig(): Promise<ViaConfig> {
  const config: Record<string, ProjectConfig> = {}
  const decoder = new TextDecoder("utf-8");
  const viaProjectConfigPath = getConfigRoot() + '/projects';
  if (!await exists(viaProjectConfigPath)) {
    return {}
  }
  for await (const dirEntry of Deno.readDir(getConfigRoot() + '/projects')) {
    const extension = dirEntry.name.split('.').pop()
    if(!dirEntry.isFile || !extension || !['yaml', 'yml'].includes(extension)) {
      continue
    }

    const projectName = dirEntry.name.replace(new RegExp(`\.${extension}$`), '') // remove extension
    const fileContent = decoder.decode(await Deno.readFile(getConfigRoot() + '/projects/' + dirEntry.name))

    config[projectName] = yamlParse(fileContent) as ProjectConfig
  }

  return config
}
