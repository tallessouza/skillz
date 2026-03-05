# Code Examples: Configurando Cluster Kind com Multiplos Nos

## Exemplo 1: Cluster minimo com 1 worker

### kind.yaml
```yaml
apiVersion: kind.x-k8s.io/v1alpha4
kind: Cluster
nodes:
  - role: control-plane
  - role: worker
```

### Criacao e verificacao
```bash
# Criar o cluster
kind create cluster --config kind.yaml --name segundo-cluster-skillz

# Verificar nos
kubectl get nodes
# NAME                                       STATUS   ROLES           AGE   VERSION
# segundo-cluster-skillz-control-plane   Ready    control-plane   1m    v1.27.3
# segundo-cluster-skillz-worker          Ready    <none>          1m    v1.27.3

# Verificar containers Docker
docker ps
# Mostra 2 containers: control-plane e worker
```

## Exemplo 2: Cluster com redundancia (2 control-planes + 2 workers)

### kind.yaml
```yaml
apiVersion: kind.x-k8s.io/v1alpha4
kind: Cluster
nodes:
  - role: control-plane
  - role: control-plane
  - role: worker
  - role: worker
```

### Criacao e verificacao
```bash
kind create cluster --config kind.yaml --name terceiro-cluster-skillz

kubectl get nodes
# NAME                                        STATUS   ROLES           AGE   VERSION
# terceiro-cluster-skillz-control-plane   Ready    control-plane   2m    v1.27.3
# terceiro-cluster-skillz-control-plane2  Ready    control-plane   2m    v1.27.3
# terceiro-cluster-skillz-worker          Ready    <none>          1m    v1.27.3
# terceiro-cluster-skillz-worker2         Ready    <none>          1m    v1.27.3

docker ps
# Mostra 5 containers: 2 control-planes, 2 workers, 1 HAProxy (load balancer)
```

## Exemplo 3: Ciclo completo (delete + create)

```bash
# Deletar cluster existente
kind delete cluster --name segundo-cluster-skillz
# Deleting cluster "segundo-cluster-skillz" ...
# Deleted nodes: ["segundo-cluster-skillz-control-plane" "segundo-cluster-skillz-worker"]

# Verificar que nao ha containers
docker ps
# Nenhum container Kind rodando

# Criar novo cluster
kind create cluster --config kind.yaml --name terceiro-cluster-skillz
```

## Exemplo 4: Escalando workers (adicionar mais nos)

Para adicionar mais workers, basta adicionar linhas ao YAML:

```yaml
apiVersion: kind.x-k8s.io/v1alpha4
kind: Cluster
nodes:
  - role: control-plane
  - role: control-plane
  - role: worker
  - role: worker
  - role: worker  # terceiro worker para mais capacidade
```

## Distribuicao de pods por tipo de no

### No control-plane rodam:
- etcd
- kube-apiserver
- kube-controller-manager
- kube-scheduler
- coredns

### Nos workers rodam:
- kube-proxy
- kindnet (CNI)
- Suas aplicacoes (deployments, pods)