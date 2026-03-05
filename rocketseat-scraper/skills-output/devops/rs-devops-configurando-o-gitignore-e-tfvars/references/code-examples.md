# Code Examples: Configurando .gitignore e .tfvars

## Exemplo 1: .gitignore completo da aula

O instrutor criou o arquivo na raiz do projeto Terraform:

```gitignore
# Arquivos de estado do Terraform
*.tfstate
*.tfstate.backup

# Diretório de workspace
terraform.tfstate.d/

# Diretório local (cache de providers e módulos)
.terraform/*

# Arquivos de variáveis (contêm valores sensíveis)
*.tfvars
*.tfvars.json
```

**Nota:** O `.terraform.lock.hcl` NÃO está no gitignore — ele deve ser versionado.

## Exemplo 2: terraform.tfvars

```hcl
# terraform.tfvars
state_bucket = "rocketseat-state-bucket-tf"
```

Este arquivo sobrescreve o valor `default` definido em `variables.tf`:

```hcl
# variables.tf
variable "state_bucket" {
  description = "Nome do bucket para armazenar o state"
  type        = string
  default     = "meu-bucket-padrao"
}
```

## Exemplo 3: Demonstração de sobrescrita

### Antes (usando default)
```bash
$ terraform plan
# No changes. Your infrastructure matches the configuration.
```

### Mudando o valor no .tfvars
```hcl
# terraform.tfvars
state_bucket = "outro-nome-de-bucket"
```

### Resultado do plan
```bash
$ terraform plan
# Terraform will perform the following actions:
#   ~ aws_s3_bucket.state must be replaced
#     - name = "rocketseat-state-bucket-tf" -> "outro-nome-de-bucket"
# Plan: 1 to add, 0 to change, 1 to destroy.
```

O Terraform detecta que o nome mudou e propõe destruir e recriar. Se o recurso tem `lifecycle { prevent_destroy = true }`, a operação é bloqueada.

### Voltando ao valor correto
```hcl
# terraform.tfvars
state_bucket = "rocketseat-state-bucket-tf"
```

```bash
$ terraform plan
# No changes. Your infrastructure matches the configuration.
```

## Exemplo 4: Fluxo completo de verificação

```bash
# 1. Criar os arquivos
touch .gitignore terraform.tfvars

# 2. Configurar o gitignore (com conteúdo acima)

# 3. Verificar que funciona
git status
# .gitignore aparece (será commitado)
# terraform.tfvars NÃO aparece (ignorado)
# *.tfstate NÃO aparece (ignorado)
# .terraform/ NÃO aparece (ignorado)
# .terraform.lock.hcl APARECE (será commitado)

# 4. Commitar
git add .gitignore .terraform.lock.hcl
git commit -m "chore: configure gitignore and lock file for terraform"

# 5. Verificar ambiente limpo
git status
# nothing to commit, working tree clean
```

## Exemplo 5: Múltiplas variáveis no .tfvars

Para projetos mais complexos com várias variáveis:

```hcl
# variables.tf
variable "state_bucket" {
  type    = string
  default = "default-state-bucket"
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}
```

```hcl
# terraform.tfvars
state_bucket  = "minha-empresa-state-bucket-tf"
region        = "sa-east-1"
environment   = "production"
instance_type = "t3.medium"
```

Todos os valores do `.tfvars` sobrescrevem os respectivos `default` values.