---
name: rs-devops-modularizando-o-s-3
description: "Enforces Terraform module creation patterns when writing infrastructure-as-code for AWS. Use when user asks to 'create a terraform module', 'modularize infrastructure', 'organize terraform code', 'create reusable terraform', or 'setup S3 with CloudFront'. Applies rules: modules/ folder convention, variables for genericity, outputs for inter-module communication, terraform init after module changes, terraform fmt for linting. Make sure to use this skill whenever creating or refactoring Terraform modules. Not for Terraform state management, CI/CD pipelines, or non-AWS providers."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-modulos-s3
  tags: [terraform, s3, modules, variables, outputs, workspace, iac]
---

# Modularizacao Terraform — Modulos S3

> Modulos Terraform sao abstracoes genericas que resolvem um problema especifico de criacao de recursos, recebendo configuracao via variaveis e expondo informacoes via outputs.

## Rules

1. **Crie modulos dentro de `modules/{recurso}/`** — `modules/s3/`, `modules/cloudfront/`, porque e a convencao padrao e o Terraform nao detecta arquivos fora da raiz automaticamente
2. **Cada modulo tem `main.tf`, `variables.tf`, `outputs.tf`** — mesma estrutura do root, porque mantem consistencia e previsibilidade
3. **Nunca hardcode valores no modulo** — use `var.nome` em vez de strings fixas, porque o modulo deve ser reutilizavel por outros projetos
4. **Declare o modulo no root com `module` block** — inclua `source = "./modules/s3"`, porque o Terraform ignora pastas nao referenciadas
5. **Rode `terraform init` apos adicionar/alterar modulos** — mesmo modulos locais precisam de instalacao, porque o Terraform trata todo modulo como potencialmente externo
6. **Rode `terraform fmt` regularmente** — garante indentacao de 2 espacos (padrao Terraform), porque mantem o codigo lintado e padronizado
7. **Toda variavel passada ao modulo deve existir em `variables.tf`** — variaveis nao declaradas causam erro `argument not expected`, porque o Terraform valida estritamente os inputs

## How to write

### Estrutura de pastas do modulo

```
modules/
└── s3/
    ├── main.tf        # Recursos (aws_s3_bucket, etc.)
    ├── variables.tf   # Inputs do modulo
    └── outputs.tf     # Outputs para outros modulos
```

### main.tf do modulo

```hcl
resource "aws_s3_bucket" "bucket" {
  bucket = "${var.s3_bucket}-${terraform.workspace}"

  tags = {
    Name        = var.s3_bucket
    Environment = terraform.workspace
  }
}
```

### variables.tf do modulo

```hcl
variable "s3_bucket" {
  type        = string
  description = "Nome do bucket S3"
  # Sem default — forca o consumidor a passar o valor
}
```

### outputs.tf do modulo

```hcl
output "bucket_domain_name" {
  value       = aws_s3_bucket.bucket.bucket_domain_name
  sensitive   = false
  description = "Dominio do bucket para configuracao do CloudFront"
}
```

### Consumindo o modulo no root main.tf

```hcl
module "s3" {
  source = "./modules/s3"

  s3_bucket = "skillz"
}
```

## Example

**Before (tudo no root, sem modulo):**
```hcl
# main.tf (root) — recurso direto, nao reutilizavel
resource "aws_s3_bucket" "bucket" {
  bucket = "skillz-staging"
  tags = {
    Name = "skillz"
  }
}
```

**After (modularizado):**
```hcl
# modules/s3/main.tf
resource "aws_s3_bucket" "bucket" {
  bucket = "${var.s3_bucket}-${terraform.workspace}"
  tags = {
    Name        = var.s3_bucket
    Environment = terraform.workspace
  }
}

# modules/s3/variables.tf
variable "s3_bucket" {
  type        = string
  description = "Nome do bucket S3"
}

# modules/s3/outputs.tf
output "bucket_domain_name" {
  value       = aws_s3_bucket.bucket.bucket_domain_name
  sensitive   = false
  description = "Dominio do bucket"
}

# main.tf (root)
module "s3" {
  source    = "./modules/s3"
  s3_bucket = "skillz"
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Recurso sera usado por multiplos projetos | Extraia para modulo em `modules/` |
| Recurso depende de output de outro | Use `module.s3.bucket_domain_name` |
| Adicionou/alterou modulo | `terraform init` antes de `plan` |
| Indentacao inconsistente | `terraform fmt` resolve automaticamente |
| Variavel sem default | Obrigatorio passar no bloco `module {}` |
| Workspace determina ambiente | Use `terraform.workspace` no nome do recurso |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Hardcode nome do bucket no modulo | Use `var.s3_bucket` + `terraform.workspace` |
| Criar recursos fora do root sem `module` block | Declare `module "s3" { source = "./modules/s3" }` |
| Passar variavel nao declarada no `variables.tf` | Declare toda variavel esperada antes de usar |
| Rodar `terraform plan` apos adicionar modulo sem `init` | Sempre `terraform init` primeiro |
| Usar indentacao de 4 espacos | `terraform fmt` para padrao de 2 espacos |
| Colocar modulos internos fora de `modules/` | Convencao: `modules/{nome_recurso}/` |

## Troubleshooting

### Terraform retorna "argument not expected" ao passar variavel para modulo
**Symptom:** `terraform plan` falha com erro de argumento inesperado no bloco `module {}`
**Cause:** A variavel esta sendo passada no bloco `module {}` mas nao foi declarada no `variables.tf` do modulo
**Fix:** Declare toda variavel esperada no `variables.tf` do modulo antes de passa-la no bloco `module {}`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
