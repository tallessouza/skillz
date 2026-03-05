---
name: rs-full-stack-0107-commonjs-es-modules
description: "Enforces ES Modules import syntax over CommonJS require in Node.js projects. Use when user asks to 'create a server', 'import a package', 'setup node project', 'configure package.json', or any Node.js code generation. Applies rules: always use import/from syntax, configure type module in package.json, prefix Node built-in packages with node: protocol. Make sure to use this skill whenever generating Node.js import statements or initializing Node projects. Not for browser-only JavaScript, Deno, or Bun-specific module systems."
---

# Import com CommonJS e ES Modules

> Sempre use ES Modules (import/from) em projetos Node.js e prefixe pacotes internos do Node com `node:`.

## Rules

1. **Use ES Modules, nunca CommonJS** — `import http from 'node:http'` nao `const http = require('http')`, porque ES Modules e o padrao moderno e permite static analysis, tree-shaking e melhor tooling
2. **Configure `type: "module"` no package.json** — sem isso, Node trata arquivos `.js` como CommonJS e o import falha com erro de syntax
3. **Prefixe pacotes internos do Node com `node:`** — `import http from 'node:http'` nao `import http from 'http'`, porque torna explicito que e um pacote do core do Node, nao um pacote de terceiros
4. **Diferencie pacotes internos de terceiros** — pacotes do Node (http, fs, path, crypto) usam `node:` prefix; pacotes de terceiros (dayjs, express) nao usam prefix, porque clareza na origem evita confusao

## How to write

### Importacao de pacote interno do Node

```javascript
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
```

### Importacao de pacote de terceiros

```javascript
import dayjs from 'dayjs'
import express from 'express'
```

### Configuracao do package.json

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "type": "module"
}
```

## Example

**Before (CommonJS — padrao antigo):**
```javascript
const http = require('http')
const fs = require('fs')
const dayjs = require('dayjs')
```

**After (ES Modules com node: prefix):**
```javascript
import http from 'node:http'
import fs from 'node:fs'
import dayjs from 'dayjs'
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo projeto Node.js | Adicione `"type": "module"` no package.json imediatamente |
| Importando fs, http, path, crypto, etc. | Use prefix `node:` |
| Importando express, dayjs, zod, etc. | Sem prefix — sao pacotes de terceiros |
| Projeto legado com require() | Migre para import/from e adicione type module |
| Erro "Cannot use import statement" | Falta `"type": "module"` no package.json |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const http = require('http')` | `import http from 'node:http'` |
| `const fs = require('fs')` | `import fs from 'node:fs'` |
| `import http from 'http'` | `import http from 'node:http'` |
| `import fs from 'fs'` | `import fs from 'node:fs'` |
| package.json sem type field | `"type": "module"` no package.json |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre CommonJS vs ES Modules, historico e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes