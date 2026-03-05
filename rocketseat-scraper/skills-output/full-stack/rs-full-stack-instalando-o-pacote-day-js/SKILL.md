---
name: rs-full-stack-instalando-o-pacote-day-js
description: "Applies day.js setup and locale configuration when adding date/time handling to JavaScript projects. Use when user asks to 'add date library', 'configure dayjs', 'setup date formatting', 'handle dates in Portuguese', or 'install dayjs'. Ensures correct locale import, centralized config in libs folder, and main.js entry point import. Make sure to use this skill whenever setting up day.js in a new project. Not for moment.js, date-fns, or native Date API usage."
---

# Configuracao do Day.js

> Centralizar a configuracao do day.js em `src/libs/dayjs.js` e importar no entry point para garantir locale consistente em toda a aplicacao.

## Rules

1. **Instale como dependencia de producao** — `npm i dayjs@1.11.10`, porque day.js e usado tanto em dev quanto em producao
2. **Crie pasta `src/libs/`** — agrupe configuracoes de bibliotecas externas separadas das configs de build (webpack, babel), porque libs/ e para bibliotecas de runtime, nao de tooling
3. **Configure locale no arquivo dedicado** — `src/libs/dayjs.js` importa, configura e exporta, porque centralizar evita configuracao duplicada em cada arquivo
4. **Importe a config no entry point** — adicione `import "./libs/dayjs.js"` no `main.js`, porque o entry point garante que a config carrega antes de qualquer uso
5. **Use extensao `.js` no import** — `"./libs/dayjs.js"` com extensao explicita, porque bundlers como webpack podem exigir a extensao dependendo da config

## Steps

### Step 1: Instalar o pacote

```bash
npm i dayjs@1.11.10
```

### Step 2: Criar arquivo de configuracao

Criar `src/libs/dayjs.js`:

```javascript
import dayjs from "dayjs"
import "dayjs/locale/pt-br"

dayjs.locale("pt-br")
```

### Step 3: Importar no entry point

Em `src/main.js`:

```javascript
// Configuracao do Dayjs
import "./libs/dayjs.js"
```

## Output format

```
src/
├── libs/
│   └── dayjs.js      # Locale config
└── main.js            # Import da config
```

## Verification

```javascript
import dayjs from "dayjs"
console.log(dayjs().format("DD/MM/YYYY HH:mm"))
// Deve exibir data no formato brasileiro
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto usa PT-BR | Importar `dayjs/locale/pt-br` e setar como default |
| Multiplos locales necessarios | Importar cada locale e usar `dayjs().locale('xx')` por chamada |
| Biblioteca de runtime (nao tooling) | Colocar config em `src/libs/`, nao na raiz |
| Precisa de plugins (relativeTime, etc) | Importar e registrar com `dayjs.extend()` no mesmo arquivo de config |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Configurar locale em cada arquivo que usa dayjs | Configurar uma vez em `src/libs/dayjs.js` |
| Instalar como devDependency | Instalar como dependency (producao) |
| Importar config sem extensao `./libs/dayjs` | Usar extensao explicita `./libs/dayjs.js` |
| Misturar configs de build com configs de runtime na mesma pasta | `libs/` para runtime, raiz para build tools |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre organizacao de libs e locale
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes