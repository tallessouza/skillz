# Deep Explanation: Configurando Features — Azure Provider

## Vinculo entre recursos e Resource Group

Na Azure, todo recurso pertence a um Resource Group. Diferente da AWS onde recursos podem existir de forma mais independente, na Azure o Resource Group funciona como um container logico. Quando voce deleta um Resource Group, **todos os recursos dentro dele sao deletados automaticamente**. Isso e poderoso mas perigoso.

O instrutor faz uma analogia com a AWS: a Virtual Network (VNet) da Azure e equivalente a VPC da AWS. Ambas sao redes virtuais isoladas, mas na Azure a VNet precisa estar vinculada a um Resource Group.

## Por que referencia dinamica e nao string?

Quando voce duplica informacao (copiar o nome do resource group como string), qualquer mudanca no nome exige alterar em multiplos lugares. O instrutor demonstrou isso ao vivo: ao corrigir um typo no nome do Resource Group ("SkillzCity" → "Skillz"), todos os recursos que referenciam `azurerm_resource_group.rg.name` atualizam automaticamente.

Sem variaveis (tfvars), a duplicacao de strings e ainda mais perigosa. A referencia dinamica resolve isso no nivel do Terraform, criando uma dependencia implicita entre recursos.

## Comportamento do Terraform ao renomear

Quando voce altera o `name` de um Resource Group, o Terraform nao consegue fazer um update in-place — ele precisa **destruir e recriar** (replace). O Terraform e inteligente o suficiente para:
1. Deletar o recurso antigo primeiro (evitar colisao de nomes)
2. Criar o novo recurso
3. Criar recursos dependentes (como a VNet)

## Features do Provider Azure

O bloco `features {}` e **obrigatorio** no provider azurerm, mesmo que esteja vazio. Isso e uma peculiaridade do provider Azure — sem ele, a configuracao falha.

Dentro de features, existem diversas protecoes. A mais relevante para Resource Groups:

```hcl
features {
  resource_group {
    prevent_deletion_if_contains_resources = true
  }
}
```

Isso impede que o Terraform delete um Resource Group que ainda contenha recursos. Voce precisaria deletar cada recurso filho individualmente antes de poder deletar o RG.

### Alternativa: lifecycle prevent_destroy

Outra opcao e usar `lifecycle { prevent_destroy = true }` diretamente no recurso. Isso funciona para qualquer provider (AWS, GCP, Azure) e impede a delecao do recurso especifico. O instrutor mencionou que usou essa tecnica no bucket S3 do backend do Terraform state.

A diferenca:
- `lifecycle.prevent_destroy` = protege um recurso especifico, qualquer provider
- `features.resource_group.prevent_deletion_if_contains_resources` = protege o RG como container, especifico Azure

## O erro classico: apply sem --destroy

O instrutor cometeu um erro ao vivo que e extremamente didatico: rodou `terraform apply --auto-approve` quando queria deletar, mas esqueceu o `--destroy`. Resultado: o Terraform **recriou** o recurso que ja tinha sido deletado do state.

Isso acontece porque o state do Terraform ainda continha a definicao do recurso. Ao rodar `apply` sem `--destroy`, o Terraform viu que o recurso existia no codigo mas nao na cloud, e o recriou.

Licao: sempre confira o comando completo antes de executar, especialmente com `--auto-approve` que pula a confirmacao.

## State e independente de provider

O instrutor destacou que a estrutura do state file do Terraform e a mesma independente do provider (AWS, Azure, GCP). Instancias, atributos e metadados seguem o mesmo formato. Isso reforça que o Terraform e uma camada de abstracao sobre os providers.