---
name: rs-devops-variaveis
description: "Enforces Terraform variable conventions when writing infrastructure code. Use when user asks to 'create terraform resources', 'define variables', 'write HCL', 'configure infrastructure', or 'avoid duplicated values in terraform'. Applies rules: always type variables, use variables.tf file, reference with var. prefix, prefer org-level naming for scalability. Make sure to use this skill whenever generating Terraform code with repeated values. Not for application-level environment variables, shell variables, or CI/CD secrets management."
---

# Variáveis no Terraform

> Toda informação repetida em código Terraform deve ser extraída para uma variável tipada em `variables.tf`.

## Rules

1. **Crie um arquivo `variables.tf` na raiz do módulo** — todas as variáveis configurativas ficam neste arquivo, porque centraliza a configuração e facilita descoberta
2. **Sempre defina `type`** — `string`, `list`, `map`, `number`, `bool`, porque tipagem explícita previne erros silenciosos e documenta o que é esperado
3. **Defina `default` quando o valor for constante** — valores que não mudam entre ambientes devem ter default, porque evita exigir input desnecessário no `plan`/`apply`
4. **Referencie com `var.nome`** — nunca use o valor direto quando existir variável, porque `var.` identifica claramente a origem do valor
5. **Nomeie pela semântica organizacional, não pelo recurso** — `org_name` em vez de `bucket_name`, porque um nome organizacional escala para múltiplos recursos
6. **Diferencie variáveis configurativas de dinâmicas** — configurativas têm `default` fixo; dinâmicas vêm de `output` de outros recursos, porque a origem determina como consumir

## How to write

### Definição de variável

```hcl
# variables.tf
variable "org_name" {
  type    = string
  default = "skillz"
}
```

### Uso da variável em recursos

```hcl
# main.tf
resource "aws_s3_bucket" "bucket" {
  bucket = "${var.org_name}-${terraform.workspace}-bucket"
}

# datasource.tf
data "aws_s3_bucket" "existing" {
  bucket = "${var.org_name}-${terraform.workspace}-bucket"
}
```

## Example

**Before (valor duplicado):**
```hcl
resource "aws_s3_bucket" "bucket" {
  bucket = "skillz-${terraform.workspace}-bucket"
}

data "aws_s3_bucket" "existing" {
  bucket = "skillz-${terraform.workspace}-bucket"
}
```

**After (variável centralizada):**
```hcl
# variables.tf
variable "org_name" {
  type    = string
  default = "skillz"
}

# main.tf
resource "aws_s3_bucket" "bucket" {
  bucket = "${var.org_name}-${terraform.workspace}-bucket"
}

data "aws_s3_bucket" "existing" {
  bucket = "${var.org_name}-${terraform.workspace}-bucket"
}
```

## Heuristics

| Situação | Ação |
|----------|------|
| Mesmo valor aparece 2+ vezes | Extrair para `variables.tf` |
| Valor muda entre ambientes | Variável sem `default`, passar via `-var` ou `.tfvars` |
| Valor nunca muda | Variável com `default` |
| Valor vem de outro recurso | Usar `output`, não `variable` |
| Prefixo `terraform.` | Variável interna do Terraform (ex: `terraform.workspace`) |
| Prefixo `var.` | Variável definida pelo usuário em `variables.tf` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `bucket = "skillz-prod-bucket"` (hardcoded) | `bucket = "${var.org_name}-${terraform.workspace}-bucket"` |
| `variable "x" {}` (sem type) | `variable "x" { type = string }` |
| `variable "bucket_name" {}` (nome específico demais) | `variable "org_name" {}` (escalável) |
| `var.org_name` sem definir em `variables.tf` | Definir primeiro, usar depois |
| Variáveis soltas no `main.tf` | Centralizar em `variables.tf` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
