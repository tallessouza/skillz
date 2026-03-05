---
name: rs-devops-criando-recursos-novo-modulo
description: "Applies Terraform external module patterns when provisioning AWS resources like SQS queues. Use when user asks to 'create terraform module', 'use terraform registry', 'provision SQS', 'configure dead letter queue', or 'abstract terraform resources'. Covers module init workflow, resource creation order, DLQ redrive policies, and module vs raw resource trade-offs. Make sure to use this skill whenever writing Terraform that uses external modules from the registry. Not for Terraform state management, CI/CD pipelines, or non-module resource definitions."
---

# Terraform — Criando Recursos com Modulos Externos

> Usar modulos externos do Terraform Registry para abstrair complexidade e reaproveitar codigo, reduzindo manifestos gigantescos a poucas linhas.

## Rules

1. **Sempre rode `terraform init` ao adicionar um modulo novo** — porque o Terraform precisa baixar o modulo do registry antes de plan/apply, e erros de referencia aparecem nesse momento
2. **Respeite a ordem de criacao de recursos dependentes** — DLQ antes da fila principal, porque a fila referencia a DLQ e sem ela o apply falha com "resource not found"
3. **Use `terraform plan` antes de `apply`** — porque o plan revela quantos recursos serao criados (um modulo pode gerar 4+ recursos a partir de 3 linhas)
4. **Nomeie DLQs com sufixo `-dlq`** — `SkillzSQS-dlq` e o padrao da industria, o proprio modulo concatena automaticamente
5. **Prefira modulos do registry a recursos raw** — porque um modulo abstrai fila + DLQ + redrive policy em ~5 linhas vs dezenas de linhas com recursos individuais
6. **Para remover recursos de modulo, remova o codigo e rode `apply`** — nao precisa de `terraform destroy` separado, o plan detecta a remocao e destroi automaticamente

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

### Workflow de inicializacao

```bash
# 1. Inicializar (baixa o modulo do registry)
terraform init

# 2. Planificar (ver os 4 recursos que serao criados)
terraform plan

# 3. Aplicar
terraform apply -auto-approve
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

resource "aws_sqs_queue_redrive_allow_policy" "dlq" {
  queue_url = aws_sqs_queue.dlq.id
  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue"
    sourceQueueArns   = [aws_sqs_queue.main.arn]
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

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de fila + DLQ + redrive | Use modulo, nao recursos individuais |
| `terraform init` falha ao baixar modulo | Verifique o `source` — referencia errada nao existe no registry |
| Plan mostra mais recursos que o esperado | Normal — modulo abstrai recursos adicionais (policies, redrive) |
| Quer remover recurso de modulo | Remova o bloco `module {}` e rode `apply` |
| Fila FIFO necessaria | Configure `fifo_queue = true` no modulo |
| Precisa do output (URL/ARN da fila) | Configure `output` no root module apontando para `module.sqs.*` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar DLQ e fila manualmente quando modulo existe | `module "sqs" { create_dlq = true }` |
| Rodar `apply` sem `init` apos adicionar modulo | Sempre `terraform init` primeiro |
| Usar `terraform destroy` para remover um modulo | Remova o codigo e rode `terraform apply` |
| Ignorar o `terraform plan` | Sempre verifique quantos recursos serao criados/destruidos |
| Criar DLQ de uma DLQ | DLQ nao tem DLQ propria — seria "backup do backup" |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
