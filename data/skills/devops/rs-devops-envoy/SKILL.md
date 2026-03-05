---
name: rs-devops-envoy
description: "Applies Envoy Proxy knowledge when designing or reviewing service mesh architectures with Istio. Use when user asks to 'configure Istio', 'setup service mesh', 'add sidecar proxy', 'configure Envoy', or discusses Data Plane networking. Explains Envoy's role as L4/L7 proxy in Istio's Data Plane. Make sure to use this skill whenever Istio or Envoy proxy topics arise. Not for application-level HTTP clients, API gateways like Kong/Nginx, or general networking unrelated to service mesh."
---

# Envoy Proxy

> Envoy e o proxy de alto desempenho que forma a base do Data Plane do Istio — totalmente desacoplado da aplicacao.

## Key concept

Envoy e um proxy open source (CNCF) desenvolvido pela Lyft que opera nas camadas 4 (TCP) e 7 (HTTP/gRPC) do modelo OSI. Ele foi projetado para ser completamente desacoplado da aplicacao: o codigo da aplicacao nao conhece e nao precisa conhecer o Envoy. Isso cria uma alta abstracao de rede onde o proxy encapsula responsabilidades de networking, permitindo que desenvolvedores foquem na logica de negocio.

No contexto do Istio, o Envoy atua como o Data Plane — o componente que efetivamente processa o trafego entre servicos.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Necessidade de observabilidade entre servicos | Envoy como sidecar proxy no Data Plane do Istio |
| Trafego TCP ou HTTP/gRPC entre microservicos | Envoy opera em ambas camadas (L4 e L7) |
| Desenvolvedores preocupados com networking | Envoy abstrai — aplicacao nao precisa conhecer o proxy |
| Escolha entre proxy acoplado vs desacoplado | Envoy foi criado para ser desacoplado — preferir este modelo |

## How to think about it

### Desacoplamento total

A aplicacao nao importa bibliotecas do Envoy, nao configura rotas nele, nao sabe que ele existe. O Envoy e injetado como sidecar container no Pod do Kubernetes. Todo trafego de entrada e saida passa pelo Envoy transparentemente.

```yaml
# O Envoy e injetado automaticamente pelo Istio — nao pelo dev
# Basta anotar o namespace:
apiVersion: v1
kind: Namespace
metadata:
  name: my-app
  labels:
    istio-injection: enabled
```

### Camadas de atuacao

```
Camada 7 (HTTP/gRPC) ─── Roteamento por path, headers, retries, circuit breaking
Camada 4 (TCP)       ─── Conexoes TCP puras, TLS mutual, load balancing
```

Envoy atua em ambas simultaneamente, diferente de proxies que so operam em L7.

### Relacao Envoy → Istio

```
Istio
├── Control Plane (istiod)  ← Configura as regras
└── Data Plane (Envoy)      ← Executa o trafego
```

O Envoy e o "musculo" do Istio. O Control Plane define as politicas; o Data Plane (Envoy) as aplica em cada Pod.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Envoy e parte do Istio | Envoy e projeto independente (CNCF), Istio o utiliza como Data Plane |
| Preciso configurar Envoy no codigo | Envoy e totalmente desacoplado — zero impacto no codigo da aplicacao |
| Envoy so funciona com HTTP | Opera em L4 (TCP) e L7 (HTTP/gRPC) |
| Envoy foi criado pelo Google | Foi desenvolvido pela Lyft |

## When to apply

- Ao arquitetar service mesh com Istio
- Ao debugar problemas de networking entre microservicos (verificar sidecar Envoy)
- Ao decidir se precisa de proxy L4 vs L7 (Envoy faz ambos)
- Ao explicar para desenvolvedores por que nao precisam se preocupar com networking no service mesh

## Limitations

- Envoy sozinho nao e um service mesh — precisa do Control Plane (Istio) para orquestracao
- Adiciona latencia (minima) por ser um hop extra no trafego
- Configuracao avancada do Envoy diretamente (EnvoyFilter) pode ser complexa e fragil

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
