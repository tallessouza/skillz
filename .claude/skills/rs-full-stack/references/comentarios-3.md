---
name: rs-full-stack-comentarios-3
description: "Applies HTML comment syntax when writing or organizing HTML code. Use when user asks to 'comment out HTML', 'add HTML comments', 'hide HTML content', 'organize HTML code', or 'document HTML'. Writes comments with correct comment delimiter syntax and uses them for code organization. Make sure to use this skill whenever generating HTML that benefits from inline documentation. Not for CSS comments, JS comments, or JSX comments."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [html, comments, organization, documentation, syntax]
---

# Comentarios no HTML

> Use comentarios HTML para organizar codigo e documentar decisoes, nunca para esconder codigo morto em producao.

## Rules

1. **Use a sintaxe correta** — `<!-- comentario -->`, porque qualquer variacao quebra o parsing do navegador
2. **Comente o POR QUE, nao o O QUE** — `<!-- Secao duplicada para A/B test -->` nao `<!-- div com titulo -->`, porque o codigo ja mostra o que ele faz
3. **Use comentarios como separadores de secao** — `<!-- HEADER -->`, `<!-- MAIN CONTENT -->`, `<!-- FOOTER -->`, porque facilita navegacao em arquivos grandes
4. **Remova codigo comentado antes de fazer merge** — porque codigo comentado e codigo morto que polui o codebase

## How to write

### Comentario basico

```html
<!-- Explicacao do que esta secao faz -->
<section>
  <h1>Titulo</h1>
</section>
```

### Separadores de secao

```html
<!-- ============ HEADER ============ -->
<header>
  <nav>...</nav>
</header>

<!-- ============ MAIN ============ -->
<main>
  <article>...</article>
</main>

<!-- ============ FOOTER ============ -->
<footer>
  <p>...</p>
</footer>
```

## Example

**Before (sem organizacao):**

```html
<header><nav><a href="/">Home</a></nav></header>
<main><h1>Titulo</h1><p>Texto</p></main>
<footer><p>Rodape</p></footer>
```

**After (com comentarios de organizacao):**

```html
<!-- HEADER: Navegacao principal -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>

<!-- MAIN: Conteudo da pagina -->
<main>
  <h1>Titulo</h1>
  <p>Texto</p>
</main>

<!-- FOOTER -->
<footer>
  <p>Rodape</p>
</footer>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Arquivo HTML com mais de 50 linhas | Adicione separadores de secao |
| Logica nao obvia no markup | Comente o motivo da estrutura |
| Codigo temporario para debug | Comente, mas remova antes do commit |
| Template com slots/blocos | Comente o que cada bloco espera receber |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<!- comentario ->` (um traco) | `<!-- comentario -->` (dois tracos) |
| `<!-- <div>codigo morto</div> -->` em producao | Delete o codigo morto |
| `<!-- isso e um paragrafo -->` acima de `<p>` | Nada — o `<p>` ja e auto-explicativo |
| Comentarios dentro de comentarios (aninhados) | Separe em blocos distintos |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Comentario HTML aparece na pagina | Sintaxe errada: `<!- -->` com um traco | Use `<!-- -->` com dois tracos de cada lado |
| Comentario HTML quebra o layout | Comentario aninhado dentro de outro comentario | Remova aninhamento — HTML nao suporta comentarios dentro de comentarios |
| Codigo comentado permanece no bundle | Comentarios HTML sao enviados ao navegador | Use ferramenta de minificacao que remove comentarios em producao |
| Comentario nao esconde conteudo | Tag de fechamento `-->` ausente ou mal posicionada | Verifique que `<!--` e `-->` envolvem todo o trecho |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes