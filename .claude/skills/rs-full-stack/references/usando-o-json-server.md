---
name: rs-full-stack-usando-o-json-server
description: "Configures json-server as a local mock API for frontend development projects. Use when user asks to 'create a mock API', 'simulate backend', 'setup json-server', 'create local API', or 'mock REST endpoints'. Guides installation, script setup, route definition, and development workflow. Make sure to use this skill whenever setting up json-server or a fake REST API for prototyping. Not for real backend development, Express servers, or production API design."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: frontend-tooling
  tags: [json-server, mock-api, rest, frontend, prototyping]
---

# Configurando json-server como API Local

> Instale e configure o json-server para simular uma REST API local durante o desenvolvimento frontend.

## Prerequisites

- Node.js 18+ instalado
- Projeto com `package.json` existente
- Se nao existir: `npm init -y`

## Steps

### Step 1: Instalar o json-server

```bash
npm install json-server@0.17.4
```

Fixar a versao para evitar breaking changes entre versoes.

### Step 2: Criar o arquivo de dados

Criar `server.json` na raiz do projeto com as rotas desejadas:

```json
{
  "schedules": []
}
```

Cada chave no objeto vira um endpoint REST completo (`GET`, `POST`, `PUT`, `DELETE`).

### Step 3: Adicionar script no package.json

```json
{
  "scripts": {
    "server": "json-server --watch server.json --port 3333"
  }
}
```

- `--watch` — reinicia automaticamente ao modificar `server.json`
- `--port 3333` — porta customizada para nao conflitar com o frontend

### Step 4: Executar o servidor

```bash
npm run server
```

Verificar no navegador: `http://localhost:3333/schedules`

### Step 5: Configurar o ambiente de desenvolvimento

Manter dois terminais no VS Code:
1. **server** — `npm run server` (sempre rodando)
2. **web** — para comandos do frontend

Dica: renomear cada terminal (botao direito → Rename) para identificar facilmente.

## Output format

```
project/
├── server.json          # Dados da API mock (rotas e registros)
├── package.json         # Script "server" adicionado
├── .gitignore           # node_modules ignorado
└── node_modules/        # Dependencias instaladas
```

## Error handling

- Se ocorrer erro "too many open files": recarregar o VS Code e executar novamente
- Se a requisicao falhar com "API not found": verificar que o servidor esta rodando no terminal
- Se `node_modules` sumiu: executar `npm install` para regenerar

## Verification

- Acessar `http://localhost:3333/{rota}` retorna os dados do `server.json`
- Adicionar um objeto no array do `server.json`, salvar, e recarregar o navegador — dados atualizados aparecem automaticamente

## Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| Erro "too many open files" | Limite de file watchers do sistema atingido | Recarregue o VS Code e execute novamente |
| Requisição retorna 404 | Nome da rota não corresponde à chave no `server.json` | Verifique se a chave no JSON corresponde exatamente ao endpoint |
| Dados não persistem entre restarts | `server.json` não foi alterado pelo json-server | Verifique permissões de escrita no arquivo e que `--watch` está ativo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre json-server e fluxo de desenvolvimento
- [code-examples.md](references/code-examples.md) — Todos os exemplos de configuracao com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-usando-o-json-server/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-usando-o-json-server/references/code-examples.md)
