---
name: rs-devops-adotando-a-cultura-dev-ops
description: "Applies the CALMS cultural diagnostic framework when evaluating or implementing DevOps practices. Use when user asks to 'assess DevOps maturity', 'diagnose team culture', 'implement DevOps', 'post-mortem process', or 'blameless culture'. Guides cultural diagnosis before tooling decisions. Make sure to use this skill whenever discussing DevOps adoption, incident response culture, or team process failures. Not for CI/CD pipeline configuration, container orchestration, or infrastructure-as-code implementation."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: devops-culture
  tags: [devops]
---

# Diagnostico Cultural DevOps com CALMS

> Antes de adotar ferramentas DevOps, diagnostique a cultura — CALMS mede a capacidade de transformacao da organizacao.

## Key concepts

CALMS e um framework do livro "The DevOps Handbook" que mede e acompanha a implementacao da cultura DevOps. Cada letra representa uma dimensao: Culture, Automation, Lean, Measurement, Sharing. O diagnostico cultural (C) e o primeiro passo obrigatorio antes de qualquer implementacao.

O principio fundamental: DevOps e cultura, nao ferramenta. Se a organizacao busca culpados em vez de resolver como time, nenhuma ferramenta resolve.

## Decision framework

| Quando encontrar | Aplique |
|-----------------|---------|
| Incidente em producao | Pergunte: "buscamos culpado ou resolvemos como time?" |
| Problema recorrente | Identifique furo de processo, nao pessoa responsavel |
| Deploy quebrou aplicacao | Analise: que processo permitiu isso acontecer? |
| Correcao aplicada | Exija post-mortem: o que aconteceu, como mitigar, que acoes tomar |
| Codigo defeituoso em prod | Avalie: mais testes? Testes de contrato? Branch policy? |

## How to think about it

### Culpa vs. Processo

Cenario: alguem fez deploy de madrugada e derrubou a aplicacao. Parece culpa da pessoa. Mas se ela conseguiu fazer o deploy, o problema e de processo — o time permitiu que isso acontecesse. Solucao: branch policy com aprovador obrigatorio, nao punicao individual.

### Post-mortem como habito

Apos corrigir um incidente, duas opcoes:
1. Seguir a vida (anti-pattern) — o incidente vai se repetir
2. Post-mortem estruturado (DevOps) — sala para entender o que aconteceu, por que aconteceu, quais acoes mitigatorias

Sem post-mortem, tempo e investido repetidamente corrigindo o mesmo tipo de falha.

### Diagnostico em 2 perguntas

1. **Como resolvemos problemas?** — Se busca culpado → longe de DevOps. Se resolve como time → sinal positivo.
2. **O que fazemos depois de corrigir?** — Se nada → longe de DevOps. Se post-mortem com acoes → sinal positivo.

## Diagnostic checklist

```
# DevOps Culture Diagnostic — run mentally for your team
1. How do we handle incidents?
   [ ] Blame individual  → FAR from DevOps
   [x] Fix as a team     → Positive signal

2. What happens after fixing?
   [ ] Move on           → FAR from DevOps
   [x] Post-mortem       → Positive signal

3. Are post-mortems blameless?
   [ ] Focus on person   → Anti-pattern
   [x] Focus on process  → DevOps culture
```

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| DevOps = ferramentas (Docker, K8s, CI/CD) | DevOps = cultura; ferramentas sao consequencia |
| Incidente = culpa de quem deployou | Incidente = furo de processo do time |
| Corrigiu o bug = problema resolvido | Sem post-mortem, o problema vai se repetir |
| CALMS e so teoria | CALMS diagnostica problemas concretos e gera acoes |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|-----------|-------------------|
| Buscar pessoa culpada por incidente | Identificar qual processo falhou como time |
| Corrigir e seguir em frente sem analise | Conduzir post-mortem com acoes documentadas |
| Adotar ferramentas DevOps sem diagnostico cultural | Aplicar CALMS primeiro para medir maturidade |
| Aceitar incidentes repetitivos como normal | Tratar recorrencia como furo de processo a mitigar |

## When to apply

- Ao avaliar se uma organizacao pratica DevOps de verdade
- Ao propor adocao de DevOps em empresa que ainda nao tem
- Ao responder incidentes e definir processo pos-incidente
- Ao identificar por que problemas se repetem na equipe

## Limitations

- CALMS diagnostica cultura mas nao prescreve ferramentas especificas
- Esta aula cobre apenas o C (Culture) — as demais dimensoes (A, L, M, S) sao tratadas em aulas seguintes
- Cada organizacao tem contexto unico; as perguntas diagnosticas sao ponto de partida, nao checklist definitivo

## Troubleshooting

### Equipe resiste a adocao de post-mortems
**Symptom:** Time ve post-mortem como perda de tempo ou busca de culpados
**Cause:** A cultura de blame esta enraizada e post-mortems sao confundidos com interrogatorios
**Fix:** Comece com post-mortems blameless focados em processo (o que falhou no fluxo) e nao em pessoas, documentando acoes concretas de melhoria

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-adotando-a-cultura-dev-ops/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-adotando-a-cultura-dev-ops/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
