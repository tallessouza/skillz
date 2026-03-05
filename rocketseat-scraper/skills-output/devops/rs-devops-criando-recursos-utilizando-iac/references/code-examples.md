# Code Examples: Criando Recursos AWS com Terraform IAC

## Exemplo 1: main.tf — Configuracao do Provider

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.49"
    }
  }
}

provider "aws" {
  region = "us-east-2"
}
```

**Notas:**
- `version = "~> 5.49"` permite patches (5.49.x) mas nao minor bumps
- A regiao `us-east-2` (Ohio) e a escolhida para o modulo do curso
- Nao ha credenciais hardcoded — o Terraform usa as credenciais configuradas na AWS CLI

## Exemplo 2: iam.tf — OpenID Connect Provider

```hcl
resource "aws_iam_openid_connect_provider" "openid_connect_git" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com"
  ]

  thumbprint_list = [
    "THUMBPRINT_GERADO_PELA_AWS"
  ]

  tags = {
    IAC = "TRUE"
  }
}
```

**Campos explicados:**
- `url` — endpoint OIDC do GitHub Actions (padrao, nao muda)
- `client_id_list` — quem consome o token; `sts.amazonaws.com` e o Security Token Service da AWS
- `thumbprint_list` — certificado TLS do endpoint (required na API do Terraform, opcional na interface)
- `tags` — identifica que o recurso foi criado via IAC

## Exemplo 3: Fluxo de comandos Terraform

```bash
# 1. Navegar para pasta IAC
cd iac/

# 2. Inicializar o projeto (baixa providers)
terraform init

# 3. Verificar o que sera criado/modificado
terraform plan

# 4. Aplicar mudancas (com auto-approve para dev)
terraform apply --auto-approve
```

**Output esperado do `terraform plan`:**
```
Plan: 1 to add, 0 to change, 0 to destroy.
```

**Output esperado do `terraform apply`:**
```
aws_iam_openid_connect_provider.openid_connect_git: Creating...
aws_iam_openid_connect_provider.openid_connect_git: Creation complete after 1s
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

## Exemplo 4: Importando recurso existente (para obter thumbprint)

```bash
# Se voce ja criou o Identity Provider pela interface:
terraform import aws_iam_openid_connect_provider.openid_connect_git \
  arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com

# Depois, rode terraform state show para ver o thumbprint:
terraform state show aws_iam_openid_connect_provider.openid_connect_git
```

## Exemplo 5: Configuracao AWS CLI (pre-requisito)

```bash
# Opcao 1: Access key direta
aws configure
# AWS Access Key ID: <sua-key>
# AWS Secret Access Key: <seu-secret>
# Default region: us-east-2

# Opcao 2: SSO (recomendado pelo instrutor)
aws sso login

# Verificar conexao
aws sts get-caller-identity
```

## Erro comum: lista vs objeto em HCL

```hcl
# ERRADO — objeto ao inves de lista
client_id_list {
  "sts.amazonaws.com"
}

# CORRETO — lista com colchetes
client_id_list = [
  "sts.amazonaws.com"
]
```