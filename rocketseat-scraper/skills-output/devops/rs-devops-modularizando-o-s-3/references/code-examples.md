# Code Examples: Modularizando o S3

## Exemplo 1: Estrutura completa de pastas

```
projeto/
├── main.tf              # Root — declara modules
├── modules/
│   └── s3/
│       ├── main.tf      # Recurso aws_s3_bucket
│       ├── variables.tf # Inputs (s3_bucket)
│       └── outputs.tf   # Outputs (bucket_domain_name)
```

## Exemplo 2: modules/s3/main.tf

```hcl
resource "aws_s3_bucket" "bucket" {
  bucket = "${var.s3_bucket}-${terraform.workspace}"

  tags = {
    Name        = var.s3_bucket
    Environment = terraform.workspace
  }
}
```

**Pontos-chave:**
- `var.s3_bucket` — vem de `variables.tf`, passado pelo consumidor
- `terraform.workspace` — variavel built-in do Terraform, retorna o workspace ativo (ex: "staging")
- Interpolacao `"${var.s3_bucket}-${terraform.workspace}"` gera nomes como `rocketseat-staging`

## Exemplo 3: modules/s3/variables.tf

```hcl
variable "s3_bucket" {
  type        = string
  description = "Nome do bucket S3"
}
```

**Pontos-chave:**
- Sem `default` — torna a variavel obrigatoria
- `type = string` — validacao de tipo
- `description` — documenta o proposito da variavel

## Exemplo 4: modules/s3/outputs.tf

```hcl
output "bucket_domain_name" {
  value       = aws_s3_bucket.bucket.bucket_domain_name
  sensitive   = false
  description = "Dominio do bucket para configuracao do CloudFront"
}
```

**Pontos-chave:**
- `aws_s3_bucket.bucket.bucket_domain_name` — referencia o atributo do recurso criado em `main.tf`
- `sensitive = false` — o valor aparece no output do `terraform apply`
- Este output sera consumido pelo modulo CloudFront na proxima aula

## Exemplo 5: Root main.tf consumindo o modulo

```hcl
module "s3" {
  source = "./modules/s3"

  s3_bucket = "rocketseat"
}
```

**Pontos-chave:**
- `source` — caminho relativo para o modulo local
- `s3_bucket` — passa valor para a variavel declarada no modulo
- O nome `"s3"` no bloco module e usado para referenciar outputs: `module.s3.bucket_domain_name`

## Exemplo 6: Erro ao passar variavel nao declarada

```hcl
# Isso causa ERRO:
module "s3" {
  source = "./modules/s3"

  s3_bucket = "rocketseat"
  url       = "https://example.com"  # NAO existe em variables.tf
}
```

Erro: `An argument named "url" is not expected here.`

## Exemplo 7: Fluxo de comandos

```bash
# 1. Apos criar/alterar modulo, inicializar
terraform init

# 2. Verificar o plano
terraform plan

# 3. Corrigir formatacao
terraform fmt

# 4. Se token AWS expirou
aws sso login
```

## Exemplo 8: Consumindo output do modulo S3 no CloudFront (preview)

```hcl
# Sera feito na proxima aula
module "cloudfront" {
  source = "./modules/cloudfront"

  origin_domain = module.s3.bucket_domain_name
}
```

Este padrao mostra como outputs de um modulo alimentam inputs de outro — a essencia da composicao modular no Terraform.