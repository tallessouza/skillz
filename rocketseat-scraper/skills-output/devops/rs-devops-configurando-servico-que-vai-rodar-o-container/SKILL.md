---
name: rs-devops-configurando-servico-container
description: "Applies AWS AppRunner IAM permission configuration using Terraform when setting up container services. Use when user asks to 'configure AppRunner', 'create IAM role for AppRunner', 'give AppRunner ECR access', 'setup container permissions on AWS', or 'deploy container with Terraform'. Covers trust policy, managed policy ARNs, inline policies with multiple statements, and ECR integration. Make sure to use this skill whenever configuring AppRunner permissions or ECR access roles via IaC. Not for ECS/EKS deployments, Lambda permissions, or non-Terraform IaC tools."
---

# Configurando Servico do Container (AppRunner + ECR)

> Crie roles IAM via Terraform para que o AppRunner consiga acessar o ECR, baixar imagens e subir o container.

## Prerequisites

- Terraform configurado com provider AWS
- ECR repository ja criado com imagem pushed
- Role de OIDC para GitHub Actions ja existente
- Arquivo de IAM (`iam.tf` ou similar) com inline policy do ECR

## Steps

### Step 1: Criar a Role do AppRunner

```hcl
resource "aws_iam_role" "app_runner_role" {
  name = "AppRunnerRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  managed_policy_arns = [
    "arn:aws:iam::policy/AmazonEC2ContainerRegistryReadOnly"
  ]

  tags = {
    Project = var.project_name
  }
}
```

O Principal usa `build.apprunner.amazonaws.com` porque o AppRunner precisa de permissao de build para baixar a imagem do ECR e subi-la.

### Step 2: Adicionar Statements na Inline Policy do ECR

Na inline policy existente (que ja tem o statement do STS), adicionar dois statements extras:

```hcl
inline_policy {
  name = "ecr-app-permission"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "Statement1"
        Effect   = "Allow"
        Action   = "ecr:*"
        Resource = "*"
      },
      {
        Sid      = "Statement2"
        Effect   = "Allow"
        Action   = "apprunner:*"
        Resource = "*"
      },
      {
        Sid    = "Statement3"
        Effect = "Allow"
        Action = [
          "iam:PassRole",
          "iam:CreateServiceLinkedRole"
        ]
        Resource = "*"
      }
    ]
  })
}
```

**Statement 2 (AppRunner):** Permite que a role do CI execute acoes no AppRunner.

**Statement 3 (IAM):** `PassRole` permite alteracoes de role em tempo de execucao. `CreateServiceLinkedRole` permite criar roles linkadas a servicos. Ambos necessarios para o pipeline de CD.

### Step 3: Validar e Aplicar

```bash
terraform plan
terraform apply -auto-approve
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa que AppRunner acesse ECR | Crie role com trust policy apontando para `build.apprunner.amazonaws.com` + managed policy `AmazonEC2ContainerRegistryReadOnly` |
| Pipeline CI/CD precisa assumir role do AppRunner | Adicione statements de `apprunner:*` e `iam:PassRole` na inline policy da role do CI |
| SID duplicado causa erro 400 | Garanta SIDs unicos em cada statement — `terraform plan` NAO detecta isso, so o `apply` |
| Esqueceu tags na role | Sempre adicione tags para rastreabilidade |

## Error Handling

- **Erro 400 (Bad Request) no apply:** Verifique SIDs duplicados nos statements — cada SID deve ser unico dentro da mesma policy
- **`terraform plan` passa mas `apply` falha:** Plan simula mas nao valida constraints da API AWS. Sempre rode o apply para confirmar
- **AppRunner nao consegue baixar imagem:** Verifique se a managed policy `AmazonEC2ContainerRegistryReadOnly` esta associada E se a inline policy tem o statement do AppRunner

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar permissions manualmente no console | Use Terraform (IaC) para reproducibilidade |
| Usar uma unica role para tudo | Crie roles escopadas: uma para ECR/CI, outra para AppRunner |
| Copiar SIDs entre statements | Use SIDs unicos (Statement1, Statement2, Statement3) |
| Pular `terraform plan` | Sempre plan antes de apply, mesmo sabendo que plan nao pega tudo |
| Esquecer `iam:PassRole` | Sem PassRole, alteracoes de role em runtime falham silenciosamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
