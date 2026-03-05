# Code Examples: Habilitando Versionamento do Estado Terraform

## Exemplo completo da aula

Configuracao do bucket de estado com versionamento habilitado:

```hcl
# Bucket para armazenar o estado Terraform
resource "aws_s3_bucket" "terraform_state" {
  bucket = "skillz-devops-terraform-state"
}

# Habilitar versionamento no bucket de estado
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.bucket

  versioning_configuration {
    status = "Enabled"
  }

  depends_on = [aws_s3_bucket.terraform_state]
}
```

## Fluxo de execucao

### 1. Verificar o plano
```bash
terraform plan
```
Output esperado: 1 recurso a ser adicionado (`aws_s3_bucket_versioning.terraform_state`).

### 2. Aplicar
```bash
terraform apply -auto-approve
```

### 3. Validar conciliacao
```bash
terraform plan
```
Output esperado: `No changes. Your infrastructure matches the configuration.`

## Referencia da documentacao

O recurso `aws_s3_bucket_versioning` aceita:

```hcl
resource "aws_s3_bucket_versioning" "example" {
  bucket = aws_s3_bucket.example.id

  versioning_configuration {
    status     = "Enabled"    # ou "Suspended" para desabilitar
    mfa_delete = "Disabled"   # opcional: requer MFA para deletar versoes
  }
}
```

### Opcoes de status
| Valor | Efeito |
|-------|--------|
| `"Enabled"` | Cada PUT gera nova versao do objeto |
| `"Suspended"` | Para de gerar novas versoes, mantem existentes |

## Verificacao via AWS CLI

```bash
# Verificar se versionamento esta habilitado
aws s3api get-bucket-versioning --bucket meu-bucket-terraform-state

# Listar versoes do arquivo de estado
aws s3api list-object-versions --bucket meu-bucket-terraform-state --prefix terraform.tfstate
```

## Configuracao completa de backend (contexto)

```hcl
terraform {
  backend "s3" {
    bucket = "skillz-devops-terraform-state"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}
```