# Deep Explanation: Criando Recursos AWS com Terraform IAC

## Contexto da Pipeline

Esta aula faz parte de um fluxo maior de CI/CD. A pipeline ja tem configurada a parte de login (credenciais AWS e login no ECR), mas precisa de dois recursos AWS para funcionar:

1. **Identity Provider (OpenID Connect)** — permite que o GitHub Actions se autentique com a AWS de forma segura
2. **Role (IAM Role)** — a role que a pipeline vai "assumir" (role to assume) para executar acoes na AWS

O Identity Provider e criado nesta aula. A Role sera criada na proxima.

## Como funciona o OpenID Connect entre GitHub e AWS

O GitHub Actions expoe um endpoint padrao para tokens OIDC:
```
https://token.actions.githubusercontent.com
```

Quando a pipeline roda, o GitHub gera um token JWT que identifica o workflow, repo e branch. A AWS valida esse token contra o Identity Provider configurado e, se valido, concede acesso temporario via STS (Security Token Service).

O `client_id_list` com `sts.amazonaws.com` indica que quem vai consumir/validar o token e o servico STS da AWS.

## Thumbprint — por que e necessario

O `thumbprint_list` e o certificado TLS do endpoint do Identity Provider. Ele garante que a conexao entre AWS e GitHub e autentica.

Na interface da AWS, o thumbprint e gerado automaticamente ao clicar "Get thumbprint". No Terraform, ainda esta marcado como `required` na documentacao, entao precisa ser passado manualmente.

### Como obter o thumbprint

O instrutor explica que fez o seguinte:
1. Criou o recurso pela interface AWS primeiro
2. Rodou `terraform import` para importar o recurso existente
3. Extraiu o thumbprint do estado importado

Este e um pattern valido quando um campo required e gerado pelo provider.

## Decisao de rodar localmente primeiro

O instrutor faz um disclaimer importante: por hora, os comandos Terraform sao executados localmente. Na proxima etapa do curso, esse codigo sera integrado na propria pipeline de CI/CD — ou seja, o Terraform tambem sera executado de forma automatizada.

Isso segue o principio de **desenvolvimento incremental**: primeiro faca funcionar local, depois automatize.

## Configuracao da AWS CLI

Para rodar Terraform localmente, e necessario estar autenticado com a AWS. Duas opcoes:

1. **`aws configure`** — configura access key e secret key diretamente (menos seguro)
2. **AWS SSO** — login via SSO do usuario (mais seguro, recomendado pelo instrutor)

O instrutor usa SSO e demonstra que quando o token expira, basta rodar `aws sso login` para renovar.

## Erro de sintaxe: lista vs objeto

O instrutor cometeu um erro ao escrever `client_id_list` e `thumbprint_list` como objetos `{}` ao inves de listas `[]`. Isso gerou erro no `terraform plan`. A correcao foi trocar para a sintaxe de lista com colchetes.

Este e um erro comum em HCL — campos com sufixo `_list` sao sempre arrays.