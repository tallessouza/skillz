---
name: rs-devops-outputs
description: "Applies Terraform output patterns when exposing resource attributes for cross-module consumption. Use when user asks to 'expose terraform values', 'share resource attributes', 'create terraform outputs', 'chain terraform resources', or 'organize terraform project files'. Enforces outputs.tf separation, data source usage, and descriptive naming. Make sure to use this skill whenever generating Terraform outputs or organizing IaC file structure. Not for application code, CI/CD pipelines, or Kubernetes manifests."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-outputs
  tags: [terraform, outputs, iac, data-source, tfstate, variables]
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

## Troubleshooting

### Output mostra valor vazio ou null apos terraform apply
**Symptom:** Output definido mas `terraform apply` mostra valor vazio ou `(known after apply)` persistente
**Cause:** Data source referencia recurso que ainda nao existe ou nome do bucket/recurso esta errado
**Fix:** Verificar se o recurso foi criado com `terraform state list`, confirmar que o nome no data source corresponde ao recurso real

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Terraform Outputs

## O que sao outputs no contexto do Terraform

Outputs sao variaveis de saida que existem apos a criacao de um recurso. Quando o Terraform cria um recurso (ex: bucket S3), o estado (tfstate) armazena diversos atributos alem dos que voce definiu. Esses atributos podem ser uteis para criar outros recursos encadeados.

## Por que usar data sources como camada intermediaria

O instrutor explica que nao e obrigatorio usar data sources para acessar atributos — voce poderia referenciar diretamente o recurso. Porem, data sources trazem **padronizacao**: ao inves de acessar diretamente o recurso, voce acessa uma camada especifica de dados. Isso organiza o codigo e cria uma convencao clara de leitura.

A estrutura de acesso e: `data.<tipo>.<nome>.<atributo>`

## Analogia com VPC (recurso mais complexo)

O instrutor usa o exemplo de uma VPC para ilustrar o valor real dos outputs: quando voce cria uma VPC, as informacoes geradas (subnet IDs, route table IDs, etc.) sao necessarias para criar outros recursos de rede. Sem outputs, voce nao teria como encadear esses recursos no IaC de forma programatica.

## Organizacao por arquivos — principio de responsabilidade

O padrao recomendado e um arquivo por responsabilidade:

| Arquivo | Responsabilidade |
|---------|-----------------|
| `providers.tf` | Configuracao de provedores |
| `datasources.tf` | Data sources |
| `outputs.tf` | Variaveis de saida |
| `variables.tf` | Variaveis de entrada |
| `main.tf` | Recursos (vai ser reorganizado conforme projeto cresce) |

O instrutor reconhece que `main.tf` ainda esta "solto" neste ponto do curso e sera organizado depois. O importante e que outputs, providers e datasources ja estejam separados.

## Comportamento com workspaces

Um ponto importante demonstrado na aula: outputs refletem automaticamente o workspace ativo. Ao trocar de `staging` para `default` com `terraform workspace select default`, os mesmos outputs mostram valores diferentes porque o estado e diferente por workspace.

## Campos do bloco output

- **value** (obrigatorio): expressao que resolve para o valor desejado
- **sensitive** (opcional, default false): oculta o valor no output do plan/apply
- **description** (opcional mas recomendado): documentacao inline
- **depends_on** (opcional, array): dependencias explicitas — o instrutor menciona mas nao usa neste momento

## Fluxo plan → apply com outputs

1. `terraform plan` — detecta alteracoes nos outputs e mostra preview ("Changes to Outputs")
2. `terraform apply -auto-approve` — aplica e exibe os valores finais na saida
3. Recursos nao sao alterados apenas por adicionar outputs — apenas a saida muda

---

# Code Examples: Terraform Outputs

## Exemplo 1: Primeiro output — bucket_domain_name

```hcl
# outputs.tf
output "bucket_domain_name" {
  value       = data.aws_s3_bucket.bucket.bucket_domain_name
  sensitive   = false
  description = "Nome de dominio do bucket S3"
}
```

Saida do `terraform plan`:
```
Changes to Outputs:
  + bucket_domain_name = "meu-bucket-staging.s3.amazonaws.com"
```

Saida do `terraform apply -auto-approve`:
```
Apply complete! Resources: 0 added, 0 changed, 0 destroyed.

Outputs:

bucket_domain_name = "meu-bucket-staging.s3.amazonaws.com"
```

## Exemplo 2: Segundo output — bucket_region

```hcl
output "bucket_region" {
  value       = data.aws_s3_bucket.bucket.region
  sensitive   = false
  description = "Regiao do bucket S3"
}
```

Saida apos apply com ambos outputs:
```
Outputs:

bucket_domain_name = "meu-bucket-staging.s3.amazonaws.com"
bucket_region      = "us-east-1"
```

## Exemplo 3: Estrutura completa do projeto

```
project/
├── main.tf          # resource "aws_s3_bucket" "bucket" { ... }
├── providers.tf     # provider "aws" { ... }
├── datasources.tf   # data "aws_s3_bucket" "bucket" { ... }
├── outputs.tf       # output "bucket_domain_name" { ... }
└── variables.tf     # (futuro)
```

## Exemplo 4: Data source referenciado nos outputs

```hcl
# datasources.tf
data "aws_s3_bucket" "bucket" {
  bucket = "meu-bucket-staging"
}

# outputs.tf — acessa qualquer atributo do estado via data source
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

output "bucket_arn" {
  value       = data.aws_s3_bucket.bucket.arn
  sensitive   = false
  description = "ARN do bucket S3"
}
```

## Exemplo 5: Output com valor sensivel

```hcl
output "database_password" {
  value       = data.aws_ssm_parameter.db_password.value
  sensitive   = true
  description = "Senha do banco de dados"
}
```

Com `sensitive = true`, o Terraform exibe:
```
Outputs:

database_password = <sensitive>
```

## Exemplo 6: Diferenca entre workspaces

```bash
# No workspace staging
terraform workspace select staging
terraform apply -auto-approve
# Output: bucket_domain_name = "meu-bucket-staging.s3.amazonaws.com"

# No workspace default
terraform workspace select default
terraform apply -auto-approve
# Output: bucket_domain_name = "meu-bucket-default.s3.amazonaws.com"
```

## Exemplo 7: Usando output em outro recurso (proximo passo)

```hcl
# Cenario futuro: output de um recurso alimenta outro
output "vpc_id" {
  value       = data.aws_vpc.main.id
  sensitive   = false
  description = "ID da VPC principal"
}

# Outro recurso usando o valor
resource "aws_subnet" "public" {
  vpc_id     = data.aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
}
```
