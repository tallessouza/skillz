# Code Examples: Metrics Server no Kubernetes

## Instalação direta (NÃO recomendada para projetos reais)

```bash
# Aplica direto da URL — fere princípio GitOps
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

Recursos criados:
```
serviceaccount/metrics-server created
clusterrole.rbac.authorization.k8s.io/... created
clusterrolebinding.rbac.authorization.k8s.io/... created
service/metrics-server created
deployment.apps/metrics-server created
apiservice.apiregistration.k8s.io/... created
```

## Remoção dos recursos instalados via URL

```bash
# Delete usando a mesma URL — remove todos os recursos criados
kubectl delete -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

## Instalação recomendada (GitOps)

### Passo 1: Download do manifesto

```bash
cd k8s/
wget https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
mv components.yaml metricserver.yml
```

### Passo 2: Edição do Deployment (adicionar flag TLS)

Localizar a seção `args` do container no Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    k8s-app: metrics-server
  name: metrics-server
  namespace: kube-system
spec:
  selector:
    matchLabels:
      k8s-app: metrics-server
  template:
    metadata:
      labels:
        k8s-app: metrics-server
    spec:
      containers:
      - args:
        - --cert-dir=/tmp
        - --secure-port=10250
        - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
        - --kubelet-use-node-status-port
        - --metric-resolution=15s
        - --kubelet-insecure-tls    # ADICIONAR: desabilita verificação TLS para ambiente local
        image: registry.k8s.io/metrics-server/metrics-server:v0.7.0
        name: metrics-server
```

### Passo 3: Aplicar localmente

```bash
kubectl apply -f metricserver.yml
```

## Diagnóstico de problemas

### Verificar pods no kube-system

```bash
kubectl get po -n kube-system
```

Saída esperada (problema):
```
NAME                                         READY   STATUS    RESTARTS   AGE
coredns-558bd4d5db-xxxxx                     1/1     Running   0          2d
etcd-control-plane                           1/1     Running   0          2d
metrics-server-xxxxxxxxx-xxxxx               0/1     Running   0          30s   # <-- 0/1 = problema
```

Saída esperada (sucesso):
```
metrics-server-xxxxxxxxx-xxxxx               1/1     Running   0          30s   # <-- 1/1 = OK
```

### Verificar logs do pod com problema

```bash
# Pegar nome exato do pod
kubectl get po -n kube-system | grep metrics

# Ver logs
kubectl logs metrics-server-xxxxxxxxx-xxxxx -n kube-system
```

Erro típico sem `--kubelet-insecure-tls`:
```
E0228 10:15:30.123456  1 scraper.go:140] "Failed to scrape node" err="Get \"https://172.19.0.5:10250/metrics/resource\": 
tls: failed to verify certificate" node="kind-worker"
```

## Verificação de métricas funcionando

### Via kubectl

```bash
# Ver métricas de pods em um namespace específico
kubectl top po -n primeira-aplicacao
```

Saída:
```
NAME                                CPU(cores)   MEMORY(bytes)
minha-app-xxxxxxxxx-xxxxx          1m           80Mi
minha-app-xxxxxxxxx-yyyyy          1m           78Mi
```

### Via Lens

Após instalação bem-sucedida, as colunas CPU e Memory no Lens mudam de `<unknown>` / `N/A` para valores reais.

## Declarando namespace no metadata (conceito adicional)

O instrutor mostra como o Metrics Server declara seu namespace no próprio manifesto:

```yaml
# Metrics Server — namespace declarado no metadata
metadata:
  name: metrics-server
  namespace: kube-system
```

O mesmo conceito se aplica a suas aplicações:

```yaml
# Sua aplicação — pode declarar namespace no metadata
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minha-app
  namespace: primeira-aplicacao    # Não precisa passar -n no apply
spec:
  # ...
```

## Estrutura do projeto após instalação

```
projeto/
├── k8s/
│   ├── fds/                    # Arquivos da aplicação
│   │   ├── deployment.yml
│   │   └── service.yml
│   ├── kind/                   # Configuração do Kind
│   │   └── cluster.yml
│   └── metricserver.yml        # Metrics Server (componente de cluster)
```

O instrutor posiciona o `metricserver.yml` fora das pastas da aplicação, porque é um componente do cluster, agnóstico à aplicação.