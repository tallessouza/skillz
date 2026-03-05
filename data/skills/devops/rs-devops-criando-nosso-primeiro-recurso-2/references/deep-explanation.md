# Deep Explanation: Criando Primeiro Recurso Azure com Terraform

## Pre-requisitos que o instrutor assume

Antes de criar recursos, tres coisas ja devem estar prontas:
1. **Provedor configurado** — bloco `provider "azurerm"` no `main.tf`
2. **Azure CLI instalada** — `az` disponivel no terminal
3. **Autenticacao feita** — `az login` executado com sucesso
4. **Terraform init** — `terraform init` ja rodado para baixar o provedor

## Por que consultar a documentacao do provedor

O instrutor enfatiza que o primeiro passo e ir na documentacao do `azurerm` no Terraform Registry. Cada recurso tem argumentos obrigatorios (`required`) e opcionais. Para o `azurerm_resource_group`:
- `name` — obrigatorio
- `location` — obrigatorio
- `managed_by` — opcional (nao usado na aula)
- `tags` — opcional (mas boa pratica)

## Anatomia de um bloco resource

```hcl
resource "azurerm_resource_group" "rg" {
  name     = "skillz-hmg"
  location = "brazilsouth"
}
```

- `resource` — keyword do Terraform
- `"azurerm_resource_group"` — tipo do recurso (vem do provedor)
- `"rg"` — apelido/label interno do Terraform (para referencia cruzada)
- Argumentos dentro do bloco — os parametros do recurso

## Location: dois formatos, mesmo resultado

O provedor Azure aceita dois formatos para location:
1. **Extenso:** `"Brazil South"`, `"West Europe"`, `"East US"`
2. **Compacto:** `"brazilsouth"`, `"westeurope"`, `"eastus"`

O provedor **sempre normaliza** para o formato compacto internamente. Se voce passar `"Brazil South"`, ele converte para `"brazilsouth"`. O instrutor recomenda usar o compacto diretamente para evitar confusao.

## Geografia Azure — zonas de disponibilidade

O conceito e identico ao da AWS e GCP:
- **Regiao** = localizacao geografica (ex: `brazilsouth` = Sao Paulo)
- **Zonas de disponibilidade** = data centers independentes dentro da regiao

Brazil South: 3 zonas, aberto em 2014, localizado em Sao Paulo. O site oficial da Azure (`azure.microsoft.com/explore/global-infrastructure/geographies`) mostra todas as regioes com detalhes de compliance, LGPD, e zonas.

## Tags como boa pratica

O instrutor criou o resource group primeiro SEM tags, depois adicionou via update para demonstrar:
1. Terraform detecta o diff automaticamente (`plan` mostra "update in-place")
2. Tags sao um mapa de strings: `tags = { key = "value" }`
3. Minimo recomendado: `iac = "true"` para indicar que o recurso e gerenciado por IaC

## Troubleshooting: plan travado

Se `terraform plan` travar sem output, o problema e permissionamento de registro de provedor na Azure. A solucao:

```hcl
provider "azurerm" {
  features {}
  skip_provider_registration = true
}
```

Isso forca o provedor a pular a validacao de registro. E uma questao de permissoes da conta Azure — se o usuario nao tem permissao de `Microsoft.Resources/register`, o plan fica indefinidamente pendente.

## Fluxo completo executado na aula

1. `terraform init` (ja feito antes)
2. Escrever `resource "azurerm_resource_group"` no `main.tf`
3. `terraform plan` — verifica o que sera criado
4. `terraform apply -auto-approve` — cria o recurso
5. Verificar no portal Azure (Resource Groups)
6. Adicionar tags no codigo
7. `terraform plan` — detecta update
8. `terraform apply` (esqueceu `-auto-approve`, digitou `yes` manualmente)
9. Verificar tags no portal (F5)

## Uso de variaveis (mencionado mas nao implementado)

O instrutor menciona que `name` e `location` poderiam vir de um `terraform.tfvars`, da mesma forma que no GCP e AWS. Isso permite reutilizacao e parametrizacao por ambiente.