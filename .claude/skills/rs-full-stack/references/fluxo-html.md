---
name: rs-full-stack-fluxo-html
description: "Applies HTML block vs inline flow rules when writing or reviewing HTML markup. Use when user asks to 'create a page', 'write HTML', 'fix layout', 'add elements', or 'structure HTML'. Enforces correct understanding of block elements (full width, stack vertically) vs inline elements (content width, flow horizontally). Make sure to use this skill whenever generating HTML structure or debugging layout issues. Not for CSS styling, JavaScript, or backend code."
---

# Fluxo HTML — Block vs Inline

> Ao escrever HTML, todo elemento segue um fluxo padrao: block ocupa toda a largura e empilha verticalmente; inline ocupa apenas o tamanho do conteudo e flui horizontalmente.

## Key concept

O navegador renderiza elementos HTML seguindo um fluxo padrao (normal flow). Cada tag tem um comportamento de exibicao implicito — block ou inline — que determina como ela ocupa espaco e como o proximo elemento se posiciona em relacao a ela. Entender isso e prerequisito para qualquer trabalho com layout.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Elementos empilhando quando deveriam ficar lado a lado | Provavelmente sao block — use inline ou flexbox |
| Elementos lado a lado quando deveriam empilhar | Provavelmente sao inline — use block ou quebra de linha |
| Layout quebrado sem CSS aplicado | Verifique o fluxo padrao da tag antes de adicionar CSS |
| Duvida sobre comportamento de uma tag | Consulte se e block ou inline por padrao |

## Rules

1. **Tags block ocupam 100% da largura disponivel** — `<p>`, `<div>`, `<h1>`-`<h6>`, `<section>`, `<article>` empilham verticalmente, porque o bloco se expande horizontalmente e empurra o proximo elemento para baixo
2. **Tags inline ocupam apenas o tamanho do conteudo** — `<a>`, `<span>`, `<strong>`, `<em>` fluem lado a lado, porque inline respeita apenas o espaco necessario
3. **Nunca assuma layout sem conhecer o fluxo padrao** — antes de aplicar CSS, entenda o comportamento nativo da tag, porque muitos "bugs" de layout sao apenas desconhecimento do fluxo

## How to write

### Elementos block (empilham verticalmente)

```html
<p>Primeiro paragrafo</p>
<p>Segundo paragrafo</p>
<!-- Resultado: um abaixo do outro, cada um ocupando toda a largura -->
```

### Elementos inline (fluem horizontalmente)

```html
<a href="/link1">Link 1</a>
<a href="/link2">Link 2</a>
<!-- Resultado: lado a lado, com pequeno espaco padrao entre eles -->
```

## Example

**Expectativa errada (achar que tudo empilha):**
```html
<a href="/home">Home</a>
<a href="/about">About</a>
<!-- Dev espera um abaixo do outro, mas ficam lado a lado -->
```

**Realidade (com skill aplicada):**
```html
<!-- Para links lado a lado (comportamento padrao inline): -->
<a href="/home">Home</a>
<a href="/about">About</a>

<!-- Para links empilhados (precisa forcar block): -->
<div><a href="/home">Home</a></div>
<div><a href="/about">About</a></div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de secoes empilhadas | Use tags block (`<div>`, `<section>`, `<p>`) |
| Precisa de elementos lado a lado | Use tags inline (`<a>`, `<span>`) ou flexbox |
| Espaco misterioso entre elementos inline | E o espaco padrao do navegador (whitespace collapsing + CSS padrao) |
| Nao sabe se tag e block ou inline | Teste sem CSS — observe o fluxo natural |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Escrever tags uma abaixo da outra no codigo = renderizar uma abaixo da outra | O posicionamento no codigo nao determina o visual — o tipo block/inline da tag determina |
| Todo elemento HTML empilha verticalmente | Apenas block elements empilham; inline elements fluem horizontalmente |
| Precisa de CSS para colocar elementos lado a lado | Tags inline ja fazem isso nativamente |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|--------------|
| Adicionar `display: block` em `<a>` sem motivo | Entenda que `<a>` e inline por padrao |
| Usar `<br>` para separar block elements | Block elements ja empilham naturalmente |
| Confundir posicao no codigo com posicao visual | Analise o tipo da tag (block vs inline) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre fluxo HTML, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-fluxo-html/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-fluxo-html/references/code-examples.md)
