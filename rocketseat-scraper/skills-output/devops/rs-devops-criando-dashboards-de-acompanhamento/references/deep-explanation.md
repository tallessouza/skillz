# Deep Explanation: Criando Dashboards de Acompanhamento no Grafana

## Por que dashboards e nao Explore?

O instrutor destaca um ponto fundamental: sem dashboards, toda vez que voce quer ver algo no Grafana, precisa ir no Explore, selecionar o data source (Loki, Prometheus), e montar a query do zero. Nao existe nada "pre-pronto". O dashboard resolve isso — queries pre-montadas que voce abre e ja bate o olho.

A analogia implicita: Explore e como abrir o terminal e digitar SQL toda vez. Dashboard e como ter uma aplicacao com telas prontas.

## Folders: organizacao por aplicacao ou time

O instrutor cria uma folder "Rocketseat" que funciona como uma "org" dentro do Grafana. Dentro dela, multiplos dashboards podem coexistir. A recomendacao e segregar por:
- Aplicacao
- Esporte/dominio
- Time responsavel

Uma folder pode conter: dashboards, paineis, e regras de alerta (vistas em aulas futuras).

## Tipo de visualizacao vs Data Source

Erro classico demonstrado na aula: ao criar um painel com Loki, o Grafana vem com Time Series selecionado por padrao. Logs nao sao time series — sao listas de eventos. O resultado e um painel vazio ou bugado.

A correcao: mudar para **Table view** para logs do Loki. O instrutor mostra que existem muitas opcoes de visualizacao (Gauge, Bar Chart, Heatmap, Histogram), e a escolha depende de:
1. Qual data source voce esta usando
2. Como voce estruturou seus dados

Histograma, por exemplo, faz sentido quando voce emite eventos de histograma na aplicacao (visto em aula anterior).

## Variaveis: o conceito mais poderoso

O instrutor enfatiza: "isso aqui e muito legal". Variaveis permitem que um unico dashboard sirva para multiplos contextos. O exemplo dado:

- Voce tem staging, producao, homologacao
- A aplicacao tem o mesmo nome em todos os environments
- Sem variaveis: voce cria 3 dashboards identicos
- Com variaveis: voce cria 1 dashboard e alterna o environment via dropdown

Tipos de variavel:
- **Custom**: valores fixos definidos manualmente (staging, producao)
- **Query**: valores buscados dinamicamente de um data source

Na query do painel, voce referencia a variavel com `$nome_da_variavel`. Quando o usuario muda o dropdown, todas as queries do dashboard atualizam automaticamente.

## Versionamento built-in

Cada alteracao no dashboard gera um JSON versionado. O Grafana guarda o historico completo com:
- Numero da versao
- Quem fez a alteracao (quando autenticado)
- Possibilidade de rollback

O instrutor nota: "dashboards sao como codigo" — o versionamento garante rastreabilidade e seguranca. Quando nao ha login configurado, aparece "anonimo", mas em ambientes corporativos com autenticacao, o nome do usuario aparece.

## Rows: agrupamento visual

Rows sao divisores dentro de um dashboard que permitem agrupar paineis por tema. Por exemplo:
- Row "Logs" → paineis de log de cada app
- Row "Metricas" → paineis de metricas

Tudo dentro de uma Row pode ser colapsado/expandido, melhorando a navegabilidade.

## Links e Runbooks

Cada painel pode ter links associados. O instrutor menciona o conceito de **runbook** — documentacao de procedimentos para resolver problemas. Se alguem esta olhando um painel que mostra erros, links diretos para o runbook relevante economizam tempo critico durante incidentes.

## Import/Export via JSON

Dashboards sao representados como JSON internamente. Isso permite:
- Exportar de um Grafana (ex: Grafana Cloud) e importar em outro (ex: self-hosted)
- Versionar dashboards em Git como IaC
- Compartilhar dashboards entre times

O import aceita tanto JSON colado diretamente quanto arquivo .json/.txt.