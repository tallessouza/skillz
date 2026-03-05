# Code Examples: Terraform Modules

## Exemplo 1: Usando modulo externo do S3 Bucket

Este e o exemplo mostrado na aula, usando o modulo do Terraform Registry:

```hcl
module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = var.bucket_name
  acl    = "private"

  control_object_ownership = true
  object_ownership         = "ObjectWriter"
}
```

### Anatomia do bloco `module`

- `module "s3_bucket"` — palavra reservada `module` + nome local do modulo
- `source` — de onde vem o modulo (Registry, GitHub, path local)
- Demais campos — variaveis expostas pelo modulo que voce configura

### Variacoes do mesmo modulo

O instrutor mostra que o modulo S3 suporta diferentes cenarios:

```hcl
# Bucket privado (mais simples)
module "s3_private" {
  source = "terraform-aws-modules/s3-bucket/aws"
  bucket = "my-private-bucket"
  acl    = "private"
}

# Bucket com logging para ELB
module "s3_elb_logs" {
  source = "terraform-aws-modules/s3-bucket/aws"
  bucket = "my-elb-logs-bucket"
  acl    = "log-delivery-write"
}

# Bucket com logging para ALB
module "s3_alb_logs" {
  source = "terraform-aws-modules/s3-bucket/aws"
  bucket = "my-alb-logs-bucket"
  acl    = "log-delivery-write"
}
```

## Exemplo 2: Estrutura de um modulo interno

```
# Estrutura de diretorios
infrastructure/
├── main.tf                    # Root — chama os modulos
├── variables.tf               # Variaveis globais
├── outputs.tf                 # Outputs globais
├── terraform.tfvars           # Valores das variaveis
└── modules/
    └── s3-bucket/
        ├── main.tf            # Recursos do modulo
        ├── variables.tf       # Interface de entrada
        └── outputs.tf         # Interface de saida
```

### modules/s3-bucket/variables.tf
```hcl
variable "bucket_name" {
  description = "Nome do bucket S3"
  type        = string
}

variable "acl" {
  description = "ACL do bucket"
  type        = string
  default     = "private"
}

variable "tags" {
  description = "Tags para o bucket"
  type        = map(string)
  default     = {}
}
```

### modules/s3-bucket/main.tf
```hcl
resource "aws_s3_bucket" "this" {
  bucket = var.bucket_name
  tags   = var.tags
}

resource "aws_s3_bucket_acl" "this" {
  bucket = aws_s3_bucket.this.id
  acl    = var.acl
}
```

### modules/s3-bucket/outputs.tf
```hcl
output "bucket_id" {
  description = "ID do bucket criado"
  value       = aws_s3_bucket.this.id
}

output "bucket_arn" {
  description = "ARN do bucket criado"
  value       = aws_s3_bucket.this.arn
}
```

### main.tf (root — consumindo o modulo)
```hcl
module "app_bucket" {
  source      = "./modules/s3-bucket"
  bucket_name = "my-app-assets"
  acl         = "private"
  tags = {
    Environment = "production"
    Team        = "platform"
  }
}

module "logs_bucket" {
  source      = "./modules/s3-bucket"
  bucket_name = "my-app-logs"
  acl         = "log-delivery-write"
  tags = {
    Environment = "production"
    Team        = "platform"
  }
}
```

## Exemplo 3: Sources de modulo

```hcl
# Terraform Registry
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"
}

# GitHub
module "custom" {
  source = "github.com/minha-org/terraform-module-custom"
}

# Path local
module "internal" {
  source = "./modules/meu-modulo"
}

# S3 bucket como source
module "from_s3" {
  source = "s3::https://s3-eu-west-1.amazonaws.com/bucket/module.zip"
}
```

## Comparacao: sem modulo vs com modulo

### Sem modulo (duplicata)
```hcl
# env/production/main.tf
resource "aws_s3_bucket" "app" {
  bucket = "prod-app-assets"
  tags   = { Environment = "production" }
}
resource "aws_s3_bucket_acl" "app" {
  bucket = aws_s3_bucket.app.id
  acl    = "private"
}

# env/staging/main.tf  (DUPLICADO!)
resource "aws_s3_bucket" "app" {
  bucket = "staging-app-assets"
  tags   = { Environment = "staging" }
}
resource "aws_s3_bucket_acl" "app" {
  bucket = aws_s3_bucket.app.id
  acl    = "private"
}
```

### Com modulo (reutilizacao)
```hcl
# env/production/main.tf
module "app_bucket" {
  source      = "../../modules/s3-bucket"
  bucket_name = "prod-app-assets"
  tags        = { Environment = "production" }
}

# env/staging/main.tf
module "app_bucket" {
  source      = "../../modules/s3-bucket"
  bucket_name = "staging-app-assets"
  tags        = { Environment = "staging" }
}
```

Agora, se precisar mudar a configuracao do bucket (ex: adicionar versionamento), muda **uma vez** no modulo e todos os ambientes recebem a atualizacao.