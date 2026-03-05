---
name: rs-devops-focando-no-valor-e-errando-rapido
description: "Applies Lean thinking to software delivery decisions, prioritizing high-value low-complexity work and small iterative releases. Use when user asks to 'plan a feature', 'scope an MVP', 'prioritize backlog', 'slice a story', or 'decide what to build next'. Ensures experimental mindset with fast feedback loops and fail-fast recovery. Make sure to use this skill whenever making scope or prioritization decisions in product or feature development. Not for CI/CD pipeline setup, infrastructure automation, or code implementation details."
---

# Lean no DevOps — Foco no Valor e Errar Rapido

> Entregue o minimo que valida a hipotese, erre rapido, corrija rapido — nunca gaste meses para descobrir que estava errado.

## Rules

1. **Priorize alto valor + baixa complexidade** — porque gastar tempo em entregas de baixo valor e alta complexidade e o pior cenario: consome produtividade sem retorno
2. **Fatie o horizonte em micro-entregas** — porque a ideia "perfeita" e calcada em achismo ate ser validada pelo mercado
3. **Lance o core primeiro, itere o resto** — porque o que esta no centro da ideia e o MVP; o que esta por fora so se desenvolve conforme feedback real
4. **Erre rapido para corrigir rapido** — porque falhar e inevitavel, e quanto menor a entrega, menor o tempo de diagnostico e correcao
5. **Diagnostique antes do cliente** — porque o time deve encontrar o erro, nao o cliente mandando screenshot de tela de erro
6. **Descontinue sem culpa** — porque descobrir que algo nao faz sentido com pouco investimento e uma vitoria, nao uma derrota

## Decision Framework

### Matriz de Priorizacao

| Valor | Complexidade | Acao |
|-------|-------------|------|
| Alto | Baixa | Fazer AGORA — melhor cenario |
| Alto | Alta | Fatiar ate reduzir complexidade |
| Baixo | Baixa | Fazer so se sobrar capacidade |
| Baixo | Alta | NAO fazer — pior cenario |

### Fatiamento de Feature

```
Horizonte (ideia macro)
    │
    ├── MVP (core da ideia) ← Lance isso primeiro
    │     └── Valide com feedback real
    │
    ├── Iteracao 1 (baseada em feedback)
    ├── Iteracao 2 (baseada em feedback)
    └── ... (evolua ou descontinue)
```

## Example

**Before (abordagem tradicional):**
```
Planejamento: 2 semanas
Desenvolvimento: 3 meses
Lancamento: dia D
Resultado: varios erros, timeline estourada, cliente estressado,
           time sem tempo para corrigir
```

**After (com Lean aplicado):**
```
Fatiamento: 1 dia
MVP (core): 2 semanas → lanca → coleta feedback
Iteracao 1: 1 semana → ajusta com base em dados reais
Iteracao 2: 1 semana → evolui ou descontinua
Resultado: erros pequenos, correcao rapida, feedback real guiando decisoes
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Feature com escopo grande e incerto | Fatiar em MVP + iteracoes |
| Stakeholder pede feature complexa | Perguntar: qual o core que valida a hipotese? |
| Time gastando semanas sem entregar | Reduzir tamanho das entregas |
| Erro descoberto pelo cliente | Melhorar observabilidade (smoke tests, alertas) |
| Feature entregue sem uso | Validar hipotese ANTES de investir mais |
| Duvida se feature faz sentido | Lance o minimo e meça — nao teorize |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Desenvolver 3 meses sem feedback | Entregas semanais com validacao |
| Buscar o cenario perfeito antes de lancar | Lancar o core e iterar |
| Gastar tempo em baixo valor + alta complexidade | Priorizar alto valor + baixa complexidade |
| Esperar cliente reportar erro | Monitorar proativamente (smoke tests, alertas) |
| Tratar descontinuacao como fracasso | Tratar como aprendizado barato |
| Planejar todas as iteracoes antecipadamente | Planejar so a proxima com base em feedback |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
