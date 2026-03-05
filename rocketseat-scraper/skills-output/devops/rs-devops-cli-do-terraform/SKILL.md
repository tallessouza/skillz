---
name: rs-devops-cli-do-terraform
description: "Applies Terraform CLI workflow commands when setting up or managing infrastructure as code. Use when user asks to 'init terraform', 'create infrastructure', 'setup IaC project', 'run terraform plan', 'destroy resources', or any Terraform CLI task. Covers the 5 main commands (init, validate, plan, apply, destroy), provider configuration, and project naming conventions. Make sure to use this skill whenever working with Terraform CLI commands or initializing IaC repositories. Not for Terraform module authoring, state backend configuration, or cloud-specific resource design."
---

# Terraform CLI — Comandos Principais e Setup

> Domine os 5 comandos principais do Terraform CLI e a configuracao inicial de um projeto IaC.

## Rules

1. **Nomeie repositorios IaC explicitamente** — use sufixo `-iac`, `.iac` ou `.infra` no nome do repositorio, porque facilita identificacao do proposito entre repos de backend/frontend
2. **Rode `terraform init` apos configurar o provider** — rodar em diretorio vazio funciona mas nao inicializa plugins; rode novamente apos adicionar o bloco `required_providers`, porque so assim ele baixa os plugins necessarios
3. **Sempre rode `plan` antes de `apply`** — o plan e um dry run que valida estado e mostra o que sera criado/alterado sem executar, porque evita surpresas na infraestrutura real
4. **Use `validate` para debug de sintaxe HCL** — antes de rodar plan, validate detecta erros de sintaxe rapidamente, porque economiza tempo de feedback
5. **Trate `destroy` como comando sensivel** — ele deleta recursos reais na nuvem; o plan do destroy mostra o que sera deletado antes de executar, porque a reversao pode ser impossivel
6. **Configure autenticacao antes de criar recursos** — o ambiente local precisa se comunicar com o provider (ex: AWS SSO), porque sem tokens validos nenhum plan/apply funciona

## Steps

### Step 1: Criar o diretorio do projeto IaC

```bash
mkdir meu-projeto-iac
cd meu-projeto-iac
```

### Step 2: Criar o arquivo de providers

Criar `providers.tf` com o bloco do provider desejado:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  # Configuracao via AWS CLI/SSO — deixar vazio quando usando credenciais externas
}
```

### Step 3: Inicializar o Terraform

```bash
terraform init
```

Resultado: cria pasta `.terraform/` (plugins) e arquivo `.terraform.lock.hcl` (controle de estado).

### Step 4: Validar sintaxe

```bash
terraform validate
```

### Step 5: Planificar (dry run)

```bash
terraform plan
```

Mostra o que sera criado/alterado/destruido sem executar.

### Step 6: Aplicar

```bash
terraform apply
```

Cria ou atualiza recursos na infraestrutura real.

### Step 7: Destruir (quando necessario)

```bash
terraform destroy
```

Deleta recursos previamente criados. Mostra preview antes de executar.

## Os 5 Comandos Principais

| Comando | Funcao | Quando usar |
|---------|--------|-------------|
| `terraform init` | Inicializa repo, baixa plugins do provider | Uma vez ao criar o projeto (e apos mudar providers) |
| `terraform validate` | Valida sintaxe HCL | Antes de plan, para debug rapido |
| `terraform plan` | Dry run — mostra o que sera feito | Antes de todo apply ou destroy |
| `terraform apply` | Cria/atualiza recursos reais | Quando o plan esta correto |
| `terraform destroy` | Deleta recursos reais | Quando precisa remover infraestrutura |

## Heuristics

| Situacao | Faca |
|----------|------|
| Diretorio vazio, sem provider | `terraform init` funciona mas nao faz muito — configure provider primeiro |
| Mudou o provider ou versao | Rode `terraform init` novamente |
| Erro de sintaxe no HCL | Rode `terraform validate` antes de plan |
| Quer ver impacto sem executar | Rode `terraform plan` |
| Precisa deletar recurso especifico | Use filtros do `terraform destroy` (flag `-target`) |
| Ambiente local sem credenciais | Configure AWS CLI + SSO antes de plan/apply |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `terraform apply` sem `plan` antes | Sempre rode `plan` primeiro para validar |
| Repo IaC sem indicacao no nome | Use sufixo `-iac`, `.iac` ou `.infra` |
| Hardcode de credentials no provider block | Use AWS SSO ou variáveis de ambiente |
| Rodar `destroy` sem revisar o plan | Revise o output do destroy antes de confirmar |
| Ignorar o `.terraform.lock.hcl` no git | Commite o lock file para consistencia de versoes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
