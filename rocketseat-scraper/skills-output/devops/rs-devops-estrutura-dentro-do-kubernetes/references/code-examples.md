# Code Examples: Estrutura do Sidecar no Kubernetes

## 1. Namespace com injecao automatica do Istio

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: rocketseat
  labels:
    istio-injection: enabled
```

Quando este label esta presente, o Istio webhook intercepta a criacao de pods e injeta automaticamente o container sidecar (Envoy).

## 2. Deployment padrao (sidecar injetado automaticamente)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-pagamentos
  namespace: rocketseat  # Namespace com istio-injection: enabled
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-pagamentos
  template:
    metadata:
      labels:
        app: api-pagamentos
    spec:
      containers:
        - name: api-pagamentos
          image: rocketseat/api-pagamentos:v1.2.0
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 256Mi
```

Resultado apos deploy (o Istio injeta automaticamente):

```
$ kubectl get pods -n rocketseat
NAME                              READY   STATUS    RESTARTS
api-pagamentos-7d8f9b6c4-abc12   2/2     Running   0
```

Note o `2/2` — dois containers no pod: a aplicacao + o sidecar Envoy.

## 3. Anti-pattern: multiplas aplicacoes no mesmo pod

```yaml
# ERRADO — nao faca isso
apiVersion: v1
kind: Pod
metadata:
  name: apps-acopladas
spec:
  containers:
    - name: app-usuarios
      image: rocketseat/app-usuarios:latest
      ports:
        - containerPort: 3000
    - name: app-pagamentos
      image: rocketseat/app-pagamentos:latest
      ports:
        - containerPort: 3001
```

Problemas:
- Se `app-usuarios` precisa escalar para 5 replicas, `app-pagamentos` escala junto
- Ambas disputam os recursos definidos no pod
- Roteamento de trafego fica complexo

## 4. Correto: ReplicaSets separados

```yaml
# ReplicaSet para usuarios
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: app-usuarios
  namespace: rocketseat
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app-usuarios
  template:
    metadata:
      labels:
        app: app-usuarios
    spec:
      containers:
        - name: app-usuarios
          image: rocketseat/app-usuarios:latest
          ports:
            - containerPort: 3000
---
# ReplicaSet para pagamentos (separado, escala independente)
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: app-pagamentos
  namespace: rocketseat
spec:
  replicas: 2
  selector:
    matchLabels:
      app: app-pagamentos
  template:
    metadata:
      labels:
        app: app-pagamentos
    spec:
      containers:
        - name: app-pagamentos
          image: rocketseat/app-pagamentos:latest
          ports:
            - containerPort: 3001
```

## 5. Verificando se o sidecar foi injetado

```bash
# Listar containers de um pod
kubectl get pod <pod-name> -n rocketseat -o jsonpath='{.spec.containers[*].name}'
# Saida esperada: api-pagamentos istio-proxy

# Verificar todos os pods de um namespace
kubectl get pods -n rocketseat
# Coluna READY deve mostrar 2/2 (app + sidecar)

# Ver detalhes do sidecar
kubectl describe pod <pod-name> -n rocketseat | grep -A 5 "istio-proxy"
```

## 6. Pod com multiplos sidecars (Istio + Vault)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-com-multiplos-sidecars
  namespace: rocketseat
  annotations:
    vault.hashicorp.com/agent-inject: "true"
    vault.hashicorp.com/role: "app-role"
spec:
  containers:
    - name: minha-app
      image: rocketseat/minha-app:latest
      ports:
        - containerPort: 8080
    # Istio sidecar: injetado automaticamente via namespace label
    # Vault sidecar: injetado automaticamente via annotation
```

Resultado: pod com 3 containers (`3/3` na coluna READY):
- `minha-app` (principal)
- `istio-proxy` (service mesh)
- `vault-agent` (gestao de segredos)