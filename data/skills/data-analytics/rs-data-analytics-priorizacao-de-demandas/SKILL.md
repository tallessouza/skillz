---
name: rs-data-analytics-priorizacao-demandas
description: "Applies demand prioritization frameworks when organizing data tasks, backlog items, or feature requests. Use when user asks to 'prioritize tasks', 'organize backlog', 'classify demands', 'what should I work on first', or 'effort vs impact matrix'. Applies effort-impact matrix (quick wins, strategic projects, complex tasks, low priority) and MoSCoW method. Make sure to use this skill whenever triaging multiple competing demands or planning sprints. Not for technical implementation, code review, or architecture decisions."
---

# Priorizacao de Demandas de Dados

> Classifique cada demanda por esforco e impacto antes de decidir a ordem de execucao.

## Key concept

Demandas chegam de multiplos stakeholders simultaneamente. Sem classificacao, voce vai gastar tempo em tarefas corriqueiras enquanto projetos estrategicos ficam parados. A priorizacao e uma habilidade de senioridade — quem sabe priorizar e promovido mais rapido.

## Decision framework

### Matriz Esforco x Impacto

| Classificacao | Esforco | Impacto | Prioridade |
|---------------|---------|---------|------------|
| **Quick wins** | Baixo | Alto | 2a (encaixar nos intervalos) |
| **Projetos estrategicos** | Alto | Alto | 1a (prioridade maxima) |
| **Tarefas complexas** | Alto | Baixo | 3a (se houver tempo) |
| **Baixa prioridade** | Baixo | Baixo | 4a (por ultimo) |

### MoSCoW

| Categoria | Significado | Criterio |
|-----------|-------------|----------|
| **Must have** | Obrigatorio | Sem isso, a empresa perde receita |
| **Should have** | Importante | A empresa sofre sem, mas sobrevive |
| **Could have** | Desejavel | Agrega valor, mas a vida continua sem |
| **Won't have** | Descartavel por hora | Curiosidade, hipotese distante |

## How to think about it

### Ordem de execucao

1. Projetos estrategicos primeiro (alto esforco, alto impacto — geralmente definidos no inicio do ano)
2. Quick wins nos intervalos (resultados rapidos que demonstram potencial)
3. Tarefas complexas se houver tempo
4. Baixa prioridade por ultimo

### Demandas corriqueiras sao as mais perigosas

Chegam disfarçadas de demandas de alto impacto. Alguem apresenta como urgente, mas na verdade e curiosidade. A pessoa vai mencionar numa reuniao, dizer "beleza" e esquecer. Antes de executar, valide com seu lider se realmente impacta o negocio ou se e fogo de palha.

### Quick wins nos primeiros 90 dias

Ao entrar numa empresa, priorize quick wins — resultados rapidos que demonstram alto potencial. Nao e um super projeto, e algo para acrescentar valor de forma rapida, mesmo que efemera.

### Demandas "louconas" podem ser estrategicas

Nem so de demandas obvias se faz inovacao. As vezes o lider prioriza algo aparentemente sem sentido porque e uma aposta de longo prazo para diferenciar dos competidores. Voce ve uma parte do negocio; o diretor ve mais; o C-level ve o todo. Antes de julgar, pergunte: "Isso e uma aposta estrategica da empresa?"

## Heuristics

| Situacao | Acao |
|----------|------|
| 10 demandas chegaram ao mesmo tempo | Classifique na matriz esforco x impacto antes de comecar qualquer uma |
| Stakeholder diz que e urgente | Valide: e must have (sem isso perde receita) ou curiosidade? |
| Primeiros 90 dias na empresa | Priorize quick wins para demonstrar valor |
| Demanda parece nao fazer sentido | Pergunte ao lider se e aposta estrategica |
| Projeto estrategico em andamento | Encaixe quick wins nos intervalos, nao interrompa |
| Duvida entre complexa e estrategica | Se nao foi acordada como meta do ano, provavelmente e complexa |

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Toda demanda urgente e importante | Muitas sao curiosidade disfarçada de urgencia |
| Junior nao precisa priorizar | Quem prioriza cedo e promovido mais rapido |
| So projetos estrategicos importam | Quick wins sao essenciais para demonstrar valor e manter momentum |
| Demandas "sem sentido" devem ser ignoradas | Podem ser apostas estrategicas de longo prazo |

## Anti-patterns

| Nao faca | Faca em vez disso |
|----------|-------------------|
| Executar na ordem que chegou | Classificar por esforco x impacto primeiro |
| Perguntar ao lider a prioridade de cada demanda | Propor a priorizacao e validar com o lider |
| Ignorar demandas de baixa prioridade | Registrar e encaixar quando houver tempo |
| Julgar demanda "sem sentido" sem contexto | Perguntar se e aposta estrategica da empresa |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
