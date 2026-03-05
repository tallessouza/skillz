# Code Examples: Criando Cluster Kubernetes com Kind

## Instalacao do Kind

```bash
# Pre-requisito: Go instalado
go install sigs.k8s.io/kind@latest

# Verificar instalacao
kind --version
```

## Criacao imperativa (apenas exploracao)

```bash
# Criar cluster com nome customizado
kind create cluster --name primeiro-cluster-rocketseat

# Output esperado:
# Creating cluster "primeiro-cluster-rocketseat" ...
#  ✓ Ensuring node image (kindest/node:v1.31.0)
#  ✓ Preparing nodes
#  ✓ Writing configuration
#  ✓ Starting control-plane
#  ✓ Installing CNI
#  ✓ Installing StorageClass
# Set kubectl context to "kind-primeiro-cluster-rocketseat"
```

## Configuracao do contexto

```bash
# Setar contexto para o cluster recem-criado
kubectl cluster-info --context kind-primeiro-cluster-rocketseat

# Output esperado:
# Kubernetes control plane is running at https://127.0.0.1:PORT
# CoreDNS is running at https://127.0.0.1:PORT/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

## Exploracao do cluster

```bash
# Ver nodes — apenas control plane
kubectl get nodes
# NAME                                       STATUS   ROLES           AGE   VERSION
# primeiro-cluster-rocketseat-control-plane   Ready    control-plane   60s   v1.31.0

# Abreviacao equivalente
kubectl get no

# Pods no namespace default — vazio
kubectl get pods
# No resources found in default namespace.

# Pods no namespace kube-system
kubectl get pods -n kube-system
# NAME                                                               READY   STATUS    RESTARTS   AGE
# coredns-xxxxx-xxxxx                                                1/1     Running   0          60s
# coredns-xxxxx-xxxxx                                                1/1     Running   0          60s
# etcd-primeiro-cluster-rocketseat-control-plane                     1/1     Running   0          60s
# kindnet-xxxxx                                                      1/1     Running   0          60s
# kube-apiserver-primeiro-cluster-rocketseat-control-plane           1/1     Running   0          60s
# kube-controller-manager-primeiro-cluster-rocketseat-control-plane  1/1     Running   0          60s
# kube-proxy-xxxxx                                                   1/1     Running   0          60s
# kube-scheduler-primeiro-cluster-rocketseat-control-plane           1/1     Running   0          60s
```

## Gerenciamento de clusters

```bash
# Listar clusters Kind existentes
kind get clusters

# Deletar um cluster
kind delete cluster --name primeiro-cluster-rocketseat

# Ver contextos disponiveis no kubectl
kubectl config get-contexts

# Trocar de contexto (quando tem multiplos clusters)
kubectl config use-context kind-outro-cluster
```

## Proximo passo: criacao declarativa com workers

```yaml
# kind-config.yaml — configuracao declarativa
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
  - role: worker
```

```bash
# Criar cluster a partir do arquivo declarativo
kind create cluster --name meu-cluster --config kind-config.yaml

# Agora kubectl get nodes mostrara 3 nodes:
# - 1 control-plane
# - 2 workers
```

## Verificacao de saude do cluster

```bash
# Status geral dos componentes
kubectl get componentstatuses

# Informacoes detalhadas de um node
kubectl describe node primeiro-cluster-rocketseat-control-plane

# Ver todos os recursos em todos os namespaces
kubectl get all --all-namespaces
```