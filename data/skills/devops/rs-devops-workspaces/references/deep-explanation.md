# Deep Explanation: Terraform Workspaces

## O que sao workspaces

Workspace e o "espaco de trabalho" do Terraform. Por default, todo gerenciamento de estado (tfstate) fica associado ao workspace `default`. Tudo que mutabiliza estado — criacao, edicao, delecao de recursos — fica vinculado ao workspace ativo.

## Por que workspaces existem

O problema que workspaces resolvem: voce pode ter o workspace local, staging, producao, e manter os **mesmos recursos** com estados independentes. A "grande sacada" e que o mesmo `main.tf` pode ser aplicado em N ambientes, cada um com seu proprio estado.

## Como o estado se organiza

- **Workspace default:** estado fica em `terraform.tfstate` na raiz do projeto
- **Qualquer outro workspace:** estado fica em `terraform.tfstate.d/{nome-do-workspace}/terraform.tfstate`
- O workspace default nunca aparece na pasta `terraform.tfstate.d/` porque ele sempre existe implicitamente

Dentro de `.terraform/` (pasta oculta), existe um arquivo `environment` que indica o workspace ativo. Se voce tem 10 workspaces, tera 10 itens listados ali.

## O problema do conflito de nomes

Quando voce usa workspaces com o mesmo recurso, precisa **mutabilizar o nome do recurso**. Caso contrario:

1. Voce cria o bucket no workspace `staging` com nome `skillz-bucket-iac`
2. Muda para workspace `default`
3. Roda `terraform plan` — ele mostra que vai criar o recurso (porque no estado default nao existe)
4. Roda `terraform apply` — erro 409 (conflito), porque o bucket ja existe na AWS

A solucao e usar `terraform.workspace` como parte do nome: `skillz-bucket-iac-${terraform.workspace}`

## Detalhe sobre separadores

O instrutor tentou usar pipe (`|`) como separador e recebeu erro. Provedores cloud rejeitam caracteres especiais em nomes de recursos. Use hifen (`-`).

## Destroy antes de create (replace)

Um insight importante: ao alterar o nome de um S3 bucket, o Terraform faz **destroy + create** (nao update in-place), porque o S3 nao suporta rename. Isso significa:

- A data de criacao do bucket muda
- Qualquer conteudo dentro do bucket e perdido
- E essencial fazer backup antes de operacoes que alteram o nome

O `terraform plan` nao detecta esse tipo de erro — so o `apply` tenta de fato criar o recurso no provedor e descobre conflitos.

## Casos de uso alem de ambientes

- Contas AWS diferentes (configuracao direta no provider)
- Times diferentes trabalhando no mesmo codigo
- Testes isolados de infraestrutura

## Variavel terraform.workspace

`terraform.workspace` e uma variavel built-in que retorna o nome do workspace ativo. Pode ser usada em qualquer lugar do codigo HCL: nomes de recursos, tags, condicionais, configuracao de providers.