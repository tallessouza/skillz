# Code Examples: Configurando IAM Roles para CI/CD

## Exemplo completo do recurso Terraform

```hcl
resource "aws_iam_role" "ecr_role" {
  name = "ecr_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "sts:AssumeRoleWithWebIdentity"
        Principal = {
          Federated = aws_iam_openid_connect_provider.oidc_git.arn
        }
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
            "token.actions.githubusercontent.com:sub" = "repo:EuSouODaniel/SkillzCIAPI:ref:refs/heads/main"
          }
        }
      }
    ]
  })

  tags = {
    IAC = true
  }
}
```

## Workflow GitHub Actions que consome a Role

```yaml
name: CI

on:
  push:
    branches: [main]

permissions:
  id-token: write   # Necessario para OIDC
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: us-east-1

      - name: Login to ECR
        # Este step vai falhar ate configurar as permission policies na Role
        run: aws ecr get-login-password --region us-east-1
```

## Variacao: acesso liberado para toda a organizacao

```hcl
# Menos restritivo — qualquer repo da org, qualquer branch
Condition = {
  StringLike = {
    "token.actions.githubusercontent.com:sub" = "repo:MinhaOrg/*"
  }
}
```

## Variacao: multiplas branches permitidas

```hcl
Condition = {
  StringLike = {
    "token.actions.githubusercontent.com:sub" = [
      "repo:MinhaOrg/MeuRepo:ref:refs/heads/main",
      "repo:MinhaOrg/MeuRepo:ref:refs/heads/staging"
    ]
  }
}
```

## Comandos Terraform usados na aula

```bash
# Visualizar o que sera criado
terraform plan

# Criar o recurso
terraform apply -auto-approve
```

## Como pegar o ARN da Role criada

Apos `terraform apply`, o ARN pode ser obtido via:

```bash
# Via Terraform output (se configurado)
terraform output ecr_role_arn

# Via AWS CLI
aws iam get-role --role-name ecr_role --query 'Role.Arn' --output text
```

Esse ARN (ex: `arn:aws:iam::123456789:role/ecr_role`) deve ser salvo como GitHub Secret `AWS_ROLE_ARN`.

## OIDC Provider referenciado (recurso prerequisito)

```hcl
resource "aws_iam_openid_connect_provider" "oidc_git" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com"
  ]

  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]

  tags = {
    IAC = true
  }
}
```