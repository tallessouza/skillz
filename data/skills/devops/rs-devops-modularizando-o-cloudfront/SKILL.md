---
name: rs-devops-modularizando-o-cloudfront
description: "Applies Terraform module patterns for AWS CloudFront distribution linked to S3 buckets. Use when user asks to 'create cloudfront', 'add CDN', 'modularize terraform', 'connect cloudfront to s3', or 'terraform module dependencies'. Enforces inter-module output passing, depends_on for resource ordering, and variable wiring between modules. Make sure to use this skill whenever creating Terraform CloudFront distributions or wiring module outputs as inputs. Not for CloudFront invalidation, Lambda@Edge, or non-Terraform CDN setup."
---

# Modularizando o CloudFront no Terraform

> Ao criar modulos Terraform interdependentes, declare outputs no modulo produtor e consuma-os como variaveis no modulo consumidor, com depends_on explicito para garantir ordem de criacao.

## Rules

1. **Crie estrutura minima por modulo** — `main.tf` + `variables.tf`, adicione `outputs.tf` apenas quando outro modulo precisar consumir valores, porque arquivos vazios poluem o projeto
2. **Exporte valores dinamicos via outputs** — valores que outro modulo precisa (IDs, domain names) devem ser declarados em `outputs.tf` do modulo produtor, porque nao ha outra forma de passar dados entre modulos
3. **Consuma outputs com `module.<name>.<output>`** — nunca hardcode IDs ou domain names, porque sao valores dinamicos gerados no apply
4. **Declare depends_on entre modulos dependentes** — `depends_on = [module.s3]` no modulo CloudFront, porque garante que o S3 exista antes da CDN ser criada
5. **Rode terraform init ao adicionar modulos** — novo modulo exige init para registrar o source, porque plan/apply falham sem isso
6. **Use terraform fmt para padronizar identacao** — rode apos editar arquivos .tf, porque mantem consistencia no codebase

## How to write

### Estrutura de pastas do modulo CloudFront

```
modules/
├── s3/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf       # Exporta bucket_id e bucket_domain_name
└── cloudfront/
    ├── main.tf           # Resource aws_cloudfront_distribution
    └── variables.tf      # Recebe origin_id e bucket_domain_name
```

### Resource CloudFront Distribution (modules/cloudfront/main.tf)

```hcl
resource "aws_cloudfront_distribution" "cloudfront" {
  enabled = true

  origin {
    origin_id   = var.origin_id
    domain_name = var.bucket_domain_name
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = var.origin_id
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

### Variables do modulo CloudFront (modules/cloudfront/variables.tf)

```hcl
variable "origin_id" {
  type        = string
  description = "ID da origin (bucket S3)"
}

variable "bucket_domain_name" {
  type        = string
  description = "Dominio do S3"
}
```

### Outputs do modulo S3 (modules/s3/outputs.tf)

```hcl
output "bucket_id" {
  value       = aws_s3_bucket.bucket.id
  description = "ID do bucket S3"
}

output "bucket_domain_name" {
  value       = aws_s3_bucket.bucket.bucket_domain_name
  description = "Domain name do bucket S3"
}
```

### Wiring no main.tf raiz

```hcl
module "s3" {
  source = "./modules/s3"
}

module "cloudfront" {
  source             = "./modules/cloudfront"
  origin_id          = module.s3.bucket_id
  bucket_domain_name = module.s3.bucket_domain_name
  depends_on         = [module.s3]
}
```

## Example

**Before (valores hardcoded, sem dependencia):**
```hcl
module "cloudfront" {
  source = "./modules/cloudfront"
}

# modules/cloudfront/main.tf
resource "aws_cloudfront_distribution" "cloudfront" {
  origin {
    origin_id   = ""
    domain_name = ""
  }
}
```

**After (outputs wired, dependencia explicita):**
```hcl
module "cloudfront" {
  source             = "./modules/cloudfront"
  origin_id          = module.s3.bucket_id
  bucket_domain_name = module.s3.bucket_domain_name
  depends_on         = [module.s3]
}

# modules/cloudfront/main.tf
resource "aws_cloudfront_distribution" "cloudfront" {
  origin {
    origin_id   = var.origin_id
    domain_name = var.bucket_domain_name
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Modulo A precisa de valor de Modulo B | Declare output em B, consuma com `module.B.<output>` em A |
| Ordem de criacao importa | Adicione `depends_on = [module.<name>]` |
| Adicionou novo modulo | Rode `terraform init` antes de plan |
| Valores origin_id/domain_name vazios | Nunca deixe vazio — passe via variable |
| Quer validar antes de criar | `terraform plan` primeiro, `terraform apply -auto-approve` so quando confiante |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Hardcode bucket ID no CloudFront | Passe via `module.s3.bucket_id` |
| Deixar origin_id como string vazia | Declare variable e passe o valor |
| Criar CloudFront sem depends_on no S3 | `depends_on = [module.s3]` |
| Rodar plan sem init apos novo modulo | `terraform init` primeiro |
| Criar outputs.tf vazio "por precaucao" | Crie apenas quando outro modulo precisar consumir |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
