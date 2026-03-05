# Deep Explanation: HPA v2

## Por que v2 e nao v1?

A v1 do HPA (`autoscaling/v1`) so permite escalar baseado em CPU. Na pratica, muitas aplicacoes tem gargalo em memoria (apps Node.js com cache, Java com heap, etc). A v2 introduz o conceito de `metrics` como array, permitindo combinar multiplas metricas.

## Como o HPA calcula a porcentagem

O `averageUtilization` e calculado com base no valor definido em `resources.requests` do container, **nao** no `limits`. Isso e crucial:

- Se requests = 64Mi e o pod usa 48Mi → 75% de utilizacao
- Se requests = 128Mi e o pod usa 48Mi → 37.5% de utilizacao

Portanto, se o HPA esta escalando demais, a primeira coisa a verificar e se o `requests` do Deployment esta dimensionado corretamente.

## Picos de memoria durante deploy

O instrutor destacou um insight importante: durante o deploy (quando pods estao subindo), o consumo de memoria e temporariamente mais alto. Isso pode causar um efeito cascata:

1. Deploy sobe novos pods
2. Memoria sobe temporariamente
3. HPA ve utilizacao alta e escala mais pods
4. Mais pods subindo = mais memoria consumida
5. HPA escala ainda mais

Por isso, ao usar metrica de memoria, e importante:
- Nao colocar `averageUtilization` muito baixo (ex: 50%)
- Considerar usar janelas de estabilizacao (Scale Up/Down windows) — tema da proxima aula

## Comportamento de downscale

O HPA nao reduz pods imediatamente quando a carga cai. Existe um periodo de estabilizacao (cooldown) para evitar "flapping" (escalar e desescalar rapidamente). Na aula, o instrutor mostrou que mesmo com utilizacao bem abaixo do target, os pods permaneciam em 8 replicas por um tempo.

## Eventos do HPA

O HPA registra eventos que podem ser consultados via `kubectl describe hpa` ou pelo Lens. Os eventos mostram:
- `New size: X` — quantos pods o HPA decidiu criar
- `Reason: memory resource utilization` — qual metrica disparou a escala

Isso e essencial para debugging: se o HPA esta escalando e voce nao sabe por que, olhe os eventos.

## Metricas combinadas — como funciona a decisao

Quando ha multiplas metricas (CPU + memoria), o HPA calcula o numero desejado de replicas para CADA metrica e usa o **maior** valor. Exemplo:
- CPU sugere 4 replicas
- Memoria sugere 6 replicas
- HPA escala para 6

## Quando usar so CPU vs CPU + memoria

O instrutor mencionou: "Via de regra, dependendo do CPU, ja pode atender muito bem." A metrica de memoria adiciona complexidade (picos de deploy, etc). Use memoria quando:
- A aplicacao tem consumo de memoria crescente (leaks, cache, conexoes)
- Voce ja dimensionou bem o requests de memoria
- Voce esta preparado para lidar com picos de deploy