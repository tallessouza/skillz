---
name: rs-full-stack-testando-build
description: "Enforces correct procedures for testing Node.js production builds and configuring npm start scripts. Use when user asks to 'test a build', 'run production build', 'add start script', 'configure npm start', or 'run compiled JavaScript'. Applies rules: run build output with node directly (not ts-node), pass environment variables explicitly via --env-file, add npm start script to package.json for convenience. Make sure to use this skill whenever testing compiled TypeScript output or setting up production execution scripts. Not for build configuration itself, Docker deployment, or CI/CD pipeline setup."
---

# Testando Build

> Ao testar uma build de producao, execute com Node puro, carregue variaveis de ambiente explicitamente, e configure um script start no package.json.

## Rules

1. **Execute a build com Node direto** — `node build/server.js` nao `ts-node` ou `tsx`, porque a build ja e JavaScript puro e nao precisa de runtime TypeScript
2. **Carregue variaveis de ambiente explicitamente** — a pasta build nao contem `.env`, entao passe `--env-file=.env` ao testar localmente, porque sem isso a validacao de env (Zod) vai falhar
3. **Adicione script start no package.json** — use `"start": "node build/server.js"` para simplificar a execucao, porque `npm start` e o padrao que plataformas de deploy reconhecem
4. **npm start nao precisa de run** — `npm start` funciona sem `run` porque `start` e um lifecycle script padrao do npm
5. **Nao inclua --env-file no script start** — o ambiente de deploy tera suas proprias variaveis de ambiente configuradas, entao o script start deve ser limpo: apenas `node build/server.js`

## Steps

### Step 1: Testar a build manualmente com env local

```bash
node --env-file=.env build/server.js
```

Verificar que a aplicacao inicia sem erros e responde normalmente.

### Step 2: Adicionar script start no package.json

```json
{
  "scripts": {
    "build": "tsup src/server.ts",
    "start": "node build/server.js"
  }
}
```

### Step 3: Testar via npm start

```bash
npm start
```

Confirmar que a aplicacao roda normalmente.

## Example

**Before (erro comum — rodar build sem env):**
```bash
node build/server.js
# Error: DATABASE_URL is required
# Error: JWT_SECRET is required
```

**After (com env carregado para teste local):**
```bash
node --env-file=.env build/server.js
# Server running on port 3333
```

**Script start no package.json (para deploy):**
```json
{
  "scripts": {
    "start": "node build/server.js"
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Testando build localmente | Use `node --env-file=.env build/server.js` |
| Configurando para deploy | Script start sem --env-file (env vem do host) |
| Build falha ao iniciar | Verifique se todas env vars estao definidas |
| Precisa rodar com npm | `npm start` (sem `run`) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `ts-node build/server.js` | `node build/server.js` — build ja e JS puro |
| `"start": "node --env-file=.env build/server.js"` | `"start": "node build/server.js"` — env vem do deploy |
| Copiar `.env` para a pasta build | Carregar env externamente com --env-file |
| `npm run start` | `npm start` — start e lifecycle script, nao precisa de run |

## Verification

- Aplicacao inicia sem erros de validacao de env
- Rotas respondem normalmente (testar com curl ou Insomnia)
- `npm start` funciona identicamente ao comando manual

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de build e ambiente
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de configuracao de scripts e env