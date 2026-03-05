# Code Examples: Visualizando Logs e Histórico no Docker

## Exemplo da aula: Fluxo completo

### 1. Listar containers

```bash
$ docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED       STATUS       PORTS                    NAMES
a1b2c3d4e5f6   minha-app   "node dist/server.js"   2 hours ago   Up 2 hours   0.0.0.0:3333->3333/tcp   app-container
```

### 2. Copiar o ID e ver logs

```bash
$ docker logs a1b2c3d4e5f6
Server is running on port 3333
```

O output corresponde ao `console.log` no server.ts:

```typescript
// server.ts
import express from 'express'

const app = express()
const PORT = 3333

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

### 3. Visualizar histórico da imagem

```bash
$ docker history minha-app
IMAGE          CREATED        CREATED BY                                      SIZE      COMMENT
a1b2c3d4e5f6   2 hours ago    CMD ["node", "dist/server.js"]                  0B
<missing>      2 hours ago    EXPOSE 3333                                     0B
<missing>      2 hours ago    RUN /bin/sh -c npm install                      45.2MB
<missing>      2 hours ago    COPY . .                                        2.3MB
<missing>      2 hours ago    WORKDIR /app                                    0B
<missing>      3 days ago     /bin/sh -c #(nop) CMD ["node"]                  0B
<missing>      3 days ago     ...                                             120MB
```

## Variações úteis

### Logs em tempo real (follow)

```bash
# Equivalente a tail -f
$ docker logs -f a1b2c3d4e5f6
Server is running on port 3333
GET /api/users 200 12ms
POST /api/users 201 45ms
# ... continua mostrando em tempo real
```

### Logs com limite de linhas

```bash
# Apenas últimas 10 linhas
$ docker logs --tail 10 a1b2c3d4e5f6
```

### Logs com timestamps

```bash
$ docker logs -t a1b2c3d4e5f6
2024-01-15T10:30:00.000Z Server is running on port 3333
```

### Logs desde um horário específico

```bash
# Logs da última hora
$ docker logs --since 1h a1b2c3d4e5f6

# Logs desde uma data
$ docker logs --since 2024-01-15T10:00:00 a1b2c3d4e5f6
```

### History sem truncar

```bash
# Mostra comandos completos (útil para RUN longos)
$ docker history --no-trunc minha-app
```

### History em formato JSON

```bash
$ docker history --format "{{.CreatedBy}}: {{.Size}}" minha-app
CMD ["node", "dist/server.js"]: 0B
EXPOSE 3333: 0B
RUN /bin/sh -c npm install: 45.2MB
COPY . .: 2.3MB
WORKDIR /app: 0B
```

## Usando com nome do container (alternativa ao ID)

```bash
# Também funciona com o nome do container
$ docker logs app-container
$ docker logs -f app-container
```