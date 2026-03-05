# Deep Explanation: Estratégias de Deploy no Kubernetes

## O que acontece por baixo dos panos

Quando você altera a tag de um container no Deployment e aplica com `kubectl apply`, o Kubernetes cria um **novo ReplicaSet** com a nova configuração e começa o processo de transição entre o ReplicaSet antigo e o novo. A **strategy** define exatamente como essa transição acontece.

### Rolling Update — o cadenciamento

O comportamento padrão do Kubernetes é o **RollingUpdate**. Ele funciona assim:

1. O novo ReplicaSet é criado
2. Pods novos começam a subir (quantidade controlada por `maxSurge`)
3. Pods antigos começam a ser terminados (quantidade controlada por `maxUnavailable`)
4. O processo se repete até que todos os pods sejam da nova versão

O instrutor demonstrou isso visualmente com 10 réplicas — ao mudar de v2 para v1, o Kubernetes foi terminando pods antigos e subindo novos de forma cadenciada, garantindo que sempre havia pods respondendo ao tráfego (conceito de **zero downtime**).

### Analogia do instrutor

O instrutor comparou o processo a um fluxo de "cadenciamento": "sobe um pod da v1, mata um da v2, e assim de forma sucessiva". É como trocar as rodas de um carro em movimento — você nunca tira todas ao mesmo tempo.

### Por que o deploy parecia lento sem configuração

Sem declarar `maxSurge` e `maxUnavailable`, o Kubernetes usa valores default conservadores (tipicamente 25% para ambos). Com 10 réplicas, isso significa:
- maxSurge default: 2-3 pods extras por vez
- maxUnavailable default: 2-3 pods fora por vez

O instrutor mostrou que ao configurar explicitamente `maxSurge: 2` e `maxUnavailable: 1`, conseguiu controlar o comportamento. Depois demonstrou porcentagem (`20%` e `10%`) que tem a vantagem de escalar automaticamente.

### maxSurge — a velocidade do deploy

É o número máximo de pods **adicionais** que podem existir acima do número desejado de réplicas durante o deploy. Se você tem 10 réplicas e `maxSurge: 2`, pode ter até 12 pods temporariamente.

- Valor maior = deploy mais rápido (mais pods novos sobem em paralelo)
- Custo: mais recursos temporários no cluster

### maxUnavailable — a tolerância à indisponibilidade

É o número máximo de pods que podem estar **fora** (terminados ou não prontos) durante o deploy. Se você tem 10 réplicas e `maxUnavailable: 1`, sempre terá pelo menos 9 pods respondendo.

- Valor 0 = zero downtime absoluto (nenhum pod antigo morre antes de um novo estar ready)
- Valor maior = deploy mais rápido mas com menos capacidade temporária

### Porcentagem vs. número inteiro

O instrutor fez a conta explicitamente:
- 10 réplicas, 10% = 1 pod
- 10 réplicas, 40% = 4 pods
- 20 réplicas, 40% = 8 pods

**Vantagem da porcentagem:** se você aumenta réplicas de 10 para 20, não precisa reconfigurar os valores. Com número inteiro, teria que ajustar manualmente.

### Recreate — a estratégia "brutal"

O `type: Recreate` é a outra estratégia disponível. Ela mata **todos** os pods antigos antes de subir os novos. Isso causa downtime completo, mas é útil quando:
- A aplicação não suporta duas versões rodando simultaneamente
- Há incompatibilidade de schema de banco
- Ambiente de desenvolvimento onde downtime é aceitável

### O erro do instrutor com recursos

Ao tentar escalar para 20 réplicas em um cluster local, o instrutor derrubou o cluster por falta de memória. Isso ilustra um ponto importante: **scaling e strategy são limitados pelos recursos do cluster**. Em produção com cloud providers isso é menos problemático, mas em clusters locais (Kind, Minikube, Docker Desktop) os recursos são compartilhados com a máquina host.

### Strategy só dispara com mudança no template

O instrutor reforçou que alterar apenas o bloco `strategy` não dispara um novo deploy. É necessário que haja uma mudança no `template` do pod (como mudar a tag da imagem). Por isso, durante os testes, ele ficava alternando entre v1 e v2 — para forçar o Kubernetes a executar a strategy.

## imagePullPolicy e velocidade

O instrutor notou que os deploys ficaram "muito mais rápidos" após a primeira vez. Isso porque a imagem já estava cacheada nos nós. Com `imagePullPolicy: IfNotPresent`, o Kubernetes só faz pull se a imagem não existir localmente, o que acelera drasticamente o rolling update.