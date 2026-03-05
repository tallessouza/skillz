---
name: rs-devops-multiplos-datasources
description: "Applies Terraform data source and output patterns when writing IaC modules. Use when user asks to 'create a datasource', 'add terraform output', 'configure data source', 'read existing resource', or 'expose module outputs'. Enforces rules: datasources inside modules not root, dynamic references never hardcoded IDs, depends_on for resource dependencies, separate root outputs from module outputs. Make sure to use this skill whenever generating Terraform module code with data sources or outputs. Not for Terraform state management, backend configuration, or provider setup."
---

# Trabalhando com Múltiplos Datasources no Terraform

> Data sources vivem no módulo que os consome, outputs do módulo não aparecem no console sem outputs na raiz, e IDs nunca são hardcoded.

## Rules

1. **Datasource dentro do módulo** — crie `datasources.tf` dentro do módulo, não na raiz, porque a responsabilidade pertence ao módulo que consome o recurso
2. **Nunca hardcode IDs** — use referências dinâmicas como `aws_cloudfront_distribution.cloudfront.id`, porque IDs mudam entre ambientes e execuções
3. **Datasource exige recurso criado** — o recurso deve existir no provider antes de criar o datasource, porque ele consulta o provider real para obter informações
4. **Outputs de módulo vs outputs de projeto** — outputs em `modules/x/outputs.tf` são saídas do módulo; para aparecer no console do `terraform plan/apply`, crie `outputs.tf` na raiz referenciando `module.x.variable`
5. **depends_on para recursos dependentes** — quando um recurso depende de outro dentro do mesmo módulo (ex: website config depende do bucket), declare `depends_on` explicitamente
6. **Alias pode repetir nome do recurso** — usar o mesmo nome no data source e no resource não causa conflito, são namespaces separados (`data.aws_s3_bucket.bucket` vs `aws_s3_bucket.bucket`)

## How to write

### Data source dentro do módulo

```hcl
# modules/cloudfront/datasources.tf
data "aws_cloudfront_distribution" "cloudfront" {
  id = aws_cloudfront_distribution.cloudfront.id
}
```

### Data source S3

```hcl
# modules/s3/datasources.tf
data "aws_s3_bucket" "bucket" {
  bucket = aws_s3_bucket.bucket.bucket
}
```

### Outputs do módulo (saída interna)

```hcl
# modules/cloudfront/outputs.tf
output "cdn_id" {
  value       = data.aws_cloudfront_distribution.cloudfront.id
  sensitive   = false
  description = "ID do CloudFront"
}

output "cdn_domain_name" {
  value       = data.aws_cloudfront_distribution.cloudfront.domain_name
  sensitive   = false
  description = "Nome de domínio do CloudFront"
}
```

### Outputs na raiz (saída do console)

```hcl
# outputs.tf (raiz do projeto)
output "s3_bucket_name" {
  value       = module.s3.bucket_domain_name
  sensitive   = false
  description = "Nome do bucket S3"
}

output "cdn_domain" {
  value       = module.cloudfront.cdn_domain_name
  sensitive   = false
  description = "Nome de domínio do CloudFront"
}
```

### Recurso dependente com depends_on

```hcl
# modules/s3/main.tf
resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_website_configuration" "bucket" {
  bucket = aws_s3_bucket.bucket.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }

  depends_on = [aws_s3_bucket.bucket]
}
```

## Example

**Before (erros comuns):**
```hcl
# datasource na raiz ao invés do módulo
data "aws_cloudfront_distribution" "cdn" {
  id = "E1ABCDEF123456"  # hardcoded!
}

# output do módulo esperando aparecer no console
# modules/cloudfront/outputs.tf
output "domain" {
  value = data.aws_cloudfront_distribution.cdn.domain_name
}
# -> NÃO aparece no terraform plan/apply
```

**After (com esta skill aplicada):**
```hcl
# modules/cloudfront/datasources.tf
data "aws_cloudfront_distribution" "cloudfront" {
  id = aws_cloudfront_distribution.cloudfront.id  # dinâmico
}

# modules/cloudfront/outputs.tf
output "cdn_domain_name" {
  value = data.aws_cloudfront_distribution.cloudfront.domain_name
}

# outputs.tf (RAIZ)
output "cdn_domain" {
  value = module.cloudfront.cdn_domain_name  # agora aparece no console
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa ler atributo de recurso já criado | Crie data source no módulo do recurso |
| Output não aparece no `terraform plan` | Verifique se existe output na raiz referenciando o módulo |
| Recurso B depende de recurso A no mesmo módulo | Use `depends_on = [aws_x.a]` |
| ID do recurso necessário | Use `resource_type.name.id`, nunca string literal |
| Mesmo alias para data e resource | Permitido — namespaces diferentes |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `id = "E1ABCDEF123456"` | `id = aws_cloudfront_distribution.cloudfront.id` |
| `bucket = "my-bucket-name"` | `bucket = aws_s3_bucket.bucket.bucket` |
| `datasources.tf` na raiz do projeto | `datasources.tf` dentro de `modules/x/` |
| Output só no módulo esperando ver no console | Output na raiz com `module.x.output_name` |
| Criar datasource sem recurso existente | Primeiro `apply` o recurso, depois adicione datasource |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
