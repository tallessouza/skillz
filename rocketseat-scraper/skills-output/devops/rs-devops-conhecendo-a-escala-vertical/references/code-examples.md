# Code Examples: Escala Vertical no Kubernetes

## Nota sobre exemplos de codigo

Esta aula e predominantemente conceitual — o instrutor nao demonstra codigo. Os exemplos abaixo sao derivados dos conceitos ensinados para aplicacao pratica.

## Instalando o VPA no Kubernetes

O instrutor menciona que o VPA precisa ser instalado como modulo externo:

```bash
# Clonar o repositorio do VPA
git clone https://github.com/kubernetes/autoscaler.git

# Navegar ate o diretorio do VPA
cd autoscaler/vertical-pod-autoscaler

# Instalar o VPA no cluster
./hack/vpa-up.sh
```

## Exemplo de configuracao VPA

```yaml
# vpa.yaml — Configuracao basica de Vertical Pod Autoscaler
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: minha-aplicacao-vpa
spec:
  targetRef:
    apiVersion: "apps/v1"
    kind: Deployment
    name: minha-aplicacao
  updatePolicy:
    updateMode: "Auto"  # Auto, Off, ou Initial
  resourcePolicy:
    containerPolicies:
    - containerName: "*"
      minAllowed:
        cpu: "100m"
        memory: "128Mi"
      maxAllowed:
        cpu: "2000m"      # Limite maximo de CPU
        memory: "4Gi"     # Limite maximo de memoria
```

## Visualizando recursos atuais de um pod

Para entender quando escala vertical seria necessaria:

```bash
# Ver consumo atual de recursos dos pods
kubectl top pods

# Ver consumo de recursos dos nos
kubectl top nodes

# Ver limites configurados em um deployment
kubectl describe deployment minha-aplicacao | grep -A 5 "Limits\|Requests"
```

## Exemplo de resource requests e limits (sem VPA)

Configuracao manual de recursos — o que o VPA automatiza:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minha-aplicacao
spec:
  replicas: 1  # Escala vertical: poucas replicas, mais recursos cada
  template:
    spec:
      containers:
      - name: app
        image: minha-aplicacao:latest
        resources:
          requests:
            cpu: "500m"       # Requisicao minima
            memory: "512Mi"
          limits:
            cpu: "2000m"      # Maximo permitido
            memory: "2Gi"
```

## Comparacao visual: vertical vs horizontal

```yaml
# ESCALA VERTICAL: 1 pod grande
spec:
  replicas: 1
  containers:
  - resources:
      limits:
        cpu: "8000m"
        memory: "16Gi"

# ESCALA HORIZONTAL: muitos pods pequenos (preferido no K8s)
spec:
  replicas: 8
  containers:
  - resources:
      limits:
        cpu: "1000m"
        memory: "2Gi"
```

## Verificando se VPA esta instalado

```bash
# Verificar se os componentes do VPA estao rodando
kubectl get pods -n kube-system | grep vpa

# Listar VPAs configurados
kubectl get vpa

# Ver recomendacoes do VPA para um deployment
kubectl describe vpa minha-aplicacao-vpa
```