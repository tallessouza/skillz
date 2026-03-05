---
name: rs-full-stack-docker-ignore
description: "Applies .dockerignore best practices when creating or reviewing Docker configurations. Use when user asks to 'create a Dockerfile', 'dockerize a project', 'set up Docker', 'optimize Docker build', or 'create .dockerignore'. Ensures unnecessary files stay out of containers. Make sure to use this skill whenever setting up Docker for any project. Not for .gitignore configuration, CI/CD pipelines, or Docker Compose networking."
---

# Docker Ignore

> Ao configurar Docker para um projeto, sempre criar um `.dockerignore` na raiz para garantir que apenas arquivos necessarios entrem no container.

## Rules

1. **Sempre crie `.dockerignore` na raiz do projeto** — ao lado do `Dockerfile`, porque sem ele todos os arquivos vao para o container, aumentando tamanho e tempo de build
2. **Ignore `node_modules/`** — porque o container recria via `npm install` no build, carregar a pasta local desperdiça espaço e pode causar incompatibilidades de plataforma
3. **Ignore `dist/`** — porque o `Dockerfile` ja define o comando de build que gera essa pasta dentro da imagem
4. **Ignore arquivos de controle do Docker** — `Dockerfile` e `.dockerignore` nao precisam existir dentro do container
5. **Ignore arquivos Git** — `.git/` e `.gitignore` sao irrelevantes para execucao da aplicacao no container
6. **Respeite case sensitivity** — `Dockerfile` com D maiusculo, exatamente como o nome real do arquivo

## How to write

### .dockerignore padrao para projetos Node.js

```dockerignore
node_modules
dist
Dockerfile
.git
.dockerignore
.gitignore
```

## Example

**Before (sem .dockerignore):**
```
project/
├── Dockerfile
├── .git/              # ~50MB de historico — vai pro container
├── node_modules/      # ~200MB — vai pro container (duplicado!)
├── dist/              # vai pro container (sera recriado)
├── src/
└── package.json
```

**After (com .dockerignore aplicado):**
```
# Apenas o necessario entra no container:
project/
├── src/
├── package.json
└── package-lock.json
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto Node.js com Dockerfile | Criar `.dockerignore` com `node_modules`, `dist`, `.git`, `Dockerfile`, `.dockerignore`, `.gitignore` |
| Pasta recriada no build do Docker | Adicionar ao `.dockerignore` |
| Arquivo so util em desenvolvimento | Adicionar ao `.dockerignore` |
| Arquivo necessario em runtime | Nunca adicionar ao `.dockerignore` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Copiar `node_modules` local para o container | Ignorar e rodar `npm install` no Dockerfile |
| Enviar `.git/` para o container | Adicionar `.git` no `.dockerignore` |
| Esquecer de criar `.dockerignore` | Criar junto com o `Dockerfile`, sempre |
| Usar nomes com case errado (`dockerfile`) | Usar exatamente `Dockerfile` com D maiusculo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogia com .gitignore e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos expandidos para diferentes stacks

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-docker-ignore/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-docker-ignore/references/code-examples.md)
