---
name: rs-full-stack-boas-vindas-aos-modulos
description: "Enforces code organization into separate files using JavaScript modules when building larger applications. Use when user asks to 'organize code', 'split into files', 'create modules', 'separate responsibilities', or starts a multi-file project. Applies module-based architecture with clear separation of concerns. Make sure to use this skill whenever a project grows beyond a single file. Not for bundler configuration, package management, or framework-specific module systems."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript
  tags: [javascript, modules, es-modules, import, export, organization]
---

# Módulos JavaScript — Separação de Responsabilidades

> Separe código em arquivos distintos usando módulos JavaScript para manter cada arquivo com uma única responsabilidade.

## Rules

1. **Nunca mantenha tudo num único arquivo** — separe em módulos assim que o projeto crescer, porque um arquivo monolítico se torna impossível de navegar e manter
2. **Cada arquivo = uma responsabilidade** — um módulo faz uma coisa bem feita, porque isso permite reutilização e facilita testes
3. **Use ES Modules (import/export)** — prefira `import`/`export` sobre `require`/`module.exports`, porque ES Modules são o padrão da linguagem

## How to write

### Separando responsabilidades

```javascript
// users.js — responsabilidade: lógica de usuários
export function createUser(name, email) {
  return { name, email, createdAt: new Date() }
}

// validation.js — responsabilidade: validações
export function validateEmail(email) {
  return email.includes('@')
}

// main.js — responsabilidade: orquestração
import { createUser } from './users.js'
import { validateEmail } from './validation.js'

const email = 'user@example.com'
if (validateEmail(email)) {
  const user = createUser('João', email)
}
```

## Example

**Before (tudo num arquivo só):**
```javascript
// app.js — 500 linhas com tudo misturado
function createUser(name, email) { /* ... */ }
function validateEmail(email) { /* ... */ }
function saveToDatabase(user) { /* ... */ }
function formatResponse(data) { /* ... */ }
// ... continua crescendo infinitamente
```

**After (separado em módulos):**
```
├── users.js          // criação e lógica de usuários
├── validation.js     // funções de validação
├── database.js       // persistência
├── formatters.js     // formatação de dados
└── main.js           // orquestração principal
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Arquivo ultrapassou ~100 linhas | Hora de separar em módulos |
| Duas funções sem relação no mesmo arquivo | Separar por responsabilidade |
| Função reutilizada em vários lugares | Extrair para módulo próprio |
| Projeto com mais de 3 funcionalidades | Criar estrutura de pastas |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Tudo em `app.js` com 500+ linhas | Módulos separados por responsabilidade |
| Funções de domínios diferentes juntas | Um arquivo por domínio/responsabilidade |
| Copiar/colar funções entre arquivos | Importar de um módulo compartilhado |


## Troubleshooting

| Problema | Solução |
|----------|---------|
| **Import not found error** | Check the file extension in the import path — Node.js ESM requires `.js` extension, and relative paths must start with `./`. |
| **Circular dependency issues** | Reorganize so that shared logic lives in a separate utility module imported by both files instead of importing each other. |
| **File growing too large** | If a file exceeds ~100 lines or contains unrelated functions, split by responsibility into separate modules. |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que modularizar e quando separar
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de organização modular