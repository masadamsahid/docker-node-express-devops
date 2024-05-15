## Build the image:

```bash
docker build -t node-app-image
```


## Run the Dockerfile container using git bash:

```bash
docker run -v /$(pwd):/app:ro -v //app/node_modules --env-file ./.env -p 3000:4000 --name node-app -d node-app-image
```

## Run the using docker compose:

dev:
```bash
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d --build
```

prod:
```bash
docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d --build
```

