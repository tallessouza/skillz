---
name: rs-devops-iniciando-configuracao
description: "Guides CI/CD pipeline migration from Docker Hub to AWS ECR with secure OIDC authentication. Use when user asks to 'configure ECR login', 'migrate from Docker Hub to ECR', 'setup AWS credentials in GitHub Actions', 'configure CI/CD for AppRunner', or 'setup OIDC for AWS'. Applies secure credential patterns using IAM roles instead of access tokens. Make sure to use this skill whenever configuring GitHub Actions pipelines that push images to AWS ECR. Not for Docker Hub setup, Kubernetes deployments, or ECS task definitions."
---

# Pipeline CI/CD: Docker Hub → AWS ECR

> Ao migrar pipeline de Docker Hub para ECR, configure credenciais AWS via OpenID Connect (OIDC) com roles escopadas, nunca via access tokens.

## Rules

1. **Nunca trafegue tokens AWS como secrets** — use OpenID Connect (OIDC) com Identity Provider do GitHub na AWS, porque elimina rotacao de credenciais e reduz superficie de ataque
2. **Separe credencial de login** — `configure-aws-credentials` configura a conexao AWS, `amazon-ecr-login` faz login no servico ECR, porque sao responsabilidades distintas
3. **Escope roles por servico** — a IAM role deve dar acesso apenas ao ECR (e AppRunner se necessario), nunca acesso amplo a conta, porque principio do menor privilegio
4. **Crie infraestrutura via Terraform** — Identity Provider, IAM roles e ECR devem ser provisionados como IaC, nunca via console manual, porque reprodutibilidade
5. **Use IDs em steps que exportam dados** — steps como ECR login precisam de `id` para que steps posteriores acessem outputs (ex: registry URL), porque GitHub Actions exige referencia explicita

## Steps

### Step 1: Remover login do Docker Hub

Comente ou remova os steps `docker/login-action` e `docker/build-push-action` da pipeline, porque sao especificos do Docker Hub.

### Step 2: Configurar AWS Credentials

```yaml
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
    aws-region: us-east-2
```

### Step 3: Login no ECR

```yaml
- name: Login to Amazon ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v2
```

### Step 4: Build e Push (apos criar recursos)

```yaml
- name: Build and Push Docker Image
  env:
    REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    REPOSITORY: nome-do-repo
    IMAGE_TAG: ${{ steps.generate-tag.outputs.tag }}
  run: |
    docker build -t $REGISTRY/$REPOSITORY:$IMAGE_TAG .
    docker push $REGISTRY/$REPOSITORY:$IMAGE_TAG
```

### Step 5: Criar recursos AWS com Terraform

Recursos necessarios:
- **IAM Identity Provider** — conecta GitHub OIDC com AWS
- **IAM Role** — escopada para ECR (e AppRunner)
- **ECR Repository** — registro privado para imagens

## Heuristics

| Situacao | Faca |
|----------|------|
| AppRunner como runtime | Obrigatorio usar ECR (Docker Hub nao suportado) |
| Precisa de login AWS na pipeline | `configure-aws-credentials` + action de login do servico |
| Regiao da AWS | Configurar na action E criar recursos na mesma regiao |
| Multiplos servicos AWS na pipeline | Uma role com policies escopadas para cada servico |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Gerar access key e colocar como secret | Usar OIDC com Identity Provider |
| Role com `AdministratorAccess` | Role escopada por servico (ECR, AppRunner) |
| Criar ECR pelo console | Terraform com IaC |
| Usar `docker/login-action` para ECR | Usar `aws-actions/amazon-ecr-login` |
| Configurar regiao diferente entre action e recursos | Mesma regiao em todos os pontos |

## Error handling

- Se login ECR falha: verificar se a IAM role tem policy `AmazonEC2ContainerRegistryPowerUser` ou equivalente
- Se `configure-aws-credentials` falha: verificar se Identity Provider do GitHub esta criado na AWS e a role confia no repositorio correto
- Se push falha: verificar se o ECR repository existe na mesma regiao configurada

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
