---
name: rs-devops-criando-repo-pipeline-terraform
description: "Applies GitHub Actions pipeline patterns for Terraform infrastructure when setting up CI/CD for IaC. Use when user asks to 'create terraform pipeline', 'setup github actions for terraform', 'automate terraform apply', 'ci cd infrastructure', or 'terraform fmt check'. Enforces gitignore for state files, setup-terraform action, AWS credentials action, and fmt/plan/apply sequence. Make sure to use this skill whenever creating CI/CD pipelines for Terraform. Not for application pipelines, Docker builds, or non-Terraform IaC tools."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: ci-cd-terraform-pipeline
  tags: [github-actions, terraform, ci-cd, pipeline, aws, infrastructure]
---

# Pipeline CI/CD para Infraestrutura Terraform

> Ao criar pipelines de infraestrutura, configure credenciais, setup do Terraform e execute os comandos na sequencia correta: init, fmt, plan, apply.

## Rules

1. **Nunca versione estado do Terraform** — `.tfstate`, `.terraform/`, `.tfvars` vao no `.gitignore`
2. **Configure o Terraform no runner** — use `hashicorp/setup-terraform@v3` com `terraform_version` explicita
3. **Configure credenciais AWS antes do Terraform** — use `aws-actions/configure-aws-credentials@v4`
4. **Execute fmt com --check** — `terraform fmt -check` quebra a pipeline se arquivos nao estiverem formatados
5. **Passe variaveis via env com prefixo TF_VAR_** — tanto no step de plan quanto no apply

## Pipeline estrutura

```yaml
name: ci
on:
  push:
    branches: [main]

jobs:
  run-terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-region: us-east-2
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.8.4
      - run: terraform init
      - run: terraform fmt -check
      - run: terraform plan
      - run: terraform apply -auto-approve
```

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Versionar `.tfstate` no git | Usar backend remoto |
| Rodar `apply` sem `init` | Sempre init, fmt, plan, apply |
| Esquecer `-auto-approve` no CI | Adicionar flag porque nao ha terminal interativo |
| Passar credenciais hardcoded | Usar `aws-actions/configure-aws-credentials` |

## Troubleshooting

### Pipeline falha no terraform apply sem terminal interativo
**Symptom:** `terraform apply` fica preso aguardando confirmacao e eventualmente falha por timeout no CI.
**Cause:** O comando `terraform apply` por padrao pede confirmacao interativa, que nao existe em ambientes CI.
**Fix:** Adicione a flag `-auto-approve` ao comando: `terraform apply -auto-approve`.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
