---
name: rs-full-stack-anatomia-documento-html
description: "Enforces correct HTML document structure when creating HTML files or boilerplate. Use when user asks to 'create an HTML page', 'start a new HTML file', 'write HTML boilerplate', 'scaffold a webpage', or 'set up an HTML document'. Ensures doctype, root tag, head with meta charset and viewport, and body are correctly structured. Make sure to use this skill whenever generating any new HTML file from scratch. Not for CSS, JavaScript, or modifying existing HTML content."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [html, document, boilerplate, doctype, structure]
---

# Anatomia de um Documento HTML

> Todo documento HTML segue uma estrutura hierarquica obrigatoria: doctype, tag raiz html, head para configuracao, body para conteudo visivel.

## Rules

1. **Sempre comece com `<!DOCTYPE html>`** — esta instrucao define o tipo do documento como HTML5, porque sem ela o navegador pode entrar em quirks mode
2. **Use `<html lang="pt-BR">` como tag raiz** — o atributo `lang` define a linguagem do documento para o navegador e leitores de tela, porque melhora acessibilidade e SEO
3. **Head configura, body exibe** — tudo no `<head>` sao configuracoes invisiveis ao usuario; tudo no `<body>` e conteudo visivel na pagina
4. **Inclua `<meta charset="UTF-8">`** — define o conjunto de caracteres para suportar acentuacoes e caracteres especiais sem problemas de formatacao
5. **Inclua a meta viewport** — `<meta name="viewport" content="width=device-width, initial-scale=1.0">` garante portabilidade em dispositivos moveis
6. **Sempre defina um `<title>`** — aparece na aba do navegador e e essencial para SEO e usabilidade

## How to write

### Documento HTML completo

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nome da Pagina</title>
</head>
<body>
  <!-- Conteudo visivel aqui -->
</body>
</html>
```

### Atalho em editores (VS Code)

Digitar `!` e pressionar Enter gera o boilerplate automaticamente. Ajustar `lang` para `pt-BR` e o `<title>` para o nome correto da pagina.

## Example

**Before (estrutura incorreta):**
```html
<head>
  <title>Meu Site</title>
</head>
<h1>Bem vindo</h1>
```

**After (com esta skill aplicada):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meu Site</title>
</head>
<body>
  <h1>Bem vindo</h1>
</body>
</html>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo arquivo HTML | Usar atalho `!` + Enter no VS Code, ajustar lang e title |
| Pagina em portugues | `lang="pt-BR"` |
| Pagina em ingles | `lang="en"` |
| Caracteres especiais quebrados | Verificar se `<meta charset="UTF-8">` esta presente no head |
| Layout quebrado no celular | Verificar se a meta viewport esta presente |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| HTML sem `<!DOCTYPE html>` | Sempre iniciar com `<!DOCTYPE html>` |
| Tags soltas fora do `<html>` | Toda tag dentro da hierarquia `html > head/body` |
| Conteudo visivel dentro do `<head>` | Conteudo visivel somente dentro do `<body>` |
| `<title>` no body | `<title>` somente no `<head>` |
| Omitir meta charset | Sempre incluir `<meta charset="UTF-8">` |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Caracteres especiais aparecem quebrados | Faltou `<meta charset="UTF-8">` no head | Adicione a meta charset como primeira tag do head |
| Layout quebrado no celular | Faltou meta viewport | Adicione `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| Navegador entra em quirks mode | Faltou `<!DOCTYPE html>` no início | Sempre inicie o arquivo com `<!DOCTYPE html>` |
| Título não aparece na aba do navegador | `<title>` está no body ou ausente | Mova `<title>` para dentro do `<head>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre hierarquia HTML, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes