---
name: rs-devops-explorando-arquitetura-istio
description: "Applies Istio service mesh architecture knowledge when designing or configuring Kubernetes clusters with Istio. Use when user asks to 'setup Istio', 'configure service mesh', 'add sidecar proxy', 'install Istio addons', or 'design microservices networking'. Covers CRD model, control/data plane, sidecar vs ambient mode, and multi-cluster deployment. Make sure to use this skill whenever working with Istio manifests or service mesh decisions on Kubernetes. Not for general Kubernetes networking without Istio, nor for Envoy-specific proxy configuration."
---

# Arquitetura do Istio

> Istio e um CRD que estende o Kubernetes — entender sua arquitetura e pre-requisito para configurar service mesh corretamente.

## Key concept

Istio nao substitui o Kubernetes, ele **estende** a API do Kubernetes via Custom Resource Definitions (CRDs). Manifestos Istio seguem a mesma estrutura YAML do Kubernetes (kind, apiVersion), mas usam a API do Istio. Isso garante alta integracao nativa com o cluster.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Precisa de observabilidade, seguranca e traffic management entre servicos | Istio como service mesh |
| Cluster simples sem comunicacao complexa entre pods | Kubernetes networking padrao, sem Istio |
| Preocupacao com overhead de sidecar por pod | Avaliar Ambient Mode (disponivel desde 2022) |
| Multiplos times no mesmo cluster | Multi-tenant Istio (multiplas instalacoes no mesmo cluster) |
| Multiplos clusters em producao | Multi-cluster Istio |
| Precisa de dashboards, tracing, metricas | Instalar addons do Istio (Kiali, Jaeger, Prometheus, Grafana) |

## How to think about it

### Istio como CRD
Kubernetes tem sua API padrao. Ao instalar Istio, voce adiciona novos `kind` e `apiVersion` que o cluster passa a reconhecer. Escrever manifesto Istio e como escrever manifesto Kubernetes — a diferenca e a API utilizada.

```yaml
# Manifesto Istio segue estrutura identica ao Kubernetes
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: my-service
spec:
  # configuracao especifica do Istio
```

### Sidecar vs Ambient Mode
- **Sidecar Mode** (padrao desde 2017): proxy Envoy injetado em cada pod como container lateral
- **Ambient Mode** (lancado em 2022): opera sem sidecar por pod, usando node-level proxy

### Control Plane e Data Plane
- **Control Plane**: gerencia configuracao e politicas (similar ao control plane do Kubernetes)
- **Data Plane**: camada onde o trafego efetivamente flui entre servicos (proxies Envoy)

## Heuristics

| Situacao | Acao |
|----------|------|
| Escrevendo manifesto Istio | Use apiVersion do Istio, mantenha estrutura YAML padrao K8s |
| Instalando Istio pela primeira vez | Comece com Sidecar mode, e o mais documentado e estavel |
| Precisa de funcionalidades extras | Instale addons — sao open source e complementam o Istio |
| Projeto com multiplos clusters | Configure Istio multi-cluster desde o inicio |
| Multiplos times compartilhando cluster | Avalie instalacao multi-tenant |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Istio substitui networking do Kubernetes | Istio **estende** o Kubernetes via CRDs, nao substitui |
| Sidecar e conceito exclusivo de service mesh | Sidecar e padrao arquitetural geral em Kubernetes |
| Ambient Mode substituiu Sidecar | Ambos coexistem, Sidecar ainda e o modo mais comum |
| Istio e produto de uma empresa | Open source, criado por IBM + Google + Lyft, mantido pela CNCF |

## Limitations

- Este skill cobre arquitetura conceitual do Istio, nao configuracao detalhada do Envoy proxy
- Para detalhes de control plane e data plane internals, consultar aulas especificas sobre esses temas
- Addons especificos (Kiali, Jaeger, etc.) tem configuracoes proprias nao cobertas aqui

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-explorando-a-arquitetura-do-istio/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-explorando-a-arquitetura-do-istio/references/code-examples.md)
