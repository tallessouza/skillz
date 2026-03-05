---
name: rs-discover-criando-lista-em-html
description: "Enforces correct HTML list and link structure when writing HTML pages. Use when user asks to 'create a list', 'add links', 'build a navigation', 'make a link list', or 'create ul/ol elements'. Applies rules: ul for unordered lists, ol for ordered, li wraps each item, href='#' for placeholder links, target='_blank' for external links. Make sure to use this skill whenever generating HTML with lists or navigation links. Not for CSS styling, JavaScript interactivity, or backend routing."
---

# Criando Listas em HTML

> Usar `<ul>` para listas sem ordem especifica, `<ol>` para listas ordenadas, e sempre preservar a navegacao do usuario com `target="_blank"` em links externos.

## Rules

1. **Use `<ul>` para listas sem ordem** — unordered list renderiza marcadores (pontos), porque a ordem dos itens nao importa visualmente
2. **Use `<ol>` para listas ordenadas** — ordered list renderiza numeros (1, 2, 3), porque a sequencia importa
3. **Cada item da lista e um `<li>`** — list item dentro de `<ul>` ou `<ol>`, porque a semantica HTML exige essa estrutura
4. **Use `href="#"` para links placeholder** — o link fica clicavel mas nao redireciona, porque durante desenvolvimento voce ainda nao tem a URL final
5. **Use `target="_blank"` em links externos** — abre nova aba, porque o usuario nao deve perder a pagina atual ao clicar
6. **`<a>` vai dentro do `<li>`** — a tag de link fica dentro do item da lista, porque o item e o container semantico

## How to write

### Lista de links com navegacao externa

```html
<ul>
  <li><a href="#">Inscrever-se</a></li>
  <li><a href="#">Baixar meu e-book</a></li>
  <li><a href="https://meusite.com/portfolio" target="_blank">Ver meu portfólio</a></li>
  <li><a href="https://rocketseat.com.br/explorer" target="_blank">Conheça o Explorer</a></li>
</ul>
```

### Lista ordenada (quando ordem importa)

```html
<ol>
  <li><a href="#step1">Passo 1: Criar conta</a></li>
  <li><a href="#step2">Passo 2: Confirmar email</a></li>
  <li><a href="#step3">Passo 3: Completar perfil</a></li>
</ol>
```

## Example

**Before (links soltos sem estrutura):**
```html
<a href="https://github.com/user">GitHub</a>
<a href="https://site.com">Portfolio</a>
<a href="#">E-book</a>
```

**After (com estrutura de lista e target correto):**
```html
<ul>
  <li><a href="https://github.com/user" target="_blank">GitHub</a></li>
  <li><a href="https://site.com" target="_blank">Portfolio</a></li>
  <li><a href="#">Baixar meu e-book</a></li>
</ul>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Link leva para fora do site | Adicione `target="_blank"` |
| Link ainda nao tem destino | Use `href="#"` |
| Link e interno (ancora na pagina) | Use `href="#secao"` sem target |
| Itens tem sequencia logica | Use `<ol>` em vez de `<ul>` |
| Lista de navegacao/links sociais | Use `<ul>` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Links soltos sem `<ul>/<li>` | Envolva em `<ul><li><a>` |
| `<ul><a href="...">` (sem li) | `<ul><li><a href="...">` |
| Link externo sem `target="_blank"` | Adicione `target="_blank"` |
| `href=""` para placeholder | `href="#"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre listas HTML, semantica e navegacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes