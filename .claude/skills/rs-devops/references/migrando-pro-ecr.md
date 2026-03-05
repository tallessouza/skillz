---
name: rs-devops-migrando-pro-ecr
description: "Applies AWS ECR migration patterns when configuring CI/CD pipelines to push Docker images to Amazon ECR. Use when user asks to 'push to ECR', 'migrate from DockerHub', 'configure ECR in GitHub Actions', 'build and push Docker image to AWS', or 'setup container registry CI'. Enforces output variables over hardcoded URIs, proper registry/repository separation, and OpenID Connect auth. Make sure to use this skill whenever building CI pipelines that target ECR. Not for Kubernetes deployments, ECS task definitions, or Dockerfile authoring."
---

# Migrando Build de Imagens para o ECR

> Ao configurar CI/CD para ECR, use outputs do login como variaveis de ambiente — nunca hardcode URIs de registro na pipeline.

## Rules

1. **Remova resquicios de registros anteriores** — ao migrar de DockerHub para ECR, delete steps de login e build/push do DockerHub e remova secrets desnecessarias, porque codigo morto na pipeline causa confusao e risco de seguranca
2. **Separe registry de repository** — o URI do ECR tem duas partes: `123456789.dkr.ecr.region.amazonaws.com` (registry) e `skillz-ci` (repository), porque confundir os dois quebra o push
3. **Use outputs do step de login como env vars** — nunca cole URIs hardcoded na pipeline, porque o login ja retorna o registry e isso torna a pipeline escalavel entre regioes e contas
4. **Autentique via OpenID Connect** — nao gere access key + secret key como secrets, porque OIDC e o padrao recomendado e elimina rotacao de credenciais
5. **Escope permissoes ao servico** — o login no ECR retorna o endpoint escopado pela regiao e permissoes da role, porque isso garante que o push vai para o registro correto
6. **Separe build e push em comandos distintos** — `docker build -t` seguido de `docker push`, porque facilita debug e permite inserir steps intermediarios como scan

## How to write

### Step de build e push com env vars

```yaml
- name: Build and Push to ECR
  env:
    REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    TAG: ${{ steps.generate-tag.outputs.tag }}
  run: |
    docker build -t $REGISTRY/skillz-ci:$TAG .
    docker push $REGISTRY/skillz-ci:$TAG
```

### Estrutura completa do job ECR

```yaml
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
    aws-region: us-east-2

- name: Login to Amazon ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v2

- name: Build and Push to ECR
  env:
    REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    TAG: ${{ steps.generate-tag.outputs.tag }}
  run: |
    docker build -t $REGISTRY/skillz-ci:$TAG .
    docker push $REGISTRY/skillz-ci:$TAG
```

## Example

**Before (hardcoded, resquicios DockerHub):**
```yaml
- name: Login to DockerHub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

- name: Build and Push
  run: |
    docker build -t danielrodrigues/skillz-ci:latest .
    docker push danielrodrigues/skillz-ci:latest
    docker build -t 123456789.dkr.ecr.us-east-2.amazonaws.com/skillz-ci:abc123 .
    docker push 123456789.dkr.ecr.us-east-2.amazonaws.com/skillz-ci:abc123
```

**After (com outputs e env vars):**
```yaml
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
    aws-region: us-east-2

- name: Login to Amazon ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v2

- name: Build and Push to ECR
  env:
    REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    TAG: ${{ steps.generate-tag.outputs.tag }}
  run: |
    docker build -t $REGISTRY/skillz-ci:$TAG .
    docker push $REGISTRY/skillz-ci:$TAG
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Migrando de DockerHub para ECR | Remova TODOS os steps do DockerHub, delete secrets antigas |
| URI do ECR aparece hardcoded | Substitua por `${{ steps.login-ecr.outputs.registry }}` |
| Precisa da tag do commit | Gere em step anterior com id, passe via env |
| Multiplas regioes AWS | O login retorna o endpoint correto por regiao — confie no output |
| AppRunner como destino | Use ECR privado — AppRunner so aceita ECR |
| Imagem open source | ECR publico tambem funciona, mas privado e o padrao para apps |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `docker build -t 123456.dkr.ecr.us-east-2.amazonaws.com/app:tag .` | `docker build -t $REGISTRY/app:$TAG .` |
| Manter login do DockerHub junto com ECR | Remover steps do DockerHub ao migrar |
| Gerar access key + secret key para CI | Usar OpenID Connect (OIDC) |
| Hardcode da tag no comando docker | Passar tag via env gerada em step anterior |
| Build e push no mesmo comando inline | Separar em dois comandos com pipe `\|` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-migrando-pro-ecr/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-migrando-pro-ecr/references/code-examples.md)
