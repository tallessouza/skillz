---
name: rs-data-analytics-contextualizacao
description: "Applies combinatorial analysis decision framework when working with data analytics scenarios. Use when user asks to 'select samples', 'group variables', 'plan campaigns', 'combine data', or 'analyze combinations'. Guides choosing between arrangement, permutation, combination, and fundamental counting principle based on whether order matters and repetition is allowed. Make sure to use this skill whenever a data analysis task involves selecting, grouping, or crossing data elements. Not for pure statistics, machine learning, or visualization tasks."
---

# Análise Combinatória no Dia a Dia do Analista de Dados

> Antes de calcular, identifique: a ordem importa? Pode repetir? A resposta determina a técnica.

## Rules

1. **Identifique primeiro se a ordem importa** — porque escolher a técnica errada (arranjo vs combinação) gera resultados completamente diferentes
2. **Identifique se há repetição** — elementos repetidos invalidam a amostra e distorcem análises
3. **Use Combinação quando a ordem NÃO importa** — seleção de amostras, agrupamento de variáveis, porque só interessa QUAIS elementos, não a sequência
4. **Use Arranjo quando a ordem importa** — rankings, prioridades, sequências, porque a posição de cada elemento altera o resultado
5. **Use Princípio Fundamental da Contagem (multiplicativo) quando combinar categorias independentes com "E"** — campanhas × canais × mensagens, porque cada dimensão multiplica as possibilidades
6. **Nunca trabalhe com achismo** — sempre aplique a técnica combinatória correta para fundamentar decisões com dados

## Framework de Decisão

```
Preciso selecionar/agrupar elementos?
├── A ordem importa?
│   ├── SIM → Arranjo (A(n,k))
│   └── NÃO → Combinação (C(n,k))
│       └── Pode repetir?
│           ├── NÃO → Combinação simples
│           └── SIM → Combinação com repetição
│
Preciso combinar categorias independentes?
├── Uso "E" entre as categorias? → Princípio Multiplicativo (×)
└── Uso "OU" entre as categorias? → Princípio Aditivo (+)
```

## Cenários Práticos

### Seleção de Amostras (Combinação)
```
Cenário: 10.000 clientes no banco → selecionar 100 para amostra
Ordem importa? NÃO (não importa quem é 1º ou 2º)
Repetição? NÃO (mesma pessoa não pode aparecer 2x)
Técnica: C(10000, 100) — Combinação
```

### Cruzamento de Variáveis (Combinação)
```
Cenário: 5 variáveis (idade, religião, renda, profissão, ...) → cruzar 3
Ordem importa? NÃO (cruzar idade×renda = cruzar renda×idade)
Técnica: C(5, 3) — Combinação
```

### Planejamento de Campanhas (Princípio Multiplicativo)
```
Cenário: 3 campanhas E 4 canais E 2 mensagens
Relação entre categorias: "E" (uso todas juntas)
Técnica: 3 × 4 × 2 = 24 combinações possíveis
```

## Heuristics

| Situação | Técnica |
|----------|---------|
| Selecionar amostra de um banco de dados | Combinação |
| Agrupar variáveis para cruzamento/dashboard | Combinação |
| Montar cenários com múltiplas dimensões independentes (canal E campanha E mensagem) | Princípio Multiplicativo |
| Definir ranking ou sequência de prioridade | Arranjo |
| Calcular formas de ordenar todos os elementos | Permutação |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Escolher técnica sem perguntar "a ordem importa?" | Sempre comece pela pergunta sobre ordem |
| Usar arranjo para seleção de amostras | Use combinação (ordem não importa em amostras) |
| Somar categorias independentes (3 + 4 + 2 = 9) | Multiplique-as (3 × 4 × 2 = 24) quando a relação é "E" |
| Trabalhar com achismo sobre quantas possibilidades existem | Calcule usando a técnica combinatória adequada |
| Permitir repetição em amostras sem verificar | Sempre valide se elementos podem ou não repetir |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
