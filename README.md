
<div align="center">
  <img src="https://raw.githubusercontent.com/Sopamo/via/main/assets/logo.png" width="269">
  
  A utility to manage your different workspaces with ease.
</div>

## Project setup
First, run

```
mkdir ~/.via
cp exampleConfig.json ~/.via/projects/my-project.json
```
Then edit my-project.json to configure your first workspace. You can create as many project.json files as you need.

## Mandatory actions
You always need these actions
 - Start
 - Stop

When running the start action, all other projects will be stopped automatically.

## Dev instructions
First, follow the project setup instructions.
Then, to run the project locally, install [deno](https://deno.land) and run

Then run:
```
deno run --allow-read --allow-run --allow-env ./src/via.ts [project] [service] [action]
```
