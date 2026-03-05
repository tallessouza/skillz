# Code Examples: Metrics Server no Kubernetes

## Verificando se o Metrics Server esta instalado

```bash
# Verifica se o Metrics Server esta rodando
kubectl get pods -n kube-system | grep metrics-server

# Verifica se a Metrics API esta disponivel
kubectl api-resources | grep metrics

# Testa se metricas estao sendo coletadas
kubectl top nodes
kubectl top pods
```

Se `kubectl top` retornar erro como `Metrics API not available`, o Metrics Server nao esta instalado.

## Instalando o Metrics Server

```bash
# Instalacao via manifesto oficial
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Para clusters locais (minikube, kind) pode precisar de flag extra
# --kubelet-insecure-tls (apenas desenvolvimento)
```

### Verificando apos instalacao

```bash
# Aguarde ~30s para o Metrics Server iniciar coleta
kubectl get deployment metrics-server -n kube-system

# Agora deve retornar valores
kubectl top nodes
# NAME           CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
# node-1         250m         12%    1024Mi           52%

kubectl top pods
# NAME                    CPU(cores)   MEMORY(bytes)
# minha-app-7d8f9-abc     50m          128Mi
```

## Configurando HPA (depende do Metrics Server)

```yaml
# hpa.yaml — so funciona com Metrics Server instalado
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: minha-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: minha-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

```bash
# Aplicar o HPA
kubectl apply -f hpa.yaml

# Verificar status do HPA
kubectl get hpa
# NAME             REFERENCE              TARGETS   MINPODS   MAXPODS   REPLICAS
# minha-app-hpa    Deployment/minha-app   45%/70%   2         10        2
```

Se a coluna TARGETS mostrar `<unknown>/70%`, o Metrics Server nao esta funcionando corretamente.

## Diagnosticando problemas

```bash
# HPA mostra <unknown> nos targets
kubectl describe hpa minha-app-hpa
# Procure por eventos como:
# "unable to get metrics for resource cpu: no metrics known for pod"

# Verifique se o pod tem resource requests definidos
kubectl get pod minha-app-xxx -o yaml | grep -A5 resources
# resources:
#   requests:
#     cpu: 100m      ← OBRIGATORIO para HPA funcionar
#     memory: 128Mi

# Sem requests definidos, o HPA nao consegue calcular percentual
```

### Requisito: Resource Requests no Deployment

```yaml
# O HPA precisa de requests definidos para calcular utilizacao percentual
spec:
  containers:
    - name: minha-app
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 500m
          memory: 512Mi
```