# Deep Explanation: Configurando SSO na AWS

## Por que nao usar Access Keys estaticas

O instrutor explica que existem "duas principais formas" de autenticar: a facil (Access Keys) e a segura (SSO). Access Keys sao pares de AK/SK encontrados em **Security Credentials** no perfil AWS. O problema central: nao ha controle de expiracao automatico. Rotacao e 100% manual — entrar no console, deletar o token, gerar novo. Isso e insustentavel a longo prazo.

SSO via IAM Identity Center resolve isso gerenciando automaticamente o ciclo de vida do token. O token gerado expira a cada 8 horas (configuravel), forcando re-autenticacao periodica.

## O que e IAM Identity Center

IAM = Identity Access Management. E toda a parte da AWS que cuida de acesso e permissao. O Identity Center (antigo AWS SSO) e um servico de Single Sign-On — centralizacao de login. Quando voce loga para gerar tokens, o Identity Center cuida do ciclo de vida: geracao, expiracao e invalidacao.

## Fluxo de autenticacao

1. `aws configure sso` registra o profile localmente
2. AWS CLI abre o navegador com um codigo de confirmacao
3. Usuario autentica no Identity Center (usuario + senha + MFA)
4. Token e gerado e armazenado localmente em `~/.aws/sso/cache/`
5. Terraform usa esse token automaticamente via provider AWS
6. Apos 8 horas, token expira e requer novo login

## MFA obrigatorio

O instrutor destaca que MFA e configurado como obrigatorio no Identity Center por padrao. "Isso e muito bom porque vai aumentar a seguranca da sua conta." Opcoes de MFA:
- **Built-in Authenticator**: usa biometria do dispositivo (fingerprint, Face ID)
- **Authenticator App**: Google Authenticator, Authy, etc.

## Sobre a duracao da sessao

Padrao: 8 horas. O instrutor menciona que nao e recomendado exceder 12 horas. Em alguns casos, duracao menor e "mais coesa, mais segura". Para ambiente de desenvolvimento com Terraform, 8 horas e suficiente para um dia de trabalho.

## Sobre o escopo de permissao

O instrutor cria `AdministratorAccess` para fins didaticos mas alerta: "vale a gente depois refletir se e melhor ter um escopo especifico e geralmente sim, vai ser melhor sim ter um escopo mais pormenorizado." Em producao, usar principio do menor privilegio.

## Transicao para IaC

Ponto importante do instrutor: toda essa configuracao feita manualmente no console sera depois transcrita para Terraform. A configuracao manual e necessaria porque ainda nao ha acesso programatico configurado — e um bootstrap problem. Depois de ter acesso, tudo vira codigo declarativo no Terraform para manter controle via IaC.

## Regiao de trabalho

O curso usa `us-east-2` (Ohio). A regiao precisa ser consistente entre o Identity Center e o CLI default region.