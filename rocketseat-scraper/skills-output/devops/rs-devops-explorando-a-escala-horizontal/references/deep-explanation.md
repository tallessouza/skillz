# Deep Explanation: Escala Horizontal no Kubernetes

## Vertical vs Horizontal — A diferenca fundamental

A escala vertical aumenta o tamanho do hardware de um servidor especifico (mais CPU, mais RAM na mesma maquina). A escala horizontal cria mais maquinas — mais pods, mais replicas. Quando voce roda um Deployment com 3 pods, ja esta aplicando o principio da horizontalidade: um container distribuido sendo executado em 3 pods.

## Replicacao em dois niveis

O instrutor destaca que a replicacao horizontal acontece em dois niveis distintos:

1. **Nivel da aplicacao (pods):** Mais replicas do mesmo pod para atender mais trafego
2. **Nivel do cluster (nos):** Mais maquinas fisicas/virtuais para alocar mais pods

Quando dois nos nao conseguem mais alocar pods, voce replica os nos horizontalmente. Isso sera abordado em modulo separado (Cluster Autoscaler).

## Distribuicao de carga e Round Robin

O objetivo e distribuir igualmente as cargas de trabalho. Com muitas requisicoes chegando, varios pods atendem usando um balanceador de carga na frente. O algoritmo padrao e Round Robin — cada pod recebe requisicoes de forma igualitaria para que nenhum fique sobrecarregado individualmente.

## Redundancia como matematica

O instrutor usa um calculo simples mas poderoso: 5 pods, 1 falha = voce ainda tem 80% do trafego sendo respondido. Isso e "disponibilidade parcial" — um conceito crucial para SLAs. Quanto mais pods, menor o impacto percentual de cada falha individual.

## Escala nao restrita ao hardware

Na escala vertical, voce esta preso ao limite maximo da maquina. Na horizontal, quando os nos atuais lotam, voce cria mais nos e escalona pods para eles. Porem, o instrutor enfatiza: **nao e boa pratica nao colocar limite**. Sempre defina limites na escala, mesmo que tecnicamente voce possa escalar indefinidamente.

## Escala manual vs autoscaling

O instrutor explica que escala manual (alterar replicas de 5 para 8) funciona e nao funciona:
- **Funciona:** resolve o problema imediato
- **Nao funciona no mundo real:** trafego e imprevisivel. Pode acontecer num final de semana, do nada, e voce nao vai estar online para reagir

Por isso existe o autoscaling — condicionado a recursos (CPU/memoria) definidos no template spec do Deployment.

## Autoscaling baseado em condicoes vs eventos

**Baseado em recursos (HPA):**
- Monitora CPU e memoria dos pods
- Se pods atingem 80% de CPU → scale up
- Se consumo cai → downscale
- Built-in do Kubernetes (existe no dia zero)

**Baseado em eventos (KEDA):**
- Monitora filas de mensageria (Kafka, RabbitMQ, SQS, etc.)
- Se mensagens ultrapassam threshold → scale up
- NAO e built-in do Kubernetes — precisa instalar o KEDA (Kubernetes Event Driven Autoscaling)
- Essencial para arquiteturas de microservicos orientadas a eventos

## O problema das aplicacoes stateful

O instrutor alerta: aplicacoes stateful (com volumes persistentes) podem ter problemas serios com replicacao horizontal. A consistencia de dados distribuidos e um desafio quando voce tem multiplas replicas acessando ou mantendo estado. Isso sera aprofundado em modulos futuros.

## HPA vs VPA — Disponibilidade built-in

- **HPA (Horizontal Pod Autoscaler):** built-in, disponivel no dia zero do Kubernetes
- **VPA (Vertical Pod Autoscaler):** requer instalacao adicional

Isso torna o HPA a escolha mais acessivel e o ponto de partida natural para autoscaling.

## Metrics Server — Pre-requisito

O HPA depende do Metrics Server para funcionar. Sem ele, o Kubernetes nao sabe quanta CPU/memoria os pods estao consumindo. A proxima aula do curso aborda esse componente essencial.