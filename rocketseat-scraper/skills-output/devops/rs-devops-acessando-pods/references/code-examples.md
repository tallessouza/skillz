# Code Examples: Acessando Pods com Services

## Exemplo completo da aula: Service para Nginx

### service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  type: ClusterIP
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
```

### Deployment correspondente (referencia)

```yaml
apiVersion: apps/v1
kind: Deployment
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
          image: nginx:1.27
          ports:
            - containerPort: 80
```

## Comandos utilizados na aula

### Aplicar o Service

```bash
kubectl apply -f service.yaml -n primeiro-app
```

### Port-forward via Service (correto)

```bash
kubectl port-forward svc/nginx-svc 8080:80 -n primeiro-app
```

### Port-forward via Deployment (gambiarra — evitar)

```bash
# Funciona mas NAO e a forma correta
kubectl port-forward deployment/nginx 8080:80
```

## Variacao: aplicacao que roda em porta diferente

Quando o container sobe em porta diferente de 80 (ex: Node.js na 3000):

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-svc
spec:
  type: ClusterIP
  selector:
    app: api
  ports:
    - port: 80        # porta do Service (cliente acessa)
      targetPort: 3000 # porta do container (app roda)
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: my-api:latest
          ports:
            - containerPort: 3000
```

## Escala declarativa vs imperativa

### Errado: escalar via CLI e esquecer o YAML

```bash
# Isso funciona mas o YAML ainda diz replicas: 5
kubectl scale deployment nginx --replicas=30 -n primeiro-app

# Proximo apply volta para 5!
kubectl apply -f deployment.yaml -n primeiro-app
```

### Correto: alterar no YAML e aplicar

```yaml
# deployment.yaml — altere aqui
spec:
  replicas: 30  # era 5, agora 30
```

```bash
kubectl apply -f deployment.yaml -n primeiro-app
```

## Verificacao

### Listar Services

```bash
kubectl get svc -n primeiro-app
# NAME        TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
# nginx-svc   ClusterIP   10.96.x.x      <none>        80/TCP    1m
```

### Verificar endpoints do Service

```bash
kubectl get endpoints nginx-svc -n primeiro-app
# Mostra os IPs dos pods que o Service esta roteando
```

### Descrever o Service

```bash
kubectl describe svc nginx-svc -n primeiro-app
# Mostra selector, port, targetPort, endpoints
```