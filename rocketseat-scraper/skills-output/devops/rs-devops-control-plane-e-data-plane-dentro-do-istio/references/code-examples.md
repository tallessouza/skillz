# Code Examples: Control Plane e Data Plane no Istio

## Estrutura conceitual do Istio

```
┌─────────────────────────────────────────────┐
│              CONTROL PLANE                   │
│                                              │
│  ┌─────────────────────────────────────┐     │
│  │            istiod                    │     │
│  │                                      │     │
│  │  ┌─────────┐ ┌────────┐ ┌────────┐ │     │
│  │  │  Pilot  │ │Citadel │ │ Galley │ │     │
│  │  │(config) │ │ (sec)  │ │(valid) │ │     │
│  │  └─────────┘ └────────┘ └────────┘ │     │
│  └─────────────────────────────────────┘     │
│                                              │
│  Alto nivel → Baixo nivel (conversao)        │
└──────────────────┬──────────────────────────┘
                   │ configuracoes
                   ▼
┌─────────────────────────────────────────────┐
│              DATA PLANE                      │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Pod A   │  │  Pod B   │  │  Pod C   │  │
│  │┌────────┐│  │┌────────┐│  │┌────────┐│  │
│  ││  App   ││  ││  App   ││  ││  App   ││  │
│  │└────────┘│  │└────────┘│  │└────────┘│  │
│  │┌────────┐│  │┌────────┐│  │┌────────┐│  │
│  ││ Envoy  ││  ││ Envoy  ││  ││ Envoy  ││  │
│  ││sidecar ││  ││sidecar ││  ││sidecar ││  │
│  │└────────┘│  │└────────┘│  │└────────┘│  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
```

## Ambient Mode — Arquitetura sem Sidecar

```
┌─────────────────────────────────────────────┐
│              CONTROL PLANE                   │
│         (istiod — mesmo de antes)            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│              DATA PLANE (Ambient Mode)       │
│                                              │
│  Node 1                                      │
│  ┌────────────────────────────────────┐      │
│  │  ┌──────┐  ┌──────┐  ┌──────┐    │      │
│  │  │Pod A │  │Pod B │  │Pod C │    │      │
│  │  │(app) │  │(app) │  │(app) │    │      │
│  │  └──────┘  └──────┘  └──────┘    │      │
│  │          (sem sidecars!)          │      │
│  │                                    │      │
│  │  ┌─────────────────────────────┐  │      │
│  │  │  ztunnel (L4 - seguranca)  │  │      │
│  │  └─────────────────────────────┘  │      │
│  │  ┌─────────────────────────────┐  │      │
│  │  │  Waypoint proxy (L7 - HTTP)│  │      │
│  │  └─────────────────────────────┘  │      │
│  └────────────────────────────────────┘      │
│                                              │
│  (execucao por no, similar a DaemonSet)      │
└─────────────────────────────────────────────┘
```

## Exemplo: VirtualService (configurado no Control Plane)

```yaml
# Recurso declarativo de alto nivel
# O Pilot converte isso em configuracao Envoy de baixo nivel
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: my-service-routing
spec:
  hosts:
    - my-service
  http:
    - match:
        - headers:
            x-version:
              exact: "canary"
      route:
        - destination:
            host: my-service
            subset: v2
    - route:
        - destination:
            host: my-service
            subset: v1
          weight: 90
        - destination:
            host: my-service
            subset: v2
          weight: 10
```

## Exemplo: DestinationRule (configurado no Control Plane)

```yaml
# Define subsets e politicas de conexao
# Citadel gerencia o mTLS referenciado aqui
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: my-service-destination
spec:
  host: my-service
  trafficPolicy:
    tls:
      mode: ISTIO_MUTUAL  # mTLS gerenciado pelo Citadel
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

## Comparacao de recursos: Sidecar vs Ambient Mode

```yaml
# Sidecar mode: 10 pods = 10 sidecars extras
# Cada sidecar consome ~50-100Mi RAM, ~100m CPU
# Total extra: ~500Mi-1Gi RAM, ~1 CPU

# Exemplo de resource usage com sidecar:
# Pod: 256Mi (app) + 128Mi (envoy sidecar) = 384Mi por pod
# 10 pods = 3840Mi total (1280Mi so de sidecars)

# Ambient mode: 10 pods = 1 ztunnel + 1 waypoint por no
# Se 10 pods estao em 3 nos: 3 ztunnels + 3 waypoints
# Reducao significativa de consumo
```

## Fluxo de trafego no Data Plane

```
# Sidecar mode:
Service A → [Envoy sidecar A] → rede → [Envoy sidecar B] → Service B
                ↑                                ↑
          intercepta saida                 intercepta entrada
          coleta telemetria                coleta telemetria
          aplica politicas                 aplica politicas

# Ambient mode:
Service A → [ztunnel no Node 1] → rede → [ztunnel no Node 2] → Service B
                ↑                                ↑
          seguranca L4                     seguranca L4
          
     [Waypoint proxy Node 1]         [Waypoint proxy Node 2]
          roteamento L7                    roteamento L7
```