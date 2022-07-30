
<div align="center">
  <img src="https://raw.githubusercontent.com/Sopamo/via/main/assets/logo.png" width="269">

  Manage your local dev environments with ease
</div>
<hr>
<br /><br />

## Installation
### OSX (arm, brew)
```bash
brew tap sopamo/via https://github.com/sopamo/via
brew install sopamo/via/via
# Create an alias if you want to access via with v
echo "alias v=via" >> ~/.bash_aliases
source ~/.bash_aliases
```

### Linux (x86_64, snap)
```bash
# Coming soon, waiting for approval
snap install via-cli --classic
# Create an alias if you want to access via with v
echo "alias v=via-cli" >> ~/.bash_aliases
source ~/.bash_aliases
```

### ArchLinux (x86_64, AUR)
```bash
yay via-cli-bin 
# Create an alias if you want to access via with v
echo "alias v=via-cli" >> ~/.bash_aliases
source ~/.bash_aliases
```

<div align="center">

[![Watch the via demo video](./assets/thumbnail.png)](https://youtu.be/lD-CBiXZfP4)
[Watch the via demo video](https://youtu.be/lD-CBiXZfP4)
</div>
<br />

## Project setup
Create your first project configuration file by running `v init my-project` and follow the instructions.

You can then run `v my-project start` to start your project. Of course, you can rename the my-project.yaml file to match your project's name.

## Project configuration

### Minimal configuration
```yaml
services:
  database:
      path: /Users/username/project/app
      actions:
        start: docker-compose up -d
        stop: docker-compose down
```
You always have to specify the start and stop actions.

When running the start action, all other projects will be stopped automatically.

### Adding custom actions
```yaml
services:
  app:
    actions:
      bash: docker-compose exec app bash
```
You can run individual actions like this:

```bash
v my-project app bash
```

<br />
<br />
<br />

## Via development setup
First, follow the project setup instructions.
Then, to run the project locally, install [deno](https://deno.land).

To run the code directly, run:
```bash
deno run --allow-read --allow-run --allow-env --allow-write ./src/via.ts [project] [service] [action]
```

To build the binary, run:
```bash
deno compile --allow-read --allow-run --allow-env --allow-write ./src/via.ts
```
