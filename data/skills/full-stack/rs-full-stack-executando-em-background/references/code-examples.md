# Code Examples: Executando Containers em Background

## Listar imagens disponiveis

```bash
docker image ls
```

Saida tipica:
```
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
minha-api    latest    abc123def456   2 hours ago    150MB
```

## Executar em foreground (terminal bloqueado)

```bash
# Por nome da imagem
docker run -p 3333:3333 minha-api

# Por ID da imagem
docker run -p 3333:3333 abc123def456
```

O terminal fica bloqueado. `Ctrl+C` para o container.

## Executar em background (terminal livre)

```bash
# Por nome
docker run -d -p 3333:3333 minha-api

# Por ID
docker run -d -p 3333:3333 abc123def456
```

Retorna:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

## Verificar containers em execucao

```bash
docker ps
```

Saida tipica:
```
CONTAINER ID   IMAGE       CREATED          PORTS                    NAMES
a1b2c3d4e5f6   minha-api   5 minutes ago    0.0.0.0:3333->3333/tcp   random_name
```

Colunas importantes:
- **CONTAINER ID** — hash abreviado para referenciar o container
- **IMAGE** — nome da imagem sendo executada
- **CREATED** — tempo desde a criacao
- **PORTS** — mapeamento de portas (host → container)
- **NAMES** — nome aleatorio gerado pelo Docker

## Parar container

```bash
# Usando container ID abreviado
docker stop a1b2c3d4e5f6

# Verificar que parou
docker ps
# (lista vazia)
```

## Variacoes uteis

```bash
# Dar nome ao container (ao inves de aleatorio)
docker run -d -p 3333:3333 --name minha-api-container minha-api

# Ver logs de container em background
docker logs a1b2c3d4e5f6

# Acompanhar logs em tempo real
docker logs -f a1b2c3d4e5f6

# Listar TODOS os containers (incluindo parados)
docker ps -a
```