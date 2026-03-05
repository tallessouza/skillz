---
name: rs-devops-criando-recursos-utilizando-iac
description: "Applies Terraform IAC patterns for creating AWS resources (IAM OpenID Connect Provider, roles) to support CI/CD pipelines. Use when user asks to 'create AWS resources with Terraform', 'setup OpenID Connect provider', 'configure IAM for GitHub Actions', 'terraform IAC for CI/CD', or 'connect GitHub to AWS'. Make sure to use this skill whenever setting up AWS infrastructure as code for pipeline authentication. Not for application code, Docker configuration, or Kubernetes setup."
---

# Criando Recursos AWS com Terraform IAC

> Crie recursos de infraestrutura AWS via codigo Terraform, nunca pela interface, seguindo o fluxo init → plan → apply.

## Rules

1. **Sempre use IAC, nunca a interface** — crie recursos via Terraform, porque codigo e versionavel, auditavel e reproduzivel
2. **Comece pelo provider** — configure o bloco `required_providers` e `provider` antes de qualquer recurso, porque sem provider nenhum recurso pode ser criado
3. **Organize por dominio** — separe recursos em arquivos por area (`iam.tf`, `ecr.tf`, `main.tf`), porque facilita navegacao e manutencao
4. **Use tags como boa pratica** — adicione `tags { IAC = "TRUE" }` em todo recurso, porque identifica recursos gerenciados por Terraform
5. **Sempre rode plan antes de apply** — `terraform plan` antes de `terraform apply`, porque previne mudancas indesejadas
6. **Use --auto-approve com cuidado** — so use em ambientes de desenvolvimento, porque pula confirmacao manual

## How to write

### Estrutura de projeto IAC

```
iac/
├── main.tf      # Provider configuration
├── iam.tf       # IAM resources (OpenID, roles)
└── ...          # Outros recursos por dominio
```

### Provider AWS

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.49"
    }
  }
}

provider "aws" {
  region = "us-east-2"
}
```

### OpenID Connect Provider para GitHub Actions

```hcl
resource "aws_iam_openid_connect_provider" "openid_connect_git" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com"
  ]

  thumbprint_list = [
    "<thumbprint-gerado-pela-aws>"
  ]

  tags = {
    IAC = "TRUE"
  }
}
```

## Example

**Before (criacao manual):**
```
AWS Console → IAM → Identity Providers → Add Provider → OpenID Connect
→ URL: token.actions.githubusercontent.com
→ Audience: sts.amazonaws.com
→ Get thumbprint → Add provider
```

**After (com Terraform IAC):**
```bash
cd iac/
terraform init      # Inicializa backend e baixa provider
terraform plan      # Visualiza mudancas planejadas
terraform apply --auto-approve  # Aplica as mudancas
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Primeiro recurso no projeto | Crie `iac/main.tf` com provider, rode `terraform init` |
| Recurso IAM (roles, policies, providers) | Crie em `iam.tf` separado |
| Precisa do thumbprint do OpenID | Crie pela interface primeiro, importe com `terraform import`, extraia o valor |
| Rodando Terraform localmente | Configure AWS CLI com `aws configure` ou SSO antes |
| Token AWS expirou | Relogue com `aws sso login` antes de rodar comandos |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar recursos pela interface e nao versionar | Use Terraform para tudo |
| Colocar tudo em um unico `.tf` | Separe por dominio (`iam.tf`, `ecr.tf`) |
| Rodar `apply` sem `plan` | Sempre `terraform plan` primeiro |
| Esquecer tags nos recursos | Adicione `tags { IAC = "TRUE" }` |
| Hardcode de credenciais no provider | Use AWS CLI profile ou SSO |
| Confundir lista `[]` com objeto `{}` no HCL | `client_id_list` e `thumbprint_list` sao listas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-criando-recursos-utilizando-iac/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-criando-recursos-utilizando-iac/references/code-examples.md)
