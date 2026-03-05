# Deep Explanation: Kubernetes Readiness Probe

## Diferenca fundamental entre os tres probes

O instrutor enfatiza que existem tres probes com papeis distintos:

- **Startup Probe**: roda apenas uma vez, na subida da aplicacao. Quando o servico sobe, o startup probe termina seu trabalho. Ele nao roda de tempos em tempos.
- **Readiness Probe**: roda continuamente, de tempos em tempos (ex: a cada 15 segundos). Valida se a aplicacao esta pronta para receber trafego.
- **Liveness Probe**: tambem roda continuamente. Valida se a aplicacao ainda esta viva (coberto em aula separada).

Frase-chave do instrutor: "O Startup Probe ele não roda de tempos em tempos. O Startup Probe é simplesmente na camada de subida. Subiu, o serviço dele terminou. O Readiness e o Liveness, eles ficam rodando de tempos em tempos."

## Por que rotas separadas

O readiness probe usa `/readyz` enquanto startup/liveness usam `/healthz`. Isso permite que:
- Readiness falhe (tirando o pod do balanceamento) sem que o liveness mate o pod
- Cada endpoint valide exatamente o que precisa

## Simulacao de cenarios reais

O instrutor simula dois cenarios criticos:

### 1. Alto tempo de bootstrap
Usando `setTimeout` de 30 segundos envolvendo o `bootstrap()` do NestJS para simular aplicacoes que demoram para subir (ex: conectando ao Kafka, banco de dados, cache). Isso testa se o startup probe aguenta esperar.

### 2. Erros aleatorios
Usando `new Date().getMilliseconds() % 2 === 0` para gerar erros 50% das vezes no health check. Simula instabilidade real de aplicacoes. O instrutor explica que isso impacta startup e liveness, mas NAO impacta readiness (que bate em `/readyz`, nao em `/healthz`).

Analogia do instrutor: "Aqui é como se a gente tivesse, por exemplo, um Kafka subindo também, ou pelo menos não a subida do Kafka, mas a aplicação se conectando ao Kafka, se conectando ao banco, se conectando ao cache, ou qualquer outro serviço externo."

## Parametros e seus significados

- **failureThreshold: 3** — precisa falhar 3 vezes seguidas para considerar nao-pronto
- **successThreshold: 1** — basta 1 sucesso para voltar a ser considerado pronto
- **timeoutSeconds: 1** — timeout de cada checagem individual
- **periodSeconds: 15** — intervalo entre checagens (o instrutor escolheu 15s para readiness, diferente do 1s do startup)

## O que acontece quando readiness falha

Quando o readiness probe falha alem do threshold, o Kubernetes:
1. Remove o pod do Service (para de enviar trafego)
2. Gera alertas nos eventos do pod
3. Pode causar restarts dependendo da configuracao

O instrutor menciona: "Caso tenha algum problema, nós vamos ter ali alguns alertas, nós vamos ter também alguns restarts."