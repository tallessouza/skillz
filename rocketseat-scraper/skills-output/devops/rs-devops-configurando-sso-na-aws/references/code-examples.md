# Code Examples: Configurando SSO na AWS

## Comando completo de configuracao SSO

```bash
# Iniciar configuracao SSO
aws configure sso

# Prompts e respostas esperadas:
# SSO session name: rocketseat-sso
# SSO start URL: https://rocketseat.awsapps.com/start
# SSO region: us-east-2
# SSO registration scopes: (vazio, Enter)
#
# [Navegador abre para autenticacao]
#
# CLI default client Region: us-east-2
# CLI default output format: (vazio, Enter)
```

## Verificacao de identidade

```bash
# Confirmar que o token esta funcionando
aws sts get-caller-identity

# Output esperado:
# {
#     "UserId": "AROAXXXXXXXXX:daniel",
#     "Account": "123456789012",
#     "Arn": "arn:aws:sts::123456789012:assumed-role/AWSReservedSSO_AdministratorAccess_.../daniel"
# }
```

## Re-login apos expiracao

```bash
# Quando o token expirar (apos 8h), re-autenticar:
aws sso login --profile <profile-name>

# O nome do profile e gerado automaticamente durante aws configure sso
# Formato tipico: AdministratorAccess-123456789012
```

## Listando profiles configurados

```bash
# Ver profiles disponiveis
aws configure list-profiles

# Usar profile especifico
export AWS_PROFILE=AdministratorAccess-123456789012
```

## Estrutura de arquivos gerados

```bash
# Apos aws configure sso, os seguintes arquivos sao criados/atualizados:

# ~/.aws/config — profile com configuracao SSO
cat ~/.aws/config
# [profile AdministratorAccess-123456789012]
# sso_session = rocketseat-sso
# sso_account_id = 123456789012
# sso_role_name = AdministratorAccess
# region = us-east-2
#
# [sso-session rocketseat-sso]
# sso_start_url = https://rocketseat.awsapps.com/start
# sso_region = us-east-2
# sso_registration_scopes = sso:account:access

# ~/.aws/sso/cache/ — tokens em cache (expiraveis)
```

## Terraform provider usando SSO

```hcl
# O Terraform usa automaticamente o profile SSO configurado
provider "aws" {
  region  = "us-east-2"
  profile = "AdministratorAccess-123456789012"
}
```

## Alternativa: Access Keys (NAO RECOMENDADO)

```bash
# Forma insegura — apenas para referencia
# Gerar em: AWS Console > Perfil > Security Credentials > Access Keys

export AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
export AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"

# Problemas:
# - Nao expira automaticamente
# - Rotacao 100% manual
# - Risco se commitado em codigo
# - Sem MFA integrado
```

## Passos no console AWS (resumo navegacao)

```
1. Console AWS > Buscar "SSO" > IAM Identity Center > Enable

2. Settings > Setting Summary > Definir nome (ex: rocketseat)
   Settings > URL de acesso > Definir URL

3. Users > Add user > Preencher dados > Generate one-time password
   > Copiar senha gerada

4. Permission Sets > Create > Predefined: AdministratorAccess > Create

5. AWS Accounts > Selecionar conta > Assign users or groups
   > Users > Selecionar usuario > Next
   > Selecionar permission set > Submit

6. Voltar ao terminal > aws configure sso
```