---
name: rs-devops-criando-primeiro-recurso-azure
description: "Applies Terraform resource creation patterns for Azure when writing infrastructure-as-code. Use when user asks to 'create azure resource', 'terraform azure', 'resource group terraform', 'azure rm', or 'provision azure infrastructure'. Enforces correct location format, tag best practices, and provider troubleshooting. Make sure to use this skill whenever generating Terraform code targeting Azure, even for simple resources. Not for AWS, GCP, Kubernetes, or non-Terraform Azure CLI provisioning."
---

# Criando Recursos no Azure com Terraform

> Sempre consulte a documentacao do provedor Azure RM antes de criar qualquer recurso, e siga o padrao: resource type, apelido, argumentos obrigatorios, tags.

## Rules

1. **Consulte a documentacao do provedor** — acesse a doc do `azurerm` no Terraform Registry antes de escrever o bloco resource, porque cada recurso tem argumentos obrigatorios especificos
2. **Sempre passe tags** — mesmo que o recurso funcione sem tags, adicione-as na criacao, porque e boa pratica para organizacao, billing e governanca
3. **Use o formato compacto para location** — `brazilsouth` em vez de `Brazil South`, porque o provedor normaliza internamente e o formato compacto evita inconsistencias
4. **Nomeie resources com apelido descritivo** — `rg` para resource group, `vnet` para virtual network, porque facilita referencia cruzada no codigo
5. **Use nomes que indiquem ambiente** — `rocketseat-hmg`, `app-prd`, porque separa recursos por escopo (homologacao, producao)
6. **Rode plan antes de apply** — sempre `terraform plan` antes de `terraform apply -auto-approve`, porque visualizar mudancas previne erros destrutivos

## How to write

### Resource Group basico

```hcl
resource "azurerm_resource_group" "rg" {
  name     = "meu-projeto-hmg"
  location = "brazilsouth"

  tags = {
    iac = "true"
  }
}
```

### Location — formatos aceitos

```hcl
# Formato compacto (preferido)
location = "brazilsouth"

# Formato extenso (aceito, normalizado pelo provedor)
location = "Brazil South"
```

### Troubleshooting — skip provider registration

```hcl
provider "azurerm" {
  features {}
  skip_provider_registration = true
}
```

## Example

**Before (sem tags, formato inconsistente):**

```hcl
resource "azurerm_resource_group" "example" {
  name     = "meurg"
  location = "Brazil South"
}
```

**After (com tags, formato compacto, nome descritivo):**

```hcl
resource "azurerm_resource_group" "rg" {
  name     = "meu-projeto-hmg"
  location = "brazilsouth"

  tags = {
    iac         = "true"
    environment = "homologacao"
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Criando qualquer recurso Azure | Consulte a doc do provedor para args obrigatorios |
| Escolhendo location | Use o site de geografia Azure para ver regioes e zonas disponiveis |
| Projeto no Brasil | Use `brazilsouth` (Sao Paulo, 3 zonas de disponibilidade, desde 2014) |
| `terraform plan` travou sem output | Adicione `skip_provider_registration = true` no provider |
| Recurso criado sem tags | Faca update adicionando tags — Terraform detecta e aplica o diff |
| Precisa de valor dinamico | Use `terraform.tfvars` para locations, nomes e tags |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Resource sem tags | Resource com pelo menos `iac = "true"` |
| `terraform apply` sem `plan` antes | `terraform plan` → analise → `terraform apply -auto-approve` |
| Nome generico `example` no apelido | Apelido descritivo: `rg`, `vnet`, `nic` |
| Nome de recurso sem indicar ambiente | Nome com sufixo: `-hmg`, `-prd`, `-dev` |
| Hardcoded values repetidos | Variaveis em `terraform.tfvars` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
