# Code Examples: Criando Projeto Node.js

## package.json completo (como o instrutor configurou)

```json
{
  "name": "support-tickets",
  "version": "1.0.0",
  "description": "API de gerenciamento de tickets de suporte",
  "main": "src/server.js",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js"
  },
  "author": "Rodrigo Gonçalves",
  "license": "ISC"
}
```

## package.json ANTES (gerado pelo npm init -y)

```json
{
  "name": "support-tickets",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## Diferencas entre ANTES e DEPOIS

| Campo | Antes (npm init -y) | Depois (configurado) |
|-------|---------------------|----------------------|
| description | `""` | `"API de gerenciamento de tickets de suporte"` |
| main | `"index.js"` | `"src/server.js"` |
| type | (ausente) | `"module"` |
| scripts | `"test": "echo..."` | `"dev": "node --watch src/server.js"` |
| keywords | `[]` | (removido) |
| author | `""` | `"Seu Nome"` |

## Estrutura final do projeto

```
support-tickets/
├── package.json
└── src/
    └── server.js
```

## Comando completo de setup (one-liner)

```bash
mkdir support-tickets && cd support-tickets && npm init -y && mkdir src && touch src/server.js
```

## Variacao: projeto com nome diferente

```bash
mkdir meu-projeto-api && cd meu-projeto-api && npm init -y
```

Depois ajustar package.json com os mesmos campos: `main`, `type`, `scripts.dev`.

## server.js inicial (vazio mas pronto)

```javascript
// src/server.js
// Entry point da aplicacao
```

O instrutor deixa o arquivo vazio nesta aula — o conteudo sera desenvolvido nas proximas aulas.