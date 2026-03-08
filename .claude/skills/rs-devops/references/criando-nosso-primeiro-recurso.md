---
name: rs-devops-criando-primeiro-recurso
description: "Follows Terraform resource lifecycle (create, edit, destroy) when provisioning AWS infrastructure. Use when user asks to 'create a terraform resource', 'provision AWS bucket', 'terraform plan', 'terraform apply', 'destroy infrastructure', or any IaC task with Terraform and AWS. Covers validate/plan/apply/destroy cycle, tags best practice, and auto-approve workflow. Make sure to use this skill whenever writing Terraform HCL for AWS resources. Not for Ansible, Pulumi, CloudFormation, or non-AWS providers."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-aws-lifecycle
  tags: [terraform, aws, s3, plan, apply, destroy, iac, tags]
---

# Ciclo de Vida de Recursos Terraform na AWS

> Todo recurso Terraform segue o ciclo validate → plan → apply, e cada etapa existe para garantir seguranca antes de tocar na cloud.

## Rules

1. **Sempre rode `terraform validate` antes do plan** — porque valida a estrutura do HCL sem tocar na AWS, pegando erros de sintaxe cedo
2. **Sempre rode `terraform plan` antes do apply** — porque planificar antes de aplicar e a unica forma de prever o impacto real na cloud
3. **Use `--auto-approve` somente apos rodar plan** — porque pular a confirmacao sem plan e operacao perigosa em producao
4. **Separe recursos em arquivos nomeados por funcao** — `providers.tf` para providers, `main.tf` ou `resources.tf` para recursos, porque um arquivo unico com tudo prejudica organizacao
5. **Adicione tag `iac = true` em todo recurso gerenciado** — porque em migracoes graduais voce precisa distinguir o que e gerenciado por IaC do que foi criado manualmente
6. **Adicione tag `name` descritiva em todo recurso** — porque facilita buscas e organizacao no console AWS
7. **A regiao vem do provider, nao do recurso** — declare `region` no bloco `provider` ou via variavel de ambiente, porque evita inconsistencias entre recursos

## Steps

### Step 1: Criar o arquivo de recurso

```hcl
# main.tf
resource "aws_s3_bucket" "s3_bucket" {
  bucket = "meu-bucket-iac"

  tags = {
    Name = "meu-bucket"
    iac  = "true"
  }
}
```

### Step 2: Validar estrutura

```bash
terraform validate
# Expected: "The configuration is valid."
```

### Step 3: Planificar

```bash
terraform plan
# Mostra: Plan: 1 to add, 0 to change, 0 to destroy.
```

### Step 4: Aplicar

```bash
# Com confirmacao interativa:
terraform apply

# Ou apos plan bem-sucedido, sem confirmacao:
terraform apply --auto-approve
```

### Step 5: Editar recurso existente

Altere o HCL (ex: adicionar tags), depois:

```bash
terraform plan    # Mostra: 0 to add, 1 to change, 0 to destroy.
terraform apply --auto-approve
```

### Step 6: Destruir recurso

```bash
# Planificar destruicao:
terraform plan --destroy

# Aplicar destruicao (duas formas equivalentes):
terraform destroy
# ou
terraform apply --destroy
```

### Step 7: Recriar recurso

```bash
terraform plan   # Detecta que recurso nao existe mais
terraform apply --auto-approve
```

## Example

**Before (recurso sem tags, sem organizacao):**
```hcl
# providers.tf (tudo junto)
provider "aws" {
  profile = "meu-sso"
}

resource "aws_s3_bucket" "bucket" {
  bucket = "meu-bucket"
}
```

**After (com this skill applied):**
```hcl
# providers.tf
provider "aws" {
  profile = "meu-sso"
}
```

```hcl
# main.tf
resource "aws_s3_bucket" "s3_bucket" {
  bucket = "meu-bucket-iac"

  tags = {
    Name = "meu-bucket"
    iac  = "true"
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Primeiro recurso no projeto | Criar `main.tf` separado do `providers.tf` |
| Recurso simples (1 campo obrigatorio) | Ainda assim adicionar tags `iac` e `Name` |
| Muitos recursos para criar | Usar `--auto-approve` apos plan, porque pode levar 10-15 min |
| Migrando infra existente para IaC | Tag `iac = true` distingue gerenciado vs manual |
| Regiao diferente do provider | Declarar `region` no bloco `provider`, nao no recurso |
| SSO ja configurado | Usar `aws sso login`, nao `aws configure sso` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `terraform apply` sem plan antes | `terraform plan` → `terraform apply` |
| Tudo em `providers.tf` | Separar em `providers.tf` + `main.tf` |
| Recurso sem tags | Sempre incluir `iac = true` + `Name` |
| `terraform apply --auto-approve` como primeiro comando | `terraform validate` → `terraform plan` → `terraform apply --auto-approve` |
| `region` hardcoded em cada recurso | `region` no bloco `provider` |
| `aws configure sso` toda vez que logar | `aws sso login` apos primeira configuracao |

## Troubleshooting

### terraform apply falha com erro de credenciais AWS
**Symptom:** `terraform apply` retorna erro de autenticacao como `NoCredentialProviders` ou `ExpiredToken`.
**Cause:** A sessao SSO expirou ou o perfil AWS nao esta configurado corretamente.
**Fix:** Execute `aws sso login` para renovar a sessao (nao `aws configure sso`, que recria a configuracao inteira). Verifique o profile no bloco `provider`.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
