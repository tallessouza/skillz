---
name: rs-devops-uma-breve-introducao-sobre-estado
description: "Applies Terraform state mental model for understanding infrastructure reconciliation, drift detection, and state file management. Use when user asks about 'terraform state', 'tfstate file', 'infrastructure drift', 'terraform plan vs apply', 'state corruption', or 'why not edit console directly'. Enforces never editing tfstate manually, never committing state to git, always using plan before apply, and remote state for teams. Make sure to use this skill whenever reasoning about Terraform state lifecycle or troubleshooting drift between code and infrastructure. Not for state backend configuration, workspace management, or terraform import workflows."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-state
  tags: [terraform, state, tfstate, drift-detection, reconciliation, plan, apply, gitignore]
---

# Terraform State

> O estado e o unico mecanismo pelo qual o Terraform sabe o que existe, o que mudou e o que precisa ser reconciliado na infraestrutura.

## Key concept

O Terraform armazena um mapeamento completo dos recursos da infraestrutura no arquivo `terraform.tfstate`. Cada `plan` e `apply` compara tres fontes: o codigo declarativo (`.tf`), o estado (`tfstate`) e a infraestrutura real no provedor. A reconciliacao sempre resolve em favor do codigo — o repositorio e a fonte unica da verdade.

## Rules

1. **Nunca edite recursos gerenciados por IaC diretamente no console** — alteracoes manuais serao sobrescritas no proximo `apply`, porque a fonte da verdade e o codigo declarativo
2. **Nunca comite o tfstate** — adicione `terraform.tfstate` e `terraform.tfstate.backup` ao `.gitignore`, porque contem dados sensiveis e estado mutavel
3. **Nunca edite o tfstate manualmente** — use `terraform state` CLI para manipulacoes, porque edicao manual corrompe o mapeamento
4. **Armazene estado remotamente em producao** — use backend remoto (S3 + DynamoDB, Terraform Cloud), porque estado local nao suporta colaboracao nem locking
5. **Sempre execute `plan` antes de `apply`** — revise o diff de reconciliacao, porque o Terraform pode destruir recursos inesperadamente ao reconciliar drift

## Decision framework

| Situacao | Acao |
|----------|------|
| Recurso existe no console mas nao no codigo | `terraform import` para trazer ao estado, depois declare no `.tf` |
| Recurso existe no codigo mas nao na infra | Terraform vai criar no proximo `apply` |
| Atributo difere entre estado e infra real | Terraform detecta drift no `plan` e reconcilia em favor do codigo |
| Atributo difere entre codigo e estado | Terraform atualiza estado e infra no `apply` |
| Precisa remover recurso | Remova do codigo `.tf` — Terraform destroi no `apply` |
| Estado corrompido | Restaure do `terraform.tfstate.backup` |

## How to think about it

### Ciclo de reconciliacao (plan/apply)

```
Codigo (.tf)  ←── fonte da verdade
     ↓
terraform plan  ──→  compara: codigo vs estado vs infra real
     ↓
terraform apply ──→  reconcilia: modifica infra + atualiza estado
     ↓
terraform.tfstate ──→ novo estado reflete infra atual
```

### Drift detection

Alguem editou uma tag diretamente no console AWS. No proximo `terraform plan`, o Terraform:
1. Faz refresh do estado (consulta a infra real)
2. Detecta a dissonancia entre estado/codigo e infra
3. Propoe remover a tag (porque o codigo nao a declara)
4. No `apply`, remove a tag e atualiza o estado

Isso e o **comportamento correto** — o IaC prevalece.

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| "Posso fazer ajustes rapidos pelo console" | Serao sobrescritos no proximo `apply` — toda alteracao deve passar pelo codigo |
| "O tfstate e so um log" | E o mapeamento ativo — sem ele, Terraform perde rastreio de todos os recursos |
| "Posso versionar o tfstate no git" | Contem secrets e muda a cada apply — deve ir no `.gitignore` e ser armazenado remotamente |
| "Se deletar o tfstate, Terraform recria tudo" | Terraform perde conhecimento dos recursos existentes e tenta criar duplicatas, causando conflitos |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Editar recurso IaC pelo console | Alterar no codigo `.tf` e rodar `apply` |
| Comitar `terraform.tfstate` | Adicionar ao `.gitignore`, usar backend remoto |
| Rodar `apply` sem revisar `plan` | Sempre `terraform plan` primeiro, revisar diff |
| Manter estado local em equipe | Configurar backend remoto com locking |
| Deletar tfstate para "resetar" | Usar `terraform state rm` para recursos especificos |

