# Code Examples: Criando Bucket S3 para Terraform State

## Exemplo 1: Criacao basica do bucket (main.tf)

Dentro do `main.tf`, apos configurar o provider AWS com a regiao:

```hcl
# Provider ja configurado
provider "aws" {
  region = "us-east-1"
}

# Bucket para armazenar o terraform state
resource "aws_s3_bucket" "terraform_state" {
  bucket        = "skillz-iac"
  force_destroy = true

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    IAC = "true"
  }
}
```

### Notas:
- `bucket` deve ser globalmente unico na AWS
- `force_destroy = true` permite cleanup quando necessario
- `prevent_destroy = true` protege contra `terraform destroy` acidental
- Tag `IAC = "true"` identifica recursos gerenciados por Terraform

## Exemplo 2: Versionamento do bucket

```hcl
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}
```

### Notas:
- Recurso separado do bucket (API do Terraform)
- Referencia o bucket via `.id` para evitar erros de nome
- `status = "Enabled"` ativa o versionamento

## Exemplo 3: Com encriptacao (mencionado como dica)

```hcl
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}
```

## Exemplo 4: Versao completa para producao

```hcl
resource "aws_s3_bucket" "terraform_state" {
  bucket        = "skillz-iac"
  force_destroy = true

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    IAC = "true"
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}
```

## Fluxo de comandos executados na aula

```bash
# 1. Planificar a criacao do bucket
terraform plan

# 2. Aplicar (criar o bucket)
terraform apply

# 3. Verificar no console AWS: S3 > skillz-iac

# 4. Adicionar versionamento, planificar novamente
terraform plan

# 5. Aplicar versionamento
terraform apply

# 6. Verificar no console: Properties > Bucket Versioning = Enabled
```

## Erro comum: nomes diferentes

```hcl
# ERRADO — causa 404
resource "aws_s3_bucket" "terraform_state" {
  bucket = "skillz-iac"
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = "skillz-city-iac"  # nome diferente = erro 404

  versioning_configuration {
    status = "Enabled"
  }
}
```

```hcl
# CORRETO — referencia direta
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id  # sempre referenciar

  versioning_configuration {
    status = "Enabled"
  }
}
```

## Deletando recursos via comentario

O instrutor mostrou que comentar um recurso no `.tf` e rodar `terraform apply` faz o Terraform destruir o recurso, sem precisar de `terraform destroy`:

```hcl
# Comentar o recurso
# resource "aws_s3_bucket_versioning" "terraform_state" {
#   ...
# }

# Rodar apply com auto-approve
# terraform apply -auto-approve
# Terraform detecta que o recurso foi removido da config e destroi
```