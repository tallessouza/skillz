---
name: rs-devops-configurando-provider-azure
description: "Applies Azure provider configuration patterns when writing Terraform code for Azure infrastructure. Use when user asks to 'configure Azure provider', 'setup Terraform for Azure', 'create Azure resources with Terraform', or 'add azurerm provider'. Covers required_providers block, features block, skip_provider_registration, resource groups, and Azure CLI authentication. Make sure to use this skill whenever generating Terraform code targeting Azure. Not for AWS or GCP provider configuration, nor for Azure Portal UI operations."
---

# Configurando Provider Azure no Terraform

> Configure o provider azurerm com required_providers, features block e autenticacao via Azure CLI antes de criar qualquer recurso.

## Rules

1. **Sempre declare required_providers com source e version** — `hashicorp/azurerm` com versao pinada, porque sem version pinada o Terraform pode baixar uma versao incompativel
2. **Sempre declare o bloco provider com features** — mesmo vazio, o bloco `features {}` e obrigatorio no azurerm, porque sem ele o provider nao inicializa
3. **Separe providers em arquivo dedicado** — use `providers.tf` para o bloco terraform/required_providers e declaracao do provider, porque facilita navegacao e segue convencao da comunidade
4. **Use Resource Groups como agrupador logico** — todo recurso Azure pertence a um Resource Group, similar ao Project do GCP, porque deletar o Resource Group deleta todos os recursos em cascata
5. **Configure features de protecao** — use flags como `prevent_deletion_if_contains_resources` no resource_group dentro de features, porque evita delecao acidental em cascata
6. **Autentique via Azure CLI** — execute `az login` antes de `terraform plan`, porque o provider azurerm usa as credenciais da CLI por padrao

## How to write

### Bloco required_providers

```hcl
# providers.tf
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.93.0"
    }
  }
}

provider "azurerm" {
  features {}
}
```

### Features com protecao de Resource Group

```hcl
provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = true
    }
  }
}
```

### Recurso basico com Resource Group

```hcl
# main.tf
resource "azurerm_resource_group" "example" {
  name     = "rg-example"
  location = "East US"
}

resource "azurerm_network_interface" "example" {
  name                = "nic-example"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.example.id
    private_ip_address_allocation = "Dynamic"
  }
}
```

## Example

**Before (incompleto, vai falhar):**
```hcl
provider "azurerm" {}

resource "azurerm_resource_group" "main" {
  name     = "rg-main"
  location = "East US"
}
```

**After (com this skill applied):**
```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.93.0"
    }
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = true
    }
  }
}

resource "azurerm_resource_group" "main" {
  name     = "rg-main"
  location = "East US"
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Primeiro setup Azure | Crie `providers.tf` + `main.tf`, configure CLI com `az login` |
| Precisa de recurso Azure | Crie Resource Group primeiro, associe recursos a ele |
| Documentacao de recurso | Busque por `azurerm_{recurso}` no Terraform Registry |
| Ambiente de producao | Ative `prevent_deletion_if_contains_resources` nas features |
| `skip_provider_registration` | Use quando seu usuario nao tem permissao para registrar providers na subscription |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `provider "azurerm" {}` sem features | `provider "azurerm" { features {} }` |
| Version sem pinar | `version = "3.93.0"` (versao exata) |
| Recursos sem Resource Group | Sempre associe a um `azurerm_resource_group` |
| Tudo em um unico `.tf` | Separe em `providers.tf` e `main.tf` |
| Credenciais hardcoded no provider | Use `az login` ou service principal via env vars |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-conhecendo-e-configurando-provider-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-conhecendo-e-configurando-provider-1/references/code-examples.md)
