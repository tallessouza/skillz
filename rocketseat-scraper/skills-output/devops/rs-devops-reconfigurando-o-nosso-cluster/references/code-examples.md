# Code Examples: Reconfigurando Cluster com Ambient Mode

## Estrutura de diretorios do projeto

```
projeto/
├── app/              # codigo da aplicacao
│   └── k8s/          # manifests kubernetes da app
│       ├── deployment.yaml
│       ├── deployment-v2.yaml
│       ├── service.yaml
│       ├── virtual-service.yaml
│       └── destination-rule.yaml
└── infra/            # configuracao de infraestrutura
    ├── kind.yaml
    ├── jaeger.yaml
    ├── kiali.yaml
    └── prometheus.yaml
```

## kind.yaml — configuracao do cluster

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: cluster-service-mesh
nodes:
  - role: control-plane
  - role: worker
  - role: worker
```

## Fluxo completo de comandos

### 1. Deletar cluster existente

```bash
kind delete cluster --name cluster-service-mesh
# Verificar que nao ha containers rodando
docker ps
```

### 2. Criar cluster novo

```bash
cd infra/
kind create cluster --config kind.yaml
```

Saida esperada:
```
Creating cluster "cluster-service-mesh" ...
 ✓ Ensuring node image
 ✓ Preparing nodes
 ✓ Writing configuration
 ✓ Starting control-plane
 ✓ Installing CNI
 ✓ Installing StorageClass
 ✓ Joining worker nodes
```

### 3. Verificar nodes

```bash
kubectl get nodes
```

Saida esperada:
```
NAME                                 STATUS   ROLES           AGE   VERSION
cluster-service-mesh-control-plane   Ready    control-plane   1m    v1.27.x
cluster-service-mesh-worker          Ready    <none>          1m    v1.27.x
cluster-service-mesh-worker2         Ready    <none>          1m    v1.27.x
```

### 4. Instalar Istio com Ambient Mode

```bash
istioctl install --set profile=ambient
```

Saida esperada:
```
This will install the Istio ambient profile...
Proceed? (y/N) y
✔ Istio core installed
✔ Istiod installed
✔ CNI installed
✔ Ztunnel installed
✔ Installation complete
Enjoy Istio without sidecars!
```

### 5. Verificar pods do Istio

```bash
kubectl get pods -n istio-system
```

Saida esperada (sem sidecar-related pods):
```
NAME                      READY   STATUS    RESTARTS   AGE
istiod-xxx                1/1     Running   0          1m
istio-cni-node-xxx        1/1     Running   0          1m
ztunnel-xxx               1/1     Running   0          1m
```

### 6. Criar namespace e instalar observabilidade

```bash
kubectl create ns app
kubectl apply -f jaeger.yaml
kubectl apply -f prometheus.yaml
kubectl apply -f kiali.yaml
```

### 7. Acompanhar pods subindo

```bash
kubectl get pods -n istio-system -w
```

Ordem esperada de readiness: Jaeger → Prometheus → Kiali (Kiali depende de Prometheus).

### 8. Deploy da aplicacao

```bash
kubectl apply -f ../k8s/. -n app
kubectl get pods -n app
```

Saida — note `1/1` (sem sidecar):
```
NAME                     READY   STATUS    RESTARTS   AGE
app-v1-xxx               1/1     Running   0          30s
app-v2-xxx               1/1     Running   0          30s
```

### 9. Aplicar label Ambient Mode

```bash
# ERRADO (modo sidecar — nao usar):
# kubectl label namespace app istio-injection=enabled

# CORRETO (modo ambient):
kubectl label namespace app istio.io/dataplane-mode=ambient
```

### 10. Port-forward para Kiali

```bash
# Via Lens: Services → istio-system → kiali → porta 20001
# Ou via CLI:
kubectl port-forward svc/kiali -n istio-system 20001:20001
```

Acessar `http://localhost:20001` — namespace app deve aparecer sem alertas de sidecar.

### Comparacao: labels por modo

```bash
# Sidecar mode (aulas anteriores)
kubectl label namespace app istio-injection=enabled

# Ambient mode (esta aula)
kubectl label namespace app istio.io/dataplane-mode=ambient
```