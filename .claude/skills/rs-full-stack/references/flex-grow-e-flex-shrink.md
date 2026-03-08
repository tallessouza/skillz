---
name: rs-full-stack-flex-grow-e-flex-shrink
description: "Enforces correct flex-grow and flex-shrink usage when writing CSS Flexbox layouts. Use when user asks to 'create a layout', 'distribute space', 'make items grow', 'shrink elements', 'flex layout', or any Flexbox task. Applies proportional growth with flex-grow, proportional shrink with flex-shrink, and flex-basis over width/height to avoid axis-inversion bugs. Make sure to use this skill whenever generating Flexbox CSS, even for simple layouts. Not for CSS Grid, positioning, or non-layout styling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-flexbox
  tags: [css, flexbox, flex-grow, flex-shrink, layout]
---

# Flex Grow e Flex Shrink

> Flex-grow distribui espaço vazio em proporções, flex-shrink encolhe em proporções — use flex-basis em vez de width/height para evitar bugs de inversão de eixo.

## Rules

1. **flex-grow distribui espaço vazio proporcionalmente** — `flex-grow: 2` recebe duas porções enquanto `flex-grow: 1` recebe uma, porque o valor define quantas "fatias" do espaço livre o item consome
2. **flex-shrink: quanto MAIOR o valor, MENOR o item** — `flex-shrink: 2` encolhe o dobro que `flex-shrink: 1`, porque shrink é encolhimento proporcional (lógica inversa ao grow)
3. **flex-shrink padrão é 1** — por isso itens "cabem" no container mesmo com flex-basis maior que o espaço disponível, porque o navegador ativa encolhimento automático por padrão
4. **flex-shrink: 0 desativa encolhimento** — o item mantém seu flex-basis exato e transborda se necessário, porque nenhuma proporção de encolhimento será aplicada
5. **Prefira flex-basis a width/height** — `flex-basis: 120px` funciona corretamente com stretch em qualquer direção de eixo, porque width/height conflita com align-items: stretch quando o eixo é invertido
6. **CSS é sensível a conflitos** — uma propriedade fixa (width) anula comportamentos dinâmicos (stretch, grow), porque propriedades explícitas têm precedência sobre distribuição automática

## How to write

### Crescimento proporcional

```css
.container {
  display: flex;
}

.item {
  flex-grow: 1; /* todos recebem 1 porção do espaço livre */
}

.item-destaque {
  flex-grow: 2; /* recebe 2 porções — visualmente maior */
}
```

### Encolhimento controlado

```css
.item {
  flex-basis: 120px;
  flex-shrink: 1; /* encolhe proporcionalmente (padrão) */
}

.item-fixo {
  flex-basis: 120px;
  flex-shrink: 0; /* nunca encolhe — mantém 120px exatos */
}

.item-encolhe-mais {
  flex-basis: 120px;
  flex-shrink: 2; /* encolhe o dobro dos outros */
}
```

### Evitando bugs de inversão de eixo

```css
/* CORRETO: flex-basis funciona em qualquer direção */
.item {
  flex-basis: 120px; /* respeita stretch em row e column */
}

/* PROBLEMÁTICO: width conflita com stretch em flex-direction: column */
.item {
  width: 20px; /* bloqueia stretch no eixo transversal quando invertido */
}
```

## Example

**Before (bugs comuns):**
```css
.container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 400px;
}
.item {
  width: 20px; /* impede stretch de funcionar na horizontal */
}
```

**After (com esta skill aplicada):**
```css
.container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 400px;
}
.item {
  flex-basis: 20px; /* stretch funciona corretamente */
  flex-grow: 1;     /* distribui espaço vertical proporcionalmente */
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Distribuir espaço livre entre itens | `flex-grow: 1` em todos, valor maior no destaque |
| Item deve manter tamanho exato | `flex-shrink: 0` + `flex-basis: Xpx` |
| Item deve encolher menos que outros | `flex-shrink` menor (ex: 0.5) nele, maior nos outros |
| Layout funciona em row mas quebra em column | Trocar `width`/`height` por `flex-basis` |
| Valores fracionários de shrink | Válido — `flex-shrink: 0.2` aplica encolhimento parcial |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `width: 120px` em flex items dinâmicos | `flex-basis: 120px` |
| `flex-shrink: 0` sem saber o impacto | Mantenha `flex-shrink: 1` (padrão) ou use com transbordo intencional |
| `flex-grow: 1` achando que grow e shrink têm mesma lógica | Lembre: grow maior = item maior, shrink maior = item MENOR |
| `align-items: stretch` + `width` fixa no eixo transversal | Remover width ou usar flex-basis |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Item com `flex-grow: 1` nao cresce | Container nao tem espaco livre disponivel | Verifique se o container tem largura/altura suficiente |
| `flex-shrink: 0` causa overflow | Item mantém tamanho exato e nao cabe no container | Adicione `overflow: auto` no container ou reduza o `flex-basis` |
| `align-items: stretch` nao funciona | `width` ou `height` fixa esta bloqueando o stretch | Remova a propriedade fixa e use `flex-basis` |
| Proporcoes de grow nao parecem corretas | Outros itens tem flex-basis diferente, afetando a distribuicao | Lembre que grow distribui apenas o espaco LIVRE, nao o espaco total |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre proporções, conflitos de propriedades e analogias do instrutor
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e cenários reais