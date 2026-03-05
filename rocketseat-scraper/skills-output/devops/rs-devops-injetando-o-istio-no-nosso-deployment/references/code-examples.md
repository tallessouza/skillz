# Code Examples: Injetando Istio no Deployment

## Arquivo service.yaml completo

```yaml
apiVersion: v1
kind: Service
metadata:
  name: app-service-mesh-svc
  namespace: app
spec:
  type: ClusterIP
  selector:
    app: app-service-mesh
  ports:
    - port: 80
      targetPort: 3000
```

## Deployment de referencia (do modulo)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-service-mesh
  namespace: app
spec:
  replicas: 4
  selector:
    matchLabels:
      app: app-service-mesh
  template:
    metadata:
      labels:
        app: app-service-mesh
    spec:
      containers:
        - name: app-service-mesh
          image: <app-image>
          ports:
            - containerPort: 3000
```

## Sequencia completa de comandos

### 1. Aplicar deployment e service

```bash
# Aplicar diretorio inteiro
kubectl apply -f k8s/ -n app

# Ou aplicar arquivo especifico
kubectl apply -f k8s/service.yaml -n app
```

### 2. Verificar recursos criados

```bash
# Verificar pods
kubectl get pods -n app

# Verificar services
kubectl get svc -n app

# Ver endpoints do service (mostra pods encontrados via selector)
# No Lens: clicar no service → Endpoints ja lista os pods
```

### 3. Habilitar injecao do Istio

```bash
kubectl label namespace app istio-injection=enabled --overwrite
```

### 4. Recriar pods para ativar injecao

```bash
# Deletar tudo no namespace
kubectl delete -f k8s/ -n app

# Verificar que nao ha pods
kubectl get pods -n app

# Verificar que nao ha services
kubectl get svc -n app

# Reaplicar
kubectl apply -f k8s/ -n app
```

### 5. Verificar injecao

```bash
# Deve mostrar 2/2 (app + istio-proxy)
kubectl get pods -n app

# Ver logs do Envoy proxy
# No Lens: clicar no pod → selecionar container istio-proxy → Logs
# Deve aparecer: "Envoy proxy is ready"
```

## Teste com namespace sem Istio

```bash
# Criar namespace sem label do Istio
kubectl create namespace app2

# Aplicar mesmos manifests no app2
kubectl apply -f k8s/ -n app2

# Verificar: deve mostrar 1/1 (sem sidecar)
kubectl get pods -n app2

# Limpar
kubectl delete -f k8s/ -n app2
kubectl delete namespace app2
```

## Containers resultantes apos injecao

Apos a injecao, cada pod tera:

| Container | Tipo | Funcao | Lifecycle |
|-----------|------|--------|-----------|
| `app-service-mesh` | Container principal | Aplicacao | Permanente |
| `istio-proxy` | Sidecar | Envoy proxy | Permanente |
| `istio-init` | InitContainer | Configura iptables | Executa e morre |