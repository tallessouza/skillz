# Code Examples: Rodando Container Docker

## Exemplo basico da aula

```bash
# Comando exato usado pelo instrutor
docker run -p 3333:3333 nome-da-imagem
```

Resultado: aplicacao Node acessivel em `localhost:3333`, logs visiveis no terminal.

## Variacoes de mapeamento de porta

### Mesma porta (recomendado)
```bash
docker run -p 3333:3333 minha-api
# Host 3333 → Container 3333
# Acesso: http://localhost:3333
```

### Porta diferente no host
```bash
docker run -p 5433:3333 minha-api
# Host 5433 → Container 3333
# Acesso: http://localhost:5433
```

### Multiplas portas
```bash
docker run -p 3333:3333 -p 9229:9229 minha-api
# API na 3333, debugger na 9229
```

## Rodando por ID

```bash
# Listar imagens para pegar o ID
docker images

# REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
# minha-api     latest    a1b2c3d4e5f6   5 minutes ago  150MB

# Rodar pelo ID
docker run -p 3333:3333 a1b2c3d4e5f6
```

## Modo detached (background)

```bash
# Rodar em background
docker run -d -p 3333:3333 minha-api

# Ver containers rodando
docker ps

# Ver logs depois
docker logs <container-id>
```

## Verificacao de funcionamento

```bash
# Via curl
curl http://localhost:3333
# Retorna o conteudo da aplicacao

# Via navegador
# Acessar http://localhost:3333
```

## Dockerfile correspondente (contexto)

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3333
CMD ["node", "server.js"]
```

O `EXPOSE 3333` no Dockerfile documenta a porta. O `-p 3333:3333` no `docker run` efetivamente a publica.

## Troubleshooting

```bash
# Container roda mas porta nao responde
docker run minha-api  # ERRO: faltou -p

# Porta ja em uso
docker run -p 3333:3333 minha-api
# Error: port is already allocated
# Solucao: parar o processo na porta ou usar porta diferente
lsof -i :3333
kill <PID>

# Verificar portas mapeadas de um container rodando
docker port <container-id>
# 3333/tcp -> 0.0.0.0:3333
```