---
name: rs-full-stack-anatomia-das-tags-1
description: "Enforces correct HTML tag anatomy when writing HTML markup. Use when user asks to 'create HTML', 'write a page', 'add an element', 'fix HTML structure', or any markup task. Applies rules: proper opening/closing tags, correct attribute placement, self-closing tags for void elements, element nesting. Make sure to use this skill whenever generating HTML, even for small snippets. Not for CSS styling, JavaScript logic, or backend code."
---

# Anatomia das Tags HTML

> Ao escrever HTML, cada tag segue uma anatomia precisa: abertura, conteudo, fechamento — formando um elemento.

## Rules

1. **Toda tag tem abertura e fechamento** — `<h1>Titulo</h1>` nao `<h1>Titulo`, porque tags sem fechamento quebram o DOM e geram comportamento imprevisivel
2. **O fechamento repete o nome com barra** — `</h1>` nao `<h1/>` nem `</ h1>`, porque o parser HTML exige `</` + nome exato
3. **Atributos ficam na tag de abertura** — `<h1 id="titulo">` nao `<h1>id="titulo"`, porque atributos configuram o elemento antes do conteudo ser processado
4. **Tags vazias nao tem conteudo nem fechamento** — `<img src="foto.jpg" alt="Foto">` e `<br>`, porque sao void elements que o HTML spec define como auto-fechados
5. **Nomeie elementos pela semantica** — `<h1>` para titulo principal, nao `<div>` com fonte grande, porque a marcacao descreve significado, nao aparencia
6. **Atributos sao opcionais mas configuram** — `<img>` sem `src` e `alt` e valido sintaticamente mas inutil, porque atributos dao significado e funcionalidade ao elemento

## How to write

### Elemento completo (com conteudo)

```html
<!-- Abertura + Conteudo + Fechamento = Elemento -->
<h1 id="page-title">Titulo da Pagina</h1>
```

### Elemento vazio (void element)

```html
<!-- Tag sem conteudo — nao precisa de fechamento -->
<img src="photo.jpg" alt="Descricao da foto">
<br>
<input type="text" name="email">
```

### Elemento com atributos

```html
<!-- Atributos sempre na abertura, antes do > -->
<a href="https://example.com" target="_blank">Link</a>
```

## Example

**Before (erros comuns):**

```html
<h1>Titulo
<img src="foto.jpg" alt="Foto"></img>
<br></br>
<p id="intro">Texto</div>
```

**After (anatomia correta):**

```html
<h1>Titulo</h1>
<img src="foto.jpg" alt="Foto">
<br>
<p id="intro">Texto</p>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Tag com conteudo visivel (texto, outros elementos) | Abertura + conteudo + fechamento (`<p>...</p>`) |
| Tag sem conteudo (imagem, quebra de linha, input) | Apenas abertura (`<img>`, `<br>`, `<hr>`) |
| Precisa configurar comportamento | Adicione atributos na tag de abertura |
| Tag universal como `id` ou `class` | Pode ir em qualquer elemento |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `<h1>Titulo` (sem fechar) | `<h1>Titulo</h1>` |
| `<img src="x.jpg"></img>` | `<img src="x.jpg" alt="desc">` |
| `<br></br>` | `<br>` |
| `<p>Texto</div>` (fechamento errado) | `<p>Texto</p>` |
| `<h1 >` (espaco antes de >) | `<h1>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre anatomia de tags, terminologia (elemento, filho, no) e void elements
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes