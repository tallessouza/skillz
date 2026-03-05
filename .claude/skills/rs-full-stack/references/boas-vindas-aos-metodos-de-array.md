---
name: rs-full-stack-boas-vindas-metodos-array
description: "Introduces JavaScript array methods as a mental model for data transformation. Use when user asks to 'iterate an array', 'transform a list', 'filter items', 'map values', or 'reduce data' in JavaScript. Provides decision framework for choosing the right array method. Make sure to use this skill whenever the user works with arrays in JS/TS and needs guidance on which method to pick. Not for specific method implementation details — see dedicated method skills for forEach, map, filter, reduce, etc."
---

# Métodos de Array — Visão Geral

> Métodos de array são ferramentas para percorrer, manipular e transformar dados — escolha o método pela intenção, não pelo hábito.

## Conceito central

Arrays em JavaScript possuem métodos nativos que substituem loops manuais com operações declarativas. Cada método expressa uma intenção diferente: percorrer, transformar, filtrar, acumular ou buscar.

## Framework de decisão

| Intenção | Método | Retorna |
|----------|--------|---------|
| Percorrer sem retorno | `forEach` | `undefined` |
| Transformar cada item | `map` | Novo array (mesmo tamanho) |
| Filtrar por condição | `filter` | Novo array (mesmo ou menor) |
| Acumular em um valor | `reduce` | Qualquer tipo |
| Buscar um item | `find` | Item ou `undefined` |
| Verificar condição | `some` / `every` | `boolean` |
| Achatar arrays aninhados | `flat` / `flatMap` | Novo array |

## Quando aplicar

- Sempre que um `for` loop manipula arrays — substitua pelo método declarativo correto
- Ao encadear operações: `filter` → `map` é mais legível que um `for` com `if` e `push`
- Ao receber dados de APIs e precisar transformar antes de renderizar

## Limitações

- Esta skill é uma visão geral — cada método tem nuances próprias cobertas em skills dedicadas
- `forEach` não suporta `break`/`continue` — use `for...of` quando precisar interromper
- Encadear muitos métodos em arrays grandes pode impactar performance — considere `reduce` único

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre quando usar cada método
- [code-examples.md](references/code-examples.md) — Exemplos comparativos: loop imperativo vs método declarativo

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-boas-vindas-aos-metodos-de-array/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-boas-vindas-aos-metodos-de-array/references/code-examples.md)
