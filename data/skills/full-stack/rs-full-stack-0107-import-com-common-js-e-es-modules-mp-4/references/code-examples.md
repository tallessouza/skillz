# Code Examples: Import com CommonJS e ES Modules

## Exemplo 1: CommonJS (modo antigo)

Do transcript — o instrutor mostra o modo padrao antes de migrar:

```javascript
// server.js — CommonJS (padrao do Node)
const http = require('http')
```

O editor mostra tres pontinhos indicando que e uma importacao CommonJS.

## Exemplo 2: Migracao para ES Modules

O instrutor troca require por import/from:

```javascript
// server.js — ES Modules
import http from 'node:http'
```

## Exemplo 3: Configuracao do package.json

Antes (sem type — assume CommonJS):
```json
{
  "name": "fundamentos-nodejs",
  "version": "1.0.0"
}
```

Depois (com type module):
```json
{
  "name": "fundamentos-nodejs",
  "version": "1.0.0",
  "type": "module"
}
```

## Exemplo 4: Prefix node: para pacotes internos

```javascript
// Sem prefix — funciona mas nao e explicito
import http from 'http'

// Com prefix — best practice, explicita a origem
import http from 'node:http'
```

## Exemplo 5: Comparacao completa — projeto real

```javascript
// Pacotes internos do Node (com node: prefix)
import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

// Pacotes de terceiros (sem prefix)
import dayjs from 'dayjs'
import express from 'express'
import { z } from 'zod'
```

## Exemplo 6: Erro comum e solucao

Executar `node src/server.js` com import mas sem `"type": "module"`:

```
$ node src/server.js
SyntaxError: Cannot use import statement outside a module
```

Solucao: adicionar `"type": "module"` no package.json e executar novamente.

## Exemplo 7: Named imports vs Default imports

```javascript
// Default import
import http from 'node:http'

// Named import (destructuring)
import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
```

## Exemplo 8: Export em ES Modules

```javascript
// Named export
export function createUser(name) {
  return { id: randomUUID(), name }
}

// Default export
export default class UserRepository {
  // ...
}
```