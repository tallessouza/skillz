---
name: rs-full-stack-node-watch
description: "Enforces Node.js --watch flag usage and mandatory server responses when creating or modifying HTTP servers. Use when user asks to 'create a server', 'start a node project', 'run node', 'setup express', or 'build an API'. Ensures dev servers use --watch for auto-restart and every request handler sends a response. Make sure to use this skill whenever scaffolding Node.js server code or writing npm scripts. Not for frontend dev servers, Docker, or production deployment."
---

# Node Watch e Resposta Obrigatoria do Servidor

> Todo servidor Node.js em desenvolvimento usa `--watch` para auto-restart, e toda requisicao recebe uma resposta.

## Rules

1. **Use `--watch` ao executar servidores em desenvolvimento** — `node --watch src/server.js` nao `node src/server.js`, porque sem watch voce precisa parar e reiniciar manualmente a cada alteracao
2. **Toda requisicao DEVE receber uma resposta** — chame `res.end()`, `res.send()`, ou equivalente em TODOS os caminhos do handler, porque sem resposta o navegador fica em loading infinito ate timeout
3. **A resposta pode ser positiva ou negativa, mas deve existir** — retorne erro 500 se necessario, nunca deixe a conexao pendurada, porque o cliente nao tem como saber o que aconteceu

## How to write

### Script de desenvolvimento no package.json

```json
{
  "scripts": {
    "dev": "node --watch src/server.js"
  }
}
```

### Handler que sempre responde

```javascript
const server = http.createServer((req, res) => {
  // Sempre terminar com uma resposta
  res.writeHead(200)
  res.end('Meu primeiro servidor')
})
```

### Handler com erro que ainda responde

```javascript
const server = http.createServer((req, res) => {
  try {
    // logica do servidor
    res.writeHead(200)
    res.end('Sucesso')
  } catch (error) {
    res.writeHead(500)
    res.end('Erro interno')
  }
})
```

## Example

**Before (servidor sem resposta — causa loading infinito):**

```javascript
const server = http.createServer((req, res) => {
  console.log('Requisicao recebida')
  // Esqueceu de responder — navegador fica em loop de carregamento
})
```

**After (com resposta obrigatoria):**

```javascript
const server = http.createServer((req, res) => {
  console.log('Requisicao recebida')
  res.writeHead(200)
  res.end('Resposta do servidor')
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Criando servidor Node.js para dev | Adicionar script `"dev": "node --watch src/server.js"` |
| Mensagem "ExperimentalWarning" do watch | Ignorar — a feature e estavel e vai permanecer |
| Handler com multiplos caminhos (if/else) | Garantir `res.end()` em TODOS os branches |
| Servidor nao reflete alteracoes | Verificar se esta rodando com `--watch` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `node src/server.js` (dev) | `node --watch src/server.js` |
| Handler sem `res.end()` | Handler que sempre chama `res.end()` |
| `Ctrl+C` + re-run manual a cada mudanca | `--watch` para auto-restart |
| Resposta apenas no caminho feliz | Resposta em todos os caminhos (sucesso e erro) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre watch mode e ciclo request-response
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0109-node-watch-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0109-node-watch-mkv-mp-4/references/code-examples.md)
