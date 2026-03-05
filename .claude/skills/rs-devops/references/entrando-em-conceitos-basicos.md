---
name: rs-devops-entrando-em-conceitos-basicos
description: "Applies Service Mesh concepts when designing microservice architectures in Kubernetes. Use when user asks to 'design microservice communication', 'add mTLS between services', 'implement retry/timeout strategy', 'improve observability', or 'control traffic in a cluster'. Guides decisions on when Service Mesh is justified vs overengineering. Make sure to use this skill whenever architecting inter-service communication in clusters with 50+ services. Not for specific tool configuration (Istio, Linkerd) or application-level code patterns."
---

# Service Mesh — Conceitos Fundamentais

> Ao projetar comunicacao entre microservicos em cluster, delegue seguranca, resiliencia e observabilidade para a camada de infraestrutura (Service Mesh), mantendo a aplicacao focada no dominio de negocio.

## Rules

1. **Chamadas intra-cluster sao HTTP por padrao** — sem TLS, qualquer servico pode chamar qualquer outro sem validacao de identidade, porque o Kubernetes nao adiciona criptografia nas chamadas internas automaticamente
2. **Use mTLS para validar identidade entre servicos** — o servico B precisa saber que quem chamou foi o servico A, e implementar isso na camada da aplicacao e extremamente complicado
3. **Separe responsabilidades: aplicacao vs infraestrutura** — retry, timeout, circuit breaker, rate limit e balanceamento pertencem a infraestrutura, nao ao codigo da aplicacao, porque isso elimina replicacao de codigo em centenas de servicos
4. **Service Mesh so faz sentido em escala** — com poucos servicos (monolito ou 10-20 servicos), e overengineering; a partir de 50+ servicos comeca a justificar
5. **Nao use Service Mesh apenas para mTLS** — existem ferramentas mais simples para resolver apenas mTLS; Service Mesh justifica-se quando voce precisa de multiplas capacidades (seguranca + resiliencia + observabilidade + controle de trafego)
6. **O sidecar amplia observabilidade automaticamente** — como roda ao lado da aplicacao, extrai metricas de toda a malha sem instrumentacao manual

## Decision Framework

| Situacao | Decisao |
|----------|---------|
| < 20 microservicos, sem requisitos complexos de seguranca | Nao usar Service Mesh — overengineering |
| Precisa apenas de mTLS entre servicos | Usar ferramenta dedicada de mTLS, nao Service Mesh completo |
| 50+ microservicos com necessidade de observabilidade | Forte candidato a Service Mesh |
| Retry/timeout implementado manualmente em cada servico | Sinal de necessidade — delegar para infra |
| Sem circuit breaker e falha local propaga para toda rede | Service Mesh resolve com circuit breaker automatizado |
| Chamadas entre servicos no mesmo cluster saem para DNS externo | Usar chamadas intra-cluster + mTLS via Service Mesh |

## Capacidades do Service Mesh

### Seguranca (mTLS)
```
Servico A ---[HTTP sem TLS]---> Servico B    # SEM Service Mesh: sem validacao
Servico A ---[mTLS via sidecar]---> Servico B # COM Service Mesh: identidade validada
```

### Resiliencia (retry, timeout, circuit breaker)
```yaml
# Configurado na camada de infraestrutura, nao na aplicacao
retry:
  attempts: 3
  perTryTimeout: 2s
timeout: 10s
circuitBreaker:
  maxConnections: 100
  maxPendingRequests: 50
```

### Observabilidade
```
[Sidecar A] --metricas--> [Coletor] --dashboard--> visibilidade da malha inteira
```

### Controle de trafego
- Rate limiting
- Roteamento inteligente
- Balanceamento de carga

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Implementar retry/timeout em cada microservico individualmente | Configurar na camada do Service Mesh |
| Sair do cluster para resolver DNS entre servicos no mesmo cluster | Usar chamadas intra-cluster |
| Adotar Service Mesh para 5 servicos | Avaliar se a complexidade justifica |
| Usar Service Mesh apenas para mTLS | Usar ferramenta dedicada ou justificar com multiplas capacidades |
| Ignorar observabilidade em ambiente com 100+ servicos | Service Mesh amplia observabilidade automaticamente |
| Deixar chamadas intra-cluster sem criptografia em producao | Habilitar mTLS via Service Mesh |

## Heuristics

| Sinal | Acao |
|-------|------|
| Codigo de retry duplicado em muitos servicos | Candidato forte para Service Mesh |
| Falha em um servico derruba outros em cascata | Precisa de circuit breaker — Service Mesh resolve |
| Nao sabe quais servicos chamam quais | Precisa de observabilidade — Service Mesh resolve |
| Equipe pequena, poucos servicos | Nao adote — complexidade nao compensa |
| Ambiente regulado exige auditoria de comunicacao | mTLS + observabilidade do Service Mesh atende |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-entrando-em-conceitos-basicos/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-entrando-em-conceitos-basicos/references/code-examples.md)
