---
name: rs-devops-criando-bucket-s-3
description: "Applies Terraform S3 bucket creation patterns for remote state storage when user asks to 'create s3 bucket', 'configure terraform state', 'setup remote backend', 'store tfstate in s3', or 'terraform backend s3'. Enforces versioning, lifecycle protection, and tagging best practices for state buckets. Make sure to use this skill whenever creating S3 buckets for Terraform state via IaC. Not for general S3 usage, application storage buckets, or non-Terraform state management."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-remote-state
  tags: [terraform, s3, aws, remote-state, versioning, lifecycle, iac]
---

# Criando Bucket S3 para Terraform State

> Ao criar um bucket S3 para armazenar estado Terraform, sempre configure versionamento e protecao contra destruicao acidental, porque o tfstate e o arquivo mais critico da infraestrutura.

## Rules

1. **Sempre ative versionamento** — use `aws_s3_bucket_versioning` com `status = "Enabled"`, porque perder o state exige recriacao manual de toda infraestrutura
2. **Proteja contra destroy acidental** — use `lifecycle { prevent_destroy = true }`, porque um `terraform destroy` acidental pode deletar o bucket com o estado
3. **Nomes de bucket devem ser consistentes** — mantenha o mesmo nome no `aws_s3_bucket` e no `aws_s3_bucket_versioning`, porque nomes diferentes causam erro 404
4. **Sempre aplique tags** — no minimo `IAC = "true"`, porque identifica recursos gerenciados por Terraform
5. **Considere encriptacao server-side** — para ambientes de producao, adicione `aws_s3_bucket_server_side_encryption_configuration`, porque o state pode conter dados sensiveis
6. **Crie o bucket ANTES de configurar o backend** — o bucket precisa existir antes de migrar o state local para remoto

## How to write

### Bucket com protecao e versionamento

```hcl
resource "aws_s3_bucket" "terraform_state" {
  bucket       = "empresa-iac"
  force_destroy = true

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    IAC = "true"
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}
```

### Com encriptacao (producao)

```hcl
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}
```

## Example

**Before (bucket sem protecao):**
```hcl
resource "aws_s3_bucket" "state" {
  bucket = "my-state"
}
```

**After (com protecao completa):**
```hcl
resource "aws_s3_bucket" "terraform_state" {
  bucket        = "my-state"
  force_destroy = true

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    IAC = "true"
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Bucket para tfstate | Versionamento + prevent_destroy obrigatorios |
| Ambiente de producao | Adicionar encriptacao server-side |
| Nomes de bucket | Usar mesmo nome no bucket e no versioning resource |
| Multiplos ambientes | Usar tfvars para parametrizar nome do bucket |
| Testar criacao | `terraform plan` primeiro, depois `terraform apply` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Bucket de state sem versionamento | `aws_s3_bucket_versioning` com `Enabled` |
| Nomes diferentes entre bucket e versioning | Referenciar `aws_s3_bucket.terraform_state.id` |
| Bucket de state sem `prevent_destroy` | `lifecycle { prevent_destroy = true }` |
| Bucket sem tags | No minimo `IAC = "true"` |
| Configurar backend antes de criar bucket | Criar bucket → apply → depois configurar backend |

## Troubleshooting

### Erro 404 ao configurar backend S3
**Symptom:** `terraform init` falha com erro 404 ou "bucket does not exist" ao configurar backend remoto.
**Cause:** O bucket S3 precisa existir antes de configurar o backend. O backend nao cria o bucket automaticamente.
**Fix:** Crie o bucket primeiro com `terraform apply` usando state local, depois adicione o bloco `backend "s3"` e rode `terraform init` para migrar o state.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
