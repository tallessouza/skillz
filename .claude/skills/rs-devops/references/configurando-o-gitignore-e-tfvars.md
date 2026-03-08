---
name: rs-devops-gitignore-tfvars
description: "Enforces correct .gitignore and .tfvars configuration for Terraform projects. Use when user asks to 'setup terraform project', 'configure gitignore for terraform', 'create tfvars', 'manage terraform variables', or 'initialize terraform repo'. Ensures state files, backups, and sensitive variables never reach version control. Make sure to use this skill whenever setting up or reviewing Terraform project structure. Not for general gitignore templates, non-Terraform projects, or CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: terraform-projeto-setup
  tags: [terraform, iac, gitignore, tfvars, security, state-management]
---

# Configurando .gitignore e .tfvars no Terraform

> Todo projeto Terraform deve proteger arquivos de estado e variáveis sensíveis do versionamento, tratando `.tfvars` como o `.env` da infraestrutura.

## Rules

1. **Nunca versione arquivos de estado** — `.tfstate` e `.tfstate.backup` contêm dados sensíveis e estado real da infra, porque vazamento expõe credenciais e recursos
2. **Ignore o diretório `.terraform/`** — é cache local de providers e módulos, porque cada ambiente faz seu próprio `terraform init`
3. **Nunca versione `.tfvars`** — contém valores reais de variáveis (equivalente ao `.env`), porque expõe configurações específicas de ambiente
4. **Sempre versione `.terraform.lock.hcl`** — garante versões consistentes de providers entre ambientes, porque evita drift silencioso
5. **Use `default` em `variable` blocks como fallback** — valores em `.tfvars` sobrescrevem o default, porque permite execução sem `.tfvars` em desenvolvimento

## Steps

### Step 1: Criar o .gitignore

```gitignore
# Terraform state - NUNCA versionar
*.tfstate
*.tfstate.backup

# Diretório local do Terraform (cache/providers)
.terraform/*

# Arquivos de variáveis sensíveis
*.tfvars
*.tfvars.json

# Crash logs
crash.log
crash.*.log

# Override files (ambiente local)
override.tf
override.tf.json
*_override.tf
*_override.tf.json
```

### Step 2: Criar o terraform.tfvars

```hcl
# terraform.tfvars - Valores reais das variáveis (NÃO versionar)
state_bucket = "meu-projeto-state-bucket-tf"
```

### Step 3: Verificar que .tfvars não será enviado

```bash
git status
# terraform.tfvars NÃO deve aparecer na lista
```

## Output format

Dois arquivos na raiz do projeto Terraform:
- `.gitignore` com as exclusões listadas
- `terraform.tfvars` com valores reais das variáveis definidas em `variables.tf`

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto Terraform novo | Criar `.gitignore` ANTES do primeiro commit |
| Variável tem valor sensível | Colocar em `.tfvars`, usar `default` genérico ou sem default |
| Variável não é sensível | Pode usar `default` direto no `variable` block |
| `.tfvars` alterado e `terraform plan` mostra destroy | O valor sobrescreveu o default e mudou o recurso — verificar antes de apply |
| Recurso tem `prevent_destroy = true` | Terraform bloqueará destroy mesmo se `.tfvars` mudar o nome |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| Commitar `*.tfstate` | Adicionar `*.tfstate` ao `.gitignore` |
| Commitar `terraform.tfvars` | Adicionar `*.tfvars` ao `.gitignore` |
| Ignorar `.terraform.lock.hcl` | Versionar o lock file (garante consistência) |
| Hardcodar valores sensíveis em `variables.tf` | Usar `default` genérico + valor real em `.tfvars` |
| Versionar `.terraform/` | Ignorar — cada ambiente roda `terraform init` |

## Error handling

- Se `terraform plan` mostra destruição inesperada após criar `.tfvars`: o valor em `.tfvars` sobrescreveu o `default` e mudou um atributo do recurso. Verifique se o valor está correto antes de `apply`.
- Se variável não tem `default` e `.tfvars` não existe: Terraform pedirá o valor interativamente no terminal.

## Verification

- `git status` não mostra `*.tfstate`, `.terraform/`, nem `*.tfvars`
- `terraform plan` executa sem erros usando valores do `.tfvars`
- `.terraform.lock.hcl` aparece no `git status` como tracked

## Troubleshooting

### Terraform plan mostra destruicao inesperada apos criar tfvars
**Symptom:** Apos criar o arquivo terraform.tfvars, `terraform plan` mostra que recursos serao destruidos e recriados
**Cause:** O valor em .tfvars sobrescreveu o default de uma variavel que afeta um atributo imutavel do recurso (ex: nome)
**Fix:** Verifique se o valor no .tfvars esta correto antes de apply. Se o recurso tem `prevent_destroy = true`, o Terraform bloqueara a destruicao

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-configurando-o-gitignore-e-tfvars/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-configurando-o-gitignore-e-tfvars/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
