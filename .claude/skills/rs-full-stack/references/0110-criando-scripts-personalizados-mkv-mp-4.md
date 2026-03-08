---
name: rs-full-stack-criando-scripts-personalizados
description: "Generates and configures custom npm scripts in package.json for Node.js projects. Use when user asks to 'create a script', 'add npm script', 'configure package.json scripts', 'setup dev command', or 'run project with npm'. Ensures correct use of 'start' for production and 'dev' for development, applies npm run vs npm start conventions. Make sure to use this skill whenever setting up or modifying package.json scripts. Not for shell scripting, bash aliases, or Makefile configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [npm, scripts, package-json, dev, start, conventions]
---

# Scripts Personalizados no package.json

> Crie atalhos no package.json para comandos frequentes, usando `dev` para desenvolvimento e `start` para producao.

## Rules

1. **Use `dev` para desenvolvimento** — `npm run dev` executa com flags de desenvolvimento como `--watch`, porque em desenvolvimento voce precisa de hot-reload
2. **Use `start` para producao** — `npm start` inicializa o projeto sem flags de desenvolvimento, porque ambientes de producao (Heroku, Railway, etc.) executam `npm start` por padrao
3. **`start` nao precisa de `run`** — execute `npm start` diretamente, porque `start` e um script padrao do npm (assim como `test`, `stop`, `restart`)
4. **Scripts customizados precisam de `run`** — execute `npm run dev`, `npm run build`, etc., porque scripts nao-padrao exigem o prefixo `run`
5. **Nomeie pelo proposito, nao pelo comando** — `"dev"` nao `"watch-server"`, porque o nome deve descrever QUANDO usar, nao O QUE faz internamente

## Steps

### Step 1: Definir script de desenvolvimento

No `package.json`, dentro de `"scripts"`:

```json
{
  "scripts": {
    "dev": "node --watch src/server.js"
  }
}
```

Executar com: `npm run dev`

### Step 2: Definir script de producao

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js"
  }
}
```

Executar com: `npm start` (sem `run`)

## Heuristics

| Situacao | Script | Comando |
|----------|--------|---------|
| Desenvolvimento local | `"dev"` | `npm run dev` |
| Producao / deploy | `"start"` | `npm start` |
| Rodar testes | `"test"` | `npm test` |
| Build do projeto | `"build"` | `npm run build` |
| Script com nome customizado | qualquer | `npm run <nome>` |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `npm dev` (sem run) | `npm run dev` |
| `npm run start` (funciona mas desnecessario) | `npm start` |
| Copiar comando inteiro no terminal toda vez | Criar script no package.json |
| `"start"` com `--watch` em producao | `"start"` limpo, `"dev"` com `--watch` |

## Verification

- `npm run dev` deve iniciar o projeto com watch mode
- `npm start` deve iniciar o projeto sem watch
- `npm run` (sem argumentos) lista todos os scripts disponiveis

## Troubleshooting

### Problem: `npm dev` returns "Unknown command: dev"
- **Cause**: Custom scripts require the `run` prefix — only standard scripts like `start`, `test`, `stop` work without it
- **Fix**: Use `npm run dev` instead of `npm dev` for custom script names

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre convencoes npm e scripts padrao vs customizados
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de configuracao de scripts para diferentes cenarios