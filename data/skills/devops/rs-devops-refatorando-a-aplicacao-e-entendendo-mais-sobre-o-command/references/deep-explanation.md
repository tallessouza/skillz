# Deep Explanation: Refatorando a Aplicacao e Entendendo o Command

## Contexto do problema

O instrutor mostra uma aplicacao em estado caotico — multiplos restarts, varias replicas tentando segurar mas sem sucesso. Isso ilustra o cenario real: probes mal configuradas ou aplicacao com bugs levam a CrashLoopBackOff, e escalar replicas nao resolve o problema fundamental.

A licao central: **escalar uma aplicacao quebrada nao conserta nada**. O caminho correto e corrigir o problema na raiz (remover timeouts artificiais, corrigir o health service) e so entao fazer o redeploy.

## Margem no initialDelaySeconds

O instrutor enfatiza: se voce sabe que a aplicacao demora X segundos, coloque um valor **um pouco acima**. A razao e que:

- Valores incertos (boot time variavel) devem ter margem generosa
- Valores certos (timeout fixo de 30s) podem ter margem menor
- Pecar pra mais e melhor que pecar pra menos — um delay maior so atrasa o primeiro check, enquanto um delay menor causa restarts falsos

Analogia pratica: se o onibus chega as 8h mas as vezes atrasa 5 min, voce chega as 7:50, nao as 8:01.

## MaxSurge e probes

Ponto critico que o instrutor ressalta: durante rolling updates, o MaxSurge (quantos pods extras podem existir durante o deploy) so tem efeito **depois** que as probes validam os novos pods. Isso significa:

- Se as tres probes estao configuradas, todas precisam passar
- Se uma probe falha, o rollout fica travado ate resolver
- O Kubernetes nao continua a cadencia de substituicao ate ter sucesso

## Flexibilidade: nao precisa das tres probes

O instrutor deixa claro que usar startup + readiness + liveness e boa pratica, mas **nao e obrigatorio**. Voce pode:

- Usar apenas startupProbe para casos simples
- Usar apenas livenessProbe se so quer restart automatico
- Usar apenas readinessProbe se so quer controlar trafego
- Qualquer combinacao que faca sentido para o contexto

## Command exec: alternativa ao httpGet

O instrutor apresenta o `exec.command` como alternativa ao `httpGet` nas probes. O caso de uso:

- Aplicacoes com verificacoes especificas que um endpoint HTTP nao cobre
- Scripts shell que checam dependencias, arquivos, estados internos
- Formato: `/bin/sh -c /caminho/do/script.sh`

Restricao importante: o Kubernetes **nao aceita** dois tipos de handler na mesma probe (httpGet + exec). Cada probe aceita exatamente um.

O script deve existir na imagem do container. Se nao existir, o pod falha com erro "not found" e entra em CrashLoopBackOff — exatamente o que o instrutor demonstra ao aplicar um manifesto referenciando `check.sh` que nao existe.

## Quando usar exec vs httpGet

- **httpGet**: maioria dos casos, aplicacao expoe endpoint de saude
- **exec**: verificacoes de sanidade que vao alem do HTTP (checar arquivo, processo, conexao com DB via script)
- E possivel usar exec para startup (verificacao pesada) e httpGet para readiness/liveness (verificacao leve)