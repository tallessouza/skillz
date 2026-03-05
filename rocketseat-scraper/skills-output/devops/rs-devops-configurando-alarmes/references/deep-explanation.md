# Deep Explanation: Configurando Alarmes no Grafana

## Arquitetura de Alertas Built-in vs Alert Manager

O Grafana possui um sistema de alertas built-in que ja vem integrado. Existe tambem o plugin **Alert Manager**, que e o gerenciador de alertas do Prometheus. A diferenca fundamental: o Alert Manager olha **somente para metricas do Prometheus**, enquanto o built-in do Grafana trabalha com qualquer data source configurado (Loki, Mimir, Prometheus, etc.).

Se voce trabalha com Grafana + Prometheus em producao, vai ouvir falar sobre o Alert Manager. Vale estudar separadamente, mas o built-in do Grafana ja cobre a maioria dos cenarios.

## O Modelo Mental: Contact Point → Policy → Rule

O instrutor enfatiza que a configuracao segue uma ordem logica:

1. **Contact Point = QUEM envia e COMO envia.** Nao e so "pra quem vai", mas sim a configuracao do canal de envio. Ex: o servidor SMTP que vai disparar o email, o bot do Telegram com sua API token, o webhook do Slack.

2. **Notification Policy = ROTEAMENTO.** E aqui que voce decide: "se o alerta tem label X, manda pro canal Y". Permite segregacao por times dentro de uma mesma organizacao. O default pega tudo que nao tem regra especifica.

3. **Alert Rule = A CONDICAO.** Define o que esta sendo monitorado, com qual query, em qual intervalo, e qual condicao dispara o alerta.

## Labels como Mecanismo de Roteamento

O conceito de labels e central. Quando voce cria uma alert rule, voce pode adicionar labels arbitrarias (ex: `squad: time1`). Essas labels sao usadas pelas notification policies para rotear o alerta ao contact point correto.

O instrutor destaca que as labels devem fazer sentido para o contexto da organizacao: pode ser `squad`, `time`, `bu` (business unit), ou qualquer outro eixo organizacional relevante.

## Ciclo de Vida do Alerta

O instrutor demonstrou ao vivo o ciclo:

1. Regra criada com evaluation interval de 1 minuto
2. Primeira avaliacao: condicao detectada → estado **Pending**
3. Segunda avaliacao (1 minuto depois): condicao confirmada → estado **Firing**
4. Quando a condicao e resolvida → volta para **Normal**

O estado Pending existe para evitar falsos positivos — o Grafana confirma a condicao antes de disparar a notificacao.

## Intervalo de Avaliacao: Por que 5 Minutos

O instrutor mostrou que colocar intervalos longos (3h, 6h) e um erro grave — voce so descobre o problema horas depois. O ideal e **5 minutos** para producao. 1 minuto pode ser usado para testes mas gera carga desnecessaria em producao.

O evaluation group define a cadencia. Todas as regras dentro do mesmo grupo compartilham o mesmo intervalo de verificacao.

## Criando Alertas a Partir de Dashboards

O instrutor mostrou um atalho util: voce pode criar um alerta diretamente de um painel do dashboard. Ao clicar no painel e selecionar "Create Alert", o Grafana ja preenche a query automaticamente. Porem, cuidado com o intervalo de tempo que vem preenchido (pode vir com 6h, que e inadequado).

## Problemas Comuns com Logs (Loki)

O instrutor encontrou um erro ao tentar criar alerta baseado em logs do Loki. O problema estava relacionado ao tipo de dado retornado pela query com ranges longos. Isso e uma limitacao especifica do Loki que requer consulta a documentacao. Metricas (Prometheus/Mimir) nao tem esse problema.

## Runbook URL: Boas Praticas

O campo Runbook URL e destacado como uma boa pratica importante. Quando um alerta dispara, a pessoa que recebe precisa saber como resolver. Ter o link direto para a documentacao de resolucao reduz drasticamente o tempo de resposta a incidentes.

## Nota sobre Ambiente Local

Em ambiente local, sem TLS configurado, nao e possivel testar o envio real de notificacoes (email, Slack, Telegram). A configuracao funciona, mas o disparo efetivo requer infraestrutura de rede e credenciais validas.