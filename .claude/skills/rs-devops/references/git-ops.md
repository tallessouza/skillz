---
name: rs-devops-git-ops
description: "Applies Infrastructure as Code and GitOps principles when designing cloud infrastructure, repository strategies, or DevOps workflows. Use when user asks to 'create infrastructure', 'deploy to cloud', 'set up AWS resources', 'organize infra repo', or 'manage cloud resources'. Ensures declarative resource management, Git-based change control, and single source of truth for infrastructure. Make sure to use this skill whenever discussing cloud resource creation or infrastructure repository structure. Not for application code, Docker/container configuration, or CI/CD pipeline implementation."
---

# Infrastructure as Code e GitOps

> Toda infraestrutura deve ser declarada em codigo, versionada no Git, e submetida aos mesmos fluxos de revisao que codigo de aplicacao.

## Key concept

IaC (Infrastructure as Code) substitui a criacao manual de recursos no console por declaracoes em codigo que sao executadas por ferramentas especializadas. GitOps complementa IaC ao aplicar fluxos Git (commits, pull requests, branch policies) ao repositorio de infraestrutura, criando uma fonte unica da verdade.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Criar recurso na nuvem (EC2, fila, banco, EKS) | Declarar via codigo, nunca criar direto no console |
| Alterar recurso existente | Pull request no repo de infra, nunca "so alterar no console" |
| Precisar saber quais recursos existem | Consultar o repositorio de infra (fonte unica da verdade) |
| Recurso de teste temporario | Criar e destruir via IaC para evitar recursos ociosos esquecidos |
| Multiplos times compartilham recursos | GitOps com branch policy e review obrigatorio |

## How to think about it

### Imperativo vs Declarativo

Modo imperativo: acessar o console, clicar, criar o recurso. Funciona, mas nao escala. Nao ha rastreio, nao ha versionamento, nao ha revisao.

Modo declarativo: descrever O QUE voce precisa em codigo. Uma ferramenta (Terraform, Pulumi, CloudFormation) transforma isso em recursos reais. O codigo e a fonte da verdade.

### O problema do recurso esquecido

Criar um EC2 para teste e esquecer de deletar gera cobranca silenciosa. Com IaC, o ciclo completo (criacao, edicao, remocao) e gerenciado via codigo. Destruir e tao simples quanto criar.

### GitOps como camada de governanca

O repositorio Git da infraestrutura funciona como o repositorio de uma aplicacao: commits atomicos, pull requests com review, historico de mudancas. Qualquer alteracao passa por revisao antes de afetar a nuvem.

## Rules

1. **Declare, nunca clique** — todo recurso de nuvem deve existir como codigo antes de existir na nuvem, porque o console nao oferece rastreabilidade
2. **Um repositorio, uma verdade** — o estado do repositorio de infra reflete o estado da nuvem, porque divergencias geram recursos fantasma e custos ocultos
3. **Pull request obrigatorio** — alteracoes em infra passam por review, porque um recurso compartilhado alterado sem revisao pode quebrar outros times
4. **Ciclo completo via codigo** — criacao, edicao e remocao sao operacoes de IaC, porque recursos ociosos esquecidos geram custo
5. **Versione a infraestrutura** — use Git para manter historico de todas as mudancas, porque permite rollback e auditoria

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Git e so para codigo de aplicacao | GitOps aplica os mesmos fluxos para infraestrutura |
| Criar no console e mais rapido | E mais rapido uma vez, mas impossivel de manter com multiplos recursos e times |
| IaC e so para empresas grandes | Ate um dev solo se beneficia ao evitar recursos esquecidos e custos inesperados |
| IaC e especifico de AWS | Aplica-se a qualquer cloud provider: GCP, Azure, DigitalOcean, etc |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar recurso direto no console sem registro | Declarar no repo de infra e executar via ferramenta de IaC |
| "So vou alterar no console rapidinho" | Abrir PR no repo de infra com a alteracao |
| Criar recurso de teste manualmente | Usar IaC para criar E destruir quando terminar |
| Manter infra sem versionamento | Repositorio Git dedicado com branch policies |

## When to apply

- Ao criar qualquer recurso em cloud provider (maquinas, filas, bancos, clusters)
- Ao estruturar repositorios de um projeto que tera infraestrutura
- Ao discutir estrategia de deploy e gestao de recursos
- Ao revisar arquitetura de times que compartilham infraestrutura

## Limitations

- Este skill cobre principios e decisoes, nao sintaxe especifica de ferramentas (Terraform, Pulumi, CloudFormation)
- Nao cobre CI/CD pipelines — apenas a estrategia de repositorio e fluxo de mudancas
- Nao cobre containerizacao (Docker, Kubernetes) — foca nos recursos de nuvem subjacentes

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-git-ops/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-git-ops/references/code-examples.md)
