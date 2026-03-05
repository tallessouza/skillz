# Deep Explanation: Configurando IAM Roles para CI/CD

## Por que uma Role e nao um Usuario?

O instrutor segue o padrao de Web Identity Federation, onde o GitHub Actions nao usa access keys (credenciais estaticas). Em vez disso, o fluxo e:

1. GitHub Actions gera um OIDC token automaticamente
2. O token chega na AWS pela rota `token.actions.githubusercontent.com`
3. AWS valida o token contra o Identity Provider configurado
4. Se valido, AWS concede credenciais temporarias via STS (Security Token Service)
5. Pipeline assume a Role com essas credenciais temporarias

Isso e mais seguro que access keys porque as credenciais expiram automaticamente.

## A dica do instrutor: usar o console para gerar JSON

O instrutor destaca que escrever o JSON da trust policy na mao "nao e la muito simples". A dica pratica e:

1. Ir pelo caminho da interface AWS ate o ponto de gerar o JSON
2. Copiar o JSON gerado
3. NAO criar a Role pelo console — voltar para o Terraform
4. Usar o JSON copiado no recurso `aws_iam_role`

Isso combina a facilidade do console (wizard guiado) com a rastreabilidade do IaC.

## Anatomia da Trust Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Principal": {
      "Federated": "arn:aws:iam::ACCOUNT:oidc-provider/token.actions.githubusercontent.com"
    },
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        "token.actions.githubusercontent.com:sub": "repo:ORG/REPO:ref:refs/heads/BRANCH"
      }
    }
  }]
}
```

### Cada campo explicado:

- **Effect Allow + Action AssumeRoleWithWebIdentity**: permite que entidades externas assumam esta Role via Web Identity
- **Principal Federated**: referencia o OIDC Provider — e o "elo" entre o Identity Provider e a Role
- **Condition aud (audience)**: deve ser `sts.amazonaws.com` — o servico que vai gerar o token temporario
- **Condition sub (subject)**: o filtro mais importante — define QUAL repo e QUAL branch podem assumir a Role

## Restricao granular e seguranca

O instrutor enfatiza que o acesso e "bem restrito":

- Se a pipeline rodar em outra branch → erro de permissao
- Se outro repositorio tentar usar o ARN → erro de permissao
- Repositorio e branch sao campos opcionais no console, mas o instrutor recomenda preencher ambos

Isso segue o principio de least privilege: dar acesso apenas ao minimo necessario.

## Role criada != Role com permissoes

Ponto crucial destacado pelo instrutor: apos criar a Role, ela existe e pode ser assumida, mas NAO tem acesso a nenhum recurso AWS. A trust policy define QUEM pode assumir a Role. As policies de permissao (que serao configuradas na proxima aula) definem O QUE a Role pode fazer.

Analogia: a trust policy e a porta de entrada. As permission policies sao as chaves dos quartos internos.

## Referencia ao recurso OIDC no Terraform

No Terraform, a Role referencia o OIDC Provider via:

```hcl
Federated = aws_iam_openid_connect_provider.oidc_git.arn
```

Isso cria uma dependencia implicita — o Terraform sabe que precisa criar o OIDC Provider antes da Role.