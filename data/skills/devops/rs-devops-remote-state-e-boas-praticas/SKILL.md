---
name: rs-devops-remote-state-e-boas-praticas
description: "Enforces Terraform remote state and CI/CD pipeline best practices when configuring IaC workflows. Use when user asks to 'setup terraform pipeline', 'configure remote state', 'create CI/CD for infrastructure', 'terraform github actions', or 'IaC best practices'. Applies rules: remote state in S3, conditional apply on main+push only, fmt-check before plan, secrets via variables. Make sure to use this skill whenever setting up Terraform pipelines or remote backends. Not for application deployment pipelines, Docker builds, or Kubernetes manifests."
---

# Remote State e Boas Práticas Terraform

> Todo recurso de infraestrutura deve ser criado exclusivamente via pipeline, com versionamento, revisão e aprovação antes de aplicar.

## Rules

1. **Estado remoto obrigatório** — armazene o state no S3 (ou backend remoto equivalente), porque permite que local e pipeline compartilhem o mesmo estado sem conflitos
2. **`terraform fmt` antes de cada commit** — rode `terraform fmt` localmente antes de commitar, porque o `fmt-check` na pipeline vai quebrar o build se a formatação estiver errada
3. **Apply condicional na pipeline** — o `terraform apply` só executa se `github.ref == refs/heads/main` AND `github.event_name == push`, porque impede applies acidentais em branches ou PRs
4. **Secrets via variáveis, nunca no código** — credenciais e valores sensíveis como variables/secrets do GitHub Actions, porque código versionado é visível para todo o time
5. **Branch-based workflow** — crie branch, abra PR, revisão, merge na main, porque garante que alguém revise antes de alterar infraestrutura em produção
6. **Pipeline é fonte única da verdade** — nunca aplique mudanças manualmente no console do cloud provider, porque o state ficará dessincronizado

## Steps

### Step 1: Configurar backend remoto

```hcl
terraform {
  backend "s3" {
    bucket = "meu-terraform-state"
    key    = "infra/terraform.tfstate"
    region = "us-east-1"
  }
}
```

Após configurar, rode `terraform init` para migrar o state local para o S3.

### Step 2: Adicionar fmt-check na pipeline

```yaml
- name: Terraform Format Check
  run: terraform fmt -check -recursive
```

Se quebrar, corrija localmente com `terraform fmt` e faça novo commit.

### Step 3: Proteger o apply com condicional

```yaml
- name: Terraform Apply
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  run: terraform apply -auto-approve
```

Isso cria dupla proteção: o trigger do workflow + a condicional no step.

### Step 4: Fluxo de criação de recurso via pipeline

```bash
# 1. Crie o arquivo do recurso (ex: s3.tf)
# 2. Formate
terraform fmt
# 3. Commit e push
git add .
git commit -m "feat: create s3 resource"
git push
# 4. Acompanhe a pipeline no GitHub Actions
```

## Output format

Pipeline GitHub Actions com 3 steps mínimos:
1. `terraform fmt -check` — valida formatação
2. `terraform plan` — mostra o que será alterado
3. `terraform apply` (condicional) — aplica apenas na main via push

## Heuristics

| Situação | Faça |
|----------|------|
| State local e pipeline precisam compartilhar | Configure backend S3 remoto |
| Pipeline quebrou no fmt-check | Rode `terraform fmt` local, commit, push |
| Quer estimar custo antes de aprovar PR | Adicione step com Infracost/Terracost no PR |
| Recurso precisa ser removido | Delete o arquivo .tf, commit, push — pipeline destrói |
| Time com múltiplos devs | Branch-based: branch → PR → review → merge → apply |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| `terraform apply` direto no console local em produção | Push para main via PR, pipeline aplica |
| Credenciais hardcoded no .tf | GitHub Secrets + `TF_VAR_*` |
| Apply sem condicional na pipeline | `if: github.ref == 'refs/heads/main' && github.event_name == 'push'` |
| Commit sem rodar `terraform fmt` | Sempre `terraform fmt` antes do commit |
| Criar recursos manualmente no cloud console | Tudo via código versionado |
| Push direto na main sem review | Branch → PR → review → merge |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
