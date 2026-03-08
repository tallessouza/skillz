---
name: rs-devops-remote-state-e-boas-praticas
description: "Applies Terraform remote state and pipeline best practices for infrastructure as code workflows. Use when user asks to 'configure remote state', 'setup S3 backend', 'add fmt-check to pipeline', 'protect terraform apply', or 'create branch-based IaC workflow'. Enforces remote state on S3, conditional apply on main branch, secrets via variables, and branch-based workflow with PR review. Make sure to use this skill whenever configuring Terraform pipelines or managing infrastructure state. Not for local-only Terraform setups, non-AWS backends, or application CI/CD pipelines without Terraform."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-pipeline
  tags: [terraform, remote-state, s3-backend, github-actions, pipeline, iac, fmt-check, branch-workflow]
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

## Troubleshooting

### Pipeline quebra no fmt-check apos commit
**Symptom:** GitHub Actions falha no step `terraform fmt -check -recursive`
**Cause:** Codigo foi commitado sem rodar `terraform fmt` localmente
**Fix:** Rode `terraform fmt` local, commit e push novamente

### terraform apply roda em branch que nao deveria
**Symptom:** Recursos sao criados/alterados a partir de uma feature branch
**Cause:** Condicional `if: github.ref == 'refs/heads/main' && github.event_name == 'push'` esta ausente no step de apply
**Fix:** Adicione a condicional no step de `terraform apply` no workflow YAML

### State local e pipeline mostram resultados diferentes
**Symptom:** `terraform plan` local mostra mudancas, mas pipeline mostra "no changes" (ou vice-versa)
**Cause:** State local e state remoto estao dessincronizados — provavelmente alguem rodou apply local sem backend remoto configurado
**Fix:** Configure backend S3 e rode `terraform init` para migrar o state local para o remoto

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Remote State e Boas Práticas

## Por que estado remoto?

Quando o state está local, ele existe apenas na máquina de quem rodou o `terraform apply`. Se a pipeline precisa rodar `plan` e `apply`, ela precisa acessar o mesmo state. O S3 resolve isso: tanto o desenvolvedor local quanto a pipeline do GitHub Actions leem e escrevem no mesmo arquivo de estado.

O instrutor demonstra isso na prática: após configurar o backend S3, ele roda `terraform plan` e `terraform apply` localmente, e o state no S3 é atualizado (de 8.4KB para 8.6KB). Quando a pipeline roda em seguida, ela lê o mesmo state e corretamente reporta "no changes" — porque o estado já está em conformidade.

## O incidente do fmt-check

Um momento valioso da aula: o instrutor fez alterações no `main.tf` mas esqueceu de rodar `terraform fmt`. A pipeline quebrou no step `terraform fmt -check`. Isso demonstra exatamente por que o fmt-check existe na pipeline — é uma rede de segurança.

A correção é simples:
1. `terraform fmt` (corrige a indentação/formatação)
2. `git add .` → `git commit -m "fix fmt"` → `git push`

O instrutor destaca: "foi até bom a gente ter tido este acontecimento para ver na prática como ajusta".

## Condicional dupla no apply

O instrutor adiciona uma camada extra de proteção:

```yaml
if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```

Mesmo que o workflow tenha um trigger configurado, essa condicional garante que o `terraform apply` SÓ executa quando:
1. O código está na branch main (não em feature branches)
2. O evento é um push (não um PR aberto, comment, etc.)

Isso é descrito como "camada extra" — defesa em profundidade.

## Fluxo branch-based (dia-a-dia real)

O instrutor admite que está fazendo push direto na main por estar sozinho, mas enfatiza que a prática correta é:

1. Criar branch a partir da main
2. Fazer as alterações de infraestrutura
3. Abrir Pull Request
4. Alguém do time revisa as mudanças
5. Opcionalmente, rodar estimativa de custo (Terracost/Infracost)
6. Aprovar e fazer merge na main
7. Pipeline aplica automaticamente

