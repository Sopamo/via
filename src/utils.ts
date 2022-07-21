import { runAction } from "./commands/runAction.ts";
import { ProjectWideActionString, ProjectConfig, ServiceConfig } from './config';
export function abort(msg: string): never {
  console.error(msg)
  Deno.exit(1)
}

/**
 * services:
 *   serviceA:
 *     path: xxx
 *     actions:
 *       foo: bar
 * 
 * actions:
 *   foo: services.serviceA.actions.foo
 *   bar: actions.bar
 *   baz: actions.bar
 */

const isStringAProjectWideActionString = (string: string) => {
  if (!string.includes('.')) {
    return false
  }
  return ['services', 'actions'].includes(string.split('.')[0])
}

// serivces.<service-name>.actions.x
// bash start

export const resolveProjectWideActionStringToAction = (actionString: ProjectWideActionString, projectConfig: ProjectConfig, lastDotNotationPath = ''): () => unknown  => {
  if (isStringAProjectWideActionString(actionString)) {
    const resolvedAction = resolveDotNotation(actionString, projectConfig)

    if (!resolvedAction) {
      throw Error('your configured action path could not be resolved')
    }

    return resolveProjectWideActionStringToAction(resolvedAction, projectConfig, actionString)
  }

  if (!lastDotNotationPath.startsWith('services.')) {
    throw Error('actions paths not destinating in services is not supported')
      }

  // get svc config
  const [services, serviceName] = lastDotNotationPath.split('.')

  const serviceConfig: ServiceConfig | undefined = resolveDotNotation([services, serviceName].join('.'), projectConfig)
  if (!serviceConfig) {
    throw Error('No Service config found')
  }
  return runAction(actionString, serviceConfig.path)
}



export const resolveProjectWideActionStringToAction = (actionString: ProjectWideActionString, projectConfig: ProjectConfig): () => unknown  => {
  if (isStringAProjectWideActionString(actionString)) {
    const resolvedAction = resolveDotNotation(actionString, projectConfig)

    if (!resolvedAction) {
      throw Error('your configured action path could not be resolved')
    }

    return resolveProjectWideActionStringToAction(resolvedAction)
  }

  if (!actionString.startsWith('services.')) {
    throw Error('actions paths not destinating in services is not supported')
  }

  // serivces.<service-name>.actions.x
  let path = actionString.split('.')
  path.splice(-2)
  path = resolveDotNotation(`${path.join('.')}.path`, projectConfig)
  const action = resolveDotNotation(actionString, projectConfig)
  if(!typeof action !== 'string') {
    abort('Invalid config')
  }
  return runAction(action, path)

  // return {actionCommand: actionString, 
}

const resolveDotNotation = (path: string, obj: object): unknown => {
  return path.split('.').reduce(function(a, pathKey) {
    if (typeof a !== 'object' || a === null ) {
      return undefined
    }
    return a[pathKey];
  }, obj);
}