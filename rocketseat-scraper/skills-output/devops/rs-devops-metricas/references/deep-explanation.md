# Deep Explanation: Métricas — Segundo Pilar da Observabilidade

## Métricas vs Logs: Macro vs Micro

O instrutor faz uma distinção fundamental: **logs operam no micro** (detalhes de cada evento), enquanto **métricas operam no macro** (comportamento geral do sistema). Métricas não substituem logs — elas são complementares. A métrica te mostra o **sintoma** (algo está errado), e o log te permite **debugar** (o que exatamente está errado).

Analogia implícita: métrica é como o termômetro (diz que tem febre), log é como o exame de sangue (diz o que está causando a febre).

## Custo de armazenamento

Um ponto que o instrutor enfatiza bastante: métricas consomem **muito menos espaço** que logs. Enquanto logs podem exigir políticas de retenção, rotação e deleção por questões de custo, métricas raramente têm esse problema. Isso significa que você pode manter um histórico longo de métricas sem preocupação, permitindo análise de tendências e comportamento em ranges de tempo extensos.

## Contadores: a regra do incremento

O instrutor é enfático: **contadores nunca decrementam**. O exemplo dado é cadastro de usuário:
- Sucesso → incrementa `user_registration_success` em 1
- Erro → incrementa `user_registration_error` em 1 (NÃO decrementa o de sucesso)

Cada tipo de evento tem seu próprio contador independente. Isso é fundamental para manter a semântica correta — um counter representa um total acumulado monotonicamente crescente.

## Gauge vs Counter

O medidor (gauge) é o tipo que **permite incrementar e decrementar**, diferente do counter. O instrutor menciona que não é muito comum, mas existe para cenários onde faz sentido ter um valor que flutua (como conexões ativas). O exemplo dado: uma métrica única de cadastro de usuário onde sucesso incrementa e erro decrementa — mas o instrutor deixa claro que o padrão mais comum é usar counters separados.

## Histograma para latência

O histograma é apresentado como ideal para medir tempo de requisição. O padrão descrito:
1. Captura `datetime` no início da requisição
2. Captura `datetime` no fim
3. Faz o diff
4. Envia como métrica

Isso permite montar dashboards de distribuição de latência ao longo do tempo.

## Percentis (P99, P95, P90)

O instrutor conceitua P99: "qual é o meu tempo de resposta para 99% do meu tráfego?". Se P99 = 50ms, significa que 99% das requisições são respondidas em até 50ms — excelente. Se P99 = 2s, o sistema está muito lento.

Percentis são superiores a médias porque revelam a experiência real. Uma média de 100ms pode esconder que 1% dos usuários esperam 10 segundos.

## Detecção de anomalias

Exemplo do instrutor: aplicação que sempre teve 100 RPS e começa a ter 500 — anomalia (possível ataque ou viral). Ou de 100 para 10 — anomalia (possível falha upstream ou problema de rede). Métricas permitem essa visão macro para depois investigar no micro.

## SLI, SLO e SLA

O instrutor conecta métricas ao universo de contratos de serviço:
- **SLI** (Service Level Indicator): a métrica em si (ex: latência P99)
- **SLO** (Service Level Objective): o objetivo (ex: P99 < 200ms)
- **SLA** (Service Level Agreement): o contrato com o cliente

Métricas são a base para definir e monitorar todos esses níveis.

## Golden Signals

Referência direta à aula de monitoramento — os 4 Golden Signals do Google SRE:
1. **Latência** — tempo de resposta
2. **Tráfego** — volume de requisições
3. **Erros** — taxa de falhas
4. **Saturação** — quão cheio o sistema está

Todos são implementados via métricas.

## Métricas negociais

O instrutor destaca que métricas não são apenas técnicas. Você pode e deve criar métricas transacionais e de produto para acompanhar o crescimento do ecossistema. KPIs de negócio também entram no universo de métricas de observabilidade.