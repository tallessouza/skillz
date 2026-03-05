# Deep Explanation: Istio Ambient Mode vs Sidecar

## Por que Ambient Mode existe

O Sidecar e o modo default do Istio — se voce nao fizer nada, ele injeta um container proxy (Envoy) ao lado de cada pod da aplicacao. Isso funciona bem em clusters pequenos, mas em escala (parques grandes de aplicacoes) pode causar:

- **Problemas de performance** — cada pod tem overhead de um container extra
- **Tempo de subida da aplicacao** — o sidecar precisa inicializar antes da app
- **Consumo de recursos** — memoria e CPU multiplicados por cada pod

## Como Ambient Mode funciona

A diferenca fundamental: em vez de injetar um proxy por pod, o Ambient Mode opera no **nivel do namespace**. A comunicacao e controlada pelo proprio namespace, sem container adicional dentro do pod.

Componentes instalados no Ambient Mode:
- **Istiod** — control plane (igual ao sidecar mode)
- **CNI Node** — DaemonSet que configura networking
- **Ztunnel** — DaemonSet que atua como agent do cluster

### DaemonSet como conceito

O instrutor destaca que DaemonSets no Kubernetes funcionam como **agents**: nao sao unicos por aplicacao, sao gerais do cluster. Se voce quer captar metricas ou fazer controle descentralizado, DaemonSet e o padrao. O Ztunnel segue essa logica — um agent por node, nao por pod.

## Sidecar vs Ambient — diferenca visual nos pods

- **Sidecar mode**: `kubectl get pods` mostra `2/2` (app + proxy)
- **Ambient mode**: `kubectl get pods` mostra `1/1` (somente app)

## Labels: a chave de ativacao

Nem sidecar nem ambient sao automaticos. Ambos exigem label no namespace:

- Sidecar: `istio-injection=enabled`
- Ambient: `istio.io/dataplane-mode=ambient`

Se voce esquecer a label, o namespace fica fora da malha e ferramentas como Kiali vao alertar.

## Dependencia Kiali → Prometheus

O instrutor enfatiza: Kiali depende do Prometheus (porta 9090) para metricas. Se Prometheus nao estiver rodando ou nao subiu, Kiali reclama na interface. Sempre instalar Prometheus antes ou garantir que esta healthy antes de acessar Kiali.

## Quando escolher cada modo

O instrutor nao detectou problemas com sidecar em clusters pequenos. A motivacao para ambient e **escala** — muitos pods, muitas aplicacoes. Para clusters menores, sidecar continua sendo perfeitamente valido.