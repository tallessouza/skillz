---
name: rs-devops-control-plane-data-plane-istio
description: "Applies Istio architecture knowledge when designing or configuring service mesh infrastructure. Use when user asks to 'setup Istio', 'configure service mesh', 'add sidecar proxy', 'configure Envoy', 'enable mTLS', or 'use ambient mode'. Enforces correct separation between control plane (istiod) and data plane (Envoy proxies). Make sure to use this skill whenever working with Istio configuration, service mesh architecture, or Kubernetes networking with Istio. Not for general Kubernetes networking without Istio, nor for application-level HTTP routing without service mesh."
---

# Control Plane e Data Plane no Istio

> Ao configurar Istio, separe claramente responsabilidades: control plane (istiod) define politicas e configuracoes, data plane (Envoy proxies) executa o trafego.

## Conceito central

O Istio segue o mesmo padrao conceitual do Kubernetes: um **control plane** (cerebro) que define regras e um **data plane** (execucao) que aplica essas regras no trafego real. O control plane converte regras de alto nivel em configuracoes de baixo nivel para os proxies.

## Arquitetura do Control Plane

### istiod — cerebro do Istio

O istiod integra tres componentes fundamentais:

| Componente | Responsabilidade |
|------------|-----------------|
| **Pilot** | Gerencia configuracoes dos proxies Envoy (VirtualService, DestinationRule) |
| **Citadel** | Seguranca: certificados, identidade, mTLS |
| **Galley** | Validacao e distribuicao de configuracoes |

### Funcao principal do istiod

```yaml
# istiod converte regras de alto nivel...
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
spec:
  hosts: ["my-service"]
  http:
    - route:
        - destination:
            host: my-service
            subset: v2
          weight: 80

# ...em configuracoes de baixo nivel para os proxies Envoy
# (essa conversao e transparente — voce nao precisa conhecer o baixo nivel)
```

## Arquitetura do Data Plane

### Modo Sidecar (padrao)

- Proxy Envoy implantado **ao lado de cada instancia** do servico
- Intercepta **todo** trafego de entrada e saida
- Coleta telemetria automaticamente
- Interpreta politicas definidas pelo control plane

### Ambient Mode (sem sidecar)

Divide o data plane em duas camadas:

| Camada | Componente | Funcao |
|--------|-----------|--------|
| Seguranca (L4) | **ztunnel** | mTLS, identidade |
| Proxy (L7) | **Waypoint proxy** | Roteamento HTTP, politicas |

Execucao acontece **por no** do cluster, nao por pod.

## Decision framework

| Situacao | Escolha | Porque |
|----------|---------|--------|
| Cluster com recursos abundantes, precisa granularidade por pod | Sidecar mode | Controle total por instancia |
| Cluster com muitos pods, recursos limitados | Ambient mode | Reduz consumo significativamente |
| Precisa telemetria detalhada por servico | Sidecar mode | Coleta nativa por proxy |
| Tempo de bootstrap do pod e critico | Ambient mode | Sem container adicional no pod |

## Heuristics

| Situacao | Acao |
|----------|------|
| Configurando roteamento (VirtualService, DestinationRule) | Lembre: isso mora no control plane (Pilot) |
| Habilitando mTLS entre servicos | Lembre: Citadel gerencia certificados |
| Validando configuracoes do Istio | Lembre: Galley faz validacao |
| 10 pods = 10 sidecars extras | Considere ambient mode para reduzir recursos |
| Pod demorando para subir com Istio | Sidecar adiciona tempo de bootstrap — avalie ambient mode |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Configurar Envoy diretamente no baixo nivel | Use VirtualService/DestinationRule — istiod converte para voce |
| Ignorar consumo de recursos dos sidecars em clusters grandes | Avalie ambient mode para clusters com muitos pods |
| Confundir control plane do K8s com control plane do Istio | Sao cerebros separados: K8s gerencia containers, Istio gerencia rede/mesh |
| Assumir que ambient mode nao tem data plane | Data plane existe, so nao usa sidecar — usa ztunnel + waypoint proxy |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
