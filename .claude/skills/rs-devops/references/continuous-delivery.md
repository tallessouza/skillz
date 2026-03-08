---
name: rs-devops-continuous-delivery
description: "Applies Continuous Delivery and Continuous Deployment practices when designing CI/CD pipelines, configuring deployment workflows, or setting up staging/production environments. Use when user asks to 'create a pipeline', 'deploy to production', 'setup CD', 'configure deployment', 'rollback strategy', or 'canary deployment'. Ensures CD always extends CI, environments are mirrored, and gradual release strategies are considered. Make sure to use this skill whenever designing deployment automation or discussing release strategies. Not for application code, unit testing, or CI-only configurations."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: ci-cd-pipelines
  tags: [continuous-delivery, continuous-deployment, ci-cd, canary, rollback, staging, pipeline]
---

# Continuous Delivery / Continuous Deployment

> CD e a pratica de automatizar a entrega do software integrado para ambientes de homologacao e producao, sempre como extensao da CI.

## Rules

1. **CD nunca existe sem CI** — CD e a continuacao da CI, porque sem integracao validada nao ha o que entregar
2. **Ambientes devem ser espelhados em ferramentas** — se producao usa Kubernetes, homologacao tambem deve usar Kubernetes, porque testes em ambientes diferentes geram falsos positivos
3. **Espelhamento e de ferramentas, nao de performance** — homologacao nao precisa da mesma escala, mas precisa das mesmas tecnologias
4. **Homologacao antes de producao** — pipeline envia para staging primeiro, valida, depois promove para producao, porque problemas devem ser detectados antes do usuario final
5. **Rollback deve ser automatizado** — pipelines devem permitir voltar versao pelo proprio software de CI/CD, porque rollback manual e lento e propenso a erro
6. **Liberacao gradual quando ha risco** — use Canary Deployment para liberar para percentual do trafego antes de 100%, porque reduz blast radius de problemas

## How to configure

### Pipeline CD basica (apos CI)

```yaml
# Fluxo: CI completa -> CD inicia
stages:
  - build        # CI
  - test         # CI
  - deploy-staging    # CD
  - approve           # CD (manual gate opcional)
  - deploy-production # CD

deploy-staging:
  stage: deploy-staging
  script:
    - deploy --environment staging
  only:
    - main

deploy-production:
  stage: deploy-production
  script:
    - deploy --environment production
  when: manual  # ou automatico apos smoke test
```

### Canary Deployment

```yaml
# Liberar para percentual do trafego
deploy-canary:
  script:
    - deploy --environment production --traffic 10
    - run-smoke-tests
    - deploy --environment production --traffic 100
```

### Smoke test com rollback automatico

```yaml
post-deploy:
  script:
    - run-smoke-tests || rollback --to-previous-version
```

### Infraestrutura como CD (Terraform)

```bash
# CI = terraform plan (validacao)
terraform init && terraform plan -out=tfplan

# CD = terraform apply (entrega de valor)
terraform apply tfplan
```

## Example

**Before (deploy manual sem CD):**
```
1. Dev faz build local
2. Envia binario para infra por email/slack
3. Infra faz SSH no servidor e copia arquivo
4. Reza para funcionar
5. Se quebrar, panico para achar versao anterior
```

**After (com CD automatizado):**
```
1. Push no main -> CI valida (build, test, lint)
2. CI passa -> CD deploya em staging automaticamente
3. Testes em staging (manual ou smoke test)
4. Aprovacao (automatica ou manual) -> deploy em producao
5. Se quebrar -> rollback via pipeline com visibilidade para equipe
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Feature nova com risco | Canary deployment (10% -> 50% -> 100%) |
| Hotfix critico | CD direto para producao (com CI passando) |
| Primeiro deploy do projeto | Configure staging primeiro, valide, depois producao |
| Infraestrutura (Terraform/Pulumi) | CI = plan, CD = apply |
| Equipe requer aprovacao | Gate manual entre staging e producao |
| Deploy quebrou producao | Rollback automatizado via pipeline, nao manual |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| CD sem CI | Sempre tenha CI completa antes da CD |
| Deploy direto em producao sem staging | Staging primeiro, producao depois |
| Kubernetes em prod, Docker Compose em staging | Mesma ferramenta nos dois ambientes |
| Rollback manual via SSH | Rollback via pipeline com visibilidade |
| Deploy 100% imediato de feature arriscada | Canary deployment gradual |
| Pipeline sem smoke test pos-deploy | Smoke test que triga rollback automatico |

## Troubleshooting

### Deploy em producao quebrou e rollback manual e lento
**Symptom:** Deploy com bug em producao e equipe precisa fazer SSH para reverter manualmente
**Cause:** Pipeline sem mecanismo de rollback automatizado
**Fix:** Adicione smoke test pos-deploy com rollback automatico: `run-smoke-tests || rollback --to-previous-version`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
