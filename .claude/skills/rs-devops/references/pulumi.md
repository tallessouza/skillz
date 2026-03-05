---
name: rs-devops-pulumi
description: "Applies Pulumi IaC knowledge when user asks about 'infrastructure as code', 'Pulumi setup', 'multi-cloud IaC', 'Pulumi vs Terraform', or 'declarative infrastructure'. Covers Pulumi's multi-cloud support, language options, pricing tiers, and environment replication patterns. Make sure to use this skill whenever discussing Pulumi or comparing IaC tools beyond Terraform/CDK. Not for Terraform-specific workflows, Kubernetes deployment, or CI/CD pipeline configuration."
---

# Pulumi — Infrastructure as Code Multi-Cloud

> Pulumi permite definir infraestrutura usando linguagens de programacao reais (TypeScript, Python, Go, C#, Java, YAML) com suporte nativo a multiplas clouds.

## Key concept

Pulumi segue a mesma linha do AWS CDK — usar linguagens de programacao ao inves de DSLs proprietarias para definir infraestrutura. A diferenca fundamental: Pulumi nao tem lock-in com nenhum provedor de cloud. Suporta AWS, Azure, Google Cloud, DigitalOcean, Alibaba Cloud, DataDog e dezenas de outros providers.

O codigo de infraestrutura vai para um repositorio Git dedicado. Para criar/recriar recursos, basta deployar o projeto de infra — se alguem deletar recursos manualmente no console, rodar o Pulumi novamente recria tudo.

## Decision framework

| Situacao | Recomendacao |
|----------|-------------|
| Projeto individual, open source suficiente | Pulumi Free (Always Free, 1 membro, recursos ilimitados) |
| Time de desenvolvimento | Plano Team ou Enterprise (Free nao suporta times) |
| Ja usa Python/TypeScript no projeto | Usar mesma linguagem no Pulumi — curva de aprendizado menor |
| Precisa de multi-cloud | Pulumi e forte candidato (suporte nativo) |
| Popularidade e ecossistema sao prioridade | Terraform domina o mercado — considerar antes do Pulumi |
| Gerenciamento granular de recursos especificos | Avaliar limitacoes do Pulumi antes de adotar |

## How to think about it

### Escolha de linguagem

Pulumi suporta TypeScript, Python, Go, C#, Java e YAML. A estrategia ideal: usar a mesma linguagem dos projetos da equipe. Se o time trabalha com Python, lançar o IaC tambem em Python reduz a curva de aprendizado significativamente.

### Replicacao de ambientes

Um dos maiores valores do IaC: criar ambientes identicos (dev/staging/prod). Seguindo o Twelve-Factor App, ambientes devem ser o mais parecidos possivel. Com Pulumi, cria-se o declarativo uma vez e replica conforme necessidade — sem recriar manualmente no console.

### Setup basico

1. Instalar CLI do Pulumi (macOS, Windows, Linux)
2. Escolher linguagem (TypeScript, Python, YAML, etc.)
3. Exportar credentials do provider (ex: AWS access key + secret key)
4. Criar projeto: `pulumi new aws-typescript` (ou `aws-python`, `aws-yaml`, etc.)
5. Definir recursos no codigo
6. Deploy: `pulumi up`

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Pulumi e totalmente gratuito | Free so para uso individual (1 membro). Times precisam de plano pago |
| Pulumi e igual ao Terraform | Pulumi usa linguagens reais, Terraform usa HCL (DSL propria) |
| Qualquer IaC tool funciona igual com qualquer cloud | Pulumi precisa de configuracao de conexao (credentials) por provider |
| CDK e Pulumi sao a mesma coisa | CDK tem lock-in com AWS, Pulumi e multi-cloud |

## Landscape de ferramentas IaC

| Ferramenta | Caracteristica principal |
|-----------|------------------------|
| **Pulumi** | Multi-cloud, linguagens reais, open source core |
| **AWS CDK** | Linguagens reais, lock-in AWS |
| **Terraform** | HCL, multi-cloud, mais popular do mercado |
| **Ansible** | Configuracao de servidores, mais antigo |
| **Chef/Puppet** | Pioneiros do IaC, gerenciamento de configuracao |

## Limitations

- Plano gratuito limitado a 1 membro — inviavel para times sem pagar
- Menor popularidade que Terraform — menos recursos da comunidade, menos vagas pedem Pulumi
- Alguns recursos especificos de cloud podem ter limitacoes de gerenciamento
- Requer configuracao explicita de credentials para cada provider

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-pulumi/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-pulumi/references/code-examples.md)
