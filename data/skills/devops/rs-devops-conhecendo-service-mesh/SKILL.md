---
name: rs-devops-conhecendo-service-mesh
description: "Applies Service Mesh concepts when designing microservices infrastructure on Kubernetes. Use when user asks to 'setup service mesh', 'configure istio', 'improve service communication', 'add sidecar proxy', or designs microservices networking. Enforces understanding that Service Mesh is infrastructure-layer, not application code. Make sure to use this skill whenever discussing inter-service communication patterns in Kubernetes clusters. Not for application-level HTTP clients, API gateway routing, or monolithic architectures."
---

# Service Mesh — Conceitos Fundamentais

> Service Mesh e uma camada de infraestrutura que abstrai a comunicacao entre servicos, sem alterar o codigo das aplicacoes.

## Rules

1. **Service Mesh e infraestrutura, nunca codigo de aplicacao** — todas as abstrações ficam na camada de infra, porque isso permite que o time de SRE gerencie independentemente do time de desenvolvimento
2. **Ideal apenas para microservicos** — em aplicacoes monoliticas, Service Mesh e over-engineering, assim como o proprio Kubernetes, porque a complexidade nao se justifica com poucos servicos
3. **Roda ao lado da aplicacao (sidecar)** — o Service Mesh executa adjacente ao servico, interceptando comunicacao sem modificar o codigo, porque isso mantem as aplicacoes agnosticas
4. **Elimina duplicacao de codigo entre servicos** — ao inves de cada microservico implementar retry, circuit breaker, mTLS etc., a malha de servico abstrai isso na infra, porque atualizar N servicos e inviavel
5. **Comumente usado com Kubernetes** — embora funcione com Nomad, ECS ou VMs, o cenario mais comum e dentro de clusters Kubernetes, porque quem tem carga consideravel de microservicos ja usa orquestracao
6. **Segregacao de responsabilidade** — o desenvolvedor nao precisa manter a malha; o time de SRE/infra fornece a camada e o dev consome de forma abstrata

## Quando usar

| Cenario | Service Mesh? |
|---------|---------------|
| Microservicos em Kubernetes com muitos servicos | Sim — caso ideal |
| Microservicos em Nomad/ECS | Sim — conceito se aplica |
| Aplicacao monolitica | Nao — over-engineering |
| Poucos servicos (2-3) | Provavelmente nao — complexidade nao justifica |
| VMs sem orquestrador | Possivel mas incomum |

## O que o Service Mesh abstrai

- Comunicacao segura entre servicos (mTLS)
- Observabilidade (metricas, tracing, logs) — conexao direta com modulo de observabilidade
- Gerenciamento de trafego (retries, circuit breakers, load balancing)
- Politicas de acesso entre servicos

## Decisao: codigo vs infraestrutura

```
Monolito → implementa no codigo (aceitavel, servico unico)
Microservicos → implementa na infraestrutura via Service Mesh
  Porque: replicar implementacao em N servicos = inviavel
  Porque: update em N servicos = tempo proibitivo
  Porque: segregacao dev/infra = melhor ownership
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Implementar retry/circuit breaker em cada microservico | Delegar para o Service Mesh na camada de infra |
| Usar Service Mesh em monolito | Implementar diretamente no codigo da aplicacao |
| Exigir que devs mantenham a malha | Segregar para time de SRE/infra |
| Ignorar Kubernetes ao adotar Service Mesh | Usar Service Mesh dentro de clusters K8s (cenario mais comum) |
| Modificar codigo da aplicacao para integrar com a malha | Manter aplicacoes agnosticas — Service Mesh roda ao lado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
