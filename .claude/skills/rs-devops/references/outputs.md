---
name: rs-devops-outputs
description: "Applies Terraform output variable patterns when writing infrastructure-as-code. Use when user asks to 'create terraform outputs', 'expose resource attributes', 'pass values between terraform modules', 'configure terraform output variables', or any IaC task involving resource attribute extraction. Enforces data source layer usage, file organization (outputs.tf), and proper output block structure with value, sensitive, and description fields. Make sure to use this skill whenever generating Terraform configurations that need to expose or share resource attributes. Not for Terraform variables (inputs), provider configuration, or resource creation."
---

# Terraform Outputs

> Outputs sao variaveis de saida pos-criacao de recursos que expoe atributos do estado para uso em outros recursos ou modulos.

## Rules

1. **Crie um arquivo `outputs.tf` dedicado** — nunca misture outputs em `main.tf` ou outros arquivos, porque separacao por responsabilidade evita bagunca no gerenciamento de infra
2. **Use data sources como camada de acesso** — prefira `data.aws_s3_bucket.bucket.attr` ao inves de acessar o recurso diretamente, porque data sources padronizam o acesso e organizam a leitura de atributos
3. **Sempre inclua description** — todo output deve ter uma descricao clara do que representa, porque facilita a leitura do `terraform plan` e documentacao automatica
4. **Marque sensitive quando necessario** — senhas, tokens e chaves devem ter `sensitive = true`, porque o Terraform oculta esses valores no output do plan/apply
5. **Nomeie outputs pelo conteudo, nao pela estrutura** — `bucket_domain_name` nao `output_1` ou `s3_data`, porque o nome deve descrever o atributo exposto
6. **Siga o padrao de arquivos** — `providers.tf`, `datasources.tf`, `outputs.tf`, `variables.tf`, `main.tf`, porque cada arquivo tem uma responsabilidade clara

## How to write

### Output basico com data source

```hcl
# outputs.tf
output "bucket_domain_name" {
  value       = data.aws_s3_bucket.bucket.bucket_domain_name
  sensitive   = false
  description = "Nome de dominio do bucket S3"
}
```

### Multiplos outputs do mesmo recurso

```hcl
output "bucket_domain_name" {
  value       = data.aws_s3_bucket.bucket.bucket_domain_name
  sensitive   = false
  description = "Nome de dominio do bucket S3"
}

output "bucket_region" {
  value       = data.aws_s3_bucket.bucket.region
  sensitive   = false
  description = "Regiao do bucket S3"
}
```

### Estrutura de acesso via data source

```hcl
# Padrao: data.<tipo_recurso>.<nome_local>.<atributo>
data.aws_s3_bucket.bucket.bucket_domain_name
data.aws_s3_bucket.bucket.region
data.aws_s3_bucket.bucket.arn
```

## Example

**Before (outputs misturados no main.tf, sem data source):**
```hcl
# main.tf — tudo junto
resource "aws_s3_bucket" "bucket" {
  bucket = "meu-bucket-staging"
  tags   = { Environment = "staging" }
}

output "nome" {
  value = aws_s3_bucket.bucket.bucket_domain_name
}
```

**After (com this skill applied):**
```hcl
# main.tf — apenas recursos
resource "aws_s3_bucket" "bucket" {
  bucket = "meu-bucket-staging"
  tags   = { Environment = "staging" }
}

# datasources.tf — camada de leitura
data "aws_s3_bucket" "bucket" {
  bucket = "meu-bucket-staging"
}

# outputs.tf — variaveis de saida
output "bucket_domain_name" {
  value       = data.aws_s3_bucket.bucket.bucket_domain_name
  sensitive   = false
  description = "Nome de dominio do bucket S3"
}

output "bucket_region" {
  value       = data.aws_s3_bucket.bucket.region
  sensitive   = false
  description = "Regiao do bucket S3"
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa usar atributo de um recurso em outro recurso | Crie output via data source, referencie no outro recurso |
| Atributo e senha, token ou chave | `sensitive = true` |
| Projeto com multiplos workspaces | Outputs refletem valores diferentes por workspace automaticamente |
| Apenas um recurso no projeto | Ainda assim separe em `outputs.tf` |
| Atributo disponivel no tfstate | Pode ser exposto como output |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Output sem description | Output com `description = "..."` sempre |
| Outputs dentro de `main.tf` | Arquivo dedicado `outputs.tf` |
| `aws_s3_bucket.bucket.attr` direto no output | `data.aws_s3_bucket.bucket.attr` via data source |
| `output "output_1"` | `output "bucket_domain_name"` (nome descritivo) |
| Senha exposta sem sensitive | `sensitive = true` para dados sensiveis |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-outputs/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-outputs/references/code-examples.md)
