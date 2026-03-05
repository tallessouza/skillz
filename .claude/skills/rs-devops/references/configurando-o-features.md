---
name: rs-devops-configurando-o-features
description: "Applies Azure provider features configuration and safe resource deletion patterns in Terraform. Use when user asks to 'configure Azure provider', 'delete resource group', 'prevent accidental deletion', 'create virtual network', or 'link resources to resource group'. Enforces prevent_deletion_if_contains_resources feature, cascaded deletion order, and dynamic resource referencing. Make sure to use this skill whenever writing Terraform code for Azure resource groups or configuring Azure provider features. Not for AWS, GCP, or non-Terraform infrastructure code."
---

# Configurando Features — Azure Provider no Terraform

> Ao configurar recursos Azure no Terraform, vincule recursos via referencia dinamica ao Resource Group e proteja contra delecao acidental usando features do provider.

## Rules

1. **Sempre referencie Resource Group dinamicamente** — use `azurerm_resource_group.rg.name` e `.location`, nunca copie strings, porque evita inconsistencia quando o nome muda
2. **Configure prevent_deletion_if_contains_resources** — no bloco `features` do provider, porque impede delecao acidental de resource groups que contenham recursos ativos
3. **Delete recursos filhos antes do Resource Group** — use `terraform plan --target --destroy` no recurso filho primeiro, porque o Azure deleta tudo dentro do RG se voce deletar o RG diretamente
4. **Bloco features e obrigatorio no provider azurerm** — mesmo vazio, o atributo `features {}` precisa existir na configuracao do provider
5. **Sempre passe --destroy junto com --auto-approve** — ao deletar recursos via CLI, porque rodar `apply --auto-approve` sem `--destroy` recria recursos deletados do state
6. **Use tags em todos os recursos** — para rastreabilidade e organizacao no portal Azure

## How to write

### Provider com features de protecao

```hcl
provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = true
    }
  }
}
```

### Virtual Network vinculada ao Resource Group

```hcl
resource "azurerm_resource_group" "rg" {
  name     = "skillz-hmg"
  location = "Brazil South"
  tags     = { environment = "homolog" }
}

resource "azurerm_virtual_network" "vnet" {
  name                = "skillz-vnet"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  address_space       = ["10.0.0.0/16"]
  tags                = { environment = "homolog" }
}
```

### Delecao segura em cascata

```bash
# 1. Deletar recurso filho primeiro
terraform plan --target=azurerm_virtual_network.vnet --destroy
terraform apply --target=azurerm_virtual_network.vnet --destroy --auto-approve

# 2. Depois deletar o resource group
terraform plan --destroy
terraform apply --destroy --auto-approve
```

## Example

**Before (referencia hardcoded, sem protecao):**
```hcl
provider "azurerm" {
  features {}
}

resource "azurerm_virtual_network" "vnet" {
  name                = "skillz-vnet"
  resource_group_name = "skillz-hmg"
  location            = "Brazil South"
  address_space       = ["10.0.0.0/16"]
}
```

**After (referencia dinamica, com protecao):**
```hcl
provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = true
    }
  }
}

resource "azurerm_virtual_network" "vnet" {
  name                = "skillz-vnet"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  address_space       = ["10.0.0.0/16"]
  tags                = { environment = "homolog" }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Criar qualquer recurso Azure | Referencie `azurerm_resource_group.rg.name` e `.location` |
| Deletar resource group com recursos dentro | Delete filhos com `--target --destroy` primeiro |
| Ambiente de producao | Ative `prevent_deletion_if_contains_resources = true` |
| Precisa proteger recurso individual | Use `lifecycle { prevent_destroy = true }` no recurso |
| Rodou apply sem --destroy por engano | Rode `apply --destroy --auto-approve` para corrigir |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `resource_group_name = "nome-hardcoded"` | `resource_group_name = azurerm_resource_group.rg.name` |
| `location = "Brazil South"` (em recurso filho) | `location = azurerm_resource_group.rg.location` |
| `terraform apply --auto-approve` (para deletar) | `terraform apply --destroy --auto-approve` |
| `features {}` em producao sem protecoes | `features { resource_group { prevent_deletion_if_contains_resources = true } }` |
| Deletar resource group direto | Deletar recursos filhos primeiro com `--target` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-configurando-o-features/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-configurando-o-features/references/code-examples.md)
