---
name: rs-devops-mais-algumas-configuracoes
description: "Enforces Terraform module configuration best practices when writing HCL code. Use when user asks to 'create a module', 'configure terraform', 'add variables to terraform', 'add tags to resources', or 'refactor hardcoded values'. Applies rules: no hardcoded values in modules, tags on every resource, map(string) for tags, defaults with override pattern, terraform fmt and validate before plan. Make sure to use this skill whenever writing or reviewing Terraform modules. Not for Terraform state management, CI/CD pipelines, or cloud provider CLI usage."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-modulos
  tags: [terraform, modules, tags, variables, hcl, cloudfront, best-practices]
---

# Configuracao de Modulos Terraform

> Modulos Terraform devem ser genericos: valores hardcoded viram variaveis, todo recurso recebe tags, e validate roda antes de plan.

## Rules

1. **Nunca deixe valores hardcoded em modulos** — `price_class`, configuracoes de cobranca e parametros que variam entre ambientes devem ser variaveis, porque modulos existem para serem reutilizaveis
2. **Defina defaults sensatos** — toda variavel de modulo deve ter um `default` quando possivel, porque o consumidor so precisa sobrescrever quando o padrao nao serve
3. **Tagueie todo recurso** — CloudFront, S3, EC2 — todos recebem tags, porque recursos sem tags sao invisiveis para governanca e billing
4. **Use `map(string)` para tags** — nunca defina tags como string unica ou lista, porque tags sao pares chave-valor flexiveis
5. **Sempre inclua tag `iac = true`** — identifica que o recurso e gerenciado por Terraform (ou Pulumi/CloudFormation), porque facilita auditoria
6. **Rode `terraform fmt` apos cada alteracao** — porque codigo formatado reduz diffs desnecessarios em PRs
7. **Rode `terraform validate` antes de `plan`** — porque erros de sintaxe e atribuicao sao mais rapidos de corrigir antes do refresh de state

## How to write

### Variavel com default e override

```hcl
variable "cdn_price_class" {
  type        = string
  description = "Classe de preco do CDN"
  default     = "PriceClass_200"
}

resource "aws_cloudfront_distribution" "this" {
  price_class = var.cdn_price_class
  # ...
}
```

### Tags como map(string)

```hcl
variable "cdn_tags" {
  type        = map(string)
  description = "Tags do recurso CDN"
  default     = {}
}

resource "aws_cloudfront_distribution" "this" {
  tags = var.cdn_tags
  # ...
}
```

### Passando tags no modulo consumidor

```hcl
module "cdn" {
  source          = "./modules/cdn"
  cdn_price_class = "PriceClass_200"
  cdn_tags        = { iac = "true" }
}

module "s3" {
  source  = "./modules/s3"
  s3_tags = { iac = "true" }
}
```

## Example

**Before (hardcoded):**
```hcl
resource "aws_cloudfront_distribution" "this" {
  price_class = "PriceClass_200"
  # sem tags
}

resource "aws_s3_bucket" "this" {
  bucket = var.bucket_name
  # sem tags
}
```

**After (modularizado):**
```hcl
resource "aws_cloudfront_distribution" "this" {
  price_class = var.cdn_price_class
  tags        = var.cdn_tags
}

resource "aws_s3_bucket" "this" {
  bucket = var.bucket_name
  tags   = var.s3_tags
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Valor que muda entre ambientes (dev/staging/prod) | Transformar em variavel com default |
| Protocolo fixo (HTTPS, SSL) | Pode deixar hardcoded — raramente muda |
| Metodos HTTP permitidos | Pode deixar hardcoded — estavel |
| Modelo de cobranca / price class | Variavel — muda por projeto |
| Qualquer recurso AWS criado | Adicionar tags com pelo menos `iac = true` |
| Alterou muitos arquivos | `terraform validate` antes de `plan` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `price_class = "PriceClass_200"` em modulo | `price_class = var.cdn_price_class` |
| Recurso sem tags | `tags = var.resource_tags` |
| `type = string` para tags | `type = map(string)` |
| `terraform plan` direto apos muitas mudancas | `terraform validate` primeiro, depois `plan` |
| Tags hardcoded dentro do modulo | Tags passadas via variavel do consumidor |
| Variavel de tags sem default | `default = {}` para tags opcionais |

## Troubleshooting

### Terraform validate falha com "argument not expected"
**Symptom:** `terraform validate` retorna erro de argumento inesperado ao passar variavel para modulo
**Cause:** A variavel esta sendo passada no bloco `module {}` mas nao foi declarada no `variables.tf` do modulo
**Fix:** Declare a variavel no `variables.tf` do modulo com `type`, `description` e opcionalmente `default`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
