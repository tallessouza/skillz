---
name: rs-data-analytics-espaco-amostral-e-evento
description: "Applies probability fundamentals including sample space, events, and probability range when analyzing data or solving probability problems. Use when user asks to 'calculate probability', 'find sample space', 'determine events', 'solve probability problem', or works with combinatorics and statistics. Ensures correct representation of probability between 0 and 1, proper identification of sample spaces and event subsets. Make sure to use this skill whenever probability concepts appear in data analysis tasks. Not for advanced statistical modeling, hypothesis testing, or machine learning."
---

# Espaço Amostral e Evento

> Probabilidade é um número entre 0 e 1 que representa a chance de um evento ocorrer dentro de um espaço amostral.

## Rules

1. **Probabilidade varia entre 0 e 1** — 0 = impossível (0%), 1 = certo (100%), porque qualquer valor fora desse intervalo não tem significado probabilístico
2. **Identifique o espaço amostral (S) primeiro** — conjunto de TODOS os resultados possíveis, porque sem ele não há como calcular probabilidade
3. **Evento é subconjunto do espaço amostral** — nunca inclua elementos que não pertencem a S, porque evento ⊆ S sempre
4. **Classifique o tipo de evento** — certo (E = S), impossível (E = ∅), ou complementar (E₁ ∩ E₂ = ∅ e E₁ ∪ E₂ = S), porque a classificação determina o tratamento
5. **Represente probabilidade como fração, decimal ou percentual** — 1/2 = 0.5 = 50%, porque diferentes contextos exigem diferentes representações

## Decision Framework

| Situação | Classificação | Probabilidade |
|----------|--------------|---------------|
| Evento contém todos os elementos de S | Evento certo | P = 1 |
| Evento não contém nenhum elemento de S | Evento impossível | P = 0 |
| Dois eventos cobrem S sem interseção | Eventos complementares | P(E₁) + P(E₂) = 1 |
| Evento é subconjunto próprio de S | Evento comum | 0 < P < 1 |

## Example

**Problema:** Dado de 6 faces. Qual a probabilidade de sair face par?

**Resolução:**
```
Espaço amostral: S = {1, 2, 3, 4, 5, 6}  → n(S) = 6
Evento (face par): E = {2, 4, 6}          → n(E) = 3
P(E) = n(E) / n(S) = 3/6 = 1/2 = 0.5 = 50%
```

**Verificação de complementaridade:**
```
E₁ (par)   = {2, 4, 6}
E₃ (ímpar) = {1, 3, 5}
E₁ ∩ E₃ = ∅        ✓ (sem elementos em comum)
E₁ ∪ E₃ = S        ✓ (juntos cobrem todo S)
→ São eventos complementares
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa calcular probabilidade | Primeiro liste S completo, depois identifique E |
| Resultado parece > 1 ou < 0 | Revise — há erro no espaço amostral ou evento |
| Dois eventos parecem opostos | Verifique as duas condições de complementaridade |
| Evento contém elemento fora de S | Evento impossível para aquele elemento |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Calcular probabilidade sem definir S | Sempre definir S = {...} primeiro |
| Assumir complementaridade sem verificar | Verificar E₁ ∩ E₂ = ∅ E E₁ ∪ E₂ = S |
| Representar probabilidade como 150% | Máximo é 1 (100%) |
| Incluir no evento elementos fora de S | Evento ⊆ Espaço Amostral sempre |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
