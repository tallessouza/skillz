# Deep Explanation: Configurando o Loki

## Por que depends_on nao garante saude

O instrutor enfatiza que `depends_on` no Docker Compose apenas garante **ordem de subida** (serial), nao que o container esteja saudavel. O Loki pode iniciar mas ainda nao estar pronto para receber conexoes. Para garantir saude real, seria necessario usar `healthcheck` com scripts como `wait-for-it`, mas isso nao foi configurado nesta aula — o objetivo era apenas garantir que o Loki suba antes do Grafana.

## O problema do type em maiusculo

Esse foi um erro real encontrado durante a aula. Quando o `type` foi declarado como `Loki` (com L maiusculo), o Grafana:
- Nao reconheceu o plugin
- Mostrou o data source sem logo (icone generico)
- Mostrou `type: undefined`
- O data source **nao apareceu** no Explorer
- Exibiu mensagem de que o plugin nao existia

A correcao e simples: `type: loki` em lowercase. O `name` pode ser maiusculo (`Loki`) sem problema — e apenas cosmetico. O `type` e o identificador tecnico do plugin.

## Por que declarativo e nao pela UI

O instrutor explica que configurar data sources pela interface do Grafana cria **dissonancia de ambiente**: o arquivo declarativo diz uma coisa, mas a configuracao real e outra. Isso e especialmente problematico em:
- Ambientes com multiplas instancias
- Deploys automatizados
- Reproducao de ambientes (dev/staging/prod)

Com `editable: false`, qualquer alteracao **precisa** passar pelo arquivo YAML, garantindo que o declarativo e a fonte de verdade.

## Rede Docker e resolucao de nomes

Dentro do Docker Compose, servicos na mesma rede (default) se enxergam pelo nome do servico. Por isso:
- `http://loki:3100` funciona dentro do Grafana
- `http://localhost:3100` **nao funciona** porque `localhost` dentro do container Grafana se refere ao proprio Grafana, nao ao host

## Portas adicionais do Loki

- **3100**: Porta principal (API HTTP, ingestao de logs, queries)
- **7946**: Memberlist — comunicacao entre nos em modo cluster
- **9095**: gRPC — usado para exporters e comunicacao interna

Para uso standalone, apenas a 3100 e necessaria. As outras foram declaradas para uso futuro com exporters.

## Data source default

O instrutor notou que o Loki apareceu como default mesmo com `isDefault: false`. Isso acontece porque o Grafana precisa de pelo menos um data source default. Quando ha apenas um configurado, ele automaticamente vira default. Ao adicionar Prometheus/Tempo depois, o comportamento se normaliza.