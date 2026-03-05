---
name: rs-full-stack-criando-o-dockerfile
description: "Generates Dockerfiles for Node.js applications following production best practices. Use when user asks to 'create a Dockerfile', 'dockerize my app', 'containerize this project', 'setup Docker for Node', or any container configuration task. Applies rules: alpine base images, dedicated WORKDIR, COPY then install pattern, explicit EXPOSE, CMD as array. Make sure to use this skill whenever creating or reviewing Dockerfiles for Node.js/TypeScript projects. Not for docker-compose, multi-stage builds, or CI/CD pipeline configuration."
---

# Criando o Dockerfile

> O Dockerfile e uma receita de bolo: define a imagem base, o ambiente de trabalho e o passo a passo para instalar, buildar e executar a aplicacao.

## Rules

1. **Sempre use imagem alpine como base** — `node:18-alpine3.20` nao `node:18`, porque alpine e significativamente menor e reduz superficie de ataque
2. **Sempre crie um WORKDIR dedicado** — `WORKDIR /usr/src/app` nao coloque na raiz da imagem, porque misturar arquivos do projeto com arquivos do sistema causa conflitos
3. **COPY antes de RUN npm install** — copie os arquivos do projeto primeiro, depois instale dependencias, porque o Docker usa cache de layers e essa ordem otimiza rebuilds
4. **Nao copie node_modules para a imagem** — use `.dockerignore` para excluir `node_modules/`, porque as dependencias devem ser instaladas dentro da imagem para garantir compatibilidade com o ambiente Linux
5. **EXPOSE declara a porta explicitamente** — `EXPOSE 3333` documenta qual porta o container usa, porque facilita comunicacao com o mundo externo e documentacao da imagem
6. **CMD como array, nao string** — `CMD ["npm", "start"]` nao `CMD npm start`, porque array executa diretamente sem shell intermediario, melhor para sinais do processo

## How to write

### Dockerfile basico para Node.js + TypeScript

```dockerfile
FROM node:18-alpine3.20

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3333

CMD ["npm", "start"]
```

### .dockerignore (sempre criar junto)

```
node_modules
dist
.git
.env
```

## Example

**Before (sem estrutura, na raiz):**
```dockerfile
FROM node:18
COPY . /
RUN npm install
CMD npm start
```

**After (com this skill applied):**
```dockerfile
FROM node:18-alpine3.20

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3333

CMD ["npm", "start"]
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto TypeScript | Adicione `RUN npm run build` antes do CMD para compilar para JS |
| Porta definida no codigo (ex: server.ts) | Use o mesmo valor no EXPOSE |
| Projeto tem node_modules local | Crie `.dockerignore` excluindo node_modules |
| Precisa de versao especifica do Node | Use tag exata: `node:18-alpine3.20`, nao `node:latest` |
| Script de start usa dist/ | CMD aponta para o arquivo compilado via npm start |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `FROM node:latest` | `FROM node:18-alpine3.20` |
| `COPY . /` (raiz da imagem) | `WORKDIR /usr/src/app` + `COPY . .` |
| `CMD npm start` (string) | `CMD ["npm", "start"]` (array) |
| Copiar node_modules para imagem | `.dockerignore` com node_modules + `RUN npm install` |
| `RUN node server.ts` direto | `RUN npm run build` + `CMD ["npm", "start"]` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada comando Docker, analogia da receita de bolo, e estrutura de diretorios Linux
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes e anotacoes