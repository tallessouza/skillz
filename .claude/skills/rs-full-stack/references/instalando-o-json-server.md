---
name: rs-full-stack-instalando-o-json-server
description: "Generates json-server setup and configuration when user needs a local mock API. Use when user asks to 'mock an API', 'simulate a backend', 'create a fake API', 'setup json-server', or 'test API consumption locally'. Applies correct package.json scripts, server.json structure, and port configuration. Make sure to use this skill whenever the user needs a local API for frontend development without a real backend. Not for creating real APIs, Express servers, or database-backed endpoints."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: json-server
  tags: [json-server, mock-api, frontend, rest, development]
---

# JSON Server — Setup de API Local

> Configurar o json-server para simular uma API local, permitindo focar no consumo de dados via JavaScript sem depender de backend real ou internet.

## Prerequisites

- Node.js instalado (para usar npm)
- Projeto com `package.json` inicializado (senão, rodar `npm init -y`)
- Se json-server nao encontrado: `npm install json-server`

## Steps

### Step 1: Instalar o json-server

```bash
npm install json-server
```

Gera `node_modules/`, `package-lock.json` e atualiza `package.json`.

### Step 2: Criar o arquivo de dados

Criar `server.json` na raiz do projeto com a estrutura de recursos:

```json
{
  "users": [
    { "id": 1, "name": "Rodrigo Gonçalves" }
  ],
  "products": []
}
```

Cada chave no objeto raiz vira um endpoint REST. `"users"` gera `/users`, `"products"` gera `/products`.

### Step 3: Adicionar script no package.json

```json
{
  "scripts": {
    "server": "json-server server.json --port 3333"
  }
}
```

### Step 4: Executar

```bash
npm run server
```

API disponível em `http://localhost:3333`. Cada recurso acessível via `/nome-do-recurso`.

## Output format

```
http://localhost:{porta}/{recurso}
```

Exemplo: `http://localhost:3333/users` retorna o array de users do `server.json`.

## Error handling

- Se porta ocupada: alterar `--port` no script para outra porta (ex: 3334)
- Se `command not found`: verificar se `npm install json-server` foi executado no projeto
- Para interromper o servidor: `Ctrl+C` no terminal

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto frontend sem backend | Usar json-server como mock |
| Precisa testar fetch/axios | json-server fornece REST completo |
| Porta 3000 ja em uso (ex: React) | Usar `--port 3333` ou outra |
| Nome do arquivo de dados | `server.json` é convencao, mas qualquer `.json` funciona |
| Objeto vazio no recurso | Endpoint retorna `{}` — preencher com dados simulados |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|-------------|
| Depender de API publica para aprender fetch | Usar json-server local |
| Hardcodar porta sem script no package.json | Criar script `"server"` com porta configuravel |
| Esquecer `--port` e conflitar com dev server | Sempre definir porta explicita no script |
| Criar backend Express so para testar consumo | json-server resolve com zero codigo |

## Verification

- Acessar `http://localhost:{porta}` no navegador — deve mostrar pagina do json-server
- Acessar `http://localhost:{porta}/{recurso}` — deve retornar o JSON do recurso
- Alterar `server.json` e recarregar — dados atualizados aparecem

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Porta ocupada ao iniciar json-server | Outro processo usando a mesma porta | Alterar `--port` no script para outra porta (ex: 3334) |
| `command not found: json-server` | Pacote nao instalado no projeto | Executar `npm install json-server` no diretorio do projeto |
| Endpoint retorna objeto vazio | Recurso sem dados no server.json | Adicionar dados ao array do recurso no server.json |
| Alteracoes no server.json nao refletem | Cache do navegador | Recarregar a pagina ou usar hard refresh (Ctrl+Shift+R) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações