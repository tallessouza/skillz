# Deep Explanation: Navegacao Bidirecional Logs-Traces

## Por que essa configuracao importa

O fluxo natural de investigacao de problemas em observabilidade e: **alerta → log → trace**. Sem a configuracao de campos derivados, o processo e manual: voce ve um log com traceId, copia o ID, vai ate o Tempo, cola e busca. Isso e lento e propenso a erro.

Com a configuracao bidirecional, um unico clique leva do log ao trace (e vice-versa), reduzindo drasticamente o tempo de investigacao.

## Campos Derivados (Derived Fields) no Loki

O conceito de campo derivado no Loki permite criar links dinamicos baseados em valores de labels ou padroes regex nos logs. O instrutor escolheu `matcherType: label` em vez de regex porque o `traceId` ja esta indexado como label — nao ha necessidade de expressao regular.

O `url: "${__value.raw}"` pega o valor bruto do campo e usa como identificador para redirecionar ao Tempo. O `urlDisplayLabel` define o texto clicavel — sem ele, o Grafana mostra "tempo" como nome generico.

## tracesToLogsV2 no Tempo

A configuracao `tracesToLogsV2` e a versao mais recente (v2) da integracao Tempo→Loki. Pontos importantes:

- **Time range shift**: O instrutor usa `-1h` para tras e `+1h` para frente. Isso cria uma janela de 2 horas centrada no span, garantindo que logs relacionados sejam encontrados mesmo com pequenas diferencas de timing.

- **Tags como mapeamento**: A tag `service.name` (atributo OpenTelemetry) e mapeada para `service_name` (label indexado no Loki). Essa traducao e necessaria porque o OTel usa pontos e o Loki usa underscores na indexacao.

- **Custom query**: A query `{${__tags}} | trace_id="${__span.traceId}"` combina o filtro por service name (via tags) com o filtro por trace ID especifico. O `${__tags}` e expandido automaticamente com base nas tags definidas.

- **filterByTraceID e filterBySpanID como false**: O instrutor desabilitou ambos para evitar filtros automaticos que poderiam "baguncar" a query customizada. A filtragem e feita explicitamente na custom query.

## Problema de Cache

O instrutor encontrou um problema real: apos reconfigurar e reiniciar os containers, a navegacao Tempo→Loki nao funcionou imediatamente. Ele identificou como cache local do Grafana — um problema conhecido quando se sobe/desce containers repetidamente. A solucao e limpar volumes Docker completamente e, se necessario, aguardar algumas execucoes.

## Ferramentas de mercado vs. internalizado

O instrutor menciona brevemente que essa configuracao manual e o que voce faz ao internalizar a stack (Grafana + Loki + Tempo). Ferramentas de mercado como Datadog, New Relic, etc., oferecem essa correlacao log-trace nativamente, sem configuracao manual. A tradeoff e custo vs. controle.