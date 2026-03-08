---
name: rs-devops-documentacao-providers-e-terra-cloud
description: "Applies Terraform provider/resource/module hierarchy and naming conventions. Use when user asks to 'configure Terraform provider', 'create Terraform resource', 'use Terraform module', or 'understand provider vs resource vs module'. Enforces required_providers declaration, descriptive resource naming, module usage for repetitive patterns, and version pinning. Make sure to use this skill whenever writing Terraform provider blocks or structuring resources and modules. Not for state management (use dinamica-e-backup-do-estado) or variable configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-fundamentos
  tags: [terraform, provider, resource, module, registry, aws, hcl, iac]
---

# Terraform: Provider, Resource, Module

> Toda configuracao Terraform segue uma hierarquia: Provider define O QUE gerenciar, Resource define O recurso especifico, Module abstrai complexidade repetitiva.

## Rules

1. **Sempre declare providers no bloco terraform.required_providers**
2. **Nomeie resources pelo conteudo, nao pela estrutura** — `aws_s3_bucket.upload_photos` nao `bucket1`
3. **Prefira modules do Registry para problemas complexos ou repetitivos**
4. **Consulte a documentacao do Provider antes de escrever resources**

## How to write

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "assets_bucket" {
  bucket = "my-app-assets"
  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"
  name = "my-vpc"
  cidr = "10.0.0.0/16"
}
```

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Criar resources sem provider declarado | Sempre declare `required_providers` |
| Escrever dezenas de resources repetitivos | Use modules do Registry |
| Ignorar versao do provider | Fixe com `~>` |
| Alias generico no resource (`bucket1`) | Nomeie pelo proposito (`upload_photos`) |

## Troubleshooting

### Terraform init falha com provider not found
**Symptom:** `terraform init` retorna erro de provider nao encontrado
**Cause:** Bloco `required_providers` ausente ou `source` incorreto
**Fix:** Adicionar bloco `terraform { required_providers { aws = { source = "hashicorp/aws" version = "~> 5.0" } } }` e rodar `terraform init` novamente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
