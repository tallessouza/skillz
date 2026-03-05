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