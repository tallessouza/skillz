---
name: rs-devops-configurando-modulo-externo
description: "Applies Terraform external module usage patterns when configuring infrastructure with third-party registry modules. Use when user asks to 'use a terraform module', 'add SQS', 'use registry module', 'configure external module', or 'add terraform dependency from registry'. Enforces source referencing, version pinning, DLQ best practices, and tag standards. Make sure to use this skill whenever importing modules from registry.terraform.io. Not for creating custom local modules, writing providers, or application-level queue consumption code."
---

# Módulos Externos do Terraform

> Ao usar módulos do Terraform Registry, declare source com referência completa, ative DLQ por padrão em filas, e sempre aplique tags de rastreabilidade.

## Rules

1. **Use módulos do registry para recursos padrão** — `source = "terraform-aws-modules/sqs/aws"` não uma pasta local, porque módulos open source já abstraem complexidade e são mantidos pela comunidade
2. **Sempre ative Dead Letter Queue em filas SQS** — `create_dlq = true` por padrão, porque eventos perdidos são irrecuperáveis sem DLQ
3. **Aplique tags de IaC em todo recurso** — `managed_by = "iac"` no mínimo, porque recursos sem tag são invisíveis em auditorias
4. **Nunca misture fila FIFO com standard após criação** — trocar tipo exige deletar e recriar, porque AWS não permite edição do tipo de fila
5. **Contribua com módulos quando encontrar gaps** — abra issue ou PR no GitHub do módulo, porque o ecossistema depende de contribuições
6. **Prefira módulos verificados** — escolha módulos com badge "verified" no registry, porque têm manutenção ativa e padrões de qualidade

## How to write

### Declaração de módulo externo (SQS com DLQ)

```hcl
module "sqs" {
  source  = "terraform-aws-modules/sqs/aws"

  name       = "my-queue"
  create_dlq = true

  tags = {
    managed_by = "iac"
    Environment = var.environment
  }
}
```

### Buscando módulos no registry

```
# Acesse registry.terraform.io → Modules
# Filtre por provider (AWS, Azure, GCP)
# Copie o bloco de uso do módulo
# Ajuste variáveis conforme seu caso
```

## Example

**Before (recurso SQS sem módulo, sem DLQ):**

```hcl
resource "aws_sqs_queue" "my_queue" {
  name = "my-queue"
}
```

**After (módulo externo com DLQ e tags):**

```hcl
module "sqs" {
  source  = "terraform-aws-modules/sqs/aws"

  name       = "my-queue"
  create_dlq = true

  tags = {
    managed_by  = "iac"
    Environment = "production"
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Recurso AWS comum (SQS, VPC, EKS, S3) | Busque módulo no registry antes de escrever do zero |
| Fila SQS de qualquer tipo | Ative DLQ para garantir resiliência |
| Módulo não tem variável que precisa | Contribua via issue/PR no GitHub do módulo |
| Fila FIFO vs Standard | Decida antes de criar — não é editável depois |
| KMS encryption necessária | Use variante com KMS do módulo, requer KMS key pré-existente |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `source = "./sqs"` para recurso genérico | `source = "terraform-aws-modules/sqs/aws"` |
| Fila SQS sem DLQ | `create_dlq = true` sempre |
| Recurso sem tags | `tags = { managed_by = "iac" }` no mínimo |
| Recriar módulo que já existe no registry | Buscar no registry.terraform.io primeiro |
| Editar tipo de fila (FIFO↔Standard) | Deletar e recriar com tipo correto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
