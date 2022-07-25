import type { ViaConfig, ProjectConfig, ProjectName } from '../config.ts'
import { startProject } from './startProject.ts'
import { stopProject } from './stopProject.ts'

export const replaceProject = (config: ViaConfig, projectName: ProjectName, projectConfig: ProjectConfig) => {
    return async () => {
        const stopCommands = Object.values(config).map(project => {
            return stopProject(project)()
        })

        await Promise.all(stopCommands)

        return startProject(projectName, projectConfig)()
    }
}