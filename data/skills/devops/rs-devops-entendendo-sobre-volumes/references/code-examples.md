# Code Examples: Docker Volumes

## Ciclo completo de volume

### 1. Criar volume

```bash
docker volume create primeiro-volume
```

Output: `primeiro-volume`

### 2. Inspecionar volume recem-criado

```bash
docker volume inspect primeiro-volume
```

Output:
```json
[
    {
        "CreatedAt": "2024-01-15T10:30:00Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/primeiro-volume/_data",
        "Name": "primeiro-volume",
        "Options": {},
        "Scope": "local"
    }
]
```

### 3. Parar container existente (se houver)

```bash
docker ps
docker stop <container_id>
```

### 4. Rodar container com volume associado

```bash
docker run \
  -v primeiro-volume:/src/app \
  --network primeira-network \
  -p 3001:3001 \
  -d \
  api-skillz:v3
```

Decomposicao do comando:
- `-v primeiro-volume:/src/app` — monta o volume no WORKDIR do container
- `--network primeira-network` — conecta a rede
- `-p 3001:3001` — mapeia porta host:container
- `-d` — modo detached
- `api-skillz:v3` — imagem e tag

### 5. Verificar que o container tem o volume

```bash
docker container inspect <container_id>
```

Na secao `Mounts`:
```json
{
    "Mounts": [
        {
            "Type": "volume",
            "Name": "primeiro-volume",
            "Source": "/var/lib/docker/volumes/primeiro-volume/_data",
            "Destination": "/src/app",
            "Driver": "local",
            "Mode": "",
            "RW": true,
            "Propagation": ""
        }
    ]
}
```

## Comandos de gerenciamento de volumes

```bash
# Listar todos os volumes
docker volume ls

# Remover volume especifico
docker volume rm primeiro-volume

# Remover todos os volumes nao utilizados
docker volume prune

# Inspect abreviado (sem especificar tipo)
docker inspect primeiro-volume
```

## Variacoes do flag de volume

```bash
# Forma abreviada (mais comum)
docker run -v meu-volume:/src/app -d minha-imagem

# Forma completa
docker run --volume meu-volume:/src/app -d minha-imagem

# Ambas sao equivalentes
```

## Exemplo com WORKDIR diferente

Se o Dockerfile define:
```dockerfile
WORKDIR /app
```

Entao o volume deve montar em `/app`:
```bash
docker run -v meu-volume:/app -d minha-imagem
```

Se o Dockerfile define:
```dockerfile
WORKDIR /src/app
```

Entao:
```bash
docker run -v meu-volume:/src/app -d minha-imagem
```

## Casos de uso tipicos

### Volume para banco de dados (PostgreSQL)

```bash
docker volume create pg-data
docker run \
  -v pg-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  -d \
  postgres:16
```

### Volume para uploads

```bash
docker volume create user-uploads
docker run \
  -v user-uploads:/src/app/uploads \
  -p 3000:3000 \
  -d \
  minha-api:latest
```

### Volume para logs

```bash
docker volume create app-logs
docker run \
  -v app-logs:/var/log/app \
  -d \
  minha-api:latest
```