import { Command } from "https://deno.land/x/cmd@v1.2.0/mod.ts"

const camelize = (str: string) => {
  return str.replace(/-./g, x => x[1].toUpperCase())
}

/**
 * How to test the autocompletion.
 * Execute this in your shell
```bash
# _via is not working
_hello() {
  eval "$(deno run --allow-read --allow-run --allow-env --allow-write src/via.ts autocomplete)"
}

compdef _hello via
```
 * @see https://github.com/zsh-users/zsh-completions/blob/master/zsh-completions-howto.org#writing-completion-functions-using-_regex_arguments-and-_regex_words
 * Current problems:
 * * the output seems to be cached, this means creating/editing/changing a project does not have any
 *   effects on the autocompletion
 * * it is not possible to name the variable _via (if i do so the autocompletion is not working at all)
 * * there might be other chars in project/service/action/description names that can break this script
 *   because I use the names as variables
 * * zsh seems to group all parameters into one line if the descriptions are identical
 *   I couldnt find a way how to control this bahvior without changing the descriptions
 *   to make them unique.
 */

export const autocomplete = () => {
  return (cmd: Command) => {
    const variables: string[] = []
    const lines: string[] = []

    const collectChildren = (c: Command, path: Command[] = [], depth = 0) => {
      const newPath = [...path, c]
      const variable = newPath.map(c => camelize(c._name)).join('__') + '_' + depth
      variables.push(variable)
      const childrenString = c.commands
        // remove the autocomplete action and the formating commands
        .filter(c => c._name !== 'autocomplete' && !c._name.includes('⠀'))
        .map(c => {
          // references to the next child commands if this command has children
          const suffix = c.commands.length
            ? `:$${collectChildren(c, newPath, depth + 1)}`
            : ''
          // escape <> to no break in eval the output
          const desc = (c._description || '-')
            .replaceAll(/</g, '\\<')
            .replaceAll(/>/g, '\\>')
          return `'${c._name}:${desc}${suffix}'`;
        })
        .join(' ')
      lines.push(`_regex_words ${variable}__${depth} 'xxx' ${childrenString}`)
      lines.push(`${variable}=("$reply[@]")`)

      return variable
    }

    const vCommand = collectChildren(cmd.parent)
    lines.unshift(`local -a ${variables.join(' ')}`)
    lines.push(`_regex_arguments _hello /$'[^\0]##\0'/ "\${${vCommand}[@]}"`)

    console.log(lines.join('\n'));
  }
}