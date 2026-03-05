# Code Examples: Criando Primeiro Recurso Azure com Terraform

## Exemplo 1: Resource Group minimo (como na aula, sem tags)

```hcl
resource "azurerm_resource_group" "rg" {
  name     = "rocketseat-hmg"
  location = "brazilsouth"
}
```

Comando para criar:
```bash
terraform plan
terraform apply -auto-approve
```

## Exemplo 2: Resource Group com tags (update feito na aula)

```hcl
resource "azurerm_resource_group" "rg" {
  name     = "rocketseat-hmg"
  location = "brazilsouth"

  tags = {
    iac = "true"
  }
}
```

Ao rodar `terraform plan` apos adicionar tags, o output mostra:
```
~ resource "azurerm_resource_group" "rg" {
    ~ tags = {
        + "iac" = "true"
      }
  }

Plan: 0 to add, 1 to change, 0 to destroy.
```

## Exemplo 3: Provider com skip_provider_registration

```hcl
provider "azurerm" {
  features {}
  skip_provider_registration = true
}

resource "azurerm_resource_group" "rg" {
  name     = "rocketseat-hmg"
  location = "brazilsouth"

  tags = {
    iac = "true"
  }
}
```

Use quando `terraform plan` travar sem output — indica problema de permissao no registro do provedor.

## Exemplo 4: Formatos de location equivalentes

```hcl
# Todos estes sao equivalentes — o provedor normaliza para o formato compacto

# Formato compacto (preferido)
location = "brazilsouth"

# Formato extenso
location = "Brazil South"

# Outros exemplos
location = "westeurope"    # ou "West Europe"
location = "eastus"        # ou "East US"
location = "centralus"     # ou "Central US"
```

## Exemplo 5: Versao com variaveis (mencionado pelo instrutor)

```hcl
# variables.tf
variable "resource_group_name" {
  description = "Nome do Resource Group"
  type        = string
}

variable "location" {
  description = "Regiao Azure"
  type        = string
  default     = "brazilsouth"
}

variable "environment" {
  description = "Ambiente (hmg, prd, dev)"
  type        = string
}

# main.tf
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    iac         = "true"
    environment = var.environment
  }
}

# terraform.tfvars
resource_group_name = "rocketseat-hmg"
location            = "brazilsouth"
environment         = "homologacao"
```

## Exemplo 6: Multiplos Resource Groups por ambiente

```hcl
resource "azurerm_resource_group" "hmg" {
  name     = "meu-projeto-hmg"
  location = "brazilsouth"

  tags = {
    iac         = "true"
    environment = "homologacao"
  }
}

resource "azurerm_resource_group" "prd" {
  name     = "meu-projeto-prd"
  location = "brazilsouth"

  tags = {
    iac         = "true"
    environment = "producao"
  }
}
```

## Fluxo completo de comandos

```bash
# 1. Inicializar (ja deve ter sido feito)
terraform init

# 2. Verificar o que sera criado
terraform plan

# 3. Criar o recurso
terraform apply -auto-approve

# 4. Apos modificar o codigo (ex: adicionar tags)
terraform plan              # ver o diff
terraform apply -auto-approve  # aplicar a mudanca
```

## Regioes Azure disponiveis no Brasil

| Regiao | Codigo | Cidade | Zonas |
|--------|--------|--------|-------|
| Brazil South | `brazilsouth` | Sao Paulo | 3 |

Para ver todas as regioes: [Azure Geographies](https://azure.microsoft.com/explore/global-infrastructure/geographies)