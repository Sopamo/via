
<div align="center">
  <img src="https://raw.githubusercontent.com/Sopamo/via/main/assets/logo.png" width="269">

  Easily start & stop your local dev environments from your cli
</div>
<hr>
<br /><br />

<div align="center">

[![Watch the via demo video](./assets/thumbnail.png)](https://youtu.be/lD-CBiXZfP4)
[Watch the via demo video](https://youtu.be/lD-CBiXZfP4)
</div>
<br />

## Project setup
First, run

```
mkdir ~/.via
cp exampleConfig.json ~/.via/projects/my-project.json
```
Then edit my-project.json to configure your first workspace. You can create as many project.json files as you need.

Download the [latest version](https://github.com/Sopamo/via/releases) of via and place it into `/usr/local/bin`.

## Mandatory actions
You always need these actions
 - Start
 - Stop

When running the start action, all other projects will be stopped automatically.

## Dev instructions
First, follow the project setup instructions.
Then, to run the project locally, install [deno](https://deno.land).

To run the code directly, run:
```
deno run --allow-read --allow-run --allow-env ./src/via.ts [project] [service] [action]
```

To build the binary, run:
```
deno compile --allow-read --allow-run --allow-env ./src/via.ts
```