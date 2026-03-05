# Deep Explanation: Stack LGTM

## Por que montar do zero e nao usar Grafana Cloud

O instrutor enfatiza que o Grafana Cloud elimina a complexidade de configuracao — voce ganha um endpoint (ex: `seu-nome.grafana.net`) e tudo ja vem pre-configurado: Prometheus, Loki, Tempo, Graphite. Porem, para um modulo de DevOps, o objetivo e entender a infraestrutura no baixo nivel.

A experiencia final (dashboards, queries, alertas) e a mesma entre local e Cloud. O que muda e o caminho ate la — e esse caminho e onde esta o aprendizado.

## Grafana Labs vs Grafana (produto)

Grafana Labs e a empresa/projeto guarda-chuva. Dentro dela existem varios produtos:
- Grafana (visualizador)
- Loki (logs)
- Tempo (traces)
- Mimir (metricas)
- K6 (testes de performance)
- Pyroscope (profiling)

O instrutor menciona que voce pode usar o Grafana para se conectar com produtos que nem fazem parte da Grafana Labs — ele e um visualizador generico.

## A imagem Hotel LGTM (`grafana/otel-lgtm`)

No Docker Hub, a Grafana disponibiliza a imagem `grafana/otel-lgtm` que ja empacota:
- OpenTelemetry Collector
- Loki
- Tempo
- Mimir
- Grafana
- Prometheus

O Dockerfile mostra todas as camadas pre-configuradas. E util para um quickstart, mas esconde a complexidade que o modulo quer ensinar.

O instrutor recomenda como exercicio complementar — rode para ver funcionando, mas depois monte do zero para entender cada peca.

## Compatibilidade do Tempo

O Tempo e compativel com:
- **OpenTelemetry** (escolha do curso)
- **Jaeger**
- **Zipkin**

O objetivo do Tempo e correlacionar traces para facilitar troubleshooting com baixo esforco de investigacao, especialmente em arquiteturas de microservicos.

## Mimir e Prometheus

Mimir e um time series database que trabalha junto com o Prometheus. O plano do curso e:
1. Primeiro configurar somente o Mimir
2. Depois adicionar o Prometheus na stack

Isso permite entender o papel de cada um separadamente.

## Abordagem do curso

O instrutor deixa claro que o modulo sera longo porque o conteudo e avancado. A configuracao local nao e trivial — "nao e tao simples assim fazer essa configuracao". A complexidade e proposital para garantir aprendizado profundo.

## Grafana Cloud como referencia

Mesmo nao usando Cloud, o instrutor recomenda criar uma conta free trial (14 dias) para comparar. Ao criar uma stack no Cloud, voce ganha:
- Endpoint centralizado para metricas
- Painel pre-configurado
- Integracoes prontas com Prometheus, Loki, Tempo, K6

Isso serve como referencia visual do "destino" que vamos construir manualmente.