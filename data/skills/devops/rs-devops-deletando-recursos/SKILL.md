---
name: rs-devops-deletando-recursos
description: "Applies Terraform resource deletion best practices when managing infrastructure teardown. Use when user asks to 'destroy terraform resources', 'delete infrastructure', 'remove a specific resource', 'terraform destroy', or 'targeted destroy'. Enforces scoped deletion with --target, plan-before-destroy workflow, and lifecycle prevention. Make sure to use this skill whenever deleting or planning deletion of Terraform-managed resources. Not for creating, updating, or importing Terraform resources."
---

# Deletando Recursos no Terraform

> Sempre execute `plan -destroy` antes de destruir, e sempre use `--target` para deleções escopadas.

## Rules

1. **Sempre rode plan antes de destroy** — `terraform plan -destroy` antes de `terraform destroy`, porque o plan mostra exatamente o que sera deletado sem executar nada
2. **Nunca rode destroy sem target em producao** — `terraform destroy` sem `--target` deleta TUDO no modulo, porque o escopo padrao e aberto
3. **Use --target para deleção escopada** — `--target module.nome.resource_type.resource_name` deleta apenas o recurso especificado, porque evita destruicao acidental de toda a infraestrutura
4. **Mantenha o mesmo target no plan e no destroy** — o target passado no `plan -destroy` deve ser identico ao passado no `destroy`, porque divergencias causam delecoes inesperadas
5. **Proteja recursos criticos com lifecycle prevent_destroy** — recursos que mantem estado (ex: backend S3 do tfstate) devem ter `prevent_destroy = true`, porque garante que mesmo um destroy acidental nao perde o estado
6. **Entenda dependencias transitivas** — deletar um recurso pode forcar a delecao de recursos dependentes (ex: deletar S3 bucket pode deletar CloudFront associado), porque Terraform resolve o grafo de dependencias automaticamente

## How to write

### Deleção escopada com --target

```hcl
# Recurso dentro de um modulo: module.<modulo>.<tipo>.<nome>
# Exemplo: deletar apenas o bucket S3 dentro do modulo s3

# 1. Planejar a delecao
# terraform plan -destroy --target module.s3.aws_s3_bucket.bucket

# 2. Executar a delecao (mesmo target)
# terraform destroy --target module.s3.aws_s3_bucket.bucket

# Alternativa via apply:
# terraform apply -destroy --target module.s3.aws_s3_bucket.bucket
```

### Protecao contra delecao acidental

```hcl
resource "aws_s3_bucket" "tfstate" {
  bucket = "my-terraform-state"

  lifecycle {
    prevent_destroy = true
  }
}
```

## Example

**Before (perigoso — destroy sem escopo):**
```bash
# Deleta TODOS os recursos do modulo
terraform destroy
```

**After (com esta skill aplicada):**
```bash
# 1. Verificar o que sera deletado
terraform plan -destroy --target module.s3.aws_s3_bucket.bucket

# 2. Revisar o plano (pode incluir dependencias transitivas)
# Plan: 0 to add, 0 to change, 3 to destroy.

# 3. Executar com o mesmo target
terraform destroy --target module.s3.aws_s3_bucket.bucket
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Deletar toda a infra de um ambiente | `terraform destroy` (sem target) — apenas em ambientes descartaveis |
| Deletar um recurso especifico | `terraform destroy --target <address>` |
| Recurso dentro de modulo | Usar path completo: `module.<mod>.<type>.<name>` |
| Recurso que guarda estado (tfstate, DB) | Adicionar `lifecycle { prevent_destroy = true }` |
| Multiplos recursos para deletar | Passar multiplos `--target` flags |
| Duvida sobre dependencias | Rodar `plan -destroy --target` primeiro e revisar |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `terraform destroy` em producao sem target | `terraform destroy --target <recurso_especifico>` |
| Rodar destroy sem plan antes | `terraform plan -destroy --target X` → revisar → `terraform destroy --target X` |
| Usar target diferente no plan e no destroy | Copiar exatamente o mesmo `--target` do plan para o destroy |
| Confiar que destroy deleta apenas 1 recurso | Revisar o plan — dependencias transitivas podem incluir mais recursos |
| Remover `prevent_destroy` de recursos de estado | Manter sempre a protecao no backend do tfstate |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
