---
name: rs-full-stack-criando-arquivo-de-script
description: "Applies correct script tag placement and JavaScript file setup when creating HTML projects. Use when user asks to 'create a project', 'setup HTML and JS', 'connect JavaScript to HTML', 'add a script file', or 'start a web project'. Ensures script tags go at end of body for performance. Make sure to use this skill whenever setting up new HTML/JS projects or adding script files. Not for Node.js server scripts, bundler configs, or module imports."
---

# Criando e Conectando Arquivo JavaScript

> Sempre posicione a tag script no final do body para priorizar o carregamento visual da pagina.

## Rules

1. **Coloque script antes do fechamento do body** — `</body>`, nunca no `<head>`, porque scripts grandes no inicio criam gargalo no carregamento visual
2. **Nomeie o arquivo de forma clara** — `scripts.js` ou `main.js`, porque o nome deve indicar que contem a logica principal da aplicacao
3. **Use console.log para verificar conexao** — apos conectar, adicione `console.log("javascript carregado")` e verifique no DevTools Console, porque confirma que o arquivo esta corretamente linkado
4. **Remova console.log de verificacao apos confirmar** — debug temporario nao deve ficar no codigo final

## How to write

### Estrutura HTML com script no final do body

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Projeto</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- conteudo da pagina -->

  <script src="scripts.js"></script>
</body>
</html>
```

### Teste de conexao

```javascript
// scripts.js — teste temporario de conexao
console.log("javascript carregado")
```

## Example

**Before (script no head — gargalo):**
```html
<head>
  <script src="scripts.js"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Meu app</h1>
</body>
```

**After (script no final do body — correto):**
```html
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Meu app</h1>

  <script src="scripts.js"></script>
</body>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo com HTML + JS | Crie `scripts.js` e conecte no final do body |
| Precisa verificar se JS esta conectado | Adicione `console.log("carregado")`, abra DevTools > Console |
| Script muito grande | Ainda mais motivo para colocar no final do body |
| Usando modules (type="module") | Modules ja sao defer por padrao, mas manter no final e consistente |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `<script>` dentro do `<head>` sem defer | `<script src="...">` antes de `</body>` |
| Deixar console.log de teste no codigo final | Remover apos confirmar conexao |
| Nomear arquivo como `code.js` ou `file.js` | Usar `scripts.js` ou `main.js` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre carregamento e performance
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes