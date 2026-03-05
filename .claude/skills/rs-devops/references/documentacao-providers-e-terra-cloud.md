---
name: rs-devops-documentacao-providers-terra-cloud
description: "Applies Terraform architecture mental model (Provider → Resource → Module hierarchy) when writing IaC code. Use when user asks to 'create terraform config', 'setup infrastructure', 'write IaC', 'configure AWS with terraform', or 'use terraform modules'. Guides correct provider block setup, resource declaration, and module usage from Terraform Registry. Make sure to use this skill whenever generating Terraform HCL code or planning infrastructure-as-code. Not for CI/CD pipelines, Terraform Cloud configuration, or non-HashiCorp IaC tools like Pulumi or CloudFormation."
---

# Terraform: Provider → Resource → Module

> Toda configuracao Terraform segue uma hierarquia: Provider define O QUE gerenciar, Resource define O recurso especifico, Module abstrai complexidade repetitiva.

## Key concept

Terraform organiza infraestrutura em tres niveis hierarquicos. O **Provider** e a conexao com o provedor de nuvem ou servico (AWS, Azure, GCP, Datadog, Grafana). O **Resource** e uma unidade de infraestrutura dentro daquele provider (um bucket S3, uma VPC, um security group). O **Module** e um template reutilizavel que agrupa multiplos resources para resolver problemas complexos ou repetitivos.

## Rules

1. **Sempre declare providers no bloco terraform.required_providers** — porque o Terraform precisa saber de onde baixar o plugin antes de qualquer operacao
2. **Nomeie resources pelo conteudo, nao pela estrutura** — `aws_s3_bucket.upload_photos` nao `aws_s3_bucket.bucket1`, porque o alias identifica o proposito no ciclo de vida
3. **Prefira modules do Registry para problemas complexos ou repetitivos** — porque modules sao templates validados pela comunidade que abstraem dezenas de resources
4. **Consulte a documentacao do Provider antes de escrever resources** — porque cada provider lista todos os recursos suportados com exemplos e argumentos obrigatorios
5. **Um provider por responsabilidade, modularize se necessario** — multiplos providers no mesmo config e valido, mas avalie repositorios separados conforme a estrategia de gerenciamento

## How to write

### Provider configuration

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
  region = "us-east-1"
}
```

### Resource declaration

```hcl
resource "aws_s3_bucket" "assets_bucket" {
  bucket = "my-app-assets"

  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}
```

### Module usage (from Registry)

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "my-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
}
```

## Decision framework

| Situacao | Acao |
|----------|------|
| Preciso conectar a um cloud provider | Declare um `provider` block com source e version |
| Preciso criar um recurso especifico (bucket, VM, DB) | Use `resource` consultando a documentacao do provider |
| Preciso criar infra complexa (VPC + subnets + NAT + routes) | Use um `module` do Registry e sobrescreva o necessario |
| Problema muito especifico da minha empresa | Crie um modulo interno e publique no Registry privado |
| Preciso gerenciar multiplos providers (AWS + Datadog) | Adicione ao `required_providers`, avalie separar repositorios |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Criar resources sem provider declarado | Sempre declare `required_providers` primeiro |
| Escrever dezenas de resources repetitivos manualmente | Use modules do Registry para abstrair |
| Ignorar versao do provider | Fixe com `~>` para evitar breaking changes |
| Copiar HCL de exemplos sem consultar docs | Verifique argumentos obrigatorios na documentacao do provider |
| Usar alias generico no resource (`bucket1`, `main`) | Nomeie pelo proposito (`upload_photos`, `user_avatars`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-documentacao-providers-e-terra-cloud/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-documentacao-providers-e-terra-cloud/references/code-examples.md)
