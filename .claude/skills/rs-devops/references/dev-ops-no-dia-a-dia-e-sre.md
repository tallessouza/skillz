---
name: rs-devops-dev-ops-no-dia-a-dia-e-sre
description: "Analyzes DevOps culture vs SRE role distinction and organizational pillars. Use when user asks to 'understand DevOps vs SRE', 'implement DevOps culture', 'define SRE responsibilities', or 'structure team integration'. Enforces understanding that DevOps is culture not a role, SRE is the technical implementation, and continuous documentation/feedback loops. Make sure to use this skill whenever evaluating team structure or distinguishing DevOps culture from SRE roles. Not for specific tooling setup or CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: cultura-devops
  tags: [devops, sre, culture, site-reliability, feedback-loop, documentation, integration]
---

# DevOps no Dia a Dia e SRE

> DevOps e cultura de integracao entre times; SRE e a implementacao tecnica dessa cultura.

## Key concepts

DevOps nao e um cargo — e uma cultura que busca integrar equipes para entregar com agilidade, errar rapido e corrigir rapido. SRE (Site Reliability Engineering) e o cargo tecnico que implementa essa cultura atraves de automatizacao, observabilidade e confiabilidade.

## Diagnostic checklist

```bash
# Avaliar maturidade DevOps do time
echo "1. Times compartilham responsabilidade de deploy? (DevOps culture)"
echo "2. Existe rotacao de plantao com SRE? (SRE practice)"
echo "3. Documentacao e atualizada continuamente? (Feedback loop)"
echo "4. CI/CD pipeline existe e e confiavel? (Automation)"
echo "5. Postmortems sao feitos sem culpa? (Blameless culture)"
```

## Pilares de uma empresa com DevOps

1. **Integracao entre times** — exige integracao entre dev, ops, QA e produto
2. **Documentacao continua** — descentralize conhecimento, documentacao e organismo vivo
3. **Feedback e aprendizado continuo** — loops de feedback rapidos
4. **Testabilidade e agilidade** — errar rapido para corrigir rapido

## DevOps vs SRE

| DevOps | SRE |
|--------|-----|
| Cultura organizacional | Cargo tecnico |
| Principios e valores | Implementacao pratica |
| Integracao, feedback, agilidade | Automatizacao, confiabilidade, observabilidade |
| Nao deveria ser um cargo | E de fato um cargo |

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| DevOps e um cargo | DevOps e cultura; SRE e o cargo tecnico |
| Basta ter CI/CD para ter DevOps | Ferramentas sem cultura nao resolvem silos |
| Erros em producao sao inaceitaveis | Objetivo e errar rapido e corrigir rapido |
| Documentacao e tarefa pontual | E organismo vivo |

## Leitura recomendada

"Engenharia de Confiabilidade de Sites" (Site Reliability Engineering) — escrito por engenheiros do Google.

## Troubleshooting

### Time confunde DevOps com cargo de infraestrutura
**Symptom:** Empresa contrata "DevOps Engineer" esperando que uma pessoa resolva todos os problemas de integração
**Cause:** Confusão entre DevOps (cultura) e SRE (cargo técnico)
**Fix:** DevOps é cultura organizacional que exige integração entre times; o cargo técnico que implementa é SRE

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
