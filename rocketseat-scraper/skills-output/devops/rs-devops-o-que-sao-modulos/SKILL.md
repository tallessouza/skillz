---
name: rs-devops-o-que-sao-modulos
description: "Applies Terraform module architecture principles when writing or reviewing Infrastructure as Code. Use when user asks to 'create terraform config', 'organize IaC', 'avoid duplicate infrastructure code', 'use terraform modules', or 'structure terraform project'. Enforces module-first thinking: encapsulation, reuse, and consistency over inline resource duplication. Make sure to use this skill whenever generating Terraform code that could benefit from modularization. Not for application code, CI/CD pipelines, or non-Terraform IaC tools like Pulumi or CloudFormation."
---

# Terraform Modules

> Organize infraestrutura como codigo em modulos reutilizaveis — nunca duplique configuracao de recursos.

## Conceito central

Um modulo Terraform e um conjunto de arquivos `.tf` agrupados que resolvem um problema configurativo especifico. Funciona como um pacote (similar a uma lib Node/Java): e uma abstracao generica que voce adapta via variaveis.

## Tipos de modulos

| Tipo | Origem | Quando usar |
|------|--------|-------------|
| **Externo (Registry)** | `registry.terraform.io` | Problema comum ja resolvido pela comunidade |
| **Interno (custom)** | Seu repositorio | Problema especifico da sua organizacao |

## Decision framework

| Situacao | Acao |
|----------|------|
| Precisa criar recurso comum (S3, VPC, ECS) | Buscar modulo no Terraform Registry primeiro |
| Modulo externo existe mas nao cobre seu caso | Avaliar fork/adapt vs criar interno |
| Nenhum modulo existe | Criar modulo interno proprio |
| Recurso usado em mais de 1 lugar | Extrair para modulo imediatamente |
| Codigo de recurso duplicado no projeto | Refatorar para modulo — duplicata e divida tecnica |

## Como usar um modulo externo

```hcl
module "s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 3.0"

  bucket = var.bucket_name
  acl    = "private"

  control_object_ownership = true
  object_ownership         = "ObjectWriter"
}
```

## Como estruturar um modulo interno

```
modules/
└── meu-modulo/
    ├── main.tf          # Recursos
    ├── variables.tf     # Inputs (variaveis)
    ├── outputs.tf       # Outputs expostos
    └── README.md        # Documentacao de uso
```

## Principios do modulo

1. **Generico por design** — aceita variaveis para customizacao, porque cada consumidor tem necessidades diferentes
2. **Encapsulamento** — esconde complexidade interna, expoe apenas inputs e outputs necessarios
3. **Reutilizacao** — um modulo, N usos, zero duplicata
4. **Consistencia** — todos os ambientes usam a mesma base configurativa
5. **Manutenibilidade** — atualizar em um lugar propaga para todos os consumidores

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Copiar blocos `resource` entre pastas | Extrair para modulo e referenciar via `module {}` |
| Hardcodar valores dentro do modulo | Expor como `variable` para o consumidor configurar |
| Criar modulo que faz tudo | Um modulo por dominio/recurso especifico |
| Ignorar modulos do Registry | Verificar Registry antes de escrever do zero |
| Modulo sem `variables.tf` e `outputs.tf` | Sempre definir interface clara de entrada e saida |

## Heuristics

| Situacao | Do |
|----------|-----|
| Recurso aparece 2+ vezes no projeto | Extrair para modulo |
| Configuracao de recurso e complexa (>30 linhas) | Encapsular em modulo para legibilidade |
| Time/org tem padrao de criacao de recurso | Modulo interno com defaults da org |
| Modulo externo tem >80% do que precisa | Usar externo + override via variaveis |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
