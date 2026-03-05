# Deep Explanation: HPA Triggers no Kubernetes

## Por que o HPA existe

O instrutor explica dois problemas fundamentais da escala manual:

### Problema 1: Tempo
Escalar manualmente exige: detectar o problema → acessar o cluster → alterar replicas → redeployar. Durante esse tempo, a aplicacao pode ficar indisponivel. Pior: se a aplicacao ja esta sobrecarregada, o redeploy pode nem funcionar — voce teria que desligar o load balancer, subir replicas internamente e depois voltar o apontamento.

### Problema 2: Custo
Se voce escala para 10 replicas por um pico de trafego e esquece de voltar, esta pagando por recursos ociosos. O downsize tambem e manual — voce precisa monitorar quando o trafego baixou e voltar para o numero original.

## Como o HPA resolve

O HPA usa um **watcher** que observa o Metrics Server continuamente. Quando a utilizacao dos pods ultrapassa o threshold definido (ex: 80% CPU), ele cria novas replicas automaticamente. Quando o trafego volta ao normal, ele remove as replicas excedentes ate voltar ao `minReplicas`.

## Relacao entre Resources e HPA

O HPA calcula percentuais baseado nos `resources.requests` do Deployment. Se voce definiu `cpu: 100m` como request e o pod esta usando `80m`, isso e 80% de utilizacao. Sem resources definidos, o HPA nao consegue calcular nada.

Cada replica usa a mesma configuracao de resources. Se voce tem `requests: 100m` e `limits: 200m`, cada pod pode usar ate 200m de CPU. Com 3 replicas, voce esta alocando 300m de request e pode usar ate 600m no limite.

## O conceito de "tender ao infinito"

O instrutor destaca que HPA, em teoria, pode escalar infinitamente — mais pods, mais nos, mais pods. Mas isso **nao e boa pratica**. O maxReplicas serve como:
1. **Limite de custo** — evita escalada descontrolada
2. **Sinal de anomalia** — se atingiu o maximo, algo errado esta acontecendo
3. **Trigger de alerta** — configure notificacao (Slack, PagerDuty, on-call) quando maxReplicas for atingido

## Regra pratica do instrutor

Se voce roda normalmente com 3 replicas, um maxReplicas de 8 e razoavel. Se chegar em 8, nao aumente automaticamente — investigue a causa.

## KEDA vs HPA nativo

O HPA nativo trabalha com metricas de CPU e memoria (built-in no Kubernetes). O KEDA (Kubernetes Event Driven Autoscaling) precisa ser instalado separadamente e permite escalar por eventos (filas, mensagens, etc). O KEDA sera abordado no modulo de observabilidade.

## Metrics Server como pre-requisito

O Metrics Server coleta metricas de utilizacao dos pods (`kubectl top pod`). Sem ele instalado, o HPA nao tem dados para tomar decisoes. O comando `kubectl top pod -n namespace` mostra CPU e memoria atual dos pods.