## Limitations

- Este skill cobre o modelo mental de estado. Configuracao de backends remotos, workspaces e state locking sao topicos separados.
- Nao cobre `terraform import` em detalhe nem migracoes de estado entre backends.


## Troubleshooting

### terraform plan mostra mudancas inesperadas
**Symptom:** Plan propoe remover ou adicionar recursos que voce nao alterou no codigo
**Cause:** Alguem editou recursos diretamente no console do cloud provider (drift)
**Fix:** Revise o plan cuidadosamente — o Terraform esta reconciliando a infra com o codigo. Se a mudanca manual era intencional, atualize o codigo `.tf` para refletir

### Perda do arquivo terraform.tfstate
**Symptom:** Terraform nao reconhece recursos existentes e tenta criar tudo do zero
**Cause:** Estado foi deletado ou corrompido — Terraform perdeu rastreio de todos os recursos
**Fix:** Restaure do `terraform.tfstate.backup` se disponivel, ou use `terraform import` para reimportar recursos existentes

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Terraform State

## O que e o estado e por que existe

O Terraform precisa de um mecanismo para mapear o que esta declarado no codigo (`.tf`) com o que realmente existe na infraestrutura do provedor (AWS, GCP, Azure). O arquivo `terraform.tfstate` e esse mapeamento.

Sem o estado, o Terraform nao saberia:
- Quais recursos ele gerencia vs quais foram criados manualmente
- O que mudou desde a ultima execucao
- Quais atributos foram gerados em tempo de criacao (como domain names, ARNs, IDs)

## Estrutura do tfstate

O arquivo e um JSON versionado. Estrutura simplificada:

```json
{
  "version": 4,
  "serial": 1,
  "resources": [
    {
      "mode": "managed",
      "type": "aws_s3_bucket",
      "name": "s3_bucket",
      "provider": "provider[\"registry.terraform.io/hashicorp/aws\"]",
      "instances": [
        {
          "attributes": {
            "bucket": "rocketc-bucket-ac",
            "bucket_domain_name": "rocketc-bucket-ac.s3.amazonaws.com",
            "tags": {}
          }
        }
      ]
    }
  ]
}
```

Pontos importantes:
- `resources` e um array — pode conter N recursos de N provedores
- `instances` contem os atributos reais do recurso, incluindo valores gerados pelo provedor (como `bucket_domain_name`) que voce nao declarou no codigo
- `serial` incrementa a cada alteracao — e o versionamento interno

## O ciclo de reconciliacao em detalhe

Quando voce roda `terraform plan`:

1. **Refreshing State**: Terraform consulta a API do provedor para cada recurso no estado. Pergunta: "qual e o estado atual deste recurso na infra real?"
2. **Comparacao triangular**: Compara tres fontes — codigo declarativo, estado local, infra real
3. **Diff generation**: Gera um plano de alteracoes para alinhar a infra com o codigo

Quando voce roda `terraform apply`:
1. Repete os passos 1-3
2. Executa as alteracoes na infra via API do provedor
3. Atualiza o `tfstate` com o novo estado real

## A analogia da fonte unica da verdade

O instrutor enfatiza repetidamente: **o repositorio (codigo declarativo) e a fonte da verdade**. Isso significa:

- Se alguem adiciona uma tag pelo console AWS → Terraform remove no proximo apply
- Se alguem remove um recurso pelo console → Terraform recria no proximo apply
- A unica forma de fazer alteracoes permanentes e atraves do codigo `.tf`

Isso e fundamental para IaC: o console do provedor deve ser **read-only** em ambientes gerenciados por Terraform.

## Experimento didatico do instrutor

O instrutor demonstra o conceito editando tags diretamente no console AWS:

1. Cria tag `test=true` no console (fora do Terraform)
2. Roda `terraform plan` → detecta drift, propoe remover a tag
3. Roda `terraform apply` → remove a tag, reconcilia com o codigo

Depois faz o inverso:
1. Adiciona `tags = { test = "pro" }` no codigo `.tf`
2. `terraform plan` → detecta que precisa adicionar a tag
3. `terraform apply` → adiciona a tag na infra E no estado

E o teste final:
1. Remove a tag pelo console novamente
2. `terraform plan` → detecta que a tag sumiu e precisa ser readicionada
3. Confirma que tanto adicao quanto remocao sao reconciliadas

