# Code Examples: Criando Permissoes na Role para ECR

## Exemplo 1: Inline Policy completa no Terraform

```hcl
resource "aws_iam_role" "github_actions" {
  name               = "github-actions-ecr-role"
  assume_role_policy = data.aws_iam_policy_document.github_oidc.json

  inline_policy {
    name = "ECRAppPermission"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Sid    = "Statement1"
          Effect = "Allow"
          Action = [
            "ecr:GetDownloadUrlForLayer",
            "ecr:BatchGetImage",
            "ecr:BatchCheckLayerAvailability",
            "ecr:PutImage",
            "ecr:InitiateLayerUpload",
            "ecr:UploadLayerPart",
            "ecr:CompleteLayerUpload",
            "ecr:GetAuthorizationToken"
          ]
          Resource = "*"
        }
      ]
    })
  }
}
```

### Explicacao das actions:

| Action | Funcao |
|--------|--------|
| `GetDownloadUrlForLayer` | Obter URL para baixar uma camada da imagem |
| `BatchGetImage` | Baixar imagens em lote |
| `BatchCheckLayerAvailability` | Verificar se camadas ja existem (otimiza upload) |
| `PutImage` | Enviar imagem para o repositorio |
| `InitiateLayerUpload` | Iniciar upload de uma camada |
| `UploadLayerPart` | Enviar parte de uma camada (upload multipart) |
| `CompleteLayerUpload` | Finalizar upload de uma camada |
| `GetAuthorizationToken` | Obter token para autenticar no ECR |

## Exemplo 2: Repositorio ECR via Terraform

Arquivo `ecr.tf`:

```hcl
resource "aws_ecr_repository" "skillz_ci" {
  name                 = "skillz-ci"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    ManagedBy = "terraform"
  }
}
```

## Exemplo 3: Variacao com Resource restrito (mais seguro)

```hcl
inline_policy {
  name = "ECRAppPermission"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ECRPushPull"
        Effect = "Allow"
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ]
        Resource = "arn:aws:ecr:us-east-1:123456789012:repository/skillz-ci"
      },
      {
        Sid      = "ECRAuth"
        Effect   = "Allow"
        Action   = ["ecr:GetAuthorizationToken"]
        Resource = "*"
      }
    ]
  })
}
```

Nota: `GetAuthorizationToken` precisa de `Resource: "*"` porque nao e especifico a um repositorio.

## Exemplo 4: Tag imutavel (producao)

```hcl
resource "aws_ecr_repository" "production" {
  name                 = "my-app-production"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}
```

Use IMMUTABLE quando trabalhar com tags versionadas (v1.0.0, v1.0.1). Nao funciona com `latest`.

## Exemplo 5: GitHub Actions workflow com permissions

```yaml
name: CI

on:
  push:
    branches: [main]

permissions:
  id-token: write
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-actions-ecr-role
          aws-region: us-east-1

      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v2
```

## Exemplo 6: Fluxo completo de aplicacao

```bash
# 1. Plan para verificar alteracoes
terraform plan

# 2. Apply para criar/alterar recursos
terraform apply

# 3. Verificar na AWS Console
# Role > Permissions > inline policy visivel
# ECR > Repositories > repositorio criado

# 4. Commit e push para triggerar a pipeline
git add .
git commit -m "fix: CI permissions"
git push
```

## Comandos Terraform utilizados na aula

```bash
# Ver o que sera alterado (role ja existe, sera editada)
terraform plan

# Aplicar com output do plan
terraform apply

# Para ECR (recurso novo, sera criado)
terraform plan    # mostra "1 to add"
terraform apply   # cria o repositorio
```