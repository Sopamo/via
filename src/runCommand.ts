export async function runCommand(cmd: string, cwd: string) {
  console.log(`Running ${cmd} in ${cwd}`)
  const p = Deno.run({
    cmd: ['sh', '-c', cmd],
    cwd,
  });
  await p.status()
  p.close()
}