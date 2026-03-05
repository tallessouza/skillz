# Deep Explanation: Configurando Provider Azure no Terraform

## Por que separar por provedor?

O instrutor enfatiza a criacao de diretorios separados por provedor (ex: `iac-azure/`, `iac-gcp/`, `iac-aws/`). A razao e organizacao e separacao de responsabilidade — cada provedor tem seu proprio state file, suas credenciais e seu ciclo de vida. Misturar provedores no mesmo diretorio gera acoplamento desnecessario.

## Resource Groups: o conceito central da Azure

Na Azure, o Resource Group e o agrupador fundamental. Todo recurso DEVE pertencer a um Resource Group. O instrutor faz a analogia direta com o Project do GCP — ambos servem como contexto logico para agrupar recursos relacionados.

Casos de uso tipicos:
- Um Resource Group por ambiente (staging, production)
- Um Resource Group por aplicacao
- Um Resource Group por dominio de negocio

### O perigo da delecao em cascata

O instrutor destaca um risco critico: se voce deleta um Resource Group, **todos os recursos dentro dele sao deletados em cascata**. Exemplo: se voce tem 10 servicos (Kubernetes, VMs, databases) dentro de um Resource Group e deleta o grupo acidentalmente, perde tudo.

A solucao e a feature `prevent_deletion_if_contains_resources = true`, que forca a delecao na ordem inversa: primeiro os recursos individuais, depois o Resource Group vazio.

## Features block: diferencial do azurerm

O bloco `features` e uma particularidade do provider Azure que nao existe nos providers AWS ou GCP. Ele permite configuracoes de seguranca e comportamento a nivel de provedor. Mesmo que voce nao configure nenhuma feature especifica, o bloco `features {}` vazio e **obrigatorio** — sem ele o provider nao inicializa.

## skip_provider_registration

O instrutor menciona mas nao detalha o `skip_provider_registration`. Esse parametro e usado quando o usuario da Azure nao tem permissoes para registrar Resource Providers na subscription. Em ambientes corporativos com controle de acesso restrito, isso e comum. Quando `true`, o Terraform assume que os providers ja estao registrados.

## Boa pratica: bloquear criacao pelo console

O instrutor menciona uma pratica avancada (provavelmente coberta no modulo 4): configurar permissoes para que usuarios so tenham acesso de leitura no portal Azure, forcando toda criacao de recursos via IaC. Isso garante rastreabilidade e consistencia.

## Azure CLI e autenticacao

O fluxo de autenticacao e simples:
1. Instalar Azure CLI (`az`)
2. Executar `az login` — abre SSO da Microsoft no navegador
3. Selecionar a conta vinculada
4. Credenciais ficam disponíveis localmente para o Terraform

Metodos de instalacao:
- macOS: `brew install azure-cli`
- Windows: download do MSI
- Linux: script ou package manager
- Docker: imagem oficial disponivel

## Convencao de nomes no Registry

Os recursos Azure no Terraform seguem o padrao `azurerm_*` onde `rm` significa "Resource Manager". Para buscar documentacao de um recurso especifico, procure por `azurerm_{nome_do_recurso}` no Terraform Registry.