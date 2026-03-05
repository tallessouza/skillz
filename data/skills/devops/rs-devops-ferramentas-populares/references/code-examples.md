# Code Examples: Ferramentas de Service Mesh

Esta aula e predominantemente conceitual/comparativa, sem exemplos de codigo direto. Abaixo estao exemplos praticos de como instalar e verificar cada ferramenta mencionada, para referencia.

## Instalacao rapida de cada ferramenta

### Istio (escolha do curso)

```bash
# Download do Istio
curl -L https://istio.io/downloadIstio | sh -
cd istio-*
export PATH=$PWD/bin:$PATH

# Instalacao no cluster
istioctl install --set profile=demo -y

# Habilitar injecao automatica de sidecar no namespace
kubectl label namespace default istio-injection=enabled

# Verificar instalacao
kubectl get pods -n istio-system
```

### Linkerd (top 2, leve, Rust)

```bash
# Instalar CLI
curl --proto '=https' --tlsv1.2 -sSfL https://run.linkerd.io/install | sh
export PATH=$HOME/.linkerd2/bin:$PATH

# Verificar pre-requisitos
linkerd check --pre

# Instalar no cluster
linkerd install --crds | kubectl apply -f -
linkerd install | kubectl apply -f -

# Verificar
linkerd check
```

### Cilium (eBPF, performance)

```bash
# Instalar CLI
CILIUM_CLI_VERSION=$(curl -s https://raw.githubusercontent.com/cilium/cilium-cli/main/stable.txt)
curl -L --fail --remote-name-all \
  https://github.com/cilium/cilium-cli/releases/download/${CILIUM_CLI_VERSION}/cilium-linux-amd64.tar.gz
sudo tar xzvf cilium-linux-amd64.tar.gz -C /usr/local/bin

# Instalar no cluster (como CNI + service mesh)
cilium install
cilium status --wait
```

### Consul Connect (HashiCorp)

```bash
# Via Helm
helm repo add hashicorp https://helm.releases.hashicorp.com
helm install consul hashicorp/consul --set global.name=consul --create-namespace -n consul

# Verificar
kubectl get pods -n consul
```

### Kuma (ecossistema Kong)

```bash
# Download
curl -L https://kuma.io/installer.sh | VERSION=2.x.x sh -

# Instalar no Kubernetes
kumactl install control-plane | kubectl apply -f -

# Verificar
kubectl get pods -n kuma-system
```

## Comparando recursos instalados

```bash
# Ver todos os CRDs instalados por cada ferramenta
# Isso mostra a "abrangencia" que o instrutor menciona

# Istio (muitos CRDs = muitos recursos)
kubectl get crds | grep istio | wc -l
# Tipicamente 20-30+ CRDs

# Linkerd (focado = menos CRDs)
kubectl get crds | grep linkerd | wc -l
# Tipicamente 10-15 CRDs

# Cilium
kubectl get crds | grep cilium | wc -l
```

## Verificando consumo de recursos (trade-off leveza vs abrangencia)

```bash
# Comparar consumo de memoria do control plane
# Istio (mais pesado)
kubectl top pods -n istio-system

# Linkerd (mais leve)
kubectl top pods -n linkerd

# Cilium (leve, kernel-level)
kubectl top pods -n kube-system -l app.kubernetes.io/part-of=cilium
```