# Code Examples: Configurando Features — Azure

## Exemplo 1: Configuracao completa do main.tf

```hcl
# Provider com features de protecao
provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = true
    }
  }
}

# Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "skillz-hmg"
  location = "Brazil South"

  tags = {
    environment = "homolog"
  }
}

# Virtual Network vinculada ao Resource Group
resource "azurerm_virtual_network" "vnet" {
  name                = "skillz-vnet"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  address_space       = ["10.0.0.0/16"]

  tags = {
    environment = "homolog"
  }
}
```

## Exemplo 2: Referencia dinamica vs hardcoded

### Errado — strings duplicadas
```hcl
resource "azurerm_virtual_network" "vnet" {
  name                = "skillz-vnet"
  resource_group_name = "skillz-hmg"      # hardcoded — vai quebrar se mudar
  location            = "Brazil South"          # hardcoded — vai quebrar se mudar
  address_space       = ["10.0.0.0/16"]
}
```

### Correto — referencia ao recurso
```hcl
resource "azurerm_virtual_network" "vnet" {
  name                = "skillz-vnet"
  resource_group_name = azurerm_resource_group.rg.name      # dinamico
  location            = azurerm_resource_group.rg.location   # dinamico
  address_space       = ["10.0.0.0/16"]
}
```

## Exemplo 3: Lifecycle prevent_destroy (alternativa multi-provider)

```hcl
resource "azurerm_resource_group" "rg" {
  name     = "skillz-hmg"
  location = "Brazil South"

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    environment = "homolog"
  }
}
```

## Exemplo 4: Fluxo completo de delecao segura via CLI

```bash
# Passo 1: Verificar o que sera deletado (VNet)
terraform plan --target=azurerm_virtual_network.vnet --destroy

# Saida esperada: "Plan: 0 to add, 0 to change, 1 to destroy."

# Passo 2: Executar delecao da VNet
terraform apply --target=azurerm_virtual_network.vnet --destroy --auto-approve

# Saida esperada: "Destroy complete! Resources: 1 destroyed."

# Passo 3: Verificar o que resta (apenas Resource Group)
terraform plan --destroy

# Saida esperada: "Plan: 0 to add, 0 to change, 1 to destroy."

# Passo 4: Deletar o Resource Group
terraform apply --destroy --auto-approve

# Saida esperada: "Destroy complete! Resources: 1 destroyed."
```

## Exemplo 5: O erro de apply sem --destroy

```bash
# Cenario: VNet ja foi deletada via --target
# Voce quer deletar o Resource Group

# ERRADO — recria a VNet!
terraform apply --auto-approve
# Resultado: "Apply complete! Resources: 1 added, 0 changed, 0 destroyed."

# CORRETO — deleta o Resource Group
terraform apply --destroy --auto-approve
# Resultado: "Destroy complete! Resources: 1 destroyed."
```

## Exemplo 6: Features disponiveis no provider azurerm

```hcl
provider "azurerm" {
  features {
    # Protecao de Resource Groups
    resource_group {
      prevent_deletion_if_contains_resources = true
    }

    # Outras features disponiveis (consultar documentacao):
    # virtual_machine { ... }
    # key_vault { ... }
    # template_deployment { ... }
    # log_analytics_workspace { ... }
  }
}
```

## Referencia: Terraform Registry

- Provider azurerm: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs
- azurerm_virtual_network: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_network
- Features reference: documentacao dedicada no provider azurerm, acessivel via pagina do provider > Features