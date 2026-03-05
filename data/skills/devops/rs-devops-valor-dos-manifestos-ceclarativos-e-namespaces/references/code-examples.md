# Code Examples: Manifestos Declarativos e Namespaces

## 1. Criar e deletar pod imperativo (antes do manifesto)

```bash
# Rodar pod imperativamente (forma NÃO recomendada para produção)
kubectl run nginx --image=nginx:1.25.3

# Ver detalhes do pod (IP, consumo, eventos)
# Pode ser feito via Lens GUI ou:
kubectl describe pod nginx

# Deletar pod
kubectl delete pod nginx
```

## 2. Criar namespace

```bash
# Forma completa
kubectl create namespace primeira-app

# Forma abreviada
kubectl create ns primeira-app
```

## 3. Manifesto completo do pod (pod.yaml)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx:1.25.3
      ports:
        - containerPort: 80
      resources:
        requests:
          cpu: "100m"      # 1/10 de uma vCPU
          memory: "64Mi"   # 64 megabytes
        limits:
          cpu: "200m"      # 1/5 de uma vCPU (2x request)
          memory: "128Mi"  # 128 megabytes (2x request)
```

## 4. Aplicar manifesto no namespace correto

```bash
# Aplicar no namespace dedicado
kubectl apply -f pod.yaml -n primeira-app

# ERRADO: sem -n vai para o default
kubectl apply -f pod.yaml
```

## 5. Verificar pods no namespace

```bash
# Sem -n: mostra default (vazio)
kubectl get pods
# Resultado: No resources found in default namespace.

# Com -n: mostra o namespace correto
kubectl get pods -n primeira-app
# NAME    READY   STATUS    RESTARTS   AGE
# nginx   1/1     Running   0          30s

# Forma abreviada
kubectl get po -n primeira-app
```

## 6. Variações de porta por tipo de aplicação

```yaml
# Nginx (porta 80)
containers:
  - name: nginx
    image: nginx:1.25.3
    ports:
      - containerPort: 80

# Node.js (porta 3000)
containers:
  - name: api
    image: minha-api:1.0.0
    ports:
      - containerPort: 3000

# Python/FastAPI (porta 8000)
containers:
  - name: backend
    image: meu-backend:1.0.0
    ports:
      - containerPort: 8000
```

## 7. Referência de unidades de CPU

```yaml
# 1 vCPU = 1000m (milicores)
resources:
  requests:
    cpu: "100m"   # 1/10 vCPU
    cpu: "250m"   # 1/4 vCPU
    cpu: "500m"   # 1/2 vCPU
    cpu: "1000m"  # 1 vCPU (pode escrever "1")
```

## 8. Reaplicar manifesto após mudanças

```bash
# Editou o YAML? Basta reaplicar
kubectl apply -f pod.yaml -n primeira-app
# O Kubernetes faz diff e aplica apenas as mudanças
```