---
name: rs-devops-criando-repo-estruturando-pipeline
description: "Generates GitHub Actions CI/CD pipelines for Terraform infrastructure projects. Use when user asks to 'create a pipeline for terraform', 'setup CI/CD for infrastructure', 'configure github actions for IaC', 'automate terraform with pipeline', or 'structure a terraform workflow'. Applies correct .gitignore, AWS credentials setup, HashiCorp setup-terraform action, and terraform command sequence (init, fmt, plan, apply). Make sure to use this skill whenever creating or modifying CI/CD pipelines for Terraform/IaC projects. Not for application CI/CD, Docker pipelines, or Kubernetes deployments."
---

# Pipeline CI/CD para Infraestrutura Terraform

> Ao criar pipelines de infraestrutura, configure credenciais, setup do Terraform e execute os comandos na sequencia correta: init, fmt, plan, apply.

## Rules

1. **Nunca versione estado do Terraform** — `.tfstate`, `.tfstate.backup`, `.terraform/`, `.terraform.lock.hcl` e `.tfvars` vao no `.gitignore`, porque o estado nao e versionavel a nivel de codigo e tfvars e equivalente ao `.env`
2. **Crie o pipeline via codigo, nao pela UI** — crie `.github/workflows/ci.yaml` manualmente no repositorio, porque da mais controle e rastreabilidade
3. **Configure o Terraform no runner** — use `hashicorp/setup-terraform@v3` com `terraform_version` explicita, porque o Ubuntu do runner nao tem Terraform instalado
4. **Configure credenciais AWS antes do Terraform** — use `aws-actions/configure-aws-credentials@v4` com `role-to-assume` e `aws-region`, porque sem credenciais nenhum comando Terraform funciona
5. **Execute fmt com --check** — `terraform fmt -check` quebra a pipeline se arquivos nao estiverem formatados, porque funciona como lint dos arquivos HCL
6. **Passe variaveis via env com prefixo TF_VAR_** — `TF_VAR_nome_variavel` tanto no step de plan quanto no apply, porque o Terraform le variaveis de ambiente com esse prefixo

## .gitignore para Terraform

```gitignore
*.tfstate
*.tfstate.backup
*.tfvars
.terraform/
.terraform.lock.hcl
```

## Pipeline estrutura

```yaml
name: ci

on:
  push:
    branches:
      - main

jobs:
  run-terraform:
    name: Run Terraform
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

      - name: Run Terraform Init
        run: terraform init

      - name: Run Terraform Format
        run: terraform fmt -check

      - name: Run Terraform Plan
        run: terraform plan

      - name: Run Terraform Apply
        run: terraform apply -auto-approve
```

## Example

**Before (pipeline incompleta/errada):**
```yaml
steps:
  - run: terraform apply
```

**After (com esta skill aplicada):**
```yaml
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
  - name: Run Terraform Init
    run: terraform init
  - name: Run Terraform Format
    run: terraform fmt -check
  - name: Run Terraform Plan
    run: terraform plan
  - name: Run Terraform Apply
    run: terraform apply -auto-approve
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto Terraform novo | Crie `.gitignore` antes do primeiro commit |
| Tem variaveis no Terraform | Adicione `env: TF_VAR_x` nos steps plan E apply |
| Variavel sensivel | Use `${{ secrets.NOME }}` do GitHub Secrets |
| Precisa de versao especifica do Terraform | Defina em `terraform_version` no setup-terraform |
| Terraform Cloud disponivel | Considere como alternativa ao GitHub Actions (HashiCorp tem servico proprio) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Versionar `.tfstate` no git | Usar backend remoto (S3, Terraform Cloud) |
| Rodar `terraform apply` sem `init` antes | Sempre init → fmt → plan → apply |
| Esquecer `-auto-approve` no apply do CI | Adicionar flag porque nao ha terminal interativo |
| Passar credenciais hardcoded no YAML | Usar `aws-actions/configure-aws-credentials` com role |
| Pular `fmt -check` na pipeline | Incluir como lint obrigatorio |
| Passar variavel so no plan | Passar `TF_VAR_` tanto no plan quanto no apply |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
