---
name: rs-full-stack-hiperlink
description: "Enforces correct HTML hyperlink patterns when writing anchor tags or navigation. Use when user asks to 'create a link', 'add navigation', 'link to a page', 'add anchor tag', or any task involving HTML links. Applies rules: href is mandatory, URL vs fragment usage, target=_blank for external links, semantic link content. Make sure to use this skill whenever generating HTML with links or navigation elements. Not for CSS styling, JavaScript event handlers, or React Router."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: html-fundamentals
  tags: [html, anchor, hyperlink, navigation, accessibility]
---

# Hiperlink HTML — Tag `<a>`

> Todo link exige o atributo `href` — sem ele, o link nao existe.

## Rules

1. **`href` e obrigatorio** — um `<a>` sem `href` nao e um link, porque o navegador nao sabe para onde navegar
2. **Use URL completa para links externos** — `https://example.com`, porque URLs relativas quebram em contextos diferentes
3. **Use fragmento `#id` para navegacao interna** — `href="#secao"` aponta para um elemento com `id="secao"` na mesma pagina, porque evita recarregamento
4. **Links externos usam `target="_blank"`** — porque mantem o usuario no site original enquanto abre o destino em nova aba
5. **Conteudo do link deve ser descritivo** — `Conheca a Skillz` nao `Clique aqui`, porque leitores de tela e SEO dependem do texto do link
6. **Dentro do `<a>` pode conter outras tags** — imagens, spans, paragrafos, porque o link envolve todo o conteudo clicavel

## How to write

### Link externo (nova aba)

```html
<a href="https://skillz.com.br" target="_blank">Conheca a Skillz</a>
```

### Link fragmento (mesma pagina)

```html
<a href="#trabalhos">Trabalhos</a>

<!-- Mais abaixo na pagina -->
<section id="trabalhos">
  <h2>Nossos Trabalhos</h2>
  <p>Conteudo da secao...</p>
</section>
```

### Link interno (mesma aba)

```html
<a href="/sobre">Sobre nos</a>
```

## Example

**Before (erros comuns):**

```html
<a>Clique aqui</a>
<a href="https://exemplo.com">Clique aqui</a>
```

**After (com esta skill aplicada):**

```html
<a href="https://exemplo.com" target="_blank">Visite o Example</a>
<a href="#contato">Ir para Contato</a>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Link para site externo | `href` com URL completa + `target="_blank"` |
| Navegacao dentro da mesma pagina | `href="#id-do-elemento"` (fragmento) |
| Navegacao interna do proprio site | `href="/caminho"` sem `target="_blank"` |
| Link envolvendo imagem | `<a href="..."><img src="..." alt="..."></a>` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<a>texto</a>` (sem href) | `<a href="/destino">texto</a>` |
| `<a href="https://externo.com">Clique aqui</a>` | `<a href="https://externo.com" target="_blank">Visite Externo</a>` |
| `<a href="" onclick="...">` | `<a href="/pagina">Descricao</a>` |
| Texto generico "Clique aqui" | Texto descritivo do destino |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Link nao funciona (nao navega) | Atributo `href` ausente no `<a>` | Adicione `href="/destino"` ou `href="https://..."` |
| Link fragmento nao rola para a secao | Elemento alvo nao tem `id` correspondente | Adicione `id="secao"` no elemento destino que corresponde ao `href="#secao"` |
| Link externo abre na mesma aba | Falta `target="_blank"` | Adicione `target="_blank"` para links externos |
| Leitor de tela nao descreve o link | Texto do link e generico ("clique aqui") | Use texto descritivo do destino no conteudo do `<a>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes