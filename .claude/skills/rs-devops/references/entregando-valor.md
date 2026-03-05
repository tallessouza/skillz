---
name: rs-devops-entregando-valor
description: "Applies continuous value delivery principles when designing CI/CD pipelines or deployment strategies. Use when user asks to 'setup CI/CD', 'create a pipeline', 'automate deployment', 'improve delivery process', or discusses DevOps culture and deployment workflows. Enforces continuous delivery mindset: short feedback cycles, team ownership of deploys, automated flows over manual handoffs. Make sure to use this skill whenever designing deployment architecture or evaluating delivery processes. Not for writing application code, container configuration, or infrastructure-as-code specifics."
---

# Entrega Contínua de Valor

> Toda decisao de pipeline e deploy deve otimizar para ciclos curtos de feedback, ownership do time de desenvolvimento e automacao completa do fluxo.

## Key concept

CI/CD nao e apenas automacao de deploy — e a transicao de "entrega de valor" para "entrega **continua** de valor". A diferenca fundamental: no modelo tradicional, valor passa por multiplos times (dev → infra) com uma "parede da confusao" no meio. No modelo continuo, quem desenvolveu coordena a publicacao.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Deploy manual com SSH/SCP ao servidor | Automatizar com pipeline CI/CD |
| Time de infra separado fazendo deploy | Dar ownership ao time de dev, infra fornece ferramentas |
| Ciclo de feedback longo (dias/semanas) | Reduzir para horas — task pronta hoje vai pra producao hoje |
| "Na minha maquina funciona" | Pipeline automatizada garante ambiente consistente |
| Monolito com deploy complexo | Pipeline padronizada; para microservicos e ainda mais critico |
| Erro descoberto tardiamente | Deploys menores e mais frequentes = deteccao rapida |

## How to think about it

### Entrega de valor vs entrega continua de valor

No modelo antigo: dev desenvolve → "terminamos nossa parte" → infra tenta implantar → nao funciona → volta pro dev → volta pra infra. Valor e entregue eventualmente, mas com fricao enorme.

No modelo CI/CD: dev desenvolve → pipeline integra (CI) → pipeline entrega (CD) → feedback imediato. O mesmo time que criou a feature coordena a publicacao.

### Por que "continuo" implica automacao

Se o objetivo e entregar valor de forma continua, processos manuais nao escalam. Um time de infra fazendo deploy manual de N aplicacoes gera: binarios errados, aplicacoes quebradas, demora. A palavra "continuo" exige automacao.

### Ownership gera visibilidade

Quando o time de dev e responsavel pela publicacao, ele sabe exatamente o que esta em producao, o que subiu ontem, o que subiu hoje. Isso permite rollback rapido e decisoes informadas.

## Principios para design de pipelines

1. **Ciclos curtos de feedback** — task concluida hoje deve ir pra producao hoje (apos staging/testes)
2. **Ownership do deploy no time de dev** — infra fornece ferramentas e plataforma, dev executa
3. **Automacao completa** — nenhum passo manual entre commit e producao
4. **Visibilidade** — todo o time sabe o estado de cada deploy
5. **Rollback orquestrado** — voltar versao deve ser tao facil quanto fazer deploy
6. **CI integra, CD entrega** — CI valida e integra codigo, CD disponibiliza o que foi integrado

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| CI/CD e so automacao de deploy | E uma mudanca cultural: ownership, feedback rapido, entrega continua |
| Time de infra deve fazer deploy | Time de dev coordena; infra potencializa com ferramentas |
| Deploy manual funciona pra poucos servicos | Nao escala nem pra monolitos; pra microservicos e impossivel |
| Entregar rapido significa entregar sem testar | O fluxo de staging/testes faz parte da pipeline, mas e rapido |
| CI e CD sao a mesma coisa | CI = integrar codigo; CD = entregar/disponibilizar o integrado |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Deploy manual via SSH | Pipeline automatizada com trigger no commit |
| Separar completamente dev e infra | Dev faz deploy, infra fornece plataforma |
| Ciclos longos de acumulo de features | Deploys pequenos e frequentes |
| Descobrir erro semanas depois | Feedback continuo com ciclos curtos |
| Um time desenvolve, outro publica sem contexto | Quem desenvolveu coordena a publicacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-entregando-valor/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-entregando-valor/references/code-examples.md)
