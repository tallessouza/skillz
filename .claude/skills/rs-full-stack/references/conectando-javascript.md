---
name: rs-full-stack-conectando-javascript
description: "Enforces best practices for connecting JavaScript to HTML files. Use when user asks to 'add a script', 'link JavaScript', 'connect JS to HTML', 'include a script tag', or 'set up an HTML page with JS'. Applies rules: external files over inline, script at end of body, never in head. Make sure to use this skill whenever generating HTML boilerplate or adding script references. Not for Node.js, bundlers, or module import/export syntax."
---

# Conectando JavaScript ao HTML

> Sempre conecte JavaScript via arquivo externo no final do body, nunca inline e nunca no head.

## Rules

1. **Use arquivo externo** — `<script src="script.js">` nao `<script>codigo aqui</script>`, porque separar JS do HTML melhora legibilidade e organizacao
2. **Script no final do body** — antes de `</body>`, depois de todos os elementos HTML, porque o navegador carrega o visual primeiro e o JS depois, evitando travamento
3. **Nunca coloque script no head** — JS no head bloqueia o renderizamento, porque o navegador executa todo o JS antes de mostrar qualquer elemento ao usuario
4. **Nunca escreva JS inline para logica propria** — codigo inline so e aceitavel para scripts de terceiros (analytics, bibliotecas externas), porque misturar JS com HTML dificulta manutencao

## How to write

### Estrutura correta

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Minha Pagina</title>
</head>
<body>
  <h1>Conteudo da pagina</h1>
  <p>Todos os elementos HTML vem primeiro</p>

  <!-- Script SEMPRE no final do body -->
  <script src="script.js"></script>
</body>
</html>
```

## Example

**Before (comum em iniciantes):**

```html
<head>
  <script src="script.js"></script>
</head>
<body>
  <h1>Minha pagina</h1>
</body>
```

**After (com esta skill aplicada):**

```html
<head>
  <title>Minha pagina</title>
</head>
<body>
  <h1>Minha pagina</h1>

  <script src="script.js"></script>
</body>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo arquivo HTML com JS | Arquivo externo `.js` + script no final do body |
| Script de terceiro (analytics, pixel) | Inline no head e aceitavel — siga as instrucoes do fornecedor |
| Prototipo rapido com 1 linha de JS | Ainda assim use arquivo externo — custa nada e mantem o padrao |
| Multiplos scripts | Todos no final do body, na ordem correta de dependencia |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `<script>` com logica no `<head>` | `<script src="app.js">` no final do `<body>` |
| JS misturado com HTML inline | Arquivo `.js` separado |
| Script no meio do body entre elementos | Script depois do ultimo elemento, antes de `</body>` |
| `<script src="...">` dentro do `<head>` | Mova para o final do `<body>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre carregamento, analogia do tempo de decisao do usuario
- [code-examples.md](references/code-examples.md) — Todos os exemplos de posicionamento de script com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-conectando-javascript/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-conectando-javascript/references/code-examples.md)
