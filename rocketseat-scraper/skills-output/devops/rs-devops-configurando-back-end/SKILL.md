---
name: rs-devops-configurando-back-end
description: "Applies Terraform S3 backend configuration when setting up remote state storage. Use when user asks to 'configure terraform backend', 'setup remote state', 'use S3 for terraform state', 'fix terraform state issues', or 'migrate local state to S3'. Guides bucket, key, and region config, terraform init migration, and IAM permissions. Make sure to use this skill whenever working with Terraform state management or CI/CD pipelines that need shared state. Not for S3 bucket creation, general AWS config, or application-level storage."
---

# Configurando Back-end do Terraform com S3

> Configure o bloco backend dentro do bloco terraform para armazenar o estado remotamente no S3, garantindo que pipelines CI/CD compartilhem a mesma fonte de verdade.

## Rules

1. **Declare o backend dentro do bloco `terraform`** — fora do `required_providers`, mas dentro do mesmo bloco `terraform {}`, porque e uma configuracao do proprio terraform, nao de um provider
2. **Sempre rode `terraform init` apos alterar o backend** — qualquer mudanca na tag `terraform` (modulos, backend, providers) exige reinicializacao, porque o terraform so le essas configs no init
3. **Use path estruturado no key** — `state/terraform.tfstate` cria um diretorio logico dentro do bucket, porque facilita organizacao quando multiplos projetos compartilham o mesmo bucket
4. **Libere permissoes S3 no IAM** — a role usada na pipeline precisa de read/write no bucket, porque em tempo de pipeline o terraform precisa ler o estado remoto para comparar com o codigo
5. **Nunca suba o tfstate manualmente** — use `terraform init` para migrar o estado local para o S3, porque o terraform detecta a mudanca de backend e oferece copiar automaticamente
6. **Sem backend configurado, terraform usa local** — o default e `backend "local"` (raiz do projeto), porque isso causa falhas em CI/CD onde nao existe estado persistente entre execucoes

## How to write

### Bloco backend S3

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "nome-do-bucket"
    key    = "state/terraform.tfstate"
    region = "us-east-2"
  }
}
```

### IAM policy para acesso ao S3

```json
{
  "Sid": "S3StateAccess",
  "Effect": "Allow",
  "Action": [
    "s3:GetObject",
    "s3:PutObject",
    "s3:ListBucket"
  ],
  "Resource": [
    "arn:aws:s3:::nome-do-bucket",
    "arn:aws:s3:::nome-do-bucket/*"
  ]
}
```

## Example

**Before (sem backend — falha em CI/CD):**
```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
    }
  }
  # Sem backend = local por default
  # Pipeline nao encontra estado → tenta recriar tudo → erro "resource already exists"
}
```

**After (com backend S3):**
```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
    }
  }

  backend "s3" {
    bucket = "rocketseat-iac"
    key    = "state/terraform.tfstate"
    region = "us-east-2"
  }
}
```

Apos configurar, execute:
```bash
terraform init
# Terraform detecta mudanca de backend local → S3
# Pergunta: "Do you want to copy existing state to the new backend?"
# Responda: yes
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Pipeline CI/CD falha com "resource already exists" | Provavelmente falta backend remoto — configure S3 |
| Mudou qualquer coisa no bloco `terraform {}` | Rode `terraform init` antes de plan/apply |
| Multiplos projetos no mesmo bucket | Use keys diferentes: `projeto-a/terraform.tfstate` |
| Precisa de locking | Adicione `dynamodb_table` no backend config |
| Estado local existe e quer migrar | `terraform init` detecta e oferece copia automatica |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Upload manual do tfstate no S3 | `terraform init` com backend configurado |
| Backend sem permissao IAM | Adicione statement S3 na role da pipeline |
| Ignorar o `terraform init` apos mudar backend | Sempre reinicialize |
| Guardar estado na raiz do bucket sem path | Use `key = "state/terraform.tfstate"` com diretorio |
| Commitar tfstate no git | Configure backend remoto e adicione `*.tfstate` no `.gitignore` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
