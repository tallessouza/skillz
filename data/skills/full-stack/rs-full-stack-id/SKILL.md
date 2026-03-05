---
name: rs-full-stack-id
description: "Enforces correct HTML id attribute usage when writing markup. Use when user asks to 'create an element', 'add an id', 'write HTML', 'build a page', or any HTML generation task. Applies rules: unique ids per document, start with letters, use hyphens as separators, no special characters, no leading numbers. Make sure to use this skill whenever generating HTML elements with ids. Not for CSS class naming, JavaScript variable naming, or database identifiers."
---

# Atributo ID no HTML

> Todo id e um identificador unico por documento — trate como o RG do elemento.

## Rules

1. **Nunca repita um id no mesmo documento** — cada id deve ser unico na pagina, porque o browser usa o primeiro que encontrar e ignora duplicatas, causando bugs silenciosos em CSS e JavaScript
2. **Comece sempre com letra** — `id="nome1"` nao `id="1nome"`, porque ids que comecam com numero quebram seletores CSS e causam comportamento imprevisivel
3. **Use tracos para separar palavras** — `id="nome-completo"` nao `id="nome completo"`, porque espacos invalidam o id e geram conflitos no DOM
4. **Nunca use caracteres especiais** — sem `@`, `#`, `!`, `%` no id, porque podem conflitar com seletores CSS e JavaScript e gerar erros dificeis de rastrear
5. **Nomeie pelo conteudo/funcao** — `id="formulario-contato"` nao `id="div1"`, porque ids descritivos facilitam manutencao e busca no codebase

## How to write

### Id basico

```html
<!-- Id unico, descritivo, comecando com letra -->
<div id="perfil-usuario">...</div>
<section id="lista-produtos">...</section>
<form id="formulario-contato">...</form>
```

### Separacao com tracos

```html
<!-- Palavras compostas separadas por traco -->
<div id="nome-completo">...</div>
<div id="endereco-entrega">...</div>
```

## Example

**Before (erros comuns):**

```html
<div id="1header"></div>        <!-- comeca com numero -->
<div id="meu header"></div>     <!-- espaco no id -->
<div id="seção-hero"></div>     <!-- caractere especial (ç) -->
<div id="card"></div>
<div id="card"></div>           <!-- id duplicado -->
```

**After (com esta skill aplicada):**

```html
<div id="header-principal"></div>
<div id="meu-header"></div>
<div id="secao-hero"></div>
<div id="card-destaque"></div>
<div id="card-secundario"></div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Elemento precisa ser acessado por JS | Use id unico e descritivo |
| Estilizacao de grupo de elementos | Use class, nao id |
| Palavras compostas | Separe com traco `-` |
| Ancora de navegacao interna | Use id na secao destino |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `id="1nome"` | `id="nome-1"` |
| `id="meu nome"` | `id="meu-nome"` |
| `id="seção"` | `id="secao"` |
| Dois elementos com `id="header"` | Ids unicos: `id="header-topo"`, `id="header-nav"` |
| `id="div1"` | `id="banner-principal"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogia do RG e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes