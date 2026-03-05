# Code Examples: Terraform Workspaces

## Exemplo 1: Fluxo completo de criacao de workspace

```bash
# Verificar workspace atual
$ terraform workspace show
default

# Criar workspace staging
$ terraform workspace new staging
# Output: Created and switched to workspace "staging"!

# Confirmar mudanca
$ terraform workspace show
staging

# Listar todos os workspaces
$ terraform workspace list
  default
* staging
# O asterisco indica o workspace ativo
```

## Exemplo 2: Recurso sem interpolacao (problema)

```hcl
# main.tf — VAI CAUSAR CONFLITO entre workspaces
resource "aws_s3_bucket" "bucket" {
  bucket = "skillz-bucket-iac"
}
```

```bash
# No workspace staging:
$ terraform workspace select staging
$ terraform apply -auto-approve
# Cria o bucket com sucesso

# No workspace default:
$ terraform workspace select default
$ terraform apply -auto-approve
# ERRO 409 — bucket ja existe na AWS
```

## Exemplo 3: Recurso com interpolacao (solucao)

```hcl
# main.tf — nome unico por workspace
resource "aws_s3_bucket" "bucket" {
  bucket = "skillz-bucket-iac-${terraform.workspace}"

  tags = {
    Context = terraform.workspace
  }
}
```

```bash
# No workspace default:
$ terraform workspace select default
$ terraform plan
# Mostra: skillz-bucket-iac-default

$ terraform apply -auto-approve
# Cria bucket "skillz-bucket-iac-default"

# No workspace staging:
$ terraform workspace select staging
$ terraform plan
# Mostra: mudanca de "skillz-bucket-iac" para "skillz-bucket-iac-staging"
# (se o bucket antigo existia, fara destroy + create)

$ terraform apply -auto-approve
# Resultado: destroy do antigo, create do novo com nome "-staging"
```

## Exemplo 4: Estrutura de arquivos resultante

```
projeto/
├── main.tf
├── terraform.tfstate              # Estado do workspace DEFAULT
├── terraform.tfstate.d/
│   └── staging/
│       └── terraform.tfstate      # Estado do workspace STAGING
└── .terraform/
    └── environment                # Indica workspace ativo (ex: "staging")
```

## Exemplo 5: Alternando entre workspaces

```bash
# Selecionar workspace existente
$ terraform workspace select default
Switched to workspace "default".

# Rodar plan no contexto default
$ terraform plan
# Mostra recursos conforme estado do workspace default

# Voltar para staging
$ terraform workspace select staging
$ terraform plan
# Mostra recursos conforme estado do workspace staging
```

## Exemplo 6: Uso avancado — provider por workspace

```hcl
# Exemplo conceitual: contas AWS diferentes por workspace
provider "aws" {
  region  = "us-east-1"
  profile = terraform.workspace == "production" ? "prod-account" : "dev-account"
}

resource "aws_s3_bucket" "bucket" {
  bucket = "minha-app-${terraform.workspace}"
}
```