---
name: rs-devops-terraform-cdk-e-hcl
description: "Applies Terraform HCL conventions and CDK-vs-HCL decision framework when writing infrastructure-as-code. Use when user asks to 'create terraform config', 'write infrastructure code', 'setup AWS with terraform', 'choose between CDK and HCL', or 'configure a provider'. Guides HCL file structure, provider configuration, and registry usage. Make sure to use this skill whenever generating Terraform code or discussing IaC tool selection. Not for CloudFormation, Pulumi, Ansible, or application-level code."
---

# Terraform — CDK vs HCL

> Ao escrever Terraform, use HCL como padrao para entender o que acontece por debaixo dos panos; CDK e uma camada de abstracao que transpila para HCL.

## Key Concept

Terraform e uma ferramenta open source da HashiCorp para automacao de infraestrutura. Diferente do Pulumi (que usa linguagens de programacao nativamente) e do CloudFormation (AWS-only), o Terraform:

1. **Suporta multiplos providers** — AWS, GCP, Azure, Kubernetes, Helm, Digital Ocean, Oracle, Alibaba e centenas mais
2. **Usa HCL por padrao** — HashiCorp Configuration Language, arquivos `.tf`, estrutura similar a JSON mas declarativa
3. **Oferece CDK como opcao** — TypeScript, Python, Java, C#, Go — mas o CDK transpila para HCL antes de executar

## Decision Framework

| Situacao | Escolha | Razao |
|----------|---------|-------|
| Aprendendo Terraform | HCL puro | Entender o que acontece por debaixo dos panos |
| Time ja domina TypeScript/Python e quer produtividade | CDK for Terraform | Aproveita tipagem e IDE support |
| Projeto simples, poucos recursos | HCL puro | Menos overhead, sem build step |
| Projeto complexo com logica condicional pesada | CDK | Loops e condicionais nativos da linguagem |
| Precisa ler/debugar state e plans | HCL puro | CDK adiciona camada de indirection |

## How to Write

### Provider Configuration (HCL)

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

### Terraform Registry

O Terraform Registry (`registry.terraform.io`) funciona como um "Docker Hub para infraestrutura" — contem providers, modules e templates prontos. Sempre consulte o registry antes de escrever um module do zero.

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto Terraform | Comece com HCL puro, migre para CDK se necessario |
| Precisa de um provider | Consulte `registry.terraform.io` primeiro |
| Escrevendo module reutilizavel | HCL — maior compatibilidade no ecossistema |
| CDK gerando HCL estranho | Leia o HCL gerado para debugar, nao o codigo CDK |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Iniciar com CDK sem conhecer HCL | Aprenda HCL primeiro, porque CDK transpila para ele |
| Ignorar o Terraform Registry | Consulte modules existentes antes de criar do zero |
| Misturar CDK e HCL puro no mesmo projeto | Escolha uma abordagem e mantenha consistencia |
| Escrever Terraform sem entender state | Estude o conceito de state antes de criar recursos |

## Verification

- `terraform version` — confirma instalacao
- `terraform init` — inicializa providers e backend
- `terraform plan` — preview antes de aplicar (nunca pule)
- `terraform validate` — valida sintaxe HCL

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-terraform-cdk-e-hcl/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-terraform-cdk-e-hcl/references/code-examples.md)
