---
name: rs-devops-configurando-sso-na-aws
description: "Guides AWS SSO (IAM Identity Center) setup for Terraform authentication. Use when user asks to 'configure AWS SSO', 'setup IAM Identity Center', 'connect Terraform to AWS', 'generate AWS tokens securely', or 'aws configure sso'. Walks through enabling Identity Center, creating users, permission sets, and local CLI configuration. Make sure to use this skill whenever setting up AWS authentication for IaC workflows. Not for Azure/GCP auth, IAM policies, or Terraform resource creation."
---

# Configurando SSO na AWS para Terraform

> Configure AWS IAM Identity Center (SSO) para autenticacao segura com tokens rotativos em vez de access keys estaticas.

## Prerequisites

- Conta AWS com acesso ao console
- AWS CLI instalada localmente
- Navegador para fluxo de autenticacao MFA

## Por que SSO em vez de Access Keys

Access Keys estaticas (AK/SK) nao expiram automaticamente, exigem rotacao manual e representam risco de seguranca. SSO via IAM Identity Center gerencia o ciclo de vida do token automaticamente com expiracao configuravel (padrao: 8h).

## Steps

### Step 1: Habilitar IAM Identity Center

1. No console AWS, buscar "SSO" na barra de pesquisa
2. Clicar em **IAM Identity Center**
3. Clicar **Enable**
4. Definir nome no Setting Summary (ex: `skillz`)
5. Configurar URL de acesso SSO
6. Confirmar regiao (ex: `us-east-2`)

### Step 2: Criar usuario

1. Ir em **Users** > **Add user**
2. Preencher username e email
3. Selecionar **Generate a one-time password**
4. Clicar **Next** > **Next** > **Add user**
5. Copiar a one-time password gerada

### Step 3: Criar Permission Set

1. Ir em **Permission Sets** > **Create permission set**
2. Selecionar permissao pre-definida (ex: `AdministratorAccess`)
3. Clicar **Next** > **Create**

### Step 4: Associar permissao ao usuario

1. Ir em **AWS Accounts**
2. Selecionar a conta
3. **Assign users or groups**
4. Aba **Users** > selecionar usuario
5. **Next** > selecionar permission set > **Submit**

### Step 5: Configurar CLI local

```bash
aws configure sso
```

Preencher:
- **SSO session name**: `skillz-sso`
- **SSO start URL**: URL copiada do dashboard Identity Center
- **SSO region**: `us-east-2`
- **SSO registration scopes**: (Enter, deixar vazio)
- **CLI default region**: `us-east-2`
- **CLI default output**: (Enter, deixar vazio)

O navegador abrira para autenticacao. Confirmar o codigo exibido no terminal, logar com usuario/senha, configurar MFA no primeiro acesso.

### Step 6: Re-login apos expiracao

```bash
aws sso login --profile <nome-do-profile>
```

Token expira a cada 8 horas por padrao.

## Configuracoes de seguranca

| Parametro | Recomendacao |
|-----------|-------------|
| MFA | Obrigatorio (ja vem habilitado) |
| Duracao da sessao | 8 horas (padrao, nao exceder 12h) |
| Permission Set | Usar escopo minimo necessario (evitar Admin em producao) |
| Metodo MFA | Built-in Authenticator ou Authenticator App |

## Heuristics

| Situacao | Acao |
|----------|------|
| Ambiente de estudo/dev | `AdministratorAccess` aceitavel temporariamente |
| Ambiente de producao | Criar permission set com escopo minimo |
| Token expirou | `aws sso login` novamente |
| Precisa de controle via codigo | Migrar config SSO para Terraform depois |

## Error handling

- Se `aws configure sso` falhar: verificar se AWS CLI v2 esta instalada
- Se autenticacao no browser falhar: verificar URL do SSO Start e regiao
- Se "No accounts available": permission set nao foi associado ao usuario
- Se MFA obrigatorio bloqueia: configurar authenticator antes de prosseguir

## Verification

```bash
aws sts get-caller-identity
```

Deve retornar Account, UserId e ARN do usuario SSO.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-configurando-sso-na-aws/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-configurando-sso-na-aws/references/code-examples.md)
