---
name: rs-devops-mantendo-estado-na-nuvem
description: "Applies Terraform remote state configuration with S3 backend when setting up infrastructure state management. Use when user asks to 'configure remote state', 'store terraform state in S3', 'setup backend S3', 'migrate local state to remote', or 'create state bucket'. Follows AWS S3 backend pattern with prevent_destroy lifecycle, encryption, and state migration. Make sure to use this skill whenever configuring Terraform backends or state storage. Not for application deployment, CI/CD pipelines, or non-Terraform infrastructure tools."
---

# Terraform — Estado Remoto com S3

> Configure o backend S3 para armazenar o estado do Terraform na nuvem, protegendo contra delecao acidental e habilitando colaboracao em equipe.

## Prerequisites

- AWS CLI configurado com credenciais validas
- Terraform instalado (>= 1.0)
- Permissoes para criar buckets S3

## Steps

### Step 1: Criar variavel para o nome do bucket

```hcl
# variables.tf
variable "state_bucket" {
  type        = string
  default     = "minha-empresa-state-bucket-tf"
  description = "Bucket com o estado do Terraform"
}
```

### Step 2: Criar o bucket S3 com protecao contra destroy

```hcl
# providers.tf (ou arquivo configurativo)
resource "aws_s3_bucket" "terraform_state" {
  bucket = var.state_bucket

  lifecycle {
    prevent_destroy = true
  }
}
```

`prevent_destroy = true` impede que `terraform destroy` delete o bucket do estado — camada de seguranca critica, porque perder o estado significa perder o mapeamento de toda a infraestrutura.

### Step 3: Aplicar para criar o bucket

```bash
terraform plan
terraform apply -auto-approve
```

### Step 4: Configurar o backend S3

```hcl
# providers.tf — dentro do bloco terraform {}
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket  = "minha-empresa-state-bucket-tf"
    key     = "terraform.tfstate"
    region  = "us-east-2"
    encrypt = true
  }
}
```

O bloco `backend` nao aceita variaveis — os valores sao hardcoded por design do Terraform.

### Step 5: Reinicializar e migrar o estado

```bash
terraform fmt
terraform validate
terraform init
```

O Terraform detecta que existe estado local e pergunta se deseja migrar para o S3. Responder `yes` para copiar o estado automaticamente.

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto pequeno, dev solo | Backend local pode ser suficiente |
| Equipe ou CI/CD | Backend remoto obrigatorio |
| Mudou bloco `backend` | Rodar `terraform init` novamente |
| Outro cloud provider (Azure) | Usar `azurerm` backend com Blob Storage |
| Outro cloud provider (GCP) | Usar `gcs` backend com Cloud Storage |
| Projeto grande | Repositorio separado so para configuracao de estado |

## Error handling

- Se `terraform init` falhar com erro de nome: verificar que o campo e `bucket`, nao `name`
- Se o bucket ja existir com outro nome: ajustar o valor hardcoded no backend
- Se a migracao falhar: o estado local permanece intacto, corrigir e tentar novamente

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Bucket de estado sem `prevent_destroy` | Sempre adicionar `lifecycle { prevent_destroy = true }` |
| Variaveis dentro do bloco `backend` | Hardcode os valores (limitacao do Terraform) |
| Estado remoto sem `encrypt = true` | Sempre encriptar — contem toda a infraestrutura |
| Deletar bucket de estado manualmente | Migrar estado antes de qualquer remocao |
| Misturar config de estado com recursos de app | Separar em arquivo/repo configurativo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-mantendo-o-estado-na-nuvem/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-mantendo-o-estado-na-nuvem/references/code-examples.md)
