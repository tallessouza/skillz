---
name: rs-devops-enviando-a-nossa-imagem-pro-repositorio
description: "Enforces correct Docker image push workflow in CI/CD pipelines with login, build, and push steps. Use when user asks to 'push docker image', 'setup container registry in CI', 'configure Docker Hub in GitHub Actions', or 'build and push image in pipeline'. Covers login-action, commit SHA tagging, and secret management for registry credentials. Make sure to use this skill whenever writing CI/CD steps that build and push container images. Not for local Docker builds, Kubernetes deployments, or ECR-specific configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: ci-cd-docker
  tags: [docker, ci-cd, github-actions, docker-hub, container-registry, pipeline]
---

# Enviando Imagem Docker para o Repositorio via CI/CD

> Toda pipeline de container precisa de tres steps sequenciais: login no registry, build com tag correta, e push.

## Rules

1. **Login antes do build** — se login falhar, nao faz sentido buildar
2. **Nome completo no tag** — `username/repo-name:tag`
3. **Secrets para credenciais** — use repository secrets, nao variables
4. **Token, nunca senha** — gere access token no Docker Hub
5. **Tag vinculada ao commit** — use SHA do commit como tag

## How to write

```yaml
steps:
  - name: Login into the container registry
    uses: docker/login-action@v3
    with:
      username: ${{ secrets.DOCKERHUB_USERNAME }}
      password: ${{ secrets.DOCKERHUB_TOKEN }}

  - name: Build Docker image
    run: docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/skillz-ci-api:${{ github.sha }} .

  - name: Push image
    run: docker push ${{ secrets.DOCKERHUB_USERNAME }}/skillz-ci-api:${{ github.sha }}
```

## Anti-patterns

| Nunca faca | Faca assim |
|------------|-----------|
| `password: ${{ secrets.MINHA_SENHA }}` | Token, nao senha |
| Build antes do login | Login como primeiro step |
| Tag sem username: `app:latest` | Tag completa: `user/app:sha` |
| Credenciais em variables | Credenciais em secrets |

## Troubleshooting

### Pipeline falha com "denied: requested access to the resource is denied"
**Symptom:** `docker push` retorna erro de acesso negado no GitHub Actions
**Cause:** Login step falhou silenciosamente ou secrets DOCKERHUB_USERNAME/DOCKERHUB_TOKEN estao vazios ou incorretos
**Fix:** Verifique se os secrets existem em Settings > Secrets and variables > Actions, e que o token do Docker Hub tem permissao de Read/Write

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
