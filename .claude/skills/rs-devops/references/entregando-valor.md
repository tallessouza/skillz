---
name: rs-devops-entregando-valor
description: "Applies continuous delivery principles when designing CI/CD pipelines or planning deployment strategies. Use when user asks to 'setup CI/CD', 'automate deployment', 'improve delivery speed', 'implement continuous delivery', or 'plan release strategy'. Enforces ownership transfer to dev teams, short feedback cycles, and full automation from commit to production. Make sure to use this skill whenever making decisions about deployment workflows or delivery culture. Not for CI/CD tool configuration, Dockerfile creation, or infrastructure provisioning."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: ci-cd-cultura
  tags: [ci-cd, continuous-delivery, devops-culture, deployment, automation, feedback-loops]
---

# Entrega Continua de Valor

> Toda decisao de pipeline e deploy deve otimizar para ciclos curtos de feedback, ownership do time de desenvolvimento e automacao completa do fluxo.

## Key concepts

CI/CD nao e apenas automacao de deploy — e a transicao de "entrega de valor" para "entrega continua de valor". No modelo continuo, quem desenvolveu coordena a publicacao.

## Principios

1. **Ciclos curtos de feedback** — task concluida hoje deve ir pra producao hoje
2. **Ownership do deploy no time de dev** — infra fornece ferramentas e plataforma
3. **Automacao completa** — nenhum passo manual entre commit e producao
4. **Visibilidade** — todo o time sabe o estado de cada deploy
5. **Rollback orquestrado** — tao facil quanto fazer deploy
6. **CI integra, CD entrega** — CI valida, CD disponibiliza

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| CI/CD e so automacao de deploy | E mudanca cultural |
| Time de infra deve fazer deploy | Time de dev coordena; infra potencializa |
| Deploy manual funciona | Nao escala nem pra monolitos |
| CI e CD sao a mesma coisa | CI = integrar codigo; CD = entregar |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Deploy manual via SSH | Pipeline automatizada |
| Separar completamente dev e infra | Dev faz deploy, infra fornece plataforma |
| Ciclos longos de acumulo de features | Deploys pequenos e frequentes |
| Quem desenvolve nao coordena publicacao | Ownership ao time de dev |

## Diagnostic

```bash
# Verificar se pipeline tem deploy automatizado
grep -r "deploy\|apply\|push" .github/workflows/ | grep -v "#"

# Checklist de entrega continua
# [ ] Pipeline automatizada (commit -> producao)
# [ ] Time de dev coordena deploy
# [ ] Rollback automatico configurado
# [ ] Feedback loop < 24h
```

## Troubleshooting

### Time de dev resiste a assumir ownership do deploy
**Symptom:** Desenvolvedores dizem que deploy e responsabilidade de infra e se recusam a operar pipelines
**Cause:** Cultura organizacional ainda separa dev e ops em silos — falta de ferramentas self-service
**Fix:** Forneca plataforma self-service (pipeline pronta, rollback automatico) para que devs precisem apenas de um merge para deployar

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
