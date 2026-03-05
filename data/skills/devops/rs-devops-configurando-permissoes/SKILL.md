---
name: rs-devops-configurando-permissoes
description: "Applies correct permissions and checkout configuration for Terraform CI/CD pipelines on GitHub Actions with AWS. Use when user asks to 'configure terraform pipeline', 'fix pipeline permissions', 'setup IAM role for CI', 'configure OpenID Connect for GitHub Actions', or 'terraform pipeline not working'. Ensures checkout step, scoped IAM roles, OIDC token permissions, and state awareness. Make sure to use this skill whenever setting up Terraform automation in GitHub Actions. Not for application CI/CD, Docker builds, or non-AWS cloud providers."
---

# Configurando Permissoes para Pipeline Terraform

> Toda pipeline Terraform precisa de tres pilares: checkout do codigo, IAM role escopada, e permissoes OIDC — sem qualquer um deles, a pipeline falha silenciosamente ou com erros cripticos.

## Rules

1. **Sempre adicione checkout como primeiro step** — `actions/checkout@v4` antes de qualquer comando Terraform, porque Terraform precisa do codigo fonte para executar init/plan/apply
2. **Crie IAM roles escopadas por repositorio** — uma role por pipeline (ex: `ecr-role` para API, `tf-role` para IAC), porque roles genericas violam principio do menor privilegio
3. **Configure permissoes OIDC no workflow** — `id-token: write` e `contents: read` sao obrigatorios para OpenID Connect funcionar com AWS
4. **Rode `terraform fmt` local antes do push** — use `terraform fmt` sem `--check` localmente, depois `terraform fmt --check` na pipeline, porque formatacao quebra pipeline silenciosamente
5. **Terraform e orientado a estado** — sem state remoto configurado, pipeline recria todos os recursos como se fosse primeira execucao, causando erros de nomes duplicados

## Steps

### Step 1: Adicionar checkout na pipeline

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v4

  - name: Setup Terraform
    uses: hashicorp/setup-terraform@v3

  - name: Terraform Init
    run: terraform init
```

O checkout deve ser o primeiro step, antes de setup e comandos Terraform.

### Step 2: Criar IAM role escopada via Terraform

```hcl
resource "aws_iam_role" "tf_role" {
  name = "tf-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:sub" = "repo:ORG/REPO-IAC:ref:refs/heads/main"
          }
        }
      }
    ]
  })

  tags = {
    IAC = "true"
  }
}
```

Substitua `ACCOUNT_ID`, `ORG`, e `REPO-IAC` pelos valores reais. O scope no `Condition` garante que apenas o repositorio correto pode assumir a role.

### Step 3: Configurar permissoes OIDC no workflow

```yaml
permissions:
  id-token: write
  contents: read

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::ACCOUNT_ID:role/tf-role
          aws-region: us-east-1

      - name: Terraform Init
        run: terraform init

      - name: Terraform Format Check
        run: terraform fmt --check

      - name: Terraform Plan
        run: terraform plan

      - name: Terraform Apply
        run: terraform apply -auto-approve
```

### Step 4: Pre-commit — formatar antes de push

```bash
# Localmente (formata arquivos):
terraform fmt

# Na pipeline (apenas verifica, quebra se nao formatado):
terraform fmt --check
```

## Error handling

- Se pipeline falha em `configure-aws-credentials` → verifique se `permissions.id-token: write` esta no YAML
- Se `terraform plan` mostra recursos ja existentes como novos → state remoto nao esta configurado (pipeline nao tem acesso ao `.tfstate`)
- Se `terraform apply` da erro 400 ou "already exists" → consequencia de state ausente, nao tente forcar — configure backend remoto primeiro
- Se `terraform fmt --check` falha → rode `terraform fmt` localmente, commit, e push novamente
- Se erro "not authorized to perform CreateRepository" → a role nao tem as policies necessarias anexadas

## Heuristics

| Situacao | Acao |
|----------|------|
| Pipeline nova para Terraform | Sempre comece com checkout + OIDC permissions + role escopada |
| Role ja existe para outro repo | Crie role separada, nao reutilize — escopo por repositorio |
| Plan mostra tudo como novo na pipeline | Configure backend remoto (S3 + DynamoDB) para state |
| Erro de permissao na pipeline | Verifique: 1) OIDC permissions no YAML 2) Role policy 3) Condition do repo |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Usar mesma IAM role para API e IAC | Criar roles separadas e escopadas por finalidade |
| Esquecer `actions/checkout` antes do Terraform | Sempre primeiro step: `actions/checkout@v4` |
| Rodar pipeline sem `permissions` block | Adicionar `id-token: write` e `contents: read` |
| Confiar no state local para pipeline CI | Configurar backend remoto (S3) para estado compartilhado |
| Rodar `terraform apply` sem state remoto | Primeiro configurar backend, depois habilitar apply |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
