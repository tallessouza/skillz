# Deep Explanation: Ciclo de Vida de Recursos Terraform na AWS

## Por que separar arquivos?

O instrutor enfatiza que embora seja possivel colocar tudo num unico arquivo (`providers.tf`), a organizacao importa. O nome do arquivo comunica intencao: `providers.tf` para configuracao de providers, `main.tf` ou `resources.tf` para recursos. Em projetos maiores, essa separacao sera essencial.

## O ciclo validate → plan → apply

O Terraform tem um ciclo deliberado de seguranca:

1. **validate** — verifica sintaxe e estrutura do HCL sem conectar na AWS. E uma "camada de garantia" como o instrutor descreve.
2. **plan** — conecta na AWS, compara o estado desejado (HCL) com o estado atual (state file) e mostra exatamente o que vai acontecer: quantos recursos serao adicionados, alterados ou destruidos.
3. **apply** — executa de fato. Importante: o apply tambem roda um plan internamente, mas rodar o plan separado antes e boa pratica para "tentar pegar algum problema caso aconteca".

## A regiao vem do provider

O instrutor explica que quando criou o bucket S3, ele apareceu na regiao `us-east-2` sem declarar regiao no recurso. Isso acontece porque o provider AWS ja estava configurado para essa regiao (via SSO). O provider "herda" a regiao da configuracao de ambiente. Voce pode sobrescrever com `region` no bloco provider, mas isso pode conflitar com o SSO se estiver configurado para outra regiao.

## Tags como boa pratica organizacional

### Tag `iac = true`

A sacada do instrutor: "Principalmente quando voce estiver migrando de nuvem ou adotando IAC, e legal voce saber qual recurso e gerenciado pelo IAC e qual nao e." Em migracoes graduais, onde parte da infra e manual e parte e IaC, essa tag e a unica forma confiavel de distinguir.

### Tag `Name`

Facilita buscas no console AWS. Sem tags, voce precisa navegar por IDs crípticos.

## O plan com --destroy

Por default, `terraform plan` olha para criacao e edicao. Para planificar destruicao, precisa do flag `--destroy`. Isso e uma protecao: voce nao destroi acidentalmente.

Duas formas equivalentes de destruir:
- `terraform destroy` (comando dedicado)
- `terraform apply --destroy` (forma mais "concisa" segundo o instrutor)

## Auto-approve e volumetria

O instrutor faz um ponto importante sobre `--auto-approve`: no exemplo e um bucket que leva 5 segundos, mas em producao com muitos recursos, o apply pode levar 10-15 minutos. Ficar esperando a confirmacao interativa nesse cenario e impratico. O workflow seguro e: plan → verificar output → apply com auto-approve.

## SSO: configure vs login

- `aws configure sso` — usado apenas na primeira configuracao ou reconfiguracao
- `aws sso login` — usado no dia-a-dia para autenticar uma sessao ja configurada

O instrutor faz questao de distinguir porque e um erro comum rodar `configure sso` toda vez.

## Estado e recriacao

O Terraform "entende do fluxo de estado": quando voce destroi um recurso e roda plan novamente, ele detecta que o recurso nao existe mais na AWS e propoe recria-lo com todas as configuracoes (incluindo tags) que estao no HCL. Isso demonstra a manutenibilidade: "e muito mais simples destruir um recurso, recriar ele novamente."