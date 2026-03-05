---
name: rs-devops-melhorias-otimizacoes-imagem
description: "Enforces Docker image optimization best practices when writing Dockerfiles or configuring Docker builds. Use when user asks to 'create a Dockerfile', 'optimize Docker image', 'reduce image size', 'docker build', or 'containerize application'. Applies rules: copy lock files separately, use .dockerignore, separate file and folder COPY commands, always tag images with versions. Make sure to use this skill whenever generating or reviewing Dockerfiles. Not for docker-compose, orchestration, networking, or volume configuration."
---

# Otimizacao de Imagens Docker

> Ao construir imagens Docker, copie apenas o necessario, separe comandos por tipo, e versione cada build com tags explicitas.

## Rules

1. **Copie lock files junto com package.json** — `COPY package.json yarn.lock ./` porque sem o lock file o gerenciador recalcula dependencias, quebrando reprodutibilidade e perdendo cache
2. **Separe COPY de arquivos e pastas** — cada pasta em seu proprio `COPY`, porque misturar arquivos e pastas num unico comando causa comportamento imprevisivel de paths
3. **Crie um .dockerignore robusto** — ignore `node_modules`, `dist`, `.git`, `Dockerfile`, `.dockerignore`, porque copiar essas pastas infla a imagem sem necessidade (reducao de 50%+ no exemplo real)
4. **Nao ignore dependencias necessarias ao build** — se `.yarn` e usado no install, nao coloque no .dockerignore, porque o build vai falhar com "not found"
5. **Sempre use tags versionadas** — `api:v1` nao `api:latest`, porque latest sobrescreve sem historico e impede rollback
6. **Copie configs de tooling** — se usa yarn berry (v3+), copie `yarnrc.yml` e a pasta `.yarn/releases/`, porque o install depende dessas configs

## How to write

### Dockerfile com lock file e COPY separado
```dockerfile
FROM node:18

WORKDIR /app

# Arquivos de dependencia primeiro (cache layer)
COPY package.json yarn.lock ./
COPY yarnrc.yml ./

# Pastas em comandos separados, referenciando destino
COPY .yarn ./.yarn

RUN yarn install

# Codigo fonte por ultimo (invalida cache menos)
COPY . .

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
```

### .dockerignore completo
```
node_modules
dist
.git
Dockerfile
.dockerignore
```

### Build com tag versionada
```bash
docker build -t api-rocket:v1 .
```

## Example

**Before (imagem ~1GB):**
```dockerfile
FROM node:18
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
```
```bash
docker build -t api-rocket .
# Resultado: 1GB, sem .dockerignore, sem lock, tag latest
```

**After (imagem ~500MB):**
```dockerfile
FROM node:18
WORKDIR /app
COPY package.json yarn.lock yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
```
```
# .dockerignore
node_modules
dist
.git
Dockerfile
.dockerignore
```
```bash
docker build -t api-rocket:v1 .
# Resultado: ~500MB, cache eficiente, versionado
```

## Heuristics

| Situation | Do |
|-----------|-----|
| npm project | `COPY package*.json ./` (asterisco pega o lock) |
| yarn classic | `COPY package.json yarn.lock ./` |
| yarn berry (v3+) | Copiar tambem `yarnrc.yml` e `.yarn/` |
| Primeira build lenta | Verificar se .dockerignore existe e exclui node_modules |
| Imagem muito grande | Checar `docker image ls` e comparar antes/depois do .dockerignore |
| CI/CD pipeline | Tags geradas automaticamente (git sha, semver) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `docker build -t app .` (sem tag) | `docker build -t app:v1 .` |
| `COPY . .` sem .dockerignore | Criar .dockerignore antes do COPY |
| `COPY package.json .yarn ./` (arquivo e pasta juntos) | Separar em dois comandos COPY |
| Ignorar `.yarn` quando yarn berry precisa dele | Remover `.yarn` do .dockerignore se usado no install |
| Copiar `node_modules` para dentro do container | Adicionar `node_modules` ao .dockerignore |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
