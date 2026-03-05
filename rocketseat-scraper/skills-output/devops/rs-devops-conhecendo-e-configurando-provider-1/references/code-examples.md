# Code Examples: Configurando Provider Azure no Terraform

## Exemplo 1: Configuracao minima do provider

Este e o setup minimo para iniciar um projeto Terraform com Azure.

### providers.tf
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
  features {}
}
```

### main.tf
```hcl
# Arquivo vazio inicialmente, recursos serao adicionados aqui
```

### Validacao
```bash
# Acessar o diretorio do projeto
cd iac-azure

# Inicializar o Terraform — valida source e version do provider
terraform init
```

Saida esperada: Terraform encontra o provider `hashicorp/azurerm` na versao `3.93.0` e inicializa com sucesso.

## Exemplo 2: Provider com features de protecao

```hcl
provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = true
    }
  }
}
```

Com essa configuracao, tentar executar `terraform destroy` em um Resource Group que contem recursos vai falhar. Voce precisa destruir os recursos individuais primeiro.

## Exemplo 3: Provider com skip_provider_registration

```hcl
provider "azurerm" {
  skip_provider_registration = true

  features {}
}
```

Use quando seu usuario Azure nao tem permissao de `Microsoft.Resources/register/action` na subscription.

## Exemplo 4: Estrutura completa de projeto

```
iac-azure/
├── providers.tf    # terraform block + provider declaration
├── main.tf         # resource definitions
└── .terraform/     # gerado pelo terraform init
```

## Exemplo 5: Autenticacao via Azure CLI

```bash
# Instalar Azure CLI (macOS)
brew install azure-cli

# Fazer login (abre navegador com SSO Microsoft)
az login

# Verificar conta logada
az account show

# Agora o Terraform pode usar as credenciais
terraform plan
```

## Exemplo 6: Criando Resource Group + recurso associado

```hcl
# main.tf
resource "azurerm_resource_group" "example" {
  name     = "rg-example"
  location = "East US"
}

# Network interface associada ao Resource Group
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

Note que `location` e `resource_group_name` referenciam o Resource Group criado — todo recurso Azure precisa dessa associacao.

## Exemplo 7: Buscando documentacao de recursos

Para criar uma Virtual Machine Azure, busque no Terraform Registry:

```
azurerm_virtual_machine
```

Ou mais moderno:

```
azurerm_linux_virtual_machine
azurerm_windows_virtual_machine
```

A documentacao mostra o bloco HCL completo com todos os argumentos obrigatorios e opcionais.