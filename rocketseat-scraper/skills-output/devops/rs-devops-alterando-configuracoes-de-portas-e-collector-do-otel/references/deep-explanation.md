# Deep Explanation: Configuracao do OTEL Collector com Prometheus

## Por que sincronizar portas e tao critico

O instrutor demonstra um ponto sutil: quando voce muda a porta do Mimir de 9090 para 9009 no Docker Compose, isso nao e suficiente. O YAML interno do Mimir ainda escuta na porta antiga. O resultado e um erro silencioso — o container sobe, mas o datasource do Grafana nao consegue conectar. O instrutor sugere inclusive testar o erro de proposito para entender o comportamento: "caso voce queira testar o erro, basta subir o container e ele vai dar problema la no plugin".

Isso revela um principio importante em stacks de observabilidade: **cada servico tem configuracao interna E externa, e ambas devem estar sincronizadas**. A porta no Docker Compose e a porta externa (host mapping). A porta no YAML do servico e a porta interna (onde o processo realmente escuta).

No caso do Mimir, ao mudar para 9009, e necessario declarar tanto grpc_listen_port (9008) quanto http_listen_port (9009) no server block do mimir.yaml.

## O padrao de adicionar um exporter ao OTEL Collector

O instrutor apresenta um passo-a-passo mental claro para adicionar qualquer novo destino ao Collector:

1. **Defina o exporter** na secao `exporters` com endpoint e configuracoes especificas
2. **Registre no service** na pipeline correspondente (metrics, traces, ou logs)

Ele enfatiza: "voce vai ter que olhar primeiro para o seu exporter, para onde ele vai exportar, e depois olhar para o seu servico que vai consumir esse recurso". Esse e um padrao que se repete para qualquer integracao — nao apenas Prometheus.

## Batch processor — por que configurar

O batch processor controla como o Collector agrupa dados antes de enviar aos exporters. Sem limites explicitos:
- `send_batch_max_size: 0` significa sem limite maximo de tamanho de batch
- `batch_size: 10` define o tamanho alvo do batch
- `timeout: 10s` garante que mesmo batches incompletos sejam enviados apos 10 segundos

O instrutor menciona que isso e "uma boa pratica a nivel do processamento dos batchs de arquivos que sao enviados, tanto de log quanto de metrica". Na pratica, sem timeout, dados podem ficar retidos indefinidamente se o volume for baixo.

## resource_to_telemetry_conversion

Esta flag converte resource attributes do OpenTelemetry em labels de metrica do Prometheus. Sem ela, informacoes como service.name e service.version ficam apenas no resource e nao aparecem como labels nas metricas do Prometheus. O instrutor ativa isso para "melhorar o nivel de performance com o nosso ecossistema".

## Validacao pos-deploy

O instrutor segue um checklist mental de validacao:
1. `docker compose down` para limpar estado anterior
2. `docker compose up` com rebuild
3. `docker ps -a` para verificar se algum container crashou
4. `docker logs <container>` procurando "Everything is ready" no Collector
5. Verificar cada datasource no Grafana (Loki, Tempo, Mimir, Prometheus)

Ele nota que o Grafana perde estado de login quando o volume nao e persistido — "ele nao tem um log porque a gente nao ta gerenciando o volume dele".

## Prometheus ja traz metricas proprias

Um insight interessante: ao adicionar Prometheus ao stack, ele ja expoe metricas dele mesmo (self-monitoring). No Grafana, voce pode consultar metricas HTTP do proprio Prometheus sem configurar nada adicional. O instrutor mostra isso e comenta: "e muito interessante isso, ja ta funcionando". Alem disso, Prometheus tem sua propria UI em localhost:9090, embora centralizar consultas no Grafana seja a pratica recomendada.