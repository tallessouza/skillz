---
name: rs-devops-escolhendo-servico-pra-rodar-a-nossa-aplicacao
description: "Analyzes AWS container service selection when deploying containerized applications. Use when user asks to 'deploy container on AWS', 'choose between ECS and EKS', 'setup AppRunner', 'create ECR repository', or 'deploy Docker image to AWS'. Analyzes AppRunner, ECS+Fargate, ECS+EC2, EKS decision framework and ECR private registry via Terraform. Make sure to use this skill whenever selecting AWS compute services for containers. Not for serverless Lambda deployments, non-AWS cloud providers, or bare-metal Kubernetes."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: aws-deploy
  tags: [aws, ecr, ecs, eks, apprunner, fargate, terraform, container-registry]
---

# Escolhendo Servico AWS para Aplicacao Containerizada

> Ao deployer uma aplicacao containerizada na AWS, escolha o servico mais simples que atende ao requisito e use ECR privado como container registry.

## Rules

1. **Nunca use Docker Hub para producao na AWS** — use ECR privado
2. **Nunca rode latest em producao** — associe tag ao hash do commit
3. **Escolha o servico pelo nivel de complexidade necessario**
4. **Crie recursos AWS via Terraform, nunca pelo console**
5. **Use ECR privado, nunca publico**

## Decision Framework

| Necessidade | Servico AWS | Complexidade |
|-------------|-------------|--------------|
| Container simples | AppRunner | Baixa |
| Orquestracao basica com scaling | ECS + Fargate | Media |
| Controle total | ECS + EC2 | Alta |
| Orquestracao avancada | EKS (Kubernetes) | Muito alta |

## Infraestrutura (Terraform)

```hcl
resource "aws_ecr_repository" "app" {
  name                 = "app-name"
  image_tag_mutability = "MUTABLE"
}

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
```

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar ECR pelo console AWS | Criar via Terraform |
| Usar Docker Hub com AppRunner | Usar ECR privado |
| Deploy com tag `latest` | Deploy com tag do commit hash |
| IAM roles manualmente | Terraform com least privilege |

## Troubleshooting

### AppRunner nao consegue fazer pull da imagem do ECR
**Symptom:** Deploy no AppRunner falha com "cannot pull image" ou "access denied"
**Cause:** IAM Role do AppRunner nao tem permissao de acesso ao ECR ou a policy AmazonEC2ContainerRegistryReadOnly nao esta vinculada
**Fix:** Crie uma IAM Role com `assume_role_policy` para `build.apprunner.amazonaws.com` e vincule a policy `AmazonEC2ContainerRegistryReadOnly`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
