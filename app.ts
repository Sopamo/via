console.log('hi')
import { copy } from "https://deno.land/std@0.104.0/io/util.ts";


const config = {
}

const args = Deno.args
if(args.length === 0) {
  console.error('specify a project and a command')
}

const project = args[0]
let command = "start"
if(args[1]) {
  command = args[1]
}
console.log(project)
console.log(command)

const projectWideActions = ["start", "stop"]

if(projectWideActions.includes(command)) {

  if(command === "start") {
    const projectProcesses = Object.keys(config).filter(p => p !== project).map((p) => {
      const processes = Object.values(config[p].services).map(async service => {
        const p = Deno.run({
          cmd: service.actions["stop"].split(" "),
          cwd: service.path,
          stdout: "piped",
          stderr: "piped",
        });
        copy(p.stdout, Deno.stdout);
        copy(p.stderr, Deno.stderr);
        await p.status()
      })
      return Promise.all(processes)
    })
    await Promise.all(projectProcesses)
  }

  const processes = Object.values(config[project].services).map(async service => {
    console.log(service)
    console.log(service.path)
    const p = Deno.run({
      cmd: service.actions[command].split(" "),
      cwd: service.path,
      stdout: "piped",
      stderr: "piped",
    });
    copy(p.stdout, Deno.stdout);
    copy(p.stderr, Deno.stderr);
    await p.status()
  })
  await Promise.all(processes)
}
