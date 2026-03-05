---
name: rs-full-stack-titulos-e-paragrafos-1
description: "Enforces correct HTML heading hierarchy and paragraph structure when writing HTML content. Use when user asks to 'create a page', 'write HTML', 'structure content', 'add headings', or 'organize text'. Applies rules: one H1 per page, heading levels follow hierarchy (no skipping), paragraphs wrap text blocks. Make sure to use this skill whenever generating HTML with text content. Not for CSS styling, JavaScript, or non-HTML markup languages."
---

# Títulos e Parágrafos HTML

> Organize conteúdo HTML usando uma hierarquia clara de headings (H1-H6) e parágrafos (p) para dar significado e estrutura ao texto.

## Rules

1. **Um único H1 por página** — o H1 define o tópico principal da página inteira, porque múltiplos H1 confundem tanto leitores quanto mecanismos de busca
2. **Respeite a hierarquia de headings** — H2 é subtítulo do H1, H3 é subtítulo do H2, nunca pule níveis (H1 → H3), porque a hierarquia comunica a relação entre seções
3. **Envolva todo bloco de texto em `<p>`** — texto solto sem tag de parágrafo perde significado semântico e quebra a organização visual
4. **Headings nomeiam seções, parágrafos desenvolvem** — o heading anuncia o assunto, o parágrafo explica, porque texto sem heading é como livro sem capítulos
5. **Use quantos H2-H6 e `<p>` precisar** — não há limite para subtítulos e parágrafos, apenas o H1 é restrito a um por página

## How to write

### Estrutura básica de página

```html
<h1>Sobre Mim</h1>
<p>Texto introdutório sobre a página.</p>

<h2>Trabalho</h2>
<p>Descrição sobre o trabalho.</p>

<h3>Carga Horária</h3>
<p>Detalhes sobre carga horária.</p>

<h2>Estilo de Vida</h2>
<p>Descrição sobre estilo de vida.</p>
```

## Example

**Before (texto desorganizado):**
```html
Sobre mim eu trabalho com desenvolvimento e gosto de viajar
minha carga horária é flexível e meu estilo de vida é saudável
```

**After (com headings e parágrafos):**
```html
<h1>Sobre Mim</h1>
<p>Eu trabalho com desenvolvimento e gosto de viajar.</p>

<h2>Trabalho</h2>
<p>Atuo como desenvolvedor web full stack.</p>

<h3>Carga Horária</h3>
<p>Minha carga horária é flexível.</p>

<h2>Estilo de Vida</h2>
<p>Meu estilo de vida é saudável.</p>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Página nova com conteúdo textual | Comece pelo H1 definindo o tópico principal |
| Nova seção dentro da página | Use H2 |
| Subseção dentro de uma seção H2 | Use H3 (não pule para H4) |
| Bloco de texto explicativo | Envolva em `<p>` |
| Texto curto como label ou legenda | Considere `<span>` ou `<label>`, não `<p>` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| Múltiplos `<h1>` na mesma página | Um `<h1>` + múltiplos `<h2>` |
| `<h1>` seguido direto de `<h3>` | `<h1>` → `<h2>` → `<h3>` |
| Texto solto sem tag | `<p>Texto aqui</p>` |
| `<br><br>` para separar blocos | Parágrafos `<p>` separados |
| Heading usado só para texto grande | Use CSS para tamanho, heading para semântica |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações