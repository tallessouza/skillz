# Deep Explanation: Configurando Permissoes para Pipeline Terraform

## Por que o checkout e necessario

O Terraform, assim como qualquer ferramenta de build, precisa do codigo fonte para executar. Na pipeline de uma API, voce roda `yarn install` sobre o codigo — o Terraform roda `init`, `plan`, `apply` sobre os arquivos `.tf`. Sem o checkout, a pipeline nao tem os arquivos de configuracao e falha imediatamente.

O instrutor posiciona o checkout como primeiro step por organizacao, embora tecnicamente pudesse ficar apos o setup do Terraform. A convencao e: checkout primeiro, setup de ferramentas depois, execucao por ultimo.

## IAM Roles escopadas — o principio

Cada pipeline deve ter sua propria role com escopo minimo. O instrutor demonstra isso comparando:

- **ECR Role** (pipeline da API): escopada para operacoes ECR + repositorio `ci-api`
- **TF Role** (pipeline IAC): escopada para operacoes Terraform + repositorio `ci-iac`

Mesmo que fosse possivel adicionar uma segunda `Condition` na ECR role para aceitar outro repositorio, isso viola o principio de responsabilidade unica. O nome da role (`ecr-role`) ja indica que ela pertence a um dominio especifico.

A criacao da TF role reutiliza a mesma estrutura da ECR role — o `assume_role_policy` com WebIdentity e praticamente identico, mudando apenas o repositorio na condition. O ARN gerado segue o padrao `arn:aws:iam::ACCOUNT_ID:role/tf-role`.

## OpenID Connect e permissions

O GitHub Actions usa OIDC para autenticar com AWS sem secrets estaticos. Para isso funcionar, o workflow YAML precisa declarar explicitamente:

```yaml
permissions:
  id-token: write    # Permite gerar o token OIDC
  contents: read     # Permite ler o conteudo do repositorio
```

Sem isso, a action `configure-aws-credentials` falha ao tentar assumir a role. O instrutor mostra que esse e um erro facil de esquecer — na pipeline da API ja estava configurado, mas na nova pipeline de IAC foi omitido inicialmente.

## O problema do estado (state)

Este e o insight mais importante da aula. Quando o Terraform roda na pipeline sem acesso ao state file:

1. `terraform plan` mostra que vai **criar** todos os recursos (mesmo que ja existam)
2. `terraform apply` falha porque tenta criar recursos com nomes ja em uso

Localmente, `terraform plan` mostra "no changes" porque o state local existe. Na pipeline, sem backend remoto configurado, o Terraform trata como primeira execucao.

O instrutor destaca: "o Terraform e orientado ao estado". Sem estado, ele nao sabe o que ja existe. Isso nao e um bug — o plano esta "correto apesar de errado", porque do ponto de vista do Terraform sem state, aqueles recursos realmente precisam ser criados.

## terraform fmt como pre-commit

O instrutor recomenda um padrao de duas etapas:

1. **Localmente**: `terraform fmt` (sem `--check`) — formata automaticamente
2. **Na pipeline**: `terraform fmt --check` — apenas verifica, falha se nao formatado

Isso funciona como um "pre-commit" informal. O instrutor demonstra rodando `git status` apos `terraform fmt` para mostrar que, no caso dele, nao houve alteracoes — mas em cenarios reais de escrita rapida, formatacao pode passar batida.

## Erro de permissao no apply

Mesmo resolvendo o OIDC e o checkout, o `terraform apply` falhou com "access denied" no `CreateRepository`. Isso indica que a TF role foi criada mas ainda nao tem as policies (permissoes IAM) necessarias para criar recursos na AWS. A role permite autenticacao (assume role), mas nao autoriza acoes especificas — esse e o proximo passo que sera abordado na aula seguinte.