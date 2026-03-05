# Code Examples: Configuracao de Modulos Terraform

## Exemplo 1: Variavel cdn_price_class

### Definicao no modulo (modules/cdn/variables.tf)

```hcl
variable "cdn_price_class" {
  type        = string
  description = "Classe de preco do CDN"
  default     = "PriceClass_200"
}
```

### Uso no recurso (modules/cdn/main.tf)

```hcl
resource "aws_cloudfront_distribution" "this" {
  price_class = var.cdn_price_class
  # ... outras configuracoes
}
```

### Passagem pelo consumidor (main.tf raiz)

```hcl
module "cdn" {
  source          = "./modules/cdn"
  cdn_price_class = "PriceClass_200"
}
```

## Exemplo 2: Tags com map(string)

### Definicao no modulo CDN (modules/cdn/variables.tf)

```hcl
variable "cdn_tags" {
  type        = map(string)
  description = "Tags do recurso CDN"
  default     = {}
}
```

### Definicao no modulo S3 (modules/s3/variables.tf)

```hcl
variable "s3_tags" {
  type        = map(string)
  description = "Tags de criacao do S3"
  default     = {}
}
```

### Uso nos recursos

```hcl
# modules/cdn/main.tf
resource "aws_cloudfront_distribution" "this" {
  tags = var.cdn_tags
  # ...
}

# modules/s3/main.tf
resource "aws_s3_bucket" "this" {
  tags = var.s3_tags
  # ...
}
```

### Passagem pelo consumidor

```hcl
module "cdn" {
  source   = "./modules/cdn"
  cdn_tags = { iac = "true" }
}

module "s3" {
  source  = "./modules/s3"
  s3_tags = { iac = "true" }
}
```

## Exemplo 3: Workflow de validacao completo

```bash
# 1. Formatar
terraform fmt

# 2. Validar sintaxe (sem API calls)
terraform validate
# Success! The configuration is valid.

# 3. Planejar (faz refresh de state)
terraform plan

# 4. Aplicar com auto-approve
terraform apply -auto-approve
```

## Exemplo 4: Erro comum — falta de atribuicao

### Errado (causa erro no validate)

```hcl
variable "cdn_price_class" {
  type        string          # FALTOU o = 
  description "Classe de preco"  # FALTOU o =
}
```

### Correto

```hcl
variable "cdn_price_class" {
  type        = string
  description = "Classe de preco"
  default     = "PriceClass_200"
}
```

## Exemplo 5: Referencia de tags errada no main.tf

### Errado (copiou do CDN sem ajustar)

```hcl
# modules/s3/main.tf
resource "aws_s3_bucket" "this" {
  tags = var.cdn_tags  # ERRADO — referencia variavel do modulo CDN
}
```

### Correto

```hcl
resource "aws_s3_bucket" "this" {
  tags = var.s3_tags  # CORRETO — referencia variavel do proprio modulo
}
```

## Exemplo 6: Estrutura de tags como map

```hcl
# Exemplo de como tags ficam na pratica
tags = {
  iac         = "true"
  environment = "staging"
  project     = "meu-projeto"
  team        = "platform"
}
```