---
name: rs-devops-criando-recursos-iac
description: "Applies Terraform IAC patterns for AWS resource provisioning when setting up infrastructure from scratch. Use when user asks to 'create AWS resources with Terraform', 'setup terraform provider', 'configure OIDC for GitHub Actions', 'terraform init aws', or 'infrastructure as code setup'. Enforces provider configuration, file organization by domain, and tag best practices. Make sure to use this skill whenever initializing Terraform projects for AWS. Not for Azure, GCP, or non-Terraform provisioning tools."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-aws-setup
  tags: [terraform, aws, iac, provider, oidc, github-actions, infrastructure]
---

# Criando Recursos AWS com Terraform IAC

> Crie recursos de infraestrutura AWS via codigo Terraform, nunca pela interface, seguindo o fluxo init, plan, apply.

## Rules

1. **Sempre use IAC, nunca a interface** — crie recursos via Terraform, porque codigo e versionavel, auditavel e reproduzivel
2. **Comece pelo provider** — configure o bloco `required_providers` e `provider` antes de qualquer recurso
3. **Organize por dominio** — separe recursos em arquivos por area (`iam.tf`, `ecr.tf`, `main.tf`)
4. **Use tags como boa pratica** — adicione `tags { IAC = "TRUE" }` em todo recurso
5. **Sempre rode plan antes de apply** — `terraform plan` antes de `terraform apply`

## How to write

### Provider AWS

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.49"
    }
  }
}

provider "aws" {
  region = "us-east-2"
}
```

### OpenID Connect Provider para GitHub Actions

```hcl
resource "aws_iam_openid_connect_provider" "openid_connect_git" {
  url = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  thumbprint_list = ["<thumbprint-gerado-pela-aws>"]
  tags = { IAC = "TRUE" }
}
```

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar recursos pela interface sem versionar | Use Terraform para tudo |
| Colocar tudo em um unico `.tf` | Separe por dominio |
| Rodar `apply` sem `plan` | Sempre `terraform plan` primeiro |
| Hardcode de credenciais no provider | Use AWS CLI profile ou SSO |

## Troubleshooting

### terraform init falha com erro de provider
**Symptom:** `terraform init` retorna erro de provider nao encontrado ou versao incompativel.
**Cause:** O bloco `required_providers` tem source ou version incorretos, ou o registry esta inacessivel.
**Fix:** Verifique o source (`hashicorp/aws`) e a version constraint (`~> 5.49`). Execute `terraform init -upgrade` para forcar download da versao mais recente compativel.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
