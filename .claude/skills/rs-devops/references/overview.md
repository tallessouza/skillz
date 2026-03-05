---
name: rs-devops-iac-overview
description: "Applies Infrastructure as Code mental models when designing or reviewing infrastructure. Use when user asks to 'provision infrastructure', 'write terraform', 'create cloud resources', 'setup IaC', or discusses declarative vs imperative approaches. Guides choosing declarative over imperative, state-based resource management, and IaC workflow design. Make sure to use this skill whenever infrastructure provisioning or IaC architecture decisions arise. Not for application code, CI/CD pipeline configuration, or container orchestration."
---

# Infrastructure as Code — Overview e Modelos

> Infraestrutura deve ser representada como estado declarativo versionado, nunca como sequencias de comandos imperativas.

## Key concept

IaC transforma infraestrutura em codigo versionado. O ciclo completo: developer escreve codigo representando recursos → versionamento (Git) → push dispara orquestracao → provedor de cloud cria/edita/deleta recursos. Se ocorre erro (sintaxe, recurso invalido, tag mal escrita), a infra nao e mutabilizada — o estado anterior permanece intacto.

IaC e um pilar da cultura DevOps porque elimina silos: developers, SREs e pessoas de infra trabalham no mesmo codigo, democratizando o conhecimento de infraestrutura.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Precisa provisionar recurso cloud | Modelo declarativo — declare O QUE, nao COMO |
| Recurso tem interdependencias | Declarativo resolve automaticamente a ordem |
| Precisa de historico de mudancas | Estado versionado no Git — cada commit e um snapshot da infra |
| Precisa deletar recursos | Altere o estado (remova do codigo) — o provedor reflete |
| Erro no provisionamento | Infra nao muda — corrija o codigo e re-aplique |
| Ambiente on-premise | IaC tambem funciona, com limitacoes |

## Declarativo vs Imperativo

### Declarativo (preferido para IaC)

- Foca no **O QUE** precisa ser feito
- Declare o recurso e a ferramenta resolve o como
- Gerencia interdependencias automaticamente
- Mantem estados passados (historico de mudancas)
- Facilita delecoes futuras — altere o estado, o provedor reflete
- Exemplo: "Quero um EC2 com capacity X" → ferramenta cria

### Imperativo (evitar para IaC)

- Foca no **COMO** fazer
- Sequencia de comandos executados em ordem
- Exige execucao serial — ordem importa sempre
- Interdependencias sao responsabilidade do autor
- Historico limitado aos comandos executados
- Exemplo: "Execute comando A, depois B, depois C para criar EC2"

## Heuristics

| Situacao | Acao |
|----------|------|
| Escolher abordagem para novo recurso | Sempre declarativo — declare estado desejado |
| Recurso com muitas dependencias | Declarativo — resolve ordem automaticamente |
| Script one-off de emergencia | Imperativo aceitavel, mas documente e migre para declarativo |
| Precisa rastrear mudancas na infra | Git como SCM — cada PR e code review de infraestrutura |
| Multiplos cloud providers | IaC suporta AWS, Azure, GCP, Oracle — mesma abordagem |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|-----------|-------------------|
| Scripts bash sequenciais para provisionar infra | Codigo declarativo versionado (Terraform, CloudFormation) |
| Criar recursos manualmente no console | Declarar no codigo e aplicar via pipeline |
| Ignorar interdependencias entre recursos | Usar modelo declarativo que resolve dependencias |
| Deletar recursos direto no provider | Remover do codigo — estado reflete no provider |
| Infra sem versionamento | Todo codigo IaC no Git com code review |
| Misturar imperativo e declarativo sem criterio | Padronizar em declarativo para toda a infra |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-overview/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-overview/references/code-examples.md)
