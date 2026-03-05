---
name: rs-devops-workspaces
description: "Applies Terraform workspace patterns when managing multi-environment infrastructure. Use when user asks to 'create terraform workspace', 'manage environments with terraform', 'separate staging and production state', 'use terraform workspace', or 'handle multiple tfstate files'. Ensures correct workspace-aware resource naming, state isolation, and environment interpolation. Make sure to use this skill whenever working with Terraform workspaces or multi-environment IaC. Not for Terraform modules, providers configuration, or non-workspace state management."
---

# Terraform Workspaces

> Isole estados por ambiente usando workspaces e interpole `terraform.workspace` nos nomes de recursos para evitar conflitos.

## Rules

1. **Cada workspace tem seu proprio estado** — o tfstate do workspace `staging` fica em `terraform.tfstate.d/staging/`, nao no `terraform.tfstate` raiz, porque o estado raiz pertence exclusivamente ao workspace `default`
2. **Sempre interpole o workspace no nome do recurso** — use `terraform.workspace` no nome, porque recursos identicos em workspaces diferentes causam erro 409 (conflito) se tiverem o mesmo nome
3. **Use hifen como separador no nome** — `bucket-name-${terraform.workspace}` nao `bucket-name|${terraform.workspace}`, porque caracteres especiais como pipe sao rejeitados por provedores cloud
4. **Selecione o workspace ANTES de rodar plan/apply** — a selecao de workspace acontece antes da execucao, nao durante
5. **Atente-se a recursos que nao suportam rename in-place** — S3 buckets, por exemplo, exigem destroy + create ao mudar o nome, o que pode causar perda de dados

## How to write

### Recurso com workspace interpolado

```hcl
resource "aws_s3_bucket" "bucket" {
  bucket = "minha-app-${terraform.workspace}"

  tags = {
    Environment = terraform.workspace
  }
}
```

### Comandos essenciais

```bash
# Ver workspace atual
terraform workspace show

# Listar workspaces (asterisco = atual)
terraform workspace list

# Criar e mudar para novo workspace
terraform workspace new staging

# Selecionar workspace existente
terraform workspace select default

# Deletar workspace
terraform workspace delete staging
```

## Example

**Before (sem workspace no nome — causa conflito):**

```hcl
resource "aws_s3_bucket" "bucket" {
  bucket = "skillz-bucket-iac"
}
```

**After (com workspace interpolado):**

```hcl
resource "aws_s3_bucket" "bucket" {
  bucket = "skillz-bucket-iac-${terraform.workspace}"

  tags = {
    Context = terraform.workspace
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mesmo recurso em staging e producao | Interpole `terraform.workspace` no nome |
| Contas AWS diferentes por ambiente | Configure o provider com variaveis condicionais ao workspace |
| Precisa ver qual workspace esta ativo | `terraform workspace show` |
| Recurso foi destruido e recriado ao inves de atualizado | Normal para recursos que nao suportam rename (ex: S3 bucket) — planeje backups |
| Primeiro uso de workspaces no projeto | O workspace `default` ja existe implicitamente |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Nomes de recurso fixos com multiplos workspaces | Interpole `terraform.workspace` no nome |
| Usar pipe `\|` como separador no nome | Usar hifen `-` como separador |
| Assumir que `terraform plan` pega erros de nome duplicado | So o `apply` detecta conflitos reais no provedor |
| Editar manualmente arquivos em `terraform.tfstate.d/` | Usar comandos `terraform workspace` |
| Esquecer backup antes de alterar nome de bucket S3 | Planejar backup — rename causa destroy + create |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