## Backup do estado

O Terraform gera automaticamente `terraform.tfstate.backup` antes de cada modificacao. Este e o estado anterior, util para recovery em caso de corrupcao.

## Por que nao comitar o tfstate

Razoes mencionadas pelo instrutor e boas praticas:
- O arquivo muda a cada `apply` — gera conflitos de merge constantes
- Pode conter dados sensiveis (passwords, tokens em atributos de recursos)
- Em equipe, estado local causa conflitos — duas pessoas rodando `apply` simultaneamente corrompem o estado
- Solucao: backend remoto com locking (abordado em aulas futuras)

## Relacao com workspaces

O instrutor menciona que workspaces serao o proximo topico. Workspaces permitem multiplos estados isolados dentro do mesmo projeto — util para ambientes (dev, staging, prod).

---

# Code Examples: Terraform State

## Exemplo 1: Recurso basico que gera estado

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "s3_bucket" {
  bucket = "rocketc-bucket-ac"
}
```

Apos `terraform apply`, o estado gerado contem:

```json
{
  "version": 4,
  "serial": 1,
  "resources": [
    {
      "mode": "managed",
      "type": "aws_s3_bucket",
      "name": "s3_bucket",
      "provider": "provider[\"registry.terraform.io/hashicorp/aws\"]",
      "instances": [
        {
          "attributes": {
            "bucket": "rocketc-bucket-ac",
            "bucket_domain_name": "rocketc-bucket-ac.s3.amazonaws.com",
            "tags": {}
          }
        }
      ]
    }
  ]
}
```

Note que `bucket_domain_name` nao foi declarado no codigo — foi gerado pelo provedor e armazenado no estado para referencia futura.

## Exemplo 2: Drift detection — tag adicionada pelo console

Estado antes (sem tags):
```json
"tags": {}
```

Alguem adiciona `test=true` pelo console AWS.

```bash
$ terraform plan
# Refreshing state...
# aws_s3_bucket.s3_bucket: Refreshing state...

# aws_s3_bucket.s3_bucket will be updated in-place
~ resource "aws_s3_bucket" "s3_bucket" {
    ~ tags = {
        - "test" = "true" -> null
      }
  }

# Plan: 0 to add, 1 to change, 0 to destroy.
```

```bash
$ terraform apply -auto-approve
# Aplica a remocao da tag — reconcilia com o codigo
```

## Exemplo 3: Adicionando tag via codigo (forma correta)

```hcl
resource "aws_s3_bucket" "s3_bucket" {
  bucket = "rocketc-bucket-ac"

  tags = {
    test = "pro"
  }
}
```

```bash
$ terraform plan
# aws_s3_bucket.s3_bucket will be updated in-place
~ resource "aws_s3_bucket" "s3_bucket" {
    ~ tags = {
        + "test" = "pro"
      }
  }

# Plan: 0 to add, 1 to change, 0 to destroy.
```

```bash
$ terraform apply -auto-approve
# Adiciona a tag na infra E atualiza o estado
```

Apos apply, o estado reflete:
```json
"tags": {
  "test": "pro"
}
```

## Exemplo 4: Drift reverso — tag removida pelo console

Apos o Exemplo 3, alguem remove a tag `test` pelo console.

```bash
$ terraform plan
# aws_s3_bucket.s3_bucket will be updated in-place
~ resource "aws_s3_bucket" "s3_bucket" {
    ~ tags = {
        + "test" = "pro"
      }
  }
```

O Terraform detecta que a tag deveria existir (esta no codigo) e propoe readiciona-la.

## Exemplo 5: .gitignore correto para Terraform

```gitignore
# Terraform state (NUNCA comitar)
*.tfstate
*.tfstate.backup
*.tfstate.*.backup

# Diretorio de trabalho
.terraform/

# Variaveis sensiveis
*.tfvars
!example.tfvars
```

## Exemplo 6: Comandos essenciais de estado

```bash
# Ver estado atual formatado
terraform show

# Listar recursos no estado
terraform state list

# Ver detalhes de um recurso especifico
terraform state show aws_s3_bucket.s3_bucket

# Remover recurso do estado (sem destruir na infra)
terraform state rm aws_s3_bucket.s3_bucket

# Importar recurso existente para o estado
terraform import aws_s3_bucket.s3_bucket rocketc-bucket-ac

# Forcar refresh do estado contra a infra real
terraform refresh
```
