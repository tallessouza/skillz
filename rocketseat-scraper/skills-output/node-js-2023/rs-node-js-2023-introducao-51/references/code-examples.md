# Code Examples: Node.js Introducao

## Contexto

Esta aula e introdutoria e nao contem exemplos de codigo. O instrutor apresenta conceitos fundamentais antes de comecar a codificar.

## O que sera construido no modulo

O instrutor descreve o projeto que sera desenvolvido ao longo do modulo:

1. **API REST completa** — sem dependencias externas
2. **Rotas HTTP** — usando apenas modulos nativos do Node
3. **Persistencia de dados** — sem banco de dados externo ou ORM
4. **Streaming** — leitura e processamento parcial de dados (exemplo: CSV grande)

## Setup necessario

### Node.js 18.x

```bash
# Verificar versao instalada
node --version
# Deve retornar v18.x.x
```

### HTTPie (para testar a API)

```bash
# Exemplo de uso do HTTPie (sera usado nas proximas aulas)
http GET localhost:3000/users
http POST localhost:3000/users name="John" email="john@example.com"
```

## Conceitos que terao codigo nas proximas aulas

### Servidor HTTP puro (sem framework)

```javascript
// Sera implementado nas proximas aulas
// Servidor HTTP usando apenas modulos nativos do Node
import { createServer } from 'node:http'

const server = createServer((request, response) => {
  // Tratamento de rotas manual
  // Sem Express, sem Fastify, sem dependencias
})

server.listen(3000)
```

### Streaming (conceito que sera explorado)

```javascript
// Conceito mencionado pelo instrutor:
// Ler arquivo CSV grande de forma parcial
// Sem carregar tudo na memoria

import { createReadStream } from 'node:fs'

// Leitura de "pouquinho em pouquinho"
const stream = createReadStream('arquivo-grande.csv')

stream.on('data', (chunk) => {
  // Processa cada pedaco sem bloquear
  // Outras tarefas continuam executando
})
```

> **Nota:** Estes exemplos sao ilustrativos do que o instrutor descreve. O codigo real sera desenvolvido nas aulas seguintes do modulo.