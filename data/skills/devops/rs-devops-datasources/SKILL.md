---
name: rs-devops-datasources
description: "Applies Terraform data source patterns when writing infrastructure-as-code. Use when user asks to 'read existing resource', 'reference remote state', 'get resource attributes', 'query AWS resource', or 'use data source in Terraform'. Enforces proper data block syntax, file organization, and cross-resource attribute referencing. Make sure to use this skill whenever generating Terraform code that needs information from existing resources. Not for creating new resources, variable definitions, or output configurations."
---

# Terraform Data Sources

> Use data sources para consultar recursos existentes e incorporar seus atributos em novas configuracoes, nunca hardcode valores gerados em tempo de criacao.

## Rules

1. **Use o bloco `data` para recursos existentes** — `data "aws_s3_bucket" "bucket" {}` nao `resource`, porque data sources consultam sem criar ou modificar
2. **Crie arquivo dedicado `datasources.tf`** — separe data sources dos resources, porque facilita localizar fontes de dados e mantem responsabilidade unica por arquivo
3. **Identifique pelo atributo correto** — use `bucket = "nome"` para S3, `name` para outros, porque cada provider define seu proprio atributo de lookup
4. **Considere workspace na identificacao** — nomes que incluem `terraform.workspace` mudam por ambiente, copie a expressao completa no data source
5. **Nunca hardcode atributos gerados** — ARN, domain name, region sao atributos de tempo de criacao, use `data.aws_s3_bucket.bucket.arn` em vez de strings fixas
6. **Data source sem output nao faz nada visivel** — `terraform plan` nao mostra mudancas para data sources isolados, combine com outputs ou references em resources

## How to write

### Data source basico

```hcl
# datasources.tf — arquivo dedicado para fontes de dados
data "aws_s3_bucket" "bucket" {
  bucket = "skillz-bucket-${terraform.workspace}"
}
```

### Referenciando atributos do data source

```hcl
# Em outro resource, use os atributos consultados
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = data.aws_s3_bucket.bucket.bucket_domain_name
    origin_id   = data.aws_s3_bucket.bucket.id
  }
}
```

### Estrutura de arquivos

```
infra/
├── main.tf           # Resources
├── providers.tf      # Provider config
├── datasources.tf    # Data sources (arquivo dedicado)
├── variables.tf      # Input variables
└── outputs.tf        # Output values
```

## Example

**Before (hardcoded — fragil e propenso a erro):**

```hcl
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = "skillz-bucket-stage.s3.amazonaws.com"
    origin_id   = "S3Origin"
  }
}
```

**After (com data source — dinamico e correto):**

```hcl
# datasources.tf
data "aws_s3_bucket" "bucket" {
  bucket = "skillz-bucket-${terraform.workspace}"
}

# main.tf
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = data.aws_s3_bucket.bucket.bucket_domain_name
    origin_id   = data.aws_s3_bucket.bucket.id
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de ARN, domain name, ou ID de recurso existente | Crie data source, nunca copie o valor |
| Recurso foi criado no mesmo projeto | Pode usar `resource.name.attribute` direto, data source e opcional |
| Recurso foi criado fora do Terraform | Data source e obrigatorio para consultar |
| Multiplos buckets/recursos do mesmo tipo | Use alias descritivo no data source (`"logs_bucket"`, `"assets_bucket"`) |
| `terraform plan` nao mostra nada apos criar data source | Normal — data source sozinho nao gera mudancas visiveis |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `domain_name = "bucket.s3.amazonaws.com"` | `domain_name = data.aws_s3_bucket.bucket.bucket_domain_name` |
| `arn = "arn:aws:s3:::my-bucket"` | `arn = data.aws_s3_bucket.bucket.arn` |
| Data sources dentro de `main.tf` misturados com resources | Arquivo `datasources.tf` dedicado |
| `data "aws_s3_bucket" "data1" {}` (alias generico) | `data "aws_s3_bucket" "assets_bucket" {}` (alias descritivo) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
