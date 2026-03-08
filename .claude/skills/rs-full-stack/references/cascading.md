---
name: rs-full-stack-cascading
description: "Enforces CSS cascade order understanding when writing or debugging stylesheets. Use when user asks to 'style an element', 'fix CSS not applying', 'debug CSS specificity', 'why is my style not working', or 'write CSS rules'. Applies cascade hierarchy: last rule wins for equal specificity, later selectors override earlier ones. Make sure to use this skill whenever resolving CSS conflicts or writing multiple rules for the same element. Not for JavaScript logic, HTML structure, or CSS layout techniques like flexbox/grid."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [css, cascade, specificity, selectors, debugging]
---

# Cascading — Hierarquia de Regras no CSS

> Quando duas regras CSS competem com a mesma especificidade, a ultima declarada no codigo vence.

## Rules

1. **Ultima regra vence** — entre dois seletores identicos, o que aparece por ultimo no arquivo prevalece, porque o navegador le CSS de cima para baixo e sobrescreve propriedades duplicadas
2. **Ordem no arquivo importa** — mover uma regra de posicao muda o resultado visual, porque a cascata e posicional
3. **Propriedades duplicadas no mesmo bloco** — o editor avisa, mas em arquivos grandes com centenas de seletores a duplicacao acontece em blocos distantes e passa despercebida
4. **Especificidade altera a cascata** — um seletor de classe (`.green`) vence um seletor de tag (`p`) independente da ordem, porque especificidade tem prioridade sobre posicao

## How to write

### Evitar conflitos de cascata

```css
/* Regra unica por propriedade — sem ambiguidade */
p {
  color: violet;
}

/* Se precisar sobrescrever, use especificidade maior */
p.highlight {
  color: blue;
}
```

### Ordem intencional

```css
/* Base (generica) primeiro */
p {
  color: violet;
}

/* Variacao (especifica) depois */
.green {
  color: green;
}
```

## Example

**Before (conflito silencioso):**

```css
p {
  color: violet;
  color: blue; /* sobrescreve violet — editor avisa, mas em arquivo grande passa despercebido */
}
```

**After (intencao clara):**

```css
p {
  color: blue;
}
```

**Cascata entre blocos distantes:**

```css
/* linha 12 */
p {
  color: violet;
}

/* linha 847 — esqueceu que ja estilizou p */
p {
  color: blue; /* este vence pela posicao */
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Duas regras identicas, resultados inesperados | Verifique qual aparece por ultimo no arquivo — essa vence |
| Cor nao aplica mesmo sendo a ultima | Verifique especificidade: classe > tag, id > classe |
| Arquivo CSS grande com muitos seletores | Busque duplicatas do mesmo seletor com `Ctrl+F` |
| Precisa sobrescrever estilo base | Use seletor mais especifico em vez de repetir o mesmo seletor abaixo |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Duas propriedades `color` no mesmo bloco | Mantenha apenas o valor final desejado |
| Repetir seletor `p` em dois lugares distantes | Consolide estilos do mesmo seletor ou use classe especifica |
| Confiar na ordem do arquivo para controle fino | Use especificidade (classe, id) para controle previsivel |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Estilo nao aplica mesmo sendo o ultimo no arquivo | Seletor com menor especificidade | Use seletor mais especifico (classe > tag) |
| Cor muda inesperadamente | Duplicata do mesmo seletor em posicao posterior | Busque duplicatas com `Ctrl+F` e consolide |
| `!important` nao funciona | Outro `!important` com especificidade maior | Remova `!important` e resolva com especificidade correta |
| Estilo de um arquivo CSS sobrescreve outro | Ordem de import dos CSS | Reordene imports para que estilos base venham primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cascata, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes