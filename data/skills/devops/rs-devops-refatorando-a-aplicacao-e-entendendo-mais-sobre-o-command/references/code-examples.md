# Code Examples: Probes e Command no Kubernetes

## 1. Manifesto completo com httpGet (versao estavel)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:v9
          ports:
            - containerPort: 3000
          startupProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 5
```

## 2. Probe com exec command

```yaml
startupProbe:
  exec:
    command:
      - /bin/sh
      - -c
      - /app/check.sh
  initialDelaySeconds: 10
```

O script `check.sh` dentro do container:

```bash
#!/bin/sh
# Exemplo: verificar se um arquivo de lock existe
if [ -f /tmp/app-ready.lock ]; then
  exit 0  # saudavel
else
  exit 1  # nao saudavel
fi
```

## 3. Combinacao: exec no startup, httpGet no restante

```yaml
startupProbe:
  exec:
    command:
      - /bin/sh
      - -c
      - /app/startup-check.sh
  initialDelaySeconds: 10
readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
```

## 4. Apenas uma probe (caso minimo)

```yaml
# Somente startup — valido e aceito pelo Kubernetes
containers:
  - name: my-app
    image: my-app:v9
    startupProbe:
      httpGet:
        path: /health
        port: 3000
      initialDelaySeconds: 10
```

## 5. Erro demonstrado: script inexistente

```yaml
# Isso causa erro porque check.sh nao existe na imagem
startupProbe:
  exec:
    command:
      - /bin/sh
      - -c
      - check.sh
```

Erro resultante no pod:
```
OCI runtime exec failed: exec failed: unable to start container process:
exec: "/bin/sh": stat check.sh: no such file or directory
```

Solucao: garantir que o Dockerfile copia o script:

```dockerfile
COPY check.sh /app/check.sh
RUN chmod +x /app/check.sh
```

## 6. Docker build e push (workflow do instrutor)

```bash
# Build da nova versao corrigida
docker build -t my-app:v9 .

# Push para registry
docker push my-app:v9

# Aplicar manifesto atualizado
kubectl apply -f deployment.yaml
```

## 7. Verificar estado dos pods apos apply

```bash
# Ver pods e restarts
kubectl get pods

# Ver eventos do pod (util para debug de probes)
kubectl describe pod <pod-name>

# Ver logs do container
kubectl logs <pod-name>
```