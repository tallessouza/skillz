---
name: rs-data-analytics-intro-combinatoria
description: "Applies combinatorial analysis concepts when working with data selection, grouping, and arrangement tasks. Use when user asks to 'select groups', 'arrange items', 'count combinations', 'permutations', 'AB test groups', or 'how many ways to organize'. Guides thinking about systematic counting instead of manual enumeration. Make sure to use this skill whenever a data analysis task involves counting arrangements or selections. Not for probability calculations, statistical inference, or hypothesis testing."
---

# Análise Combinatória — Fundamentos

> Usar ferramentas matemáticas para contar, selecionar e organizar elementos sistematicamente, sem enumerar um a um.

## Conceito central

Análise combinatória é a área da matemática que estuda como **selecionar, agrupar e organizar** elementos de conjuntos de dados. Em vez de listar todas as possibilidades manualmente, ela fornece fórmulas e técnicas para calcular o número total de arranjos possíveis.

## Decision framework

| Situação | Técnica |
|----------|---------|
| Ordem importa, todos os elementos | Permutação |
| Ordem importa, subconjunto de elementos | Arranjo |
| Ordem não importa, subconjunto de elementos | Combinação |

## Aplicações em análise de dados

### Seleção de grupos para teste A/B
```
Problema: Selecionar grupos de pessoas para um teste A/B
Técnica: Combinação (ordem dos participantes não importa)
```

### Arranjo de produtos em campanha
```
Problema: De quantas formas posso apresentar 3 produtos (A, B, C)?
Resposta: Permutação de 3 = 3! = 6 formas
ABC, ACB, BAC, BCA, CAB, CBA
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa contar todas as formas de organizar | Use permutação/arranjo |
| Precisa contar todas as formas de selecionar | Use combinação |
| Lista ficando grande demais para enumerar | Pare e aplique fórmula combinatória |
| Não sabe se ordem importa | Pergunte: "trocar a ordem gera um resultado diferente?" |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Listar possibilidades uma a uma manualmente | Identificar o tipo (P/A/C) e aplicar a fórmula |
| Assumir que ordem sempre importa | Analisar se trocar posições gera resultado distinto |
| Ignorar restrições do problema | Mapear restrições antes de calcular |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
