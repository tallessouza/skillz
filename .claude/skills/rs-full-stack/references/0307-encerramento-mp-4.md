---
name: rs-full-stack-0307-encerramento
description: "Outlines a Node.js fundamentals checklist and mental model when reviewing or starting Node.js projects. Use when user asks to 'review Node basics', 'check Node fundamentals', 'start a Node project from scratch', or 'what do I need to know about Node'. Ensures all foundational concepts are covered: API design, HTTP server, request/response cycle, route params, query params, body parsing, in-memory data, file persistence. Make sure to use this skill whenever scaffolding a new Node.js API from zero. Not for advanced topics like authentication, databases, ORMs, or deployment."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [nodejs, fundamentals, checklist, api, http-server, review]
---

# Fundamentos do Node.js — Checklist de Conceitos

> Antes de avançar para projetos complexos, garanta domínio de cada fundamento do Node.js.

## Key concepts

Ao criar ou revisar uma aplicação Node.js básica, verificar cobertura de cada conceito:

1. **Criar aplicação Node** — inicializar projeto, configurar package.json, entry point
2. **Conceito de API** — entender o contrato entre cliente e servidor
3. **Criar servidor HTTP** — usar `http.createServer` ou framework equivalente
4. **Requisição e resposta** — entender o ciclo request/response, status codes, headers
5. **Enviar dados pelo body** — receber e parsear JSON no corpo da requisição
6. **Parâmetros nomeados (route params)** — `/users/:id` para identificar recursos
7. **Parâmetros não nomeados (query params)** — `?search=term&page=1` para filtros
8. **Recuperar parâmetros na API** — extrair e usar params dentro dos handlers
9. **Dados em memória** — arrays/objetos para armazenamento temporário durante desenvolvimento
10. **Persistência em arquivo** — salvar dados em JSON/arquivo para sobreviver a restarts

## Decision framework

| Situação | Abordagem |
|----------|-----------|
| Prototipando rápido | Dados em memória (array) |
| Precisa persistir entre restarts | Arquivo JSON com `fs` |
| Projeto real em produção | Banco de dados (próxima etapa) |
| Rota identifica recurso específico | Route param (`:id`) |
| Rota filtra/busca coleção | Query param (`?search=`) |
| Cliente envia dados complexos | Body JSON com POST/PUT |

## Exemplo minimo

```javascript
import http from 'node:http'

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Node.js funcionando' }))
})

server.listen(3333, () => console.log('Server running on port 3333'))
```

## Quando aplicar

- Ao iniciar um novo projeto Node.js do zero
- Ao revisar se uma API cobre todos os fundamentos
- Ao ensinar ou explicar Node.js para iniciantes
- Como checklist antes de avançar para tópicos avançados

## Limitações

Este checklist cobre apenas fundamentos. Não substitui conhecimento de:
- Bancos de dados e ORMs
- Autenticação e autorização
- Validação robusta de dados
- Deploy e infraestrutura
- Frameworks como Fastify/Express

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `node src/server.js` não executa | Faltou `"type": "module"` no package.json | Adicionar `"type": "module"` para habilitar ESModules |
| Servidor não reinicia ao salvar | Usando `node` em vez de `node --watch` | Configurar script `"dev": "node --watch src/server.js"` |
| Route params retornam undefined | Path não tem `:param` definido | Verificar que a rota usa `/resource/:id` com dois-pontos |
| Body da requisição é undefined | Faltou middleware de parsing de JSON | Processar chunks do body antes de parsear com `JSON.parse` |
| Dados em memória somem ao reiniciar | Sem persistência em arquivo | Implementar persistência com `fs` para salvar dados em JSON |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre cada fundamento e como se conectam
- [code-examples.md](references/code-examples.md) — Exemplos de código para cada conceito fundamental