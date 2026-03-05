---
name: rs-full-stack-estrutura-dos-arquivos
description: "Generates starter project structure when setting up a JavaScript learning environment or linking JS to HTML. Use when user asks to 'create a JS project', 'link JavaScript to HTML', 'setup Live Server', 'start a basic web project', or 'create index.html with script'. Make sure to use this skill whenever scaffolding a minimal HTML+JS workspace. Not for frameworks, bundlers, or Node.js server setup."
---

# Estrutura de Arquivos JS + HTML

> Crie uma estrutura minima com index.html e scripts.js vinculados, servida com Live Server para feedback instantaneo.

## Prerequisites

- VSCode instalado
- Extensao Live Server instalada (`ritwickdey.LiveServer`)
- Se Live Server nao instalado: orientar usuario a instalar via aba Extensions

## Steps

### Step 1: Criar pasta e arquivos

```
projeto/
├── index.html
└── scripts.js
```

### Step 2: Criar index.html com vinculo ao JS

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aulas de JavaScript</title>
</head>
<body>
  <script src="scripts.js"></script>
</body>
</html>
```

### Step 3: Testar conexao no scripts.js

```javascript
console.log("Hello World")
```

### Step 4: Servir com Live Server

Botao direito no `index.html` → "Open with Live Server". Alteracoes salvas refletem automaticamente no navegador.

## Rules

1. **Tag script no final do body** — `<script src="scripts.js"></script>` antes de `</body>`, porque garante que o DOM carregou antes do JS executar
2. **src sem prefixo quando mesmo nivel** — use `scripts.js` e nao `./scripts.js`, porque ambos funcionam e o primeiro e mais limpo quando estao na mesma pasta
3. **Verificar conexao com console.log** — sempre teste com `console.log` apos vincular, porque erros silenciosos de path sao comuns
4. **Live Server para desenvolvimento** — use Live Server em vez de abrir o arquivo diretamente (`file://`), porque hot-reload economiza tempo e simula um servidor real

## Heuristics

| Situacao | Faca |
|----------|------|
| JS no mesmo nivel do HTML | `src="scripts.js"` |
| JS em subpasta | `src="js/scripts.js"` |
| Alteracoes nao refletem | Verificar se salvou (bolinha no tab = nao salvo) |
| Console vazio apos refresh | Verificar path no src, abrir DevTools > Console |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Abrir HTML via `file://` para dev | Usar Live Server (cria servidor local) |
| Esquecer de salvar e recarregar manual | Live Server + Ctrl+S = auto-reload |
| Colocar script no `<head>` sem defer | Script no final do `<body>` ou com `defer` |
| Sobrescrever codigo de aulas anteriores | Duplicar arquivo antes de modificar (ex: `aula-4-conectando-html-js.js`) |

## Verification

- Abrir DevTools (F12 ou botao direito → Inspecionar)
- Ir na aba Console
- Confirmar que a mensagem do `console.log` aparece

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre vinculacao JS-HTML e Live Server
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-estrutura-dos-arquivos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-estrutura-dos-arquivos/references/code-examples.md)
