# Code Examples: Gerenciamento de Fluxo com Istio

## Instalacao Completa via Helm

```bash
# 1. Adicionar repositorio Helm do Istio
helm repo add istio https://istio-release.storage.googleapis.com/charts
helm repo update

# 2. Criar namespace dedicado
kubectl create namespace istio-system

# 3. Instalar componentes base (CRDs)
helm install istio-base istio/base -n istio-system --wait

# 4. Instalar istiod (control plane)
helm install istiod istio/istiod -n istio-system --wait

# 5. Verificar instalacao
kubectl get pods -n istio-system
helm ls -n istio-system
```

## Habilitar Injecao Automatica de Sidecar

```bash
# Habilitar em um namespace especifico
kubectl label namespace default istio-injection=enabled

# Habilitar em multiplos namespaces
for ns in default staging production; do
  kubectl label namespace $ns istio-injection=enabled
done

# Verificar quais namespaces tem injecao habilitada
kubectl get namespace -L istio-injection

# Desabilitar para um namespace especifico (se necessario)
kubectl label namespace monitoring istio-injection-
```

## Verificar Injecao de Sidecar

```bash
# Apos deploy, verificar se pod tem 2 containers (READY 2/2)
kubectl get pods -n default
# NAME                      READY   STATUS    RESTARTS
# my-app-6b4f5d7c8-x2k9p   2/2     Running   0

# Ver containers dentro do pod
kubectl describe pod my-app-6b4f5d7c8-x2k9p -n default
# Containers:
#   my-app:        (aplicacao)
#   istio-proxy:   (sidecar injetado automaticamente)
```

## Usando Istio CTL

```bash
# Analisar configuracao do cluster
istioctl analyze

# Verificar status dos proxies
istioctl proxy-status

# Ver configuracao de um proxy especifico
istioctl proxy-config routes deploy/my-app

# Verificar versao instalada
istioctl version
```

## Deployment Normal (com injecao automatica)

```yaml
# Nao precisa declarar sidecar — o webhook injeta automaticamente
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: default  # namespace com istio-injection=enabled
spec:
  replicas: 2
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
          image: my-app:latest
          ports:
            - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: my-app
spec:
  selector:
    app: my-app  # matchLabels — Istio usa isso para service discovery
  ports:
    - port: 80
      targetPort: 8080
```

## Gerenciamento de Pacotes via Helm vs kubectl

```bash
# Com kubectl (manual, multiplos arquivos)
kubectl apply -f istio-base.yaml
kubectl apply -f istiod.yaml
kubectl apply -f istio-gateway.yaml
# Problema: gerenciar upgrades, rollbacks, dependencias

# Com Helm (empacotado)
helm install istiod istio/istiod -n istio-system
helm upgrade istiod istio/istiod -n istio-system
helm rollback istiod 1 -n istio-system
helm uninstall istiod -n istio-system
# Vantagem: upgrade, rollback e uninstall atomicos
```

## Monitoramento do Namespace istio-system

```bash
# Ver todos os componentes instalados
kubectl get all -n istio-system

# Ver CRDs do Istio
kubectl get crds | grep istio

# Logs do istiod (control plane)
kubectl logs -l app=istiod -n istio-system -f

# Recursos consumidos
kubectl top pods -n istio-system
```