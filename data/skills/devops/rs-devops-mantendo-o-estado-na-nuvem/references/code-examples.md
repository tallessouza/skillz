# Code Examples: Estado Remoto com S3

## Exemplo completo do arquivo variables.tf

```hcl
variable "state_bucket" {
  type        = string
  default     = "skillz-state-bucket-tf"
  description = "Bucket com o estado"
}
```

## Exemplo completo do recurso S3 para estado

```hcl
resource "aws_s3_bucket" "terraform_state" {
  bucket = var.state_bucket

  lifecycle {
    prevent_destroy = true
  }
}
```

### O que cada parte faz:

- `bucket = var.state_bucket` — nome do bucket vem da variavel (reutilizavel)
- `lifecycle { prevent_destroy = true }` — impede delecao via `terraform destroy`

## Exemplo completo do bloco backend

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket  = "skillz-state-bucket-tf"
    key     = "terraform.tfstate"
    region  = "us-east-2"
    encrypt = true
  }
}
```

### O que cada campo faz:

- `bucket` — nome do bucket S3 (hardcoded, nao aceita var)
- `key` — caminho/nome do arquivo de estado dentro do bucket
- `region` — regiao AWS do bucket
- `encrypt` — encripta o estado em repouso (server-side encryption)

## Sequencia de comandos executados na aula

```bash
# 1. Verificar o plano (criacao do bucket)
terraform plan

# 2. Aplicar para criar o bucket
terraform apply -auto-approve

# 3. Apos configurar o backend, formatar
terraform fmt

# 4. Validar a configuracao
terraform validate

# 5. Reinicializar com novo backend (dispara migracao)
terraform init
# Terraform pergunta: "Do you want to copy existing state to the new backend?"
# Responder: yes
```

## Variacao: Backend config dinamico via CLI

Para ambientes multiplos sem hardcode no arquivo:

```bash
# staging
terraform init -backend-config="bucket=empresa-state-staging-tf" \
               -backend-config="region=us-east-2" \
               -backend-config="key=staging/terraform.tfstate"

# production
terraform init -backend-config="bucket=empresa-state-prod-tf" \
               -backend-config="region=us-east-1" \
               -backend-config="key=prod/terraform.tfstate"
```

## Variacao: Backend para Azure

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfstateaccount"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}
```

## Variacao: Backend para GCP

```hcl
terraform {
  backend "gcs" {
    bucket = "minha-empresa-tf-state"
    prefix = "terraform/state"
  }
}
```

## Estrutura final dos arquivos apos a aula

```
projeto/
├── providers.tf      # required_providers + backend "s3" + resource aws_s3_bucket
├── variables.tf      # variable "state_bucket"
├── main.tf           # recursos da aplicacao
└── outputs.tf        # outputs (incluindo estado se desejado)
```