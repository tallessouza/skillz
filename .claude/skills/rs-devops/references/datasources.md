---
name: rs-devops-terraform-datasources
description: "Applies Terraform data source patterns when referencing existing infrastructure resources. Use when user asks to 'reference existing resource', 'use terraform data source', 'query existing s3 bucket', 'terraform data block', or 'lookup existing infrastructure'. Enforces data block usage, dedicated datasources.tf file, and dynamic attribute references. Make sure to use this skill whenever referencing pre-existing cloud resources in Terraform configurations. Not for creating new resources, importing state, or Terraform modules."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-data-sources
  tags: [terraform, data-source, aws, s3, cloudfront, iac, existing-resources]
---

# Terraform Data Sources

> Use data sources para consultar recursos existentes e incorporar seus atributos em novas configuracoes, nunca hardcode valores gerados em tempo de criacao.

## Rules

1. **Use o bloco `data` para recursos existentes** — data sources consultam sem criar ou modificar
2. **Crie arquivo dedicado `datasources.tf`** — separe data sources dos resources
3. **Nunca hardcode atributos gerados** — use `data.aws_s3_bucket.bucket.arn`
4. **Data source sem output nao faz nada visivel** — combine com references em resources

## How to write

```hcl
# datasources.tf
data "aws_s3_bucket" "bucket" {
  bucket = "skillz-bucket-${terraform.workspace}"
}

# main.tf — referenciando
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = data.aws_s3_bucket.bucket.bucket_domain_name
    origin_id   = data.aws_s3_bucket.bucket.id
  }
}
```

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `domain_name = "bucket.s3.amazonaws.com"` | `data.aws_s3_bucket.bucket.bucket_domain_name` |
| Data sources dentro de `main.tf` | Arquivo `datasources.tf` dedicado |
| Alias generico (`data1`, `main`) | Alias descritivo (`assets_bucket`) |

## Troubleshooting

### Data source retorna erro "resource not found"
**Symptom:** `terraform plan` falha com erro indicando que o recurso referenciado pelo data source nao existe.
**Cause:** O nome ou identificador passado ao data source nao corresponde a um recurso existente na conta/regiao AWS configurada.
**Fix:** Verifique se o recurso existe na mesma conta e regiao do provider. Use o AWS Console ou CLI para confirmar o nome exato do recurso (ex: nome do bucket S3).

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
