---
name: rs-devops-problemas-que-resolve-e-beneficios
description: "Applies Service Mesh concepts when designing microservice infrastructure for resilience, observability, and traffic management. Use when user asks to 'configure circuit breaker', 'setup retry policies', 'implement canary deployment', 'blue-green deploy', 'service mesh', or 'improve microservice resilience'. Covers when to use Service Mesh vs code-level solutions, mTLS, and deploy strategies. Make sure to use this skill whenever architecting communication between microservices in Kubernetes. Not for application-level code patterns, single-service apps, or monolith architectures."
---

# Service Mesh — Problemas que Resolve e Benefícios

> Mova resiliência, observabilidade e controle de tráfego para a camada de infraestrutura, mantendo a aplicação agnóstica a esses conceitos.

## Rules

1. **Resiliência na infraestrutura, não no código** — circuit breaker, retry e timeout pertencem ao Service Mesh, não a cada microserviço, porque duplicar essa lógica em N serviços gera problemas de manutenibilidade
2. **Aplicação agnóstica** — o serviço não precisa saber o que é circuit breaker; a camada de infra intercepta e controla o tráfego, porque isso isola responsabilidades
3. **Nunca use Service Mesh só para mTLS** — se o único caso de uso é segurança entre serviços, é over-engineering; existem soluções mais simples para mTLS isolado
4. **Combine capacidades para justificar** — Service Mesh faz sentido quando você precisa de resiliência + observabilidade + controle de tráfego juntos, porque o overhead operacional precisa compensar
5. **Blast radius primeiro** — um problema local pode impactar a rede inteira; circuit breaker existe para conter o raio de explosão antes que ele se propague
6. **Deploy strategies são bônus** — Blue-Green, Canary e teste A/B são possíveis via Service Mesh, mas existem ferramentas específicas; use o Service Mesh para isso se já o utiliza para resiliência

## Decision Framework

| Cenário | Recomendação |
|---------|-------------|
| Poucos microserviços (<5), sem complexidade de rede | Code-level resilience (libs) |
| Muitos microserviços, resiliência + observabilidade necessárias | Service Mesh |
| Apenas mTLS entre serviços | Solução dedicada de segurança, não Service Mesh |
| Precisa de Canary/Blue-Green e já usa Service Mesh | Aproveite o Service Mesh |
| Precisa de Canary/Blue-Green sem Service Mesh | Ferramentas específicas de deploy |

## Circuit Breaker — Como Funciona

```
Circuito FECHADO (normal) → requisições passam normalmente
         │
    Serviço C retorna 5xx repetidamente (ex: 5 vezes)
         │
         ▼
Circuito ABERTO → B para de chamar C, retém eventos
         │
    Após cooldown period
         │
         ▼
Circuito HALF-OPEN → tenta algumas requisições
         │
    Se OK → FECHADO | Se falha → ABERTO novamente
```

## Capacidades do Service Mesh

### Resiliência
```yaml
# Exemplo conceitual de configuração
resilience:
  circuitBreaker:
    consecutive5xxErrors: 5
    action: open_circuit
  retry:
    attempts: 3
    perTryTimeout: 2s
  timeout:
    global: 30s
```

### Observabilidade
- Integração com Prometheus e Grafana
- Visualização da malha de serviços (service graph)
- Métricas de tráfego entre serviços automaticamente

### Deploy Strategies
| Estratégia | Descrição |
|-----------|-----------|
| **Blue-Green** | Nova versão só recebe tráfego quando estiver healthy |
| **Canary** | Libera para X% do tráfego gradualmente |
| **Teste A/B** | Duas versões simultâneas para comparação |
| **Rolling Update** | Padrão do Kubernetes, sem Service Mesh necessário |

### Segurança (mTLS)
- Validação mútua entre serviços dentro do cluster
- Apenas como benefício adicional, nunca como justificativa única

## Heuristics

| Situação | Faça |
|----------|------|
| Duplicando retry/timeout em cada serviço | Mova para Service Mesh |
| Um serviço instável derruba a rede toda | Implemente circuit breaker no mesh |
| Precisa de visibilidade da comunicação entre serviços | Aproveite observabilidade do mesh |
| Quer testar deploy em produção com segurança | Use Canary via mesh |
| Só precisa de mTLS e nada mais | Não use Service Mesh para isso |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Circuit breaker controlado por env var manual em cada serviço | Circuit breaker na camada de Service Mesh com limites configurados |
| Implementar retry em código em todos os microserviços | Retry policy centralizada no mesh |
| Adotar Service Mesh só para mTLS | Usar solução dedicada de segurança ou justificar com mais capacidades |
| Ignorar blast radius de falhas localizadas | Configurar circuit breaker para conter propagação |
| Rolling update sempre, mesmo quando precisa de zero-downtime | Blue-Green ou Canary via mesh quando disponível |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
