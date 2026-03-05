# Deep Explanation: Explorando Cenarios de Estresse no Kubernetes

## O ciclo de decaimento do HPA

Apos um teste de estresse, o HPA nao remove replicas imediatamente. O instrutor observou a reducao gradual: 8→7→6→5→3. Isso acontece porque:

- O HPA tem um **stabilization window** padrao (geralmente 5 minutos para scale-down)
- Isso e proposital — evita "flapping" (escalar e desescalar rapidamente)
- Em cenarios de producao, muitos times aumentam esse tempo de proposito para manter resiliencia pos-pico

### Dois contextos validos para o tempo de decaimento:
1. **Decaimento lento proposital**: aplicacoes com sazonalidade irregular — manter replicas extras como camada de resiliencia
2. **Decaimento rapido**: aplicacoes com periodos claros de baixa — economizar recursos rapidamente

Se a aplicacao nao tem sazonalidade clara, nao faz sentido manter tempo grande de decaimento.

## Por que writeStream sincrono gera alto consumo de CPU

O instrutor usou `createWriteStream` do modulo `fs` do Node.js para escrever 10.000 linhas em um arquivo a cada requisicao. Por si so, isso nao e problema. O problema e **escala**:

- Cada requisicao dispara 10.000 operacoes de escrita
- Em um teste com 6.000 QPS e 50 threads, multiplas requisicoes simultaneas competem por CPU
- O processo e sincrono dentro do loop, bloqueando a event loop do Node

Resultado medido: de ~500k requisicoes (app simples) para apenas ~10k requisicoes no mesmo periodo de 2 minutos.

## A diferenca dramatica nos numeros

| Metrica | App simples (retorna string) | App com writeStream |
|---------|------------------------------|---------------------|
| Total de requisicoes | ~500.000 | ~10.000 |
| QPS | ~4.000-5.000 | ~80 |
| Latencia media | 12ms | 617ms |
| Status code | 200 (todos) | 200 (todos) |

O Fortio cadenciou as requisicoes — nao conseguiu enviar mais porque a aplicacao nao respondia a tempo. Isso demonstra que **throughput e limitado pelo recurso mais escasso**, neste caso CPU.

## Estrategia de ajuste pos-teste

O instrutor seguiu esta ordem de raciocinio:

1. **Identificar o gargalo**: `kubectl top pods` mostrou CPU no limite, memoria OK
2. **Nao mexer no que nao e gargalo**: memoria ficou estavel, entao nao alterou
3. **Aumentar resources do gargalo**: CPU request de 200m→400m, limit de 200m→700m
4. **Ajustar baseline de replicas**: minReplicas de 3→6 porque o trafego e constante
5. **Dar headroom no HPA**: maxReplicas de 8→10

### A reflexao sobre "numeros magicos"

O instrutor reconheceu que os numeros iniciais eram "magicos" — escolhidos sem base em dados. A abordagem correta e iterativa:

1. Definir valores iniciais razoaveis
2. Rodar teste de estresse
3. Observar metricas reais
4. Ajustar e re-testar
5. Repetir conforme a aplicacao evolui

## Rolling update durante HPA escalado

Ponto importante levantado: se voce faz deploy quando o HPA escalou para 8 replicas, o rolling update vai substituir TODAS as 8. O Kubernetes nao "sabe" que o minimo e 3 — ele ve 8 replicas ativas e faz o rollout de todas, respeitando a estrategia de surge/unavailable configurada.

Isso significa que **e seguro fazer deploy durante picos de trafego** — o rolling update mantem a capacidade.

## HPA como fallback, nao como estrategia principal

Insight critico do instrutor: se sua aplicacao **sempre** recebe carga alta, o HPA nao deveria ser a estrategia principal. O HPA e para picos extremos e inesperados. Para trafego previsivel:

- Aumente o baseline de replicas (minReplicas)
- Aumente os resources por pod
- Use o HPA como safety net para picos acima do normal