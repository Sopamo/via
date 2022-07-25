import { getConfig, getCurrentProjectName } from './config.ts'
import { createViaCommander } from './cliCommander.ts';

const config = await getConfig()
const currentProjectName = await getCurrentProjectName()

if (Object.keys(config).length === 0) {
  console.error('No project configuration was found.')
  console.error('Create your first project configuration by running "v init <project name>"')
}

const via = createViaCommander(config, currentProjectName)

via.parse(Deno.args)