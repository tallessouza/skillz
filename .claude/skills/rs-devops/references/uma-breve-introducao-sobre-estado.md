---
name: rs-devops-terraform-estado
description: "Applies Terraform state management principles when writing or reviewing Infrastructure as Code. Use when user asks to 'create terraform config', 'fix terraform drift', 'manage infrastructure state', 'run terraform plan/apply', or 'handle tfstate'. Ensures proper state handling, drift detection awareness, and IaC source-of-truth discipline. Make sure to use this skill whenever working with Terraform configurations or debugging infrastructure inconsistencies. Not for application code, CI/CD pipelines, or non-Terraform IaC tools like Pulumi or CloudFormation."
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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-uma-breve-introducao-sobre-estado/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-uma-breve-introducao-sobre-estado/references/code-examples.md)
