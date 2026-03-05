# Deep Explanation: Grafana OnCall e Gestao de Incidentes

## Por que alertas sao mais importantes que dashboards

O instrutor enfatiza um ponto fundamental: dashboards sem alarmes criam uma falsa sensacao de seguranca. Voce nao vai ficar olhando dashboards o dia inteiro — e cansativo e improdutivo. O cenario ideal e que voce so precise olhar para o dashboard quando ja sabe que ha um problema. Se nao houver alertas, quem vai te avisar e o cliente, e nesse ponto tanto voce quanto o cliente ja estao estressados, o que impacta negativamente a correcao.

A logica e: **descubra o problema o quanto antes**. Quanto mais cedo a deteccao, menor o impacto e menor o estresse na resolucao.

## O conceito de OnCall (Plantao)

OnCall e literalmente "plantao". Em um time de 7 pessoas, existe um rodizio: hoje voce esta de plantao, amanha seu colega, depois de amanha outro. Pode haver distincao entre horario comercial e nao-comercial.

**Ponto critico do instrutor:** A pessoa de plantao nao e necessariamente quem resolve o problema. Ela e a **responsavel por acionar**. Do ponto de vista da lideranca, se houver um problema e o Joao esta de plantao, a lideranca vai ao Joao para saber o que foi feito. Talvez o Joao nao tenha corrigido nada, mas ele e responsavel por ter falado com o time, pedido ajuda, e feito a ponte.

Isso se alinha com a cultura DevOps que estimula colaboracao — ninguem resolve sozinho, mas alguem precisa ser o ponto focal.

## Escalation Chain explicada

A escalation chain define QUEM sera notificado e COMO. Pode incluir:
- A pessoa de plantao (ou pessoas — pode haver mais de uma simultaneamente)
- Canal do Slack, Telegram, Teams, Google Chat
- Notificacoes por SMS, chamada telefonica, mencao em canal

O instrutor destaca a flexibilidade: voce pode criar um canal especifico para incidentes, colocar as pessoas relevantes dentro, e ter alguem para investigar imediatamente.

## Workflow de incidente e metricas

O fluxo completo:
1. Alerta chega
2. Alguem faz "ACK" (acknowledge) — sinalizando que viu e esta investigando
3. Investigacao e resolucao
4. Problema resolvido → alerta fecha automaticamente

Desse fluxo, voce extrai metricas poderosas:
- **Quanto tempo o time demora para descobrir** que houve um problema (MTTD)
- **Quanto tempo demora para resolver** (MTTR)
- **MTBF** — tempo medio entre falhas

## Severidade e a analogia do instrutor

O instrutor usa um exemplo muito claro: se o time A demora 30 minutos para responder a uma SEV1, e o time B demora 5 minutos, a pergunta DevOps nao e "por que o time A e lento?" mas sim "o que o time B faz de processo que o time A nao faz?". Provavelmente e uma questao de processo, e uma mudanca simples ja resolve.

**Principio fundamental:** nunca punir, sempre entender. A cultura DevOps busca melhoria continua, nao culpados.

## Status do Grafana OnCall OSS

O instrutor alerta que a versao open-source do Grafana OnCall entrou em modo manutencao em 11 de marco de 2025 e sera arquivada no ano seguinte. Isso significa:
- Nao havera novas features
- Apenas correcoes de CVEs criticos
- Nao vale a pena configurar do zero

A recomendacao e usar o Grafana Cloud (que tem plano gratuito suficiente para estudos) ou alternativas como PagerDuty e Squadcast.

## Blast Radius

O instrutor menciona o conceito de "blast radius" — o raio de impacto de um problema. A severidade deve considerar nao apenas o tipo de falha, mas o impacto que ela gera. Um bug em uma feature usada por 10 usuarios e diferente de um bug no login que afeta 100% dos usuarios.