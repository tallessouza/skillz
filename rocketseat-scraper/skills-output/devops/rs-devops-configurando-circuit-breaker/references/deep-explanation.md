# Deep Explanation: Circuit Breaker com Istio

## O que e Circuit Breaker

Circuit Breaker e um design pattern que protege sistemas contra falhas em chamadas sincronas entre aplicacoes. O problema central: se a Aplicacao B fica lenta, isso impacta a Aplicacao A, que impacta quem chama A — um efeito cascata.

O Circuit Breaker "abre o circuito" quando detecta problemas, fazendo a aplicacao parar de chamar o servico com falha. O problema deixa de ser geral e fica isolado no servico problematico.

## Tres estados do circuito

1. **Closed (fechado)** — tudo funcionando normalmente, requisicoes passam
2. **Open (aberto)** — problemas detectados, trafego bloqueado (total ou parcialmente conforme `maxEjectionPercent`)
3. **Half-open (meio aberto)** — apos o `baseEjectionTime`, algumas requisicoes comecam a passar para testar se o servico voltou. Se voltou, fecha o circuito. Se nao, abre novamente.

## Por que no DestinationRule e nao no VirtualService

O instrutor explica que o DestinationRule e quem "conhece o destino". E ele quem controla se o destino esta ou nao pronto para receber requisicoes. Faz sentido semantico: a regra de destino decide sobre a saude do destino.

## Por que NÃO usar consecutive5xxErrors

O instrutor faz uma distincao importante:
- **Erros de gateway (502, 503, 504):** indicam indisponibilidade real do servico. Causam lentidao na rede inteira.
- **Erro 500 (Internal Server Error):** e um erro da aplicacao. Nao necessariamente causa indisponibilidade ou lentidao na rede.

A recomendacao: tratar erro 500 na camada da aplicacao. Usar Circuit Breaker para erros de gateway. Se erro 500 estiver causando lentidao na rede, ai talvez faca sentido incluir — ou talvez faca sentido revisar a estrutura da aplicacao.

## Circuit Breaker na aplicacao vs no Istio

Existem libraries em todas as linguagens (Node, C#, Java) para implementar Circuit Breaker na propria aplicacao. Porem, se voce ja usa Istio para outros aspectos (observabilidade, traffic management, mTLS), faz sentido aproveitar o Istio para Circuit Breaker tambem — sem mexer no codigo da aplicacao.

A vantagem: regra de rede, nao de aplicacao. Mudanca de configuracao, nao de codigo.

## Circuit Breaker manual vs automatizado

Uma abordagem alternativa (e inferior) e usar variaveis de ambiente como feature flags: quando detectar problema, ir manualmente desligar a comunicacao. O instrutor critica essa abordagem porque exige monitoramento constante e acao manual. O outlier detection do Istio e 100% automatizado.

## Parametros explicados

- **consecutiveGatewayErrors:** quantos erros consecutivos de gateway (502/503/504) antes de tomar acao
- **interval:** janela de tempo para contar os erros consecutivos
- **baseEjectionTime:** tempo que o servico fica ejetado (sem receber trafego) antes de entrar em half-open
- **maxEjectionPercent:** porcentagem do trafego que sera cortada. 100 = isolamento total. 50 = metade passa, metade nao.

## Observacao sobre ferramentas de teste

O instrutor destaca que Fortio (ferramenta de teste de carga) crashava ao receber 504, mascarando o comportamento real do Circuit Breaker. Ele sugere que outras ferramentas como k6 podem se comportar melhor. O teste ideal e com duas aplicacoes reais no cluster, uma chamando a outra.

## Fallback

Quando o circuito abre, e possivel redirecionar o trafego para outro destino (fallback). O instrutor menciona isso como possibilidade mas nao implementa nesta aula.

## Antes de usar Circuit Breaker: avalie a chamada

O instrutor levanta um ponto arquitetural: antes de configurar Circuit Breaker, questione se a chamada precisa mesmo ser sincrona. Se puder ser assincrona (via mensageria, por exemplo), o problema de cascata nao existe.