# Code Examples: Priorizacao de Demandas

## Matriz Esforco x Impacto (Visualizacao)

```
                    ALTO IMPACTO
                         |
    QUICK WINS           |        PROJETOS ESTRATEGICOS
    (Prioridade 2)       |        (Prioridade 1)
    - Rapido de fazer    |        - Meta do ano
    - Alto retorno       |        - Alto investimento
    - Demonstra valor    |        - Alto retorno
                         |
  BAIXO ESFORCO ---------+--------- ALTO ESFORCO
                         |
    BAIXA PRIORIDADE     |        TAREFAS COMPLEXAS
    (Prioridade 4)       |        (Prioridade 3)
    - Curiosidades       |        - Complicadas
    - Fogo de palha      |        - Importantes
    - Nao muda ponteiro  |        - Nao estrategicas
                         |
                    BAIXO IMPACTO
```

## Template de Priorizacao (Markdown)

```markdown
# Priorizacao de Demandas — Sprint/Semana X

## Projetos Estrategicos (Prioridade 1)
| Demanda | Stakeholder | MoSCoW | Prazo | Status |
|---------|-------------|--------|-------|--------|
| Modernizacao data lake | CTO | Must have | Q2 | Em andamento |

## Quick Wins (Prioridade 2 — encaixar nos intervalos)
| Demanda | Stakeholder | Esforco estimado | Impacto |
|---------|-------------|-----------------|---------|
| Analise basica de recomendacao | Produto | 2h | Demonstra potencial |

## Tarefas Complexas (Prioridade 3 — se houver tempo)
| Demanda | Stakeholder | Esforco estimado | Justificativa |
|---------|-------------|-----------------|---------------|
| Cruzamento de dados multi-fonte | Marketing | 3 dias | Importante mas nao estrategico |

## Baixa Prioridade (Prioridade 4)
| Demanda | Stakeholder | Validacao | Decisao |
|---------|-------------|-----------|---------|
| "Por que vendas caiu na terca?" | Gerente X | Curiosidade | Postergar |
```

## Checklist de Validacao de Demanda

```markdown
## Antes de executar qualquer demanda, valide:

- [ ] Quem pediu? (stakeholder e nivel hierarquico)
- [ ] Por que pediu? (problema real ou curiosidade?)
- [ ] O que muda se tivermos esse dado? (impacto concreto)
- [ ] Qual o esforco estimado? (horas/dias)
- [ ] E must have, should have, could have ou won't have?
- [ ] Validei com meu lider? (especialmente para demandas corriqueiras)
- [ ] Onde encaixo na matriz esforco x impacto?
```

## Exemplo de Conversa com Lider

```
# Ao receber multiplas demandas, em vez de:
"Lider, recebi 10 demandas. Qual faco primeiro?"

# Faca:
"Lider, recebi 10 demandas e organizei assim:
- Prioridade 1: [projeto estrategico X] porque e meta do trimestre
- Quick wins para encaixar: [demanda Y] e [demanda Z]
- Posterguei: [demanda W] porque parece mais curiosidade
Voce concorda com essa organizacao?"
```