# Code Examples: Terraform Outputs

## Exemplo 1: Primeiro output — bucket_domain_name

```hcl
# outputs.tf
output "bucket_domain_name" {
  value       = data.aws_s3_bucket.bucket.bucket_domain_name
  sensitive   = false
  description = "Nome de dominio do bucket S3"
}
```

Saida do `terraform plan`:
```
Changes to Outputs:
  + bucket_domain_name = "meu-bucket-staging.s3.amazonaws.com"
```

Saida do `terraform apply -auto-approve`:
```
Apply complete! Resources: 0 added, 0 changed, 0 destroyed.

Outputs:

bucket_domain_name = "meu-bucket-staging.s3.amazonaws.com"
```

## Exemplo 2: Segundo output — bucket_region

```hcl
output "bucket_region" {
  value       = data.aws_s3_bucket.bucket.region
  sensitive   = false
  description = "Regiao do bucket S3"
}
```

Saida apos apply com ambos outputs:
```
Outputs:

bucket_domain_name = "meu-bucket-staging.s3.amazonaws.com"
bucket_region      = "us-east-1"
```

## Exemplo 3: Estrutura completa do projeto

```
project/
├── main.tf          # resource "aws_s3_bucket" "bucket" { ... }
├── providers.tf     # provider "aws" { ... }
├── datasources.tf   # data "aws_s3_bucket" "bucket" { ... }
├── outputs.tf       # output "bucket_domain_name" { ... }
└── variables.tf     # (futuro)
```

## Exemplo 4: Data source referenciado nos outputs

```hcl
# datasources.tf
data "aws_s3_bucket" "bucket" {
  bucket = "meu-bucket-staging"
}

# outputs.tf — acessa qualquer atributo do estado via data source
output "bucket_domain_name" {
  value       = data.aws_s3_bucket.bucket.bucket_domain_name
  sensitive   = false
  description = "Nome de dominio do bucket S3"
}

output "bucket_region" {
  value       = data.aws_s3_bucket.bucket.region
  sensitive   = false
  description = "Regiao do bucket S3"
}

output "bucket_arn" {
  value       = data.aws_s3_bucket.bucket.arn
  sensitive   = false
  description = "ARN do bucket S3"
}
```

## Exemplo 5: Output com valor sensivel

```hcl
output "database_password" {
  value       = data.aws_ssm_parameter.db_password.value
  sensitive   = true
  description = "Senha do banco de dados"
}
```

Com `sensitive = true`, o Terraform exibe:
```
Outputs:

database_password = <sensitive>
```

## Exemplo 6: Diferenca entre workspaces

```bash
# No workspace staging
terraform workspace select staging
terraform apply -auto-approve
# Output: bucket_domain_name = "meu-bucket-staging.s3.amazonaws.com"

# No workspace default
terraform workspace select default
terraform apply -auto-approve
# Output: bucket_domain_name = "meu-bucket-default.s3.amazonaws.com"
```

## Exemplo 7: Usando output em outro recurso (proximo passo)

```hcl
# Cenario futuro: output de um recurso alimenta outro
output "vpc_id" {
  value       = data.aws_vpc.main.id
  sensitive   = false
  description = "ID da VPC principal"
}

# Outro recurso usando o valor
resource "aws_subnet" "public" {
  vpc_id     = data.aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
}
```