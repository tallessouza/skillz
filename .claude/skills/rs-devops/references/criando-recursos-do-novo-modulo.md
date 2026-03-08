---
name: rs-devops-criando-recursos-modulo-externo
description: "Applies Terraform external module patterns when creating AWS resources like SQS queues with DLQ. Use when user asks to 'use terraform module', 'create SQS with terraform', 'terraform registry module', 'abstract terraform resources', or 'terraform module sqs'. Enforces module usage from registry, terraform init workflow, and proper DLQ configuration. Make sure to use this skill whenever using external Terraform modules from the registry. Not for writing custom modules, Kubernetes resources, or non-AWS providers."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-modules
  tags: [terraform, modules, sqs, dlq, terraform-registry, iac, aws]
---

# Terraform — Criando Recursos com Modulos Externos

> Usar modulos externos do Terraform Registry para abstrair complexidade e reaproveitar codigo, reduzindo manifestos gigantescos a poucas linhas.

## Rules

1. **Sempre rode `terraform init` ao adicionar um modulo novo** — porque o Terraform precisa baixar o modulo do registry antes de plan/apply
2. **Respeite a ordem de criacao de recursos dependentes** — DLQ antes da fila principal, porque a fila referencia a DLQ
3. **Use `terraform plan` antes de `apply`** — porque o plan revela quantos recursos serao criados
4. **Nomeie DLQs com sufixo `-dlq`** — padrao da industria
5. **Prefira modulos do registry a recursos raw** — porque um modulo abstrai fila + DLQ + redrive policy em ~5 linhas
6. **Para remover recursos de modulo, remova o codigo e rode `apply`** — nao precisa de `terraform destroy` separado

## How to write

### Declaracao de modulo SQS externo

```hcl
module "sqs" {
  source  = "terraform-aws-modules/sqs/aws"
  version = "~> 4.0"

  name       = "SkillzSQS"
  create_dlq = true

  tags = {
    Environment = "production"
    Project     = "skillz"
  }
}
```

## Example

**Before (sem modulo — recursos raw):**
```hcl
resource "aws_sqs_queue" "dlq" {
  name = "SkillzSQS-dlq"
}

resource "aws_sqs_queue" "main" {
  name = "SkillzSQS"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = 3
  })
}
```

**After (com modulo externo):**
```hcl
module "sqs" {
  source     = "terraform-aws-modules/sqs/aws"
  name       = "SkillzSQS"
  create_dlq = true
}
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar DLQ e fila manualmente quando modulo existe | `module "sqs" { create_dlq = true }` |
| Rodar `apply` sem `init` apos adicionar modulo | Sempre `terraform init` primeiro |
| Usar `terraform destroy` para remover um modulo | Remova o codigo e rode `terraform apply` |
| Criar DLQ de uma DLQ | DLQ nao tem DLQ propria |

## Troubleshooting

### terraform plan falha com "Module not installed"
**Symptom:** `terraform plan` retorna erro indicando que o modulo nao foi encontrado ou nao esta instalado.
**Cause:** O modulo foi adicionado ao codigo mas `terraform init` nao foi executado para baixa-lo do registry.
**Fix:** Execute `terraform init` sempre que adicionar, remover ou alterar a versao de um modulo externo.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
