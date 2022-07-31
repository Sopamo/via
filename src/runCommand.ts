export async function runCommand(cmd: string, cwd: string, args: string[] = []) {
  console.log(`Running ${cmd} in ${cwd}`)
  const p = Deno.run({
    // pass an empty string before the args to pass the args as args ($1 $2 $3 .../ $@ and not as $0)
    // the empty string is accessible at $0
    cmd: ['sh', '-c', cmd, '', ...args ],
    cwd,
  });
  await p.status()
  p.close()
}