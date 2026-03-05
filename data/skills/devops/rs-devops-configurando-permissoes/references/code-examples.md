# Code Examples: Configurando Permissoes para Pipeline Terraform

## Pipeline YAML completa (estado final da aula)

```yaml
name: Terraform CI

on:
  push:
    branches: [main]

permissions:
  id-token: write
  contents: read

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/tf-role
          aws-region: us-east-1

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3

      - name: Terraform Init
        run: terraform init

      - name: Terraform Format Check
        run: terraform fmt --check

      - name: Terraform Plan
        run: terraform plan

      - name: Terraform Apply
        if: github.ref == 'refs/heads/main'
        run: terraform apply -auto-approve
```

## Recurso Terraform: IAM Role para pipeline

```hcl
resource "aws_iam_role" "tf_role" {
  name = "tf-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:sub" = "repo:skillz/ci-iac:ref:refs/heads/main"
          }
        }
      }
    ]
  })

  tags = {
    IAC = "true"
  }
}
```

## Comparacao: ECR Role vs TF Role

```hcl
# ECR Role — escopada para pipeline da API
resource "aws_iam_role" "ecr_role" {
  name = "ecr-role"
  assume_role_policy = jsonencode({
    # ...
    Condition = {
      StringEquals = {
        "token.actions.githubusercontent.com:sub" = "repo:skillz/ci-api:ref:refs/heads/main"
      }
    }
  })
}

# TF Role — escopada para pipeline de IAC
resource "aws_iam_role" "tf_role" {
  name = "tf-role"
  assume_role_policy = jsonencode({
    # ...
    Condition = {
      StringEquals = {
        "token.actions.githubusercontent.com:sub" = "repo:skillz/ci-iac:ref:refs/heads/main"
      }
    }
  })
}
```

A unica diferenca entre as duas e o repositorio na condition. Estrutura identica, escopo diferente.

## Fluxo de criacao da role (local)

```bash
# Verificar o plano antes de aplicar
terraform plan
# Output: 1 to add (aws_iam_role.tf_role)

# Criar o recurso
terraform apply -auto-approve
# Output: aws_iam_role.tf_role: Creation complete

# Copiar o ARN do console AWS ou via output
# arn:aws:iam::123456789012:role/tf-role
```

## Comparacao: pipeline da API vs pipeline IAC

```yaml
# Pipeline API — permissions block
permissions:
  id-token: write
  contents: read

# Pipeline IAC — MESMO permissions block necessario
permissions:
  id-token: write
  contents: read
```

Ambas precisam do mesmo bloco porque ambas usam OpenID Connect para autenticar com AWS.

## Pre-commit com terraform fmt

```bash
# Localmente — formata automaticamente
terraform fmt
# Sem output = nada para formatar

# Verificar se houve mudancas
git status
# Se "nothing to commit" = codigo ja formatado

# Na pipeline — apenas verifica
terraform fmt --check
# Exit code 0 = formatado
# Exit code != 0 = pipeline falha
```