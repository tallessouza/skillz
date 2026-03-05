# Code Examples: Configurando Cluster Kubernetes com Kind

## Estrutura do projeto completa

```
service-mesh/
├── app-ts/
│   ├── src/
│   │   └── server.ts        # Health check + readiness routes
│   ├── Dockerfile            # Multi-stage build
│   ├── package.json
│   └── tsconfig.json
└── infra/
    └── kind.yaml             # Configuracao do cluster
```

## kind.yaml — Configuracao completa

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: cluster-service-mesh
nodes:
  - role: control-plane
  - role: worker
  - role: worker
```

## Comandos de criacao e verificacao

### Criar cluster com config

```bash
# Navegar ate o diretorio infra
cd infra

# Criar cluster usando arquivo de configuracao
kind create cluster --config kind.yaml
```

### Output esperado da criacao

```
Creating cluster "cluster-service-mesh" ...
 ✓ Ensuring node image (kindest/node:v1.32.x) 🖼
 ✓ Preparing nodes 📦 📦 📦
 ✓ Writing configuration 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
 ✓ Joining worker nodes 🚜
Set kubectl context to "kind-cluster-service-mesh"
```

### Verificar nodes

```bash
kubectl get nodes
```

```
NAME                                 STATUS   ROLES           AGE   VERSION
cluster-service-mesh-control-plane   Ready    control-plane   2m    v1.32.0
cluster-service-mesh-worker          Ready    <none>          1m    v1.32.0
cluster-service-mesh-worker2         Ready    <none>          1m    v1.32.0
```

## Variacoes de configuracao

### Cluster minimo (1 node)

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: dev-cluster
nodes:
  - role: control-plane
```

### Cluster com port mapping (expor servicos)

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: cluster-service-mesh
nodes:
  - role: control-plane
    extraPortMappings:
      - containerPort: 80
        hostPort: 80
        protocol: TCP
      - containerPort: 443
        hostPort: 443
        protocol: TCP
  - role: worker
  - role: worker
```

### Cluster com 3 workers (alta redundancia)

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: cluster-ha
nodes:
  - role: control-plane
  - role: worker
  - role: worker
  - role: worker
```

## Comandos uteis de gerenciamento

```bash
# Listar clusters Kind
kind get clusters

# Deletar cluster especifico
kind delete cluster --name cluster-service-mesh

# Criar com nome via CLI (override do YAML)
kind create cluster --config kind.yaml --name meu-cluster

# Carregar imagem local no cluster (evita push para registry)
kind load docker-image minha-app:latest --name cluster-service-mesh

# Verificar pods do sistema
kubectl get pods -A

# Verificar contexto kubectl
kubectl config current-context
# Output: kind-cluster-service-mesh
```