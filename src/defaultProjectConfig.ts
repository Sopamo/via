export const getDefaultProjectConfig = (homeDir: string) =>
`# for more detailed explanations and examples
# visit https://github.com/Sopamo/via
services:
  your-service-name:
    path: ${homeDir}/path/to/service
    actions:
      start: docker-compose up -d
      stop: docker-compose down

`