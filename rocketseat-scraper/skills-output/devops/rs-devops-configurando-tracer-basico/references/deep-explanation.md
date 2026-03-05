# Deep Explanation: Configurando Tracer Basico

## Por que Jaeger?

O Jaeger e um projeto open source da CNCF, criado originalmente pela Uber. Ele resolve o problema de tracing distribuido — rastrear uma requisicao enquanto ela passa por multiplos servicos. No contexto de service mesh com Istio, o Jaeger se integra nativamente porque o Envoy proxy (sidecar) ja exporta spans automaticamente.

O instrutor menciona o Grafana Tempo como alternativa (visto no modulo de observabilidade), mas escolhe Jaeger aqui por ser o addon padrao do Istio e por ter integracao direta com Kiali.

## Arquitetura de Observabilidade no Istio

A stack completa mencionada na aula:
- **Kiali** — visualizacao da malha (grafo de servicos, trafego)
- **Prometheus** — metricas (coleta de dados dos proxies Envoy)
- **Jaeger** — tracing distribuido (spans entre servicos)

Esses tres componentes se complementam. O Kiali consome dados tanto do Prometheus quanto do Jaeger para mostrar uma visao unificada. O instrutor destaca que "voce comeca a ter uma observabilidade muito legal" quando os tres estao funcionando juntos.

## Por que FortIO e nao K6?

O instrutor menciona K6 (da Grafana Labs) como alternativa, mas prefere FortIO por uma razao pratica: **e extremamente simples de rodar dentro de um cluster Kubernetes**. Basta um `kubectl run` com a imagem Docker. Nao precisa de scripts, configuracao externa ou instalacao.

A grande sacada e que ao rodar FortIO **dentro do cluster e no mesmo namespace**, o pod recebe automaticamente o sidecar do Istio. Isso significa que o trafego de teste passa pela malha de servico completa — proxy Envoy, metricas Prometheus, traces Jaeger. Um teste externo ao cluster nao teria essa visibilidade.

## DNS Interno do Kubernetes

O endpoint usado no teste (`http://app-service-mesh.svc/healthz`) funciona porque:
1. O FortIO roda no mesmo namespace (`app`)
2. O Kubernetes tem um DNS interno que resolve nomes de Service
3. O formato e `nome-do-servico.svc` (ou FQDN completo: `nome.namespace.svc.cluster.local`)
4. O Service faz load balancing para todos os pods

O instrutor mostra no Lens que o servico `app-service-mesh` existe e o DNS interno resolve para ele.

## Interpretacao dos Resultados

O teste pediu 8000 QPS mas obteve ~2734. O instrutor nao considera isso um problema, e sim um dado valioso:
- A aplicacao tem **limites reais de recursos** (CPU, memoria)
- Nao ha **HPA (Horizontal Pod Autoscaler)** configurado
- O resultado mostra a **capacidade real** do pod atual

Isso e o proposito de um teste de carga: descobrir limites antes que eles sejam atingidos em producao.

## Fluxo de Trafego Observado no Kiali

```
FortIO pod → Envoy proxy (sidecar) → Service (DNS) → Envoy proxy (sidecar) → App pod
```

No Kiali, isso aparece como:
- FortIO com trafego de saida (outbound) para App Service Mesh
- 1.2K+ RPS registrados
- 100% do trafego visivel e rastreavel
- Metricas de latencia e codigo de resposta disponiveis

## Proximos Passos Mencionados

O instrutor antecipa configuracoes avancadas do Istio:
- **Virtual Service** — roteamento avancado de trafego
- **Destination Rule** — politicas de trafego por destino
- **Fault Injection** — injetar falhas para testar resiliencia
- **Circuit Breaker** — protecao contra cascata de falhas
- **Deploy Canario** — release gradual com porcentagem de trafego