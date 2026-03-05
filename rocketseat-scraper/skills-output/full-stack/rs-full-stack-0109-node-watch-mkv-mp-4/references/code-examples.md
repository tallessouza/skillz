# Code Examples: Node Watch e Resposta Obrigatoria

## Exemplo 1: Servidor basico sem watch (problema)

```bash
# Terminal
node src/server.js
# Servidor rodando com "Hello World"
# Voce altera o codigo para "Resposta do servidor"
# Recarrega o navegador — ainda mostra "Hello World"
# Precisa fazer Ctrl+C e rodar novamente
```

## Exemplo 2: Servidor com watch (solucao)

```bash
# Terminal
node --watch src/server.js
# (node:12345) ExperimentalWarning: Watch mode is an experimental feature...
# Servidor rodando
# Voce altera o codigo e salva
# Terminal mostra: reiniciou automaticamente
# Recarrega o navegador — conteudo atualizado
```

## Exemplo 3: Evolucao do conteudo demonstrada na aula

```javascript
// Versao 1
const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Hello World')
})

// Versao 2 — salva, watch reinicia automaticamente
const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Resposta do servidor')
})

// Versao 3 — salva, watch reinicia automaticamente
const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Sucesso')
})

// Versao 4 — salva, watch reinicia automaticamente
const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Meu primeiro servidor')
})
```

## Exemplo 4: Servidor sem resposta (problema demonstrado na aula)

```javascript
// O instrutor comenta a linha de resposta para demonstrar o problema
const server = http.createServer((req, res) => {
  // res.writeHead(200)
  // res.end('Meu primeiro servidor')
  // Sem resposta — navegador fica em loading infinito
})
```

Resultado no navegador: spinner de loading que nunca para, ate eventual timeout.

## Exemplo 5: Package.json com script dev

```json
{
  "name": "meu-servidor",
  "version": "1.0.0",
  "scripts": {
    "dev": "node --watch src/server.js"
  }
}
```

```bash
# Agora basta rodar:
npm run dev
# Em vez de lembrar a flag toda vez
```

## Exemplo 6: Garantindo resposta em todos os caminhos

```javascript
const server = http.createServer((req, res) => {
  if (req.url === '/users') {
    res.writeHead(200)
    res.end('Lista de usuarios')
    return // importante: encerrar aqui
  }

  if (req.url === '/products') {
    res.writeHead(200)
    res.end('Lista de produtos')
    return
  }

  // Rota nao encontrada — ainda assim responde
  res.writeHead(404)
  res.end('Rota nao encontrada')
})
```

## Exemplo 7: Handler com try/catch que sempre responde

```javascript
const server = http.createServer((req, res) => {
  try {
    const data = processarRequisicao(req)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
  } catch (error) {
    console.error('Erro ao processar requisicao:', error)
    res.writeHead(500)
    res.end('Erro interno do servidor')
  }
})
```