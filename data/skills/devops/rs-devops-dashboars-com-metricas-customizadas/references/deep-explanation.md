# Deep Explanation: Dashboards com Metricas Customizadas

## Por que metricas de erro sao mais importantes que metricas de sucesso

O instrutor enfatiza um ponto crucial: dashboards de acompanhamento de sucesso sao interessantes mas nao acionaveis. Quando voce olha para um grafico de `hello_success_total` sempre subindo, nao ha acao a tomar. Porem, quando voce olha para `hello_error_total` e ve uma crescente, voce imediatamente sabe que precisa investigar.

A logica e: **o dashboard existe para voce bater o olho e saber se precisa agir**. Se o numero esta normal, siga em frente. Se esta crescendo em erros, tome acao.

## Metricas globais e o papel do service_name

Um ponto importante ressaltado na aula: metricas podem ser globais. Se a App 1 e a App 2 emitirem `hello_success_total`, ambas aparecerao no Prometheus. O que diferencia e o label `service_name`.

Isso significa que sem o filtro de `service_name`, voce estaria vendo dados agregados de todas as aplicacoes — o que pode mascarar problemas em uma app especifica ou gerar falsos alarmes.

## Thresholds como mecanismo de acionabilidade visual

O instrutor demonstra a configuracao de thresholds no Grafana:
- Linha base: **verde** (tudo normal)
- Acima do limite (ex: 30): **vermelho** (atencao necessaria)

Isso transforma o dashboard de um grafico passivo em um indicador ativo. Voce bate o olho, ve vermelho, sabe que precisa agir.

## Dashboard saves funcionam como commits

O Grafana salva alteracoes em JSON e permite adicionar comentarios a cada save. O instrutor faz a analogia direta com commits do Git — cada alteracao e versionada e rastreavel. Isso e importante para auditar quem mudou o que no dashboard.

## Segmentacao por environment

Mesma logica de metricas se aplica a environments: voce pode ter metricas de staging e producao. O dashboard deve permitir filtrar por environment para nao misturar dados de ambientes diferentes.

## Tipos de visualizacao

- **Time Series**: adequado para counters (linhas continuas ao longo do tempo)
- **Histogram**: adequado para metricas de duracao com buckets (grafico de barras que segmenta por faixa de valor)

O instrutor menciona que voce *pode* usar Time Series para histogramas, mas Histogram e mais apropriado porque segmenta visualmente pelos buckets.

## Relacao com alertas

O instrutor menciona que a opcao de alerta aparece dentro de cada painel. Isso sera aprofundado nas proximas aulas, mas o conceito ja esta presente: thresholds visuais sao o primeiro passo, alertas automatizados sao a evolucao natural.