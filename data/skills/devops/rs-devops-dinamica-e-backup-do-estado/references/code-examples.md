# Code Examples: Dinâmica e Backup do Estado Terraform

## Estrutura de Diretórios com Workspaces

```
projeto-terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── .gitignore                         # Contém *.tfstate*
├── terraform.tfstate                  # Workspace default (estado atual)
├── terraform.tfstate.backup           # Workspace default (versão anterior)
└── terraform.tfstate.d/
    └── stage/
        ├── terraform.tfstate          # Workspace stage (estado atual)
        └── terraform.tfstate.backup   # Workspace stage (versão anterior)
```

## Conteúdo típico de um tfstate

```json
{
  "version": 4,
  "terraform_version": "1.5.0",
  "serial": 12,
  "lineage": "abc123-def456-...",
  "outputs": {},
  "resources": [
    {
      "module": "module.s3",
      "mode": "managed",
      "type": "aws_s3_bucket",
      "name": "example",
      "provider": "provider[\"registry.terraform.io/hashicorp/aws\"]",
      "instances": [
        {
          "schema_version": 0,
          "attributes": {
            "bucket": "meu-bucket-exemplo",
            "region": "us-east-1"
          }
        }
      ]
    }
  ]
}
```

Nota: quando é módulo, o campo `module` aparece com o path do módulo (ex: `module.s3`).

## Comandos de estado demonstrados na aula

### Listar recursos

```bash
$ terraform state list
data.aws_caller_identity.current
data.aws_region.current
module.s3.aws_s3_bucket.this
module.s3.aws_s3_bucket_versioning.this
```

Output mostra: data sources, recursos, e recursos dentro de módulos.

### Ver subcomandos disponíveis

```bash
$ terraform state
Usage: terraform state <subcommand> [options] [args]

Subcommands:
    list     List resources in the state
    mv       Move an item in the state
    pull     Pull current state and output to stdout
    push     Update remote state from a local state file
    rm       Remove instances from the state
    show     Show a resource in the state
```

## Cenário de restauração de backup

### Cenário: Apply corrompeu o estado

```bash
# 1. Verificar que o backup existe
ls -la terraform.tfstate.backup

# 2. Verificar conteúdo do backup (sanidade)
cat terraform.tfstate.backup | python3 -m json.tool | head -20

# 3. Restaurar
cp terraform.tfstate terraform.tfstate.corrupted  # Guardar corrompido para análise
cp terraform.tfstate.backup terraform.tfstate

# 4. Verificar que o estado foi restaurado
terraform state list

# 5. Rodar plan para ver se está consistente com a cloud
terraform plan
```

## Configuração de Backend Remoto (S3)

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "empresa-terraform-state"
    key            = "projeto/env/stage/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"  # Para locking
  }
}
```

### Migrar de estado local para remoto

```bash
# 1. Adicionar configuração de backend no código
# 2. Rodar init com migração
terraform init -migrate-state

# Terraform perguntará:
# "Do you want to copy existing state to the new backend?"
# Responder: yes
```

### Criar o bucket S3 para estado (antes de configurar backend)

```hcl
# Isso seria feito em um projeto separado ou manualmente
resource "aws_s3_bucket" "terraform_state" {
  bucket = "empresa-terraform-state"

  tags = {
    Name        = "Terraform State"
    Environment = "management"
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"  # Importante: versionamento para histórico de estados
  }
}

resource "aws_dynamodb_table" "terraform_lock" {
  name         = "terraform-state-lock"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
```

## .gitignore para projetos Terraform

```gitignore
# Terraform state (NUNCA comitar)
*.tfstate
*.tfstate.*
*.tfstate.backup

# Diretórios de estado por workspace
terraform.tfstate.d/

# Credenciais e variáveis sensíveis
*.tfvars
!example.tfvars

# Diretório de providers
.terraform/
.terraform.lock.hcl
```