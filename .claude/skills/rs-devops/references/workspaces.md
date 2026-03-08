---
name: rs-devops-workspaces
description: "Applies Terraform workspace patterns for isolating state per environment and avoiding resource name conflicts. Use when user asks to 'use terraform workspaces', 'isolate environments', 'fix 409 resource conflict', 'interpolate workspace in resource name', or 'manage staging vs production state'. Enforces workspace interpolation in resource names, hyphen separators, workspace selection before plan/apply, and backup awareness for rename operations. Make sure to use this skill whenever managing multiple Terraform environments or resolving resource name conflicts across workspaces. Not for remote state backends, module configuration, or provider-level environment separation."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-workspaces
  tags: [terraform, workspaces, state-isolation, environments, workspace-interpolation, staging, production]
---

# Terraform Workspaces

> Isole estados por ambiente usando workspaces e interpole `terraform.workspace` nos nomes de recursos para evitar conflitos.

## Rules

1. **Cada workspace tem seu proprio estado** — o tfstate do workspace `staging` fica em `terraform.tfstate.d/staging/`, nao no `terraform.tfstate` raiz, porque o estado raiz pertence exclusivamente ao workspace `default`
2. **Sempre interpole o workspace no nome do recurso** — use `terraform.workspace` no nome, porque recursos identicos em workspaces diferentes causam erro 409 (conflito) se tiverem o mesmo nome
3. **Use hifen como separador no nome** — `bucket-name-${terraform.workspace}` nao `bucket-name|${terraform.workspace}`, porque caracteres especiais como pipe sao rejeitados por provedores cloud
4. **Selecione o workspace ANTES de rodar plan/apply** — a selecao de workspace acontece antes da execucao, nao durante
5. **Atente-se a recursos que nao suportam rename in-place** — S3 buckets, por exemplo, exigem destroy + create ao mudar o nome, o que pode causar perda de dados

## How to write

### Recurso com workspace interpolado

```hcl
resource "aws_s3_bucket" "bucket" {
  bucket = "minha-app-${terraform.workspace}"

  tags = {
    Environment = terraform.workspace
  }
}
```

### Comandos essenciais

```bash
# Ver workspace atual
terraform workspace show

# Listar workspaces (asterisco = atual)
terraform workspace list

# Criar e mudar para novo workspace
terraform workspace new staging

# Selecionar workspace existente
terraform workspace select default

# Deletar workspace
terraform workspace delete staging
```

## Example

**Before (sem workspace no nome — causa conflito):**

```hcl
resource "aws_s3_bucket" "bucket" {
  bucket = "skillz-bucket-iac"
}
```

**After (com workspace interpolado):**

```hcl
resource "aws_s3_bucket" "bucket" {
  bucket = "skillz-bucket-iac-${terraform.workspace}"

  tags = {
    Context = terraform.workspace
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mesmo recurso em staging e producao | Interpole `terraform.workspace` no nome |
| Contas AWS diferentes por ambiente | Configure o provider com variaveis condicionais ao workspace |
| Precisa ver qual workspace esta ativo | `terraform workspace show` |
| Recurso foi destruido e recriado ao inves de atualizado | Normal para recursos que nao suportam rename (ex: S3 bucket) — planeje backups |
| Primeiro uso de workspaces no projeto | O workspace `default` ja existe implicitamente |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Nomes de recurso fixos com multiplos workspaces | Interpole `terraform.workspace` no nome |
| Usar pipe `\|` como separador no nome | Usar hifen `-` como separador |
| Assumir que `terraform plan` pega erros de nome duplicado | So o `apply` detecta conflitos reais no provedor |
| Editar manualmente arquivos em `terraform.tfstate.d/` | Usar comandos `terraform workspace` |
| Esquecer backup antes de alterar nome de bucket S3 | Planejar backup — rename causa destroy + create |


## Troubleshooting

### Erro 409 ao rodar apply em workspace diferente
**Symptom:** Recurso ja existe no provider ao tentar criar em outro workspace
**Cause:** Nome do recurso nao inclui `terraform.workspace` — nome identico causa conflito
**Fix:** Interpole `terraform.workspace` no nome: `bucket = "app-${terraform.workspace}"`

### Estado do workspace errado sendo usado
**Symptom:** `terraform plan` mostra recursos que nao correspondem ao ambiente esperado
**Cause:** Workspace ativo nao e o esperado — selecao nao foi feita antes do plan
**Fix:** Verifique com `terraform workspace show` e selecione o correto com `terraform workspace select <nome>`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Terraform Workspaces

## O que sao workspaces

Workspace e o "espaco de trabalho" do Terraform. Por default, todo gerenciamento de estado (tfstate) fica associado ao workspace `default`. Tudo que mutabiliza estado — criacao, edicao, delecao de recursos — fica vinculado ao workspace ativo.

## Por que workspaces existem

O problema que workspaces resolvem: voce pode ter o workspace local, staging, producao, e manter os **mesmos recursos** com estados independentes. A "grande sacada" e que o mesmo `main.tf` pode ser aplicado em N ambientes, cada um com seu proprio estado.

## Como o estado se organiza

- **Workspace default:** estado fica em `terraform.tfstate` na raiz do projeto
- **Qualquer outro workspace:** estado fica em `terraform.tfstate.d/{nome-do-workspace}/terraform.tfstate`
- O workspace default nunca aparece na pasta `terraform.tfstate.d/` porque ele sempre existe implicitamente

Dentro de `.terraform/` (pasta oculta), existe um arquivo `environment` que indica o workspace ativo. Se voce tem 10 workspaces, tera 10 itens listados ali.

## O problema do conflito de nomes

Quando voce usa workspaces com o mesmo recurso, precisa **mutabilizar o nome do recurso**. Caso contrario:

1. Voce cria o bucket no workspace `staging` com nome `skillz-bucket-iac`
2. Muda para workspace `default`
3. Roda `terraform plan` — ele mostra que vai criar o recurso (porque no estado default nao existe)
4. Roda `terraform apply` — erro 409 (conflito), porque o bucket ja existe na AWS

A solucao e usar `terraform.workspace` como parte do nome: `skillz-bucket-iac-${terraform.workspace}`

## Detalhe sobre separadores

O instrutor tentou usar pipe (`|`) como separador e recebeu erro. Provedores cloud rejeitam caracteres especiais em nomes de recursos. Use hifen (`-`).

## Destroy antes de create (replace)

Um insight importante: ao alterar o nome de um S3 bucket, o Terraform faz **destroy + create** (nao update in-place), porque o S3 nao suporta rename. Isso significa:

- A data de criacao do bucket muda
- Qualquer conteudo dentro do bucket e perdido
- E essencial fazer backup antes de operacoes que alteram o nome

O `terraform plan` nao detecta esse tipo de erro — so o `apply` tenta de fato criar o recurso no provedor e descobre conflitos.

## Casos de uso alem de ambientes

- Contas AWS diferentes (configuracao direta no provider)
- Times diferentes trabalhando no mesmo codigo
- Testes isolados de infraestrutura

## Variavel terraform.workspace

`terraform.workspace` e uma variavel built-in que retorna o nome do workspace ativo. Pode ser usada em qualquer lugar do codigo HCL: nomes de recursos, tags, condicionais, configuracao de providers.

---

# Code Examples: Terraform Workspaces

## Exemplo 1: Fluxo completo de criacao de workspace

```bash
# Verificar workspace atual
$ terraform workspace show
default

