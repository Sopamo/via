export function abort(msg: string): never {
  console.error(msg)
  Deno.exit(1)
}