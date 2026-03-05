# Code Examples: Variáveis no Terraform

## Exemplo 1: Definição básica de variável

```hcl
# variables.tf
variable "org_name" {
  type    = string
  default = "rocketseat"
}
```

**Anatomia:**
- `variable` — palavra reservada do Terraform
- `"org_name"` — nome da variável (entre aspas)
- `type = string` — tipagem obrigatória
- `default = "rocketseat"` — valor padrão (entre aspas duplas para strings)

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
  default = "rocketseat"
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

Para mudar de "rocketseat" para "nova-empresa":

```hcl
# Antes: editar N arquivos
# Depois: editar apenas variables.tf
variable "org_name" {
  type    = string
  default = "nova-empresa"  # mudou aqui, propagou para todos
}
```

Todos os recursos que referenciam `var.org_name` recebem o novo valor automaticamente.