# Criar workspace staging
$ terraform workspace new staging
# Output: Created and switched to workspace "staging"!

# Confirmar mudanca
$ terraform workspace show
staging

# Listar todos os workspaces
$ terraform workspace list
  default
* staging
# O asterisco indica o workspace ativo
```

## Exemplo 2: Recurso sem interpolacao (problema)

```hcl
# main.tf — VAI CAUSAR CONFLITO entre workspaces
resource "aws_s3_bucket" "bucket" {
  bucket = "skillz-bucket-iac"
}
```

```bash
# No workspace staging:
$ terraform workspace select staging
$ terraform apply -auto-approve
# Cria o bucket com sucesso

# No workspace default:
$ terraform workspace select default
$ terraform apply -auto-approve
# ERRO 409 — bucket ja existe na AWS
```

## Exemplo 3: Recurso com interpolacao (solucao)

```hcl
# main.tf — nome unico por workspace
resource "aws_s3_bucket" "bucket" {
  bucket = "skillz-bucket-iac-${terraform.workspace}"

  tags = {
    Context = terraform.workspace
  }
}
```

```bash
# No workspace default:
$ terraform workspace select default
$ terraform plan
# Mostra: skillz-bucket-iac-default

$ terraform apply -auto-approve
# Cria bucket "skillz-bucket-iac-default"

# No workspace staging:
$ terraform workspace select staging
$ terraform plan
# Mostra: mudanca de "skillz-bucket-iac" para "skillz-bucket-iac-staging"
# (se o bucket antigo existia, fara destroy + create)

$ terraform apply -auto-approve
# Resultado: destroy do antigo, create do novo com nome "-staging"
```

## Exemplo 4: Estrutura de arquivos resultante

```
projeto/
├── main.tf
├── terraform.tfstate              # Estado do workspace DEFAULT
├── terraform.tfstate.d/
│   └── staging/
│       └── terraform.tfstate      # Estado do workspace STAGING
└── .terraform/
    └── environment                # Indica workspace ativo (ex: "staging")
```

## Exemplo 5: Alternando entre workspaces

```bash
# Selecionar workspace existente
$ terraform workspace select default
Switched to workspace "default".

# Rodar plan no contexto default
$ terraform plan
# Mostra recursos conforme estado do workspace default

# Voltar para staging
$ terraform workspace select staging
$ terraform plan
# Mostra recursos conforme estado do workspace staging
```

## Exemplo 6: Uso avancado — provider por workspace

```hcl
# Exemplo conceitual: contas AWS diferentes por workspace
provider "aws" {
  region  = "us-east-1"
  profile = terraform.workspace == "production" ? "prod-account" : "dev-account"
}

resource "aws_s3_bucket" "bucket" {
  bucket = "minha-app-${terraform.workspace}"
}
```
