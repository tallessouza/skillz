---
name: rs-devops-o-que-e-um-sidecar
description: "Applies sidecar proxy patterns when designing or reviewing Kubernetes service mesh architectures. Use when user asks to 'configure service mesh', 'add sidecar proxy', 'setup Istio/Linkerd', 'design microservice communication', or 'implement traffic interception in K8s'. Make sure to use this skill whenever discussing pod-level proxy patterns or service-to-service communication in Kubernetes. Not for application-level HTTP clients, API gateway configuration, or ingress controller setup."
---

# Sidecar em Service Mesh

> Todo trafego entre servicos passa por proxies sidecar, nunca diretamente entre containers de aplicacao.

## Conceito central

O sidecar e um container proxy que roda **ao lado** do container da aplicacao dentro do mesmo pod Kubernetes. Ele intercepta todo trafego de entrada e saida, permitindo que a aplicacao foque apenas na logica de negocio enquanto o sidecar gerencia responsabilidades de infraestrutura.

## Rules

1. **Um sidecar por pod** — cada instancia (pod) tem seu proprio sidecar, porque o proxy precisa conhecer o estado daquela instancia especifica
2. **Comunicacao e proxy-para-proxy** — servico A envia pelo seu proxy, que chega no proxy do servico B, porque isso garante que todas as abstrações (retry, circuit breaker, mTLS) sejam aplicadas em ambos os lados
3. **Isolamento arquitetural total** — o container da aplicacao nao conhece o sidecar e vice-versa em termos de implementacao, porque isso permite trocar o proxy sem alterar codigo da aplicacao
4. **Sidecar intercepta antes da aplicacao** — se ha problema, o proxy barra a request antes de chegar na aplicacao, porque isso protege a aplicacao de trafego indesejado
5. **Replicacao proporcional** — 10 pods = 10 sidecars, porque cada instancia precisa de monitoramento e controle independente

## Decision framework

| Situacao | Acao |
|----------|------|
| Microservicos precisam de mTLS, retry, observabilidade | Sidecar proxy via service mesh |
| Apenas um servico precisa de rate limiting | Pode resolver no ingress, sidecar e overkill |
| Precisa interceptar trafego sem alterar codigo | Sidecar e a solucao correta |
| Preocupado com overhead de recursos (muitos pods) | Avalie o custo: N pods = N sidecars extras |

## Como funciona o fluxo

```
[Servico A Container] → [Sidecar A (proxy)] → rede → [Sidecar B (proxy)] → [Servico B Container]
                                                                          ↓
                                                              (se B nao saudavel,
                                                               proxy barra a request)
```

## Anatomia do pod com sidecar

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: meu-servico
spec:
  containers:
    - name: app              # Container da aplicacao
      image: minha-app:1.0
      ports:
        - containerPort: 8080
    - name: sidecar-proxy    # Container do sidecar (isolado)
      image: envoyproxy/envoy:latest
      ports:
        - containerPort: 15001
```

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Implementar retry/circuit breaker no codigo quando ha service mesh | Delegue ao sidecar proxy |
| Assumir que a aplicacao conhece o sidecar | Mantenha isolamento total — sao containers independentes |
| Configurar comunicacao direta entre servicos ignorando o proxy | Todo trafego passa pelo sidecar |
| Ter um unico sidecar para multiplos pods | Cada pod tem seu proprio sidecar |

## Limitacoes

- Cada sidecar consome CPU e memoria — em clusters grandes, o overhead pode ser significativo
- Adiciona latencia (minima) a cada hop de rede
- Complexidade operacional: mais containers para monitorar e atualizar
- Nem toda aplicacao precisa de service mesh — avalie a real necessidade antes de adotar

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
