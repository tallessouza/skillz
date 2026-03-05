---
name: rs-devops-habilitando-o-versionamento
description: "Applies S3 bucket versioning configuration for Terraform state files when user asks to 'enable versioning', 'protect terraform state', 'version s3 bucket', 'configure state backend', or 'secure remote state'. Enforces correct resource dependencies, backup strategy (local backup, remote state), and aws_s3_bucket_versioning usage. Make sure to use this skill whenever configuring Terraform remote state storage or S3 bucket versioning. Not for general S3 operations, application data buckets, or non-Terraform versioning."
---

# Habilitando Versionamento do Estado Terraform

> Sempre habilite versionamento no bucket S3 que armazena o estado Terraform, porque o estado e sensivel e cada alteracao deve gerar uma versao recuperavel.

## Rules

1. **Sempre versione o bucket de estado** — use `aws_s3_bucket_versioning` com `status = "Enabled"`, porque o estado Terraform e o artefato mais sensivel da infraestrutura
2. **Backup local, estado remoto** — o arquivo `.tfstate.backup` fica local na maquina de execucao, o `.tfstate` fica no S3, porque isso garante recuperacao mesmo sem acesso remoto
3. **Use depends_on explicito** — o recurso de versionamento deve depender do bucket, porque garante ordem correta de criacao
4. **Valide com terraform plan apos aplicar** — apos habilitar versionamento, rode `terraform plan` para confirmar que a infraestrutura esta conciliada (sem changes)

## How to write

### Recurso de versionamento

```hcl
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.bucket

  versioning_configuration {
    status = "Enabled"
  }

  depends_on = [aws_s3_bucket.terraform_state]
}
```

### Bucket de estado (contexto)

```hcl
resource "aws_s3_bucket" "terraform_state" {
  bucket = "meu-projeto-terraform-state"
}
```

## Example

**Before (bucket sem versionamento):**
```hcl
resource "aws_s3_bucket" "terraform_state" {
  bucket = "meu-projeto-terraform-state"
}

# Estado remoto sem protecao — qualquer alteracao sobrescreve a versao anterior
```

**After (com versionamento habilitado):**
```hcl
resource "aws_s3_bucket" "terraform_state" {
  bucket = "meu-projeto-terraform-state"
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.bucket

  versioning_configuration {
    status = "Enabled"
  }

  depends_on = [aws_s3_bucket.terraform_state]
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Criando backend S3 para Terraform | Sempre adicione `aws_s3_bucket_versioning` |
| Precisa recuperar estado anterior | Use as versoes do S3 (console ou CLI) |
| Configurando pipeline de infra (CI/CD) | Estado remoto + versionamento elimina dependencia de maquina local |
| Backup do estado | Nao suba backup para S3 — mantenha local |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Bucket de estado sem versionamento | Sempre habilite `aws_s3_bucket_versioning` |
| Subir `.tfstate.backup` para o S3 | Mantenha backup local na maquina de execucao |
| Versionamento inline no recurso do bucket (deprecated) | Use recurso separado `aws_s3_bucket_versioning` |
| Omitir `depends_on` no versionamento | Adicione dependencia explicita no bucket |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
