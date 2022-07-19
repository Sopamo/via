import type {ViaConfig, ProjectConfig} from '../config'
import { startProject } from './startProject.ts'
import { stopProject } from './stopProject.ts'

export const replaceProject = (config: ViaConfig, projectConfig: ProjectConfig) => {
    return () => {
        const stoppingCommands = Object.values(config).map(project => {
            return stopProject(project)()
        })

        await Promise.all(stopCommands)

        return startProject(projectConfig)
    }
}