# Deep Explanation: Pipeline CI/CD para Infraestrutura Terraform

## Por que pipeline de infraestrutura?

O instrutor apresenta isso como a aplicacao natural dos conceitos de CI/CD ao contexto de IaC (Infrastructure as Code). A ideia central: quando voce quer criar um recurso em nuvem, voce tambem passa por uma pipeline, e apos a execucao o recurso e criado no seu provedor de cloud. O mesmo fluxo de qualidade que se aplica a codigo de aplicacao se aplica a codigo de infraestrutura.

## Por que esses arquivos nao vao para o git?

- **`.tfstate`** — O estado do Terraform nao e versionavel a nivel de codigo. Ele contem informacoes sensiveis e muda a cada apply. A maneira correta de armazenar sera abordada separadamente (backend remoto como S3).
- **`.tfvars`** — Equivalente ao `.env` de aplicacoes. Contem valores que podem ser sensiveis ou especificos do ambiente.
- **`.terraform/`** — Diretorio oculto com plugins e modulos baixados. Sao arquivos que auxiliam a execucao, sem necessidade de versionamento.
- **`.terraform.lock.hcl`** — Lock file similar ao package-lock.json.

## Criacao manual vs UI

O instrutor destaca que na primeira vez (para a API) criaram o workflow pela UI do GitHub, mas para IaC estao criando "manualmente" via codigo. Isso demonstra as duas formas e da preferencia ao codigo para projetos de infraestrutura.

## HashiCorp setup-terraform

A action `hashicorp/setup-terraform@v3` e necessaria porque o runner Ubuntu do GitHub Actions nao tem o Terraform instalado. E analogo ao que foi feito com Docker em aulas anteriores — a diferenca e que aqui estamos "setando" o Terraform antes de usa-lo.

O instrutor menciona que a HashiCorp (empresa por tras do Terraform, chamada de "RastCorp" na transcricao) tem seu proprio servico de pipeline — o Terraform Cloud. E free com pricing para recursos avancados. Isso e uma alternativa ao GitHub Actions para quem quiser explorar.

## Sequencia de comandos

A sequencia `init → fmt -check → plan → apply -auto-approve` replica o que se faz localmente, mas adaptado para CI:
- `fmt -check` em vez de `fmt` (modo verificacao, quebra se nao formatado)
- `apply -auto-approve` em vez de `apply` (sem terminal interativo no CI)

## Variaveis de ambiente no Terraform

O prefixo `TF_VAR_` e o mecanismo do Terraform para ler variaveis de ambiente. Se voce tem uma variavel `nome`, passa `TF_VAR_nome` no env. Precisa estar presente tanto no step de plan quanto no step de apply. Variaveis sensiveis devem usar o recurso de Secrets do GitHub.

## O que faltou (propositalmente)

O instrutor encerra dizendo que a pipeline vai falhar por dois motivos:
1. A `role-to-assume` nao foi configurada (esta vazia)
2. Falta um step que sera adicionado na proxima aula
3. Falta configurar permissionamento do repositorio na AWS

Isso e intencional para abordar na proxima aula.