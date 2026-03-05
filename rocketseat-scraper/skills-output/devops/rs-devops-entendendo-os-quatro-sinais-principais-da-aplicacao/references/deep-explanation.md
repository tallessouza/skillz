# Deep Explanation: Golden Signals

## Origem e contexto

Os Golden Signals vem do livro "Engenharia de Confiabilidade do Google" (Site Reliability Engineering), considerado a Biblia da pessoa SRE. Foi escrito por pessoas que trabalham ou trabalharam no Google e define essas quatro metricas como o "sinal de ouro" para qualquer pessoa SRE.

## Por que o salto importa mais que o valor absoluto

O instrutor enfatiza um ponto sutil: 500ms de latencia pode parecer aceitavel no macro (meio segundo). Mas se o baseline era 100ms, houve um salto de 5x. Esse salto e o verdadeiro alarme, nao o numero absoluto.

Isso importa porque em microservicos o efeito e hierarquico. Se o servico A chamava B que respondia em 100ms, e agora B responde em 500ms, TODOS os servicos que dependem de B herdam esses 400ms extras. A degradacao se propaga pela rede inteira.

## Sync vs Async como estrategia de mitigacao

O instrutor traz um ponto pratico de desenvolvimento: quando trafego aumenta e ha muito fluxo sincrono, o enfileiramento e inevitavel. A recomendacao e mover para assincrono tudo que nao precisa ser resolvido imediatamente.

Isso nao resolve o problema de trafego, mas cria "camadas de buffer" que absorvem melhor os picos. O servico gera um evento, a aplicacao processa de forma assincrona, e nao ha a "trava" de esperar a resposta.

## Circuit Breaker — a valvula de seguranca

O conceito de Circuit Breaker aparece em multiplos contextos na aula. E a principal ferramenta para evitar degradacao em cascata.

**Analogia:** funciona como um disjuntor eletrico. Quando a corrente (latencia/erros) fica muito alta, o circuito "abre" e corta a conexao, protegendo o resto da rede.

Na pratica:
- Servico A chama Servico B normalmente (circuito fechado)
- Servico B comeca a degradar (latencia alta, erros)
- Circuit Breaker detecta e "abre" o circuito
- Servico A para de chamar B, evitando propagar a degradacao
- A rede como um todo se mantem saudavel

O instrutor menciona que o Istio (Service Mesh) suporta Circuit Breaker nativamente, sendo uma forma pratica de implementar esse padrao em Kubernetes.

## Blast Radius — conceito chave

O instrutor usa o termo "raio de explosao" (blast radius) para descrever o impacto de um servico degradado na rede. Quanto maior o blast radius, mais servicos sao afetados.

O Circuit Breaker existe justamente para reduzir o blast radius: isolar o servico problematico antes que ele derrube outros.

## Interdependencia dos sinais

Todos os quatro sinais estao interligados:
1. **Trafego** aumenta → gera enfileiramento
2. **Latencia** sobe → por conta do enfileiramento sincrono
3. **Erros** aparecem → timeouts, servicos que nao respondem
4. **Saturacao** atinge o limite → CPU/memoria insuficiente → aplicacao cai

Por isso, monitorar apenas um sinal isolado e insuficiente. A correlacao entre eles e que revela o diagnostico real.

## Log vs Trace

O instrutor faz uma distincao importante:
- **Log** mostra o erro de forma individualizada, no contexto de um unico servico
- **Trace** mostra com quem o servico teve contato, permitindo rastrear a origem do erro na cadeia de chamadas

Para investigar erros em microservicos, o trace e essencial porque o problema pode ter origem em outro servico da cadeia.