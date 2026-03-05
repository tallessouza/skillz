---
name: rs-devops-escolhendo-servico-aplicacao
description: "Guides AWS service selection for running containerized applications, choosing between ECS, Fargate, EC2, and AppRunner. Use when user asks to 'deploy container on AWS', 'choose AWS service for app', 'run docker on AWS', 'setup AppRunner', or 'migrate from Docker Hub to ECR'. Covers CI/CD pipeline transition from Docker Hub to ECR and AppRunner setup with Terraform. Make sure to use this skill whenever deploying containerized Node.js apps to AWS. Not for Kubernetes deployments, local Docker setup, or non-AWS cloud providers."
---

# Escolhendo Servico AWS para Aplicacao Containerizada

> Ao deployer uma aplicacao containerizada na AWS, escolha o servico mais simples que atende ao requisito e use ECR privado como container registry.

## Rules

1. **Nunca use Docker Hub para producao na AWS** — use ECR privado, porque AppRunner so suporta ECR/ECR Public e imagens de producao devem ser privadas
2. **Nunca rode latest em producao** — associe a tag da imagem ao hash do commit, porque latest nao e rastreavel e causa deploys imprevisiveis
3. **Escolha o servico pelo nivel de complexidade necessario** — AppRunner para simples, ECS Fargate para medio, ECS EC2 para controle total, porque over-engineering gera custo e complexidade desnecessarios
4. **Crie recursos AWS via Terraform, nunca pelo console** — porque IaC e auditavel, versionavel e reproduzivel
5. **Use ECR privado, nunca publico** — porque codigo de producao e closed source por padrao
6. **Configure IAM roles via Terraform** — porque permissoes manuais sao impossiveis de auditar

## Decision Framework

| Necessidade | Servico AWS | Complexidade |
|-------------|-------------|--------------|
| Rodar container simples, sem orquestracao | **AppRunner** | Baixa |
| Orquestracao basica com scaling | **ECS + Fargate** (serverless) | Media |
| Controle total de infraestrutura | **ECS + EC2** | Alta |
| Orquestracao avancada, multi-servico | **EKS (Kubernetes)** | Muito alta |
| Apenas rodar container em VM | **EC2 direto** | Media (config manual) |

## Pipeline: Docker Hub para ECR

### Antes (CI com Docker Hub)
```yaml
# GitHub Actions - push para Docker Hub
- name: Login Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}

- name: Build and Push
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: user/app:${{ env.SHORT_SHA }}, user/app:latest
```

### Depois (CI com ECR)
```yaml
# GitHub Actions - push para ECR privado
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-2

- name: Login ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v2

- name: Build and Push
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: |
      ${{ steps.login-ecr.outputs.registry }}/app:${{ env.SHORT_SHA }}
      ${{ steps.login-ecr.outputs.registry }}/app:latest
```

## Infraestrutura necessaria (Terraform)

```hcl
# 1. ECR Repository (container registry privado)
resource "aws_ecr_repository" "app" {
  name                 = "app-name"
  image_tag_mutability = "MUTABLE"
}

# 2. IAM Role para AppRunner acessar ECR
resource "aws_iam_role" "apprunner_ecr_access" {
  name = "apprunner-ecr-access"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "build.apprunner.amazonaws.com" }
    }]
  })
}

# 3. AppRunner Service
resource "aws_apprunner_service" "app" {
  service_name = "app-name"
  source_configuration {
    image_repository {
      image_identifier      = "${aws_ecr_repository.app.repository_url}:latest"
      image_repository_type = "ECR"
    }
    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner_ecr_access.arn
    }
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App simples, quer ver CD funcionando | AppRunner |
| Precisa de auto-scaling sofisticado | ECS Fargate |
| Precisa de GPU ou instancia especifica | ECS EC2 |
| Vai ter multiplos microservicos | EKS (Kubernetes) |
| Ambiente didatico / prova de conceito | AppRunner + free tier |
| Imagem no Docker Hub, quer usar AppRunner | Migre para ECR privado |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar ECR pelo console AWS | Criar via Terraform |
| Usar Docker Hub com AppRunner | Usar ECR privado |
| Deploy com tag `latest` | Deploy com tag do commit hash |
| Deixar imagem publica em producao | ECR privado sempre |
| Criar IAM roles manualmente | Terraform com least privilege |
| Instalar Node no servidor para deploy | Usar container com servico gerenciado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-escolhendo-servico-pra-rodar-a-nossa-aplicacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-escolhendo-servico-pra-rodar-a-nossa-aplicacao/references/code-examples.md)
