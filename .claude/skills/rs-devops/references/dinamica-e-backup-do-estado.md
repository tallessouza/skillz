---
name: rs-devops-dinamica-e-backup-do-estado
description: "Applies Terraform state management best practices including remote backends and backup strategies. Use when user asks to 'manage Terraform state', 'configure S3 backend', 'restore tfstate backup', or 'prevent state file corruption'. Enforces never committing tfstate to Git, using remote backends, state CLI commands over manual edits, and backup restoration procedures. Make sure to use this skill whenever configuring Terraform backends or managing tfstate files. Not for resource creation (use criando-nosso-primeiro-recurso) or variable management."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-estado
  tags: [terraform, tfstate, state, backend, s3, backup, gitignore]
---

# Dinamica e Backup do Estado Terraform

> O tfstate e a fonte da verdade da infraestrutura — nunca comitar no Git, sempre gerenciar remotamente com backup.

## Rules

1. **Nunca comitar tfstate no repositorio** — adicionar `*.tfstate` ao `.gitignore`
2. **Estado so muda no apply com sucesso** — `plan` nao altera estado
3. **Tfstate e a fonte da verdade** — alteracoes diretas no cloud geram dissonancia
4. **Backup e sempre a versao anterior** — `.tfstate.backup` contem o estado antes do ultimo apply
5. **Usar backend remoto (S3) em producao** — estado compartilhado e versionado
6. **Evitar alterar estado manualmente** — usar `terraform state` apenas quando necessario

## Comandos de estado

```bash
terraform state list
terraform state show aws_s3_bucket.example
terraform state mv SOURCE DESTINATION
terraform state pull > state.json
terraform state push state.json
terraform state rm aws_s3_bucket.example
```

## Restauracao de backup

```bash
cp terraform.tfstate.backup terraform.tfstate
```

## Backend remoto (S3)

```hcl
terraform {
  backend "s3" {
    bucket = "meu-projeto-terraform-state"
    key    = "env/stage/terraform.tfstate"
    region = "us-east-1"
  }
}
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Comitar `*.tfstate` no Git | `.gitignore` + backend remoto |
| Editar tfstate manualmente em JSON | Usar `terraform state` CLI |
| Alterar recurso direto no console AWS | Alterar no `.tf` e rodar `apply` |
| Deletar tfstate achando que recria | Estado perdido = Terraform perde controle |

## Troubleshooting

### Terraform mostra recursos para criar que ja existem no cloud
**Symptom:** `terraform plan` quer criar recursos que ja existem na AWS
**Cause:** Estado local foi perdido ou corrompido, Terraform nao sabe que os recursos existem
**Fix:** Usar `terraform import resource_type.name <cloud-id>` para importar recursos existentes para o estado

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
