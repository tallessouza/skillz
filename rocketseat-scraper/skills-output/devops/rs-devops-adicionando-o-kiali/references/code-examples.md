# Code Examples: Adicionando o Kiali

## Instalacao completa passo a passo

### Baixar manifestos para pasta de infra

```bash
# Navegar ate a pasta de infra do projeto
cd infra/

# Baixar Kiali
wget https://raw.githubusercontent.com/istio/istio/master/samples/addons/kiali.yaml

# Baixar Prometheus
wget https://raw.githubusercontent.com/istio/istio/master/samples/addons/prometheus.yaml

# Verificar arquivos baixados
ls -la *.yaml
# kiali.yaml
# prometheus.yaml
# kind.yaml (ja existente)
```

### Instalar Gateway API CRDs (pre-requisito)

```bash
# Verificar se CRDs ja existem, instalar se nao
kubectl get crd gateways.gateway.networking.k8s.io &> /dev/null || \
  kubectl kustomize "github.com/kubernetes-sigs/gateway-api/config/crd?ref=v1.2.0" | kubectl apply -f -
```

### Instalar o Kiali

```bash
kubectl apply -f kiali.yaml

# Acompanhar criacao do pod
kubectl get pods -n istio-system -l app=kiali -w

# Verificar logs
kubectl logs -n istio-system -l app=kiali
```

### Instalar o Prometheus

```bash
kubectl apply -f prometheus.yaml

# Acompanhar criacao
kubectl get pods -n istio-system -l app=prometheus -w
```

### Corrigir erro de ImagePullBackOff no config-reloader

Se o Prometheus mostrar erro ao baixar imagem do config-reloader:

```yaml
# ANTES (prometheus.yaml) - trecho com dois containers
containers:
  - name: prometheus-server
    image: prom/prometheus:v2.x.x
    # ... config do prometheus
  - name: configmap-reload          # <-- REMOVER este bloco inteiro
    image: jimmidyson/configmap-reload
    # ... config do reloader
```

```yaml
# DEPOIS - apenas o container principal
containers:
  - name: prometheus-server
    image: prom/prometheus:v2.x.x
    # ... config do prometheus
```

```bash
# Reaplicar apos edicao
kubectl apply -f prometheus.yaml

# Verificar - agora deve mostrar 1/1 containers
kubectl get pods -n istio-system -l app=prometheus
```

### Acessar o Kiali

```bash
# Port-forward do servico
kubectl port-forward svc/kiali -n istio-system 20001:20001

# Acessar no browser: http://localhost:20001
```

## Verificacao final

```bash
# Todos os pods do istio-system devem estar Running
kubectl get pods -n istio-system

# Saida esperada (alem dos pods do Istio):
# NAME                     READY   STATUS    RESTARTS   AGE
# kiali-xxxxx              1/1     Running   0          5m
# prometheus-xxxxx         1/1     Running   0          3m
```

## Alternativa: instalar via diretorio local do Istio

```bash
# Se voce instalou o Istio via istioctl e tem o $ISTIO_HOME configurado
kubectl apply -f $ISTIO_HOME/samples/addons/kiali.yaml
kubectl apply -f $ISTIO_HOME/samples/addons/prometheus.yaml

# Vantagem: compatibilidade de versao garantida
# Desvantagem: menos controle sobre os manifestos
```

## Estrutura de addons no repositorio do Istio

```
github.com/istio/istio/
└── samples/
    └── addons/
        ├── grafana.yaml
        ├── jaeger.yaml
        ├── kiali.yaml       # Console de visualizacao
        ├── loki.yaml
        └── prometheus.yaml  # Coleta de metricas (dependencia do Kiali)
```