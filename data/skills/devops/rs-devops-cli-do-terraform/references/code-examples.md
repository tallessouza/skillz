# Code Examples: Terraform CLI

## Exemplo 1: Arquivo `providers.tf` basico

Este e o arquivo criado na aula para configurar o provider AWS:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  # Configuracao via AWS CLI/SSO
}
```

**Detalhes:**
- O bloco `terraform.required_providers` declara qual provider sera usado
- `source = "hashicorp/aws"` aponta para o registry oficial
- `version` trava a versao para evitar breaking changes
- O bloco `provider "aws" {}` fica vazio quando a autenticacao e externa (SSO/CLI)

## Exemplo 2: Fluxo completo de inicializacao

```bash
# 1. Criar diretorio com nome explicito de IaC
mkdir meu-projeto-iac
cd meu-projeto-iac

# 2. Criar providers.tf (conteudo acima)

# 3. Inicializar — baixa plugins do provider
terraform init
# Output: Initializing provider plugins...
#         - Installing hashicorp/aws v5.x.x...
#         Terraform has been successfully initialized!

# 4. Verificar arquivos gerados
ls -la
# .terraform/          <- pasta com plugins baixados
# .terraform.lock.hcl  <- lock de versoes
# providers.tf         <- nosso arquivo
```

## Exemplo 3: Init em diretorio vazio vs com provider

**Sem provider (diretorio vazio):**
```bash
terraform init
# Terraform initialized in an empty directory!
# (nenhum plugin baixado)
```

**Com provider configurado:**
```bash
terraform init
# Initializing provider plugins...
# - Finding hashicorp/aws versions matching "~> 5.0"...
# - Installing hashicorp/aws v5.x.x...
# Terraform has been successfully initialized!
```

A diferenca e significativa — com o provider, o init baixa os plugins necessarios e cria a infraestrutura local de trabalho.

## Exemplo 4: Fluxo plan → apply para criar recurso

```bash
# Apos criar um recurso (ex: S3 bucket) em um arquivo .tf:

# Dry run — mostra o que sera criado
terraform plan
# Plan: 1 to add, 0 to change, 0 to destroy.

# Executar de fato
terraform apply
# Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

## Exemplo 5: Fluxo de destruicao

```bash
# Mostra o que sera deletado e executa
terraform destroy
# Plan: 0 to add, 0 to change, 1 to destroy.
# (pede confirmacao antes de deletar)
```

## Exemplo 6: Validacao de sintaxe

```bash
terraform validate
# Success! The configuration is valid.

# Se houver erro de sintaxe:
terraform validate
# Error: Missing required argument
#   on main.tf line 5, in resource "aws_s3_bucket" "example":
```

## Convencoes de nomenclatura para repos IaC

```
# Opcoes aceitas:
meu-projeto-iac      # sufixo -iac (usado no curso)
meu-projeto.iac      # sufixo .iac
meu-projeto.infra    # sufixo .infra

# NAO fazer:
meu-projeto          # sem indicacao de que e IaC
infra                # generico demais
terraform-stuff      # nao descreve o projeto
```