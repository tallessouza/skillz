# Deep Explanation: Entendendo o PromQL

## Ecossistema de Query Languages na Observabilidade

O instrutor contextualiza o PromQL dentro do ecossistema completo de observabilidade, mostrando que cada pilar tem sua propria linguagem de consulta:

- **LogQL** — linguagem de consulta do Loki (logs)
- **TraceQL** — linguagem de consulta do Tempo (traces)
- **PromQL** — linguagem de consulta do Prometheus (metricas)

No Grafana, cada uma dessas linguagens tem dois modos de uso:
1. **Builder** — interface visual, low-code, tipo building blocks, que abstrai a complexidade
2. **Code** — a query raw na linguagem nativa

O builder sempre gera a query equivalente por debaixo dos panos. E util para explorar, mas entender a linguagem diretamente da mais controle.

## Por que Labels sao Fundamentais

O instrutor enfatiza um cenario real: se voce tem 10 aplicacoes, provavelmente mais de uma tera metricas HTTP. Sem labels, voce nao consegue distinguir de qual aplicacao vem cada metrica.

A configuracao de `honor_labels: true` no scrape config do Prometheus evita conflito entre labels enviadas pela aplicacao e labels adicionadas pelo proprio Prometheus.

### Labels uteis citadas pelo instrutor:
- `service_name` — identifica a aplicacao
- `environment` — staging, homolog, production
- `version` — versao da aplicacao
- `container_id` — ID do container
- `container_tag` — tag da imagem Docker

## Filosofia: Metrica como Sintoma

O instrutor usa um exemplo numerico concreto para ilustrar:

> "Eu geralmente tenho mil transacoes por hora de sucesso e 1% de erro (10 transacoes). Na ultima hora, comecei a ter 505 com sucesso e 505 com erro. Estou 50-50, tem algo errado."

A metrica mostra o SINTOMA (taxa de erro subiu de 1% para 50%). Mas para entender a CAUSA, voce precisa:
1. **Logs** — para ver mensagens de erro detalhadas
2. **Traces** — para rastrear o caminho da requisicao e identificar onde falhou

Essa e a base dos tres pilares da observabilidade trabalhando juntos.

## Counter: Por que Nunca Decrementar

O instrutor explica com clareza: se voce tem uma metrica de sucesso e ocorre um erro, a tentacao e decrementar. Mas isso corrompe a serie temporal.

A solucao correta: **duas metricas separadas**.
- `transaction_success_total` — incrementa no try
- `transaction_error_total` — incrementa no catch

Nunca decrementa nenhuma. Isso permite montar dashboards de acompanhamento onde cada metrica cresce monotonicamente e voce pode calcular rates sobre elas.

## Histogram: Caso de Uso Pratico

O instrutor da um exemplo concreto:
- Requisicao comecou as 11h15
- Requisicao terminou as 11h17
- Duracao: 2 minutos (impensavel em producao, mas ilustrativo)

O histograma captura essa distribuicao temporal, permitindo:
- Monitorar tempo de resposta apos deploys
- Detectar picos de latencia
- Entender distribuicao (p50, p95, p99) das duracoes

## Metricas Auto-instrumentadas vs Customizadas

O instrutor faz questao de separar:
- **Auto-instrumentadas** — geradas automaticamente pelo SDK/agent (ex: metricas HTTP padrao)
- **Customizadas** — criadas pelo desenvolvedor na aplicacao (ex: contagem de transacoes do e-commerce)

Ambas coexistem. Criar metricas customizadas NAO impacta as auto-instrumentadas. "Uma coisa e uma coisa, outra coisa e outra coisa."