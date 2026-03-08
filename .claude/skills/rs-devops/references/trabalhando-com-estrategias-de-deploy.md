---
name: rs-devops-trabalhando-com-estrategias-de-deploy
description: "Applies Kubernetes deployment strategy configuration with RollingUpdate and Recreate patterns. Use when user asks to 'configure deploy strategy', 'set maxSurge', 'set maxUnavailable', 'achieve zero downtime deploy', or 'use Recreate strategy'. Enforces explicit strategy declaration, percentage-based values, imagePullPolicy IfNotPresent, and understanding that strategy only triggers on template changes. Make sure to use this skill whenever configuring Kubernetes deployment strategies or tuning rolling update parameters. Not for canary deployments, blue-green, or Istio traffic management."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-deployments
  tags: [kubernetes, deployment, rolling-update, recreate, maxsurge, maxunavailable, zero-downtime, strategy]
---

# Estratégias de Deploy no Kubernetes

> Ao configurar deploys no Kubernetes, defina explicitamente a estratégia de atualização com maxSurge e maxUnavailable para controlar o cadenciamento e garantir zero downtime.

## Rules

1. **Sempre declare strategy explicitamente** — mesmo que use RollingUpdate (o default), porque torna o comportamento visível e auditável no manifesto
2. **Use porcentagem em vez de número inteiro** — `maxSurge: "20%"` escala automaticamente com o número de réplicas, evitando reconfiguração manual ao escalar
3. **maxUnavailable controla indisponibilidade** — define quantos pods podem ficar fora durante a atualização; use `0` se zero downtime for crítico, porque garante que nenhum pod antigo morra antes de um novo estar pronto
4. **maxSurge controla velocidade** — define quantos pods extras podem existir temporariamente; valores maiores = deploy mais rápido, porque mais pods novos sobem em paralelo
5. **imagePullPolicy: IfNotPresent** — evita pull desnecessário quando a imagem já existe no nó, porque acelera significativamente o rolling update
6. **Strategy só tem efeito na virada de versão** — alterar strategy sem mudar a tag não dispara novo deploy; o deploy ocorre quando há mudança no template do pod

## How to write

### Deployment com RollingUpdate explícito

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minha-aplicacao
  namespace: minha-aplicacao
spec:
  replicas: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: "20%"
      maxUnavailable: "10%"
  selector:
    matchLabels:
      app: minha-aplicacao
  template:
    metadata:
      labels:
        app: minha-aplicacao
    spec:
      containers:
        - name: minha-aplicacao
          image: usuario/app:v2
          imagePullPolicy: IfNotPresent
```

### Deployment com Recreate (mata tudo, sobe tudo)

```yaml
spec:
  strategy:
    type: Recreate
  # Sem rollingUpdate block — Recreate não aceita essas propriedades
```

## Example

**Before (sem strategy — comportamento implícito e lento):**
```yaml
spec:
  replicas: 10
  selector:
    matchLabels:
      app: api
  template:
    spec:
      containers:
        - name: api
          image: usuario/api:v1
```

**After (strategy explícita com controle de cadenciamento):**
```yaml
spec:
  replicas: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 2
      maxUnavailable: 1
  selector:
    matchLabels:
      app: api
  template:
    spec:
      containers:
        - name: api
          image: usuario/api:v2
          imagePullPolicy: IfNotPresent
