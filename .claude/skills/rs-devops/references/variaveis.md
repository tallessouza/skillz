---
name: rs-devops-variaveis
description: "Applies Terraform variable patterns for centralizing configuration and avoiding code duplication. Use when user asks to 'create terraform variable', 'avoid hardcoded values', 'use variables.tf', 'reference var.name', or 'parameterize terraform resources'. Enforces variables.tf file, explicit type definition, semantic naming by domain, and var. prefix for references. Make sure to use this skill whenever defining Terraform variables or extracting hardcoded values into variables.tf. Not for outputs, data sources, or module variable passing."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-variables
  tags: [terraform, variables, variables-tf, type, default, var-prefix, dry-principle, parameterization]
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


## Troubleshooting

### Erro "invalid reference" ao usar variavel
**Symptom:** `terraform plan` falha com erro de referencia invalida
**Cause:** Variavel referenciada sem o prefixo `var.` — ex: `org_name` em vez de `var.org_name`
**Fix:** Sempre use o prefixo `var.` ao referenciar variaveis definidas pelo usuario

### terraform plan pede input inesperado
**Symptom:** `terraform plan` para e pede valor para variavel interativamente
**Cause:** Variavel definida sem `default` e sem valor passado via `-var` ou `.tfvars`
**Fix:** Adicione `default` na definicao da variavel ou passe valor via `terraform plan -var="nome=valor"`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Variáveis no Terraform

## Por que variáveis existem no Terraform

O instrutor enfatiza que a principal vantagem de variáveis é **evitar código duplicado**. Quando o mesmo valor (como o nome de uma organização) aparece em múltiplos recursos — `resource`, `data source`, `output` — qualquer mudança exige editar todos os pontos. Variáveis centralizam isso.

## Dois tipos de variáveis

O instrutor faz uma distinção importante:

1. **Variáveis configurativas (constantes):** Valores fixos definidos com `default` em `variables.tf`. Exemplo: nome da organização, região padrão, flags de nomenclatura.

2. **Variáveis dinâmicas (outputs):** Valores que mudam a cada execução de `terraform apply`. São os `output` blocks que capturam IDs, ARNs, endpoints gerados pela infraestrutura.

Essa distinção é crucial porque determina onde e como o valor é definido.

## A decisão de naming: `bucket_name` → `org_name`

O instrutor começou criando `bucket_name` mas percebeu em tempo real que isso não escalaria. Se amanhã houver um segundo recurso (outro bucket, uma Lambda, um API Gateway), todos precisarão do prefixo da organização. Renomeou para `org_name` pensando em escalabilidade.

Esse raciocínio é: **nomeie pela semântica do domínio, não pelo recurso que consome**.

## O erro `invalid reference` e o prefixo `var.`

O instrutor demonstrou o erro ao vivo: definiu a variável `org_name` mas referenciou sem o prefixo `var.`. O Terraform retornou `invalid reference`. A lição:

- `terraform.xxx` = variáveis internas do Terraform (ex: `terraform.workspace`)
- `var.xxx` = variáveis definidas pelo usuário

O prefixo é obrigatório e indica a **origem** do valor.

## Tipos suportados

O instrutor mencionou que Terraform suporta:
- `string` — texto simples
- `list` — arrays
- `map` — objetos chave-valor
- `number`, `bool` — tipos primitivos

E reforçou: **sempre tipar**. A tipagem facilita entender o que trafega e previne erros.

## Conexão com módulos (próxima aula)

O instrutor antecipa que variáveis ganham muito mais poder com módulos:
- Cada módulo terá seu próprio `variables.tf`
- Variáveis serão escopadas por módulo
- Haverá variáveis dinâmicas passadas entre módulos via outputs
- Múltiplos data sources combinados com variáveis

## Fluxo de verificação

O instrutor usou `terraform plan` (não `apply`) para verificar se a variável estava funcionando. Esse é o padrão correto: plan valida a configuração sem aplicar mudanças reais.

---

# Code Examples: Variáveis no Terraform

## Exemplo 1: Definição básica de variável

```hcl
# variables.tf
variable "org_name" {
  type    = string
  default = "skillz"
}
```

**Anatomia:**
- `variable` — palavra reservada do Terraform
- `"org_name"` — nome da variável (entre aspas)
- `type = string` — tipagem obrigatória
- `default = "skillz"` — valor padrão (entre aspas duplas para strings)

## Exemplo 2: Uso em resource

```hcl
# main.tf
resource "aws_s3_bucket" "bucket" {
  bucket = "${var.org_name}-${terraform.workspace}-bucket"
}
```

**Nota:** Combina `var.org_name` (variável do usuário) com `terraform.workspace` (variável interna).

## Exemplo 3: Uso em data source

```hcl
# datasource.tf
data "aws_s3_bucket" "existing" {
  bucket = "${var.org_name}-${terraform.workspace}-bucket"
}
```

**Mesmo padrão:** A variável é reutilizada em ambos os contextos (resource e data source), garantindo consistência.

## Exemplo 4: O erro sem prefixo `var.`

```hcl
# ERRADO — causa "invalid reference"
resource "aws_s3_bucket" "bucket" {
  bucket = "${org_name}-${terraform.workspace}-bucket"
}
```

```hcl
# CORRETO — com prefixo var.
resource "aws_s3_bucket" "bucket" {
  bucket = "${var.org_name}-${terraform.workspace}-bucket"
}
```

## Exemplo 5: Variáveis para diferentes contextos

```hcl
# variables.tf — variáveis configurativas comuns
variable "org_name" {
  type    = string
  default = "skillz"
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "environment_prefix" {
  type    = string
  default = "app"
}
```

## Exemplo 6: Validação com terraform plan

```bash
# Sempre validar antes de aplicar
terraform plan

# Se precisar passar variável sem default
terraform plan -var="org_name=outra-org"
```

## Exemplo 7: Mudança centralizada

Para mudar de "skillz" para "nova-empresa":

```hcl
# Antes: editar N arquivos
# Depois: editar apenas variables.tf
variable "org_name" {
  type    = string
  default = "nova-empresa"  # mudou aqui, propagou para todos
}
```

Todos os recursos que referenciam `var.org_name` recebem o novo valor automaticamente.
