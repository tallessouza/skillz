---
name: rs-full-stack-espacos-e-quebras-de-linha
description: "Enforces correct HTML whitespace and line break handling when writing HTML markup. Use when user asks to 'create HTML', 'add spacing', 'break lines in HTML', 'fix whitespace', or 'write a paragraph'. Applies rules: use br for line breaks, use &amp;nbsp; for extra spaces, prefer semantic elements like p over br chains. Make sure to use this skill whenever generating HTML text content with spacing needs. Not for CSS spacing, margins, padding, or layout."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: html-fundamentals
  tags: [html, whitespace, line-break, br, nbsp, paragraphs, semantics]
---

# Espaços e Quebras de Linha no HTML

> HTML ignora quebras de linha e múltiplos espaços no código-fonte — use marcações explícitas para controlar espaçamento.

## Rules

1. **HTML colapsa whitespace** — múltiplos espaços viram um só, quebras de linha são ignoradas, porque o browser trata todo whitespace consecutivo como um único espaço
2. **Use `<br>` para quebra de linha** — tag auto-fechante (`<br>` ou `<br />`) força uma quebra, porque é a marcação semântica para line break
3. **Use `&nbsp;` para espaços extras** — entidade HTML que o browser renderiza como espaço não-colapsável, porque espaços normais consecutivos são ignorados
4. **Prefira `<p>` a múltiplos `<br>`** — separar conteúdo em parágrafos é mais semântico que empilhar `<br>`, porque comunica intenção de novo bloco de texto
5. **CSS é a solução definitiva** — `<br>` e `&nbsp;` resolvem casos simples, mas `margin`, `padding`, `line-height` e `white-space` são as ferramentas corretas para controle avançado

## How to write

### Quebra de linha com `<br>`

```html
<p>Primeira linha do texto.<br>Segunda linha no mesmo parágrafo.</p>
```

### Espaços extras com `&nbsp;`

```html
<p>Palavra&nbsp;&nbsp;&nbsp;com&nbsp;espaços&nbsp;extras.</p>
```

### Separação semântica com `<p>`

```html
<p>Primeiro parágrafo com seu conteúdo.</p>
<p>Segundo parágrafo — melhor que usar br entre blocos.</p>
```

## Example

**Before (não funciona como esperado):**

```html
<p>Linha um
Linha dois
Linha três      com espaços</p>
```

Resultado: `Linha um Linha dois Linha três com espaços` (tudo junto, um espaço só)

**After (com marcações corretas):**

```html
<p>Linha um<br>Linha dois<br>Linha três&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;com espaços</p>
```

Resultado: três linhas separadas, espaços preservados.

## Heuristics

| Situação | Faça |
|----------|------|
| Separar blocos de texto | Use `<p>` para cada bloco |
| Quebra dentro do mesmo parágrafo | Use `<br>` |
| Espaçamento visual entre elementos | Use CSS (`margin`, `padding`) |
| Espaços forçados inline | Use `&nbsp;` (raramente necessário) |
| Layout ou alinhamento | Nunca use `&nbsp;` — use CSS |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Múltiplos `<br><br><br>` para espaçar blocos | `<p>` separados ou CSS `margin` |
| Dezenas de `&nbsp;` para alinhar colunas | CSS `display: flex` ou `grid` |
| Quebras de linha no source esperando renderizar | `<br>` explícito ou `<p>` |
| Espaços repetidos no source para indentar texto | CSS `text-indent` ou `padding-left` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Texto aparece tudo em uma linha so | Quebras de linha no source code sem `<br>` | Adicionar `<br>` ou separar em `<p>` |
| Espacos extras nao aparecem | Browser colapsa whitespace consecutivo | Usar `&nbsp;` para espacos forcados |
| Layout desalinhado com muitos `&nbsp;` | Usando entidades HTML para layout | Substituir por CSS `display: flex` ou `grid` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre whitespace collapsing e estratégias
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações