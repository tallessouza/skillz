# Deep Explanation: Kubernetes HPA v1

## Por que o HPA e por aplicacao e nao por cluster

O HPA esta condicionado a uma aplicacao. Se voce tem um deployment ou replica set e quer usar HPA, tera um manifesto para cada deployment. Ele nao e um componente a nivel de cluster — esta dentro da propria aplicacao, pois a responsabilidade dele e olhar para aquele deployment especifico.

## O problema do target muito baixo vs muito alto

### Target baixo (ex: 30%)
30% de uso de CPU e algo super normal, nao causa nenhuma saturacao. Se voce define o target em 30%, sua aplicacao vai estar sempre hiperescalada, provocando ociosidade de utilizacao de recursos. A aplicacao sempre utiliza 50%, por exemplo, mas o target e 30% — ela vai ficar permanentemente autoescalada sem necessidade.

### Target alto (ex: 90-95%)
Se a aplicacao ja esta no limite de utilizacao, ate chegar em 95% foi um caminho gradual. Mas de 95% para 100% e muito rapido. Ate o HPA disparar a criacao de novos pods, ainda tem o tempo desses pods/containers subirem a aplicacao (bootstrap). Entao a aplicacao pode saturar antes dos novos pods estarem prontos.

### O sweet spot: 75-80%
O ideal e um numero entre 75 e 80 (dependendo, 85). Nao muito proximo de 100 porque quando chegar nesse valor, ja e uma situacao anormal e voce ja consegue ter a escala para comportar o trafego antes que chegue em 100%.

## imagePullPolicy e o impacto no scale-up

Se voce usa `imagePullPolicy: Always` no deployment, quando comecar a escalar horizontalmente, ele vai fazer pull da imagem novamente. Isso adiciona tempo ao processo de replicacao. Com `IfNotPresent`, ele nao baixa novamente a imagem, reduzindo o tempo de bootstrap — mas ainda assim tem a condicao da aplicacao de fato subir.

## Comportamento do scale-up e scale-down

O HPA v1 tem um comportamento default:
- **Scale-up:** Quando detecta que a CPU esta acima do target por alguns minutos, cria novas replicas
- **Scale-down:** Quando a CPU volta abaixo do target, ele tambem identifica e comeca a dropar pods (downsizing)

Ambos levam "alguns minutinhos" no default. Na v2, e possivel configurar essas janelas de stabilization (tanto scale-down quanto scale-up).

## Por que maxReplicas deve ser significativamente maior que minReplicas

Se a aplicacao roda bem com 3 replicas e chega em 8, provavelmente aconteceu algo — campanha de marketing, promocao sazonal, aumento de trafego. E importante ter alarmistica em cima dessa quantidade maxima (topico de observabilidade).

## v1 vs v2: limitacoes

A v1 deprecou o campo `targetMemoryUtilizationPercentage`. Se voce tentar usar, o `kubectl apply` vai falhar com erro indicando que o campo nao existe na versao. A v2 traz:
- Escala por memoria
- Escala por CPU e memoria combinados
- Configuracao de janelas de stabilization (scale-up e scale-down)
- Mais opcoes de personalizacao

## Como deletar um HPA

Duas formas:
1. Por nome: `kubectl delete hpa <nome> -n <namespace>`
2. Por arquivo: `kubectl delete -f <arquivo.yaml>`

Ambas funcionam. A segunda e util quando voce tem o manifesto comentado/versionado.