Isso transforma infraestrutura em um processo colaborativo com auditoria completa.

## Fonte única da verdade

O princípio fundamental de IaC: **todo recurso deve ser criado pela pipeline**. Isso significa:
- Versionamento (git history mostra quem mudou o quê e quando)
- Controle de SCM (code review antes de aplicar)
- Aprovação (alguém revisa e aprova a mudança)
- Auditoria (trail completo de mudanças)

Se alguém cria um recurso manualmente no console AWS, o state do Terraform não sabe desse recurso. Isso gera drift — a realidade diverge do código.

## Demonstração criar/destruir via pipeline

O instrutor demonstra o ciclo completo:
1. Cria arquivo `s3.tf` com um bucket simples
2. `terraform fmt` → commit → push
3. Pipeline roda: plan mostra 1 recurso para criar, apply cria
4. Bucket aparece no console AWS

Depois:
1. Deleta o arquivo `s3.tf`
2. Commit → push
3. Pipeline roda: plan mostra 1 recurso para destruir, apply destrói
4. Bucket removido do console AWS

Isso prova que a pipeline gerencia o ciclo de vida completo dos recursos.

## Menção ao Terracost/Infracost

O instrutor menciona brevemente que é possível adicionar um step no PR que calcula o custo estimado das mudanças de infraestrutura no cloud provider. Isso é descrito como "quase um FinOps" — permite que o time tenha visibilidade de custo antes de aprovar mudanças.

---

# Code Examples: Remote State e Boas Práticas

## Backend S3 configurado

```hcl
terraform {
  backend "s3" {
    bucket = "meu-terraform-state"
    key    = "infra/terraform.tfstate"
    region = "us-east-1"
  }
}
```

## Workflow GitHub Actions completo com boas práticas

```yaml
name: Terraform IaC

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  terraform:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3

      - name: Terraform Init
        run: terraform init
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Terraform Format Check
        run: terraform fmt -check -recursive

      - name: Terraform Plan
        run: terraform plan
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Terraform Apply
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: terraform apply -auto-approve
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Recurso S3 simples (exemplo da aula)

```hcl
resource "aws_s3_bucket" "s3_test" {
  bucket = "test-pipeline"
}
```

## Fluxo de comandos: criar recurso via pipeline

```bash
# Criar o arquivo de recurso
cat > s3.tf << 'EOF'
resource "aws_s3_bucket" "s3_test" {
  bucket = "test-pipeline"
}
EOF

# Formatar antes de commitar
terraform fmt

# Verificar mudanças
git status

# Commit e push
git add s3.tf
git commit -m "feat: create s3 resource"
git push
```

## Fluxo de comandos: remover recurso via pipeline

```bash
# Deletar o arquivo do recurso
rm s3.tf

# Commit e push (fmt não necessário ao deletar)
git add .
git commit -m "chore: remove s3 resource"
git push
```

## Fluxo de correção quando fmt-check quebra

```bash
# Pipeline quebrou no fmt-check
# Corrigir localmente:
terraform fmt

# Ver o que mudou
git status
# OUTPUT: modified: main.tf (indentação corrigida)

# Commit da correção
git add .
git commit -m "fix: terraform fmt"
git push
```

## Condicional no apply (detalhe)

```yaml
# A condicional é colocada no step do apply
- name: Terraform Apply
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  run: terraform apply -auto-approve
```

Duas condições verificadas:
- `github.ref == 'refs/heads/main'` — só na branch main
- `github.event_name == 'push'` — só em evento push (não PR open, comment, etc.)

## Verificação do state remoto

Após apply local, verificar que o state no S3 foi atualizado:
- Acesse o bucket S3 no console AWS
- O arquivo `.tfstate` deve ter tamanho atualizado
- Rode `terraform plan` na pipeline — deve mostrar "No changes"