```

## Heuristics

| Situação | Faça |
|----------|------|
| Produção com SLA de uptime | `maxUnavailable: 0`, `maxSurge: "25%"` — nunca perde pod, sobe extras |
| Ambiente de staging/dev | `maxSurge: "50%"`, `maxUnavailable: "50%"` — deploy rápido, downtime aceitável |
| Poucos recursos no cluster | `maxSurge: 1`, `maxUnavailable: 1` — cadenciamento conservador |
| Muitas réplicas (20+) | Use porcentagem — escala proporcionalmente sem reconfiguração |
| Precisa derrubar tudo e recriar | `type: Recreate` — aceita downtime total entre versões |
| Mudou strategy mas não mudou tag | Nada acontece — force deploy mudando a tag ou annotation |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Omitir strategy e confiar no default implícito | Declarar `strategy.type: RollingUpdate` explicitamente |
| Usar `maxUnavailable: 0` com `maxSurge: 0` | Pelo menos um deve ser > 0, senão o deploy trava |
| Usar número inteiro fixo com réplicas variáveis | Usar porcentagem que escala automaticamente |
| Colocar `rollingUpdate` block com `type: Recreate` | Recreate não aceita sub-propriedades — remove o block |
| Ignorar `imagePullPolicy` em rolling updates | Setar `IfNotPresent` para evitar pulls redundantes |


## Troubleshooting

### Deploy nao dispara apos alterar strategy
**Symptom:** Mudou maxSurge/maxUnavailable mas nenhum pod novo foi criado
**Cause:** Strategy so tem efeito quando ha mudanca no template do pod (ex: tag da imagem)
**Fix:** Altere a tag da imagem ou adicione uma annotation no template para forcar o deploy

### Deploy trava sem progresso
**Symptom:** Pods novos nao sobem e pods antigos nao sao terminados
**Cause:** `maxSurge: 0` e `maxUnavailable: 0` simultaneamente — deploy impossivel
**Fix:** Pelo menos um dos valores deve ser maior que 0

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

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

---

# Code Examples: Estratégias de Deploy no Kubernetes

## Exemplo 1: Escalar réplicas de 2 para 10

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minha-aplicacao
  namespace: primeira-aplicacao
spec:
  replicas: 10  # Era 2, agora 10
  selector:
    matchLabels:
      app: minha-aplicacao
  template:
    metadata:
      labels:
        app: minha-aplicacao
    spec:
      containers:
        - name: minha-aplicacao
          image: usuario/app:v2
```

Aplicar:
```bash
kubectl apply -f k8s/ -n primeira-aplicacao
```

Resultado: Kubernetes simplesmente cria 8 pods adicionais. Não há "strategy" envolvida aqui — scaling horizontal é direto no ReplicaSet.

## Exemplo 2: Rolling Update com valores inteiros

```yaml
spec:
  replicas: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 2        # Até 12 pods temporariamente
      maxUnavailable: 1  # Mínimo 9 pods sempre disponíveis
  template:
    spec:
      containers:
        - name: minha-aplicacao
          image: usuario/app:v1  # Mudou de v2 para v1
```

Comportamento observado pelo instrutor:
- Pods novos (v1) sobem de 2 em 2
- Pods antigos (v2) morrem de 1 em 1
- Virada completa bem mais rápida que o default

## Exemplo 3: Rolling Update com porcentagem

```yaml
spec:
  replicas: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: "20%"        # 2 pods extras (20% de 10)
      maxUnavailable: "10%"  # 1 pod indisponível (10% de 10)
  template:
    spec:
      containers:
        - name: minha-aplicacao
          image: usuario/app:v2
```

Mesmo comportamento que o exemplo anterior, mas escala automaticamente se réplicas mudar.

## Exemplo 4: Tabela de cálculo de porcentagem

| Réplicas | maxSurge 20% | maxSurge 40% | maxUnavailable 10% | maxUnavailable 0 |
|----------|-------------|-------------|--------------------|--------------------|
| 10       | 2 extras    | 4 extras    | 1 fora             | 0 fora (zero DT)   |
| 20       | 4 extras    | 8 extras    | 2 fora             | 0 fora (zero DT)   |
| 50       | 10 extras   | 20 extras   | 5 fora             | 0 fora (zero DT)   |

## Exemplo 5: Variações para diferentes cenários

### Produção — zero downtime absoluto
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: "25%"
    maxUnavailable: 0
```
Nenhum pod antigo morre antes de um novo estar Ready. Deploy mais lento, mas sem risco.

### Staging — deploy rápido
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: "50%"
    maxUnavailable: "50%"
```
Metade dos pods podem morrer e metade extras podem subir. Deploy muito rápido.

### Cluster com poucos recursos
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 1
```
Sobe 1, mata 1 — consome mínimo de recursos extras.

## Exemplo 6: Recreate (sem sub-propriedades)

```yaml
spec:
  replicas: 10
  strategy:
    type: Recreate
  # NÃO colocar rollingUpdate block aqui — causa erro
  template:
    spec:
      containers:
        - name: minha-aplicacao
          image: usuario/app:v2
```

Comportamento: mata todos os 10 pods da versão antiga, depois sobe 10 pods da versão nova. Downtime completo entre as versões.

## Comandos utilizados na aula

```bash
# Aplicar manifesto (diretório inteiro)
kubectl apply -f k8s/ -n primeira-aplicacao

# Aplicar arquivo específico
kubectl apply -f k8s/deployment.yaml -n primeira-aplicacao

# Verificar pods
kubectl get pods -n primeira-aplicacao

# Verificar replicasets
kubectl get rs -n primeira-aplicacao

# Verificar deployment com detalhes de strategy
kubectl describe deployment minha-aplicacao -n primeira-aplicacao
```
