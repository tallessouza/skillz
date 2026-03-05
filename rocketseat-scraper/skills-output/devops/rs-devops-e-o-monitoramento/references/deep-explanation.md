# Deep Explanation: Monitoramento vs Observabilidade

## A relacao entre monitoramento e observabilidade

O instrutor explica que monitoramento e observabilidade nao sao a mesma coisa, mas sao complementares. A analogia e: monitoramento e a "foto" do sistema — ele te da uma visao do estado atual (ou de qualquer range de tempo que voce escolher). Observabilidade e o "zoom" nessa foto — quando o monitoramento aponta um problema, a observabilidade permite investigar a causa raiz.

## Golden Signals — os 4 indicadores universais

O conceito de Golden Signals (sinais de ouro) vem do Google SRE book. Sao 4 metricas que, juntas, dao uma visao macro completa da saude de qualquer aplicacao:

1. **Taxa de erros** — percentual de requisicoes com falha (ex: 40% de erros 500)
2. **Latencia** — tempo de resposta das requisicoes
3. **Saturacao** — consumo de recursos (CPU, memoria, out of memory)
4. **Satisfacao do usuario (Apdex)** — indicador derivado da latencia que mede experiencia

O ponto critico que o instrutor reforça: "40% de erros 500, por si so, nao quer dizer muita coisa". O numero e apenas um indicador macro. Ele te diz QUE algo esta errado, nao O QUE esta errado. Para chegar na causa, voce precisa da observabilidade (traces, logs estruturados, spans).

## O ciclo: alerta → painel → observabilidade

O fluxo mental que o instrutor descreve:

1. Algo acontece no sistema
2. Monitoramento detecta (taxa de erros sobe para 40%)
3. Alerta dispara (Slack, SMS)
4. Engenheiro abre o painel (visao macro — confirma o problema)
5. Engenheiro mergulha na observabilidade (traces, logs — encontra a causa)
6. Problema resolvido

Sem monitoramento: voce so descobre o problema quando o cliente liga.
Sem observabilidade: voce sabe que tem problema, mas nao consegue debugar.

## Metricas auto-instrumentadas vs customizadas

O instrutor faz uma distincao importante:

- **Auto-instrumentadas**: CPU, memoria, disco, metricas HTTP basicas. Ja vem "de graca" com ferramentas como Prometheus node_exporter, OpenTelemetry auto-instrumentation.
- **Customizadas**: metricas de negocio que voce cria no codigo. Exemplo: contador de cadastros com sucesso vs erro.

A chave e que auto-instrumentacao cobre infraestrutura, mas nao cobre logica de negocio. Se voce quer saber "quantos cadastros falharam na ultima hora", precisa instrumentar no codigo (try/catch com incremento de contador).

## Monitoramento como ferramenta de crescimento

Um ponto que o instrutor destaca e o uso de monitoramento para acompanhar o crescimento do ecossistema ao longo do tempo:

- Mes passado: 500 RPS, 5 replicas
- Este mes: 1000 RPS, 10 replicas
- Capacidade duplicou

Isso permite planejamento de capacidade e visibilidade de evolucao da aplicacao.

## Transacional vs Analitico — a distincao critica

### Monitoramento Transacional
- **Real-time**: o que acontece agora aparece agora no painel
- **Foco**: resolver problemas rapido
- **Obrigatorio** para operacao

### Monitoramento Analitico
- **Delay**: geralmente D-1 (dado de ontem) ou H-1 (dado de 1h atras)
- **Foco**: visao para produto, negocio, auditoria
- **Complementar**, nao substitui transacional
- Pode usar ETL/ELT para Data Lake (Databricks, Athena)
- Real-time analitico e possivel via streaming, mas custo e alto e nao e comum

### A complementaridade

O instrutor enfatiza: "uma coisa nao elimina a outra". Voce pode:
- Pegar dados transacionais e jogar no analitico (para negocio ter visao)
- Pegar metricas de negocio e jogar no transacional (para produto ter metricas rapidas)

Mas o foco para operacao e sempre transacional — resolver o problema o quanto antes.

## Eventos de auditoria

Dentro do campo analitico, o instrutor menciona eventos de auditoria como caso de uso. Auditoria geralmente nao precisa ser real-time, entao encaixa bem no modelo analitico com ETL periodico.