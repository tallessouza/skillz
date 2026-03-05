# Code Examples: Kubernetes ReplicaSet

## Evolucao passo a passo (como mostrado na aula)

### Passo 1: Template inicial (incompleto — vai falhar)

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx
spec:
  template:
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "250m"
              memory: "64Mi"
            limits:
              cpu: "500m"
              memory: "128Mi"
```

**Erro:** `selector is a required field` e `template.metadata.labels is required`

### Passo 2: Adicionando replicas e selector (ainda incompleto)

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx
spec:
  replicas: 5
  selector:
    matchLabels:
      app: nginx
  template:
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "250m"
              memory: "64Mi"
            limits:
              cpu: "500m"
              memory: "128Mi"
```

**Erro:** Faltam as labels no template para o selector fazer match.

### Passo 3: Versao completa e funcional

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx
spec:
  replicas: 5
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "250m"
              memory: "64Mi"
            limits:
              cpu: "500m"
              memory: "128Mi"
```

**Sucesso:** `kubectl apply -f replicaset.yaml` cria o ReplicaSet com 5 pods.

## Comandos kubectl demonstrados

```bash
# Aplicar o ReplicaSet
kubectl apply -f replicaset.yaml

# Verificar pods criados
kubectl get pods

# Ver ReplicaSets
kubectl get replicaset

# Aplicar pod avulso (para comparacao)
kubectl apply -f pod.yaml

# Deletar um pod (ReplicaSet recria automaticamente)
kubectl delete pod <pod-name>
```

## Escalando replicas

```yaml
# Para aumentar para 10 replicas, altere:
spec:
  replicas: 10

# Para reduzir para 2 replicas:
spec:
  replicas: 2
```

Depois rode `kubectl apply -f replicaset.yaml` — o Kubernetes ajusta automaticamente.

## Comparacao: Pod avulso vs Pod controlado

### Pod avulso (sem controller)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx:latest
      ports:
        - containerPort: 80
```

- Deletou? Sumiu para sempre.
- Sem replicacao.
- Sem auto-recovery.

### Pod via ReplicaSet (com controller)

- Deletou? ReplicaSet recria automaticamente.
- Numero de replicas garantido.
- Self-discovery via labels.