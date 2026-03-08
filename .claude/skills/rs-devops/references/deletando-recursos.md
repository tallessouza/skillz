---
name: rs-devops-deletando-recursos
description: "Applies safe Terraform resource deletion patterns with plan-destroy and target scoping. Use when user asks to 'delete Terraform resource', 'terraform destroy safely', 'scope destroy with target', or 'protect resources from deletion'. Enforces plan before destroy, target-scoped deletion, prevent_destroy lifecycle, and dependency awareness. Make sure to use this skill whenever running terraform destroy or removing infrastructure resources. Not for state management (use dinamica-e-backup-do-estado) or resource creation."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-recursos
  tags: [terraform, destroy, target, lifecycle, prevent-destroy, plan, iac]
---

# Deletando Recursos no Terraform

> Sempre execute `plan -destroy` antes de destruir, e sempre use `--target` para delecoes escopadas.

## Rules

1. **Sempre rode plan antes de destroy** — `terraform plan -destroy` antes de `terraform destroy`
2. **Nunca rode destroy sem target em producao** — deleta TUDO no modulo
3. **Use --target para delecao escopada** — `--target module.nome.resource_type.resource_name`
4. **Mantenha o mesmo target no plan e no destroy**
5. **Proteja recursos criticos com lifecycle prevent_destroy**
6. **Entenda dependencias transitivas** — deletar um recurso pode forcar delecao de dependentes

## How to write

```bash
# 1. Planejar a delecao
terraform plan -destroy --target module.s3.aws_s3_bucket.bucket

# 2. Executar com mesmo target
terraform destroy --target module.s3.aws_s3_bucket.bucket
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

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `terraform destroy` em producao sem target | `terraform destroy --target <recurso>` |
| Rodar destroy sem plan antes | Plan primeiro, depois destroy |
| Usar target diferente no plan e no destroy | Copiar exatamente o mesmo `--target` |
| Remover `prevent_destroy` de recursos de estado | Manter sempre a protecao |

## Troubleshooting

### Terraform destroy deleta recursos que nao deveriam ser deletados
**Symptom:** Rodar `terraform destroy` remove recursos inesperados alem do alvo
**Cause:** Falta `--target` no comando, causando delecao de todos os recursos do modulo
**Fix:** Sempre usar `terraform destroy --target module.nome.resource_type.resource_name` para escopar a delecao

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
