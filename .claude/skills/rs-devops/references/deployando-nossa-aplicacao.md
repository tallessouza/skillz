---
name: rs-devops-deployando-nossa-aplicacao
description: "Applies AWS AppRunner deployment via GitHub Actions with dynamic image references. Use when user asks to 'deploy to AppRunner', 'configure AppRunner in CI/CD', 'setup GitHub Actions deploy step', or 'reference ECR image in deploy'. Enforces dynamic tag via outputs, secrets for ARNs, correct CPU/memory ratios, and handling of in-progress operations. Make sure to use this skill whenever configuring AppRunner deployments in GitHub Actions workflows. Not for ECS/EKS deployments or manual AppRunner console setup."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: ci-cd-github-actions
  tags: [aws, apprunner, github-actions, ci-cd, ecr, deploy, docker]
---

# Deploy com AWS AppRunner via CI/CD

> Configure o step de deploy no GitHub Actions usando a action `aws-labs/amazon-apprunner-deploy` com referencia dinamica de imagem via outputs de steps anteriores.

## Rules

1. **Use a action oficial aws-labs/amazon-apprunner-deploy**
2. **Referencie imagens via outputs de steps, nunca hardcode a tag**
3. **Defina CPU e memoria em valores aceitos pelo AppRunner** — 1 vCPU exige minimo 2 GB RAM
4. **Armazene ARNs de roles como secrets**
5. **Trate operacoes em progresso** — AppRunner rejeita deploy se outro esta rodando

## How to write

```yaml
- name: Generate Tag
  id: generate-tag
  run: echo "tag=$(echo $GITHUB_SHA | head -c 7)" >> $GITHUB_OUTPUT

- name: Build Docker Image
  id: build-docker-img
  run: |
    IMG=${{ steps.login-ecr.outputs.registry }}/my-app:${{ steps.generate-tag.outputs.tag }}
    docker build -t $IMG .
    docker push $IMG
    echo "img=$IMG" >> $GITHUB_OUTPUT

- name: deploy-to-apprunner
  uses: aws-labs/amazon-apprunner-deploy@main
  with:
    service: my-app
    access-role-arn: ${{ secrets.APPRUNNER_ROLE_ARN }}
    region: us-east-1
    cpu: 1
    memory: 2
    port: 3000
    image: ${{ steps.build-docker-img.outputs.img }}
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `image: repo/app:latest` | `image: ${{ steps.build-docker-img.outputs.img }}` |
| ARN hardcoded | `${{ secrets.APPRUNNER_ROLE_ARN }}` |
| `memory: 1` com `cpu: 1` | `memory: 2` com `cpu: 1` (minimo aceito) |

## Troubleshooting

### Deploy falha com "operation in progress"
**Symptom:** GitHub Actions step falha com erro de operacao em progresso no AppRunner
**Cause:** Outro deploy ainda esta rodando no mesmo servico AppRunner
**Fix:** Aguardar o deploy anterior finalizar ou adicionar retry com backoff no workflow

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
