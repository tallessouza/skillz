# Code Examples: Como Executar um Cluster Kubernetes

## Nota sobre esta aula

Esta aula e conceitual/decisional — nao contem codigo. Os exemplos abaixo ilustram os proximos passos praticos que o instrutor menciona.

## Execucao local (ferramentas comuns)

### Minikube
```bash
# Instalar minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Criar cluster local
minikube start

# Verificar status
minikube status
```

### Kind (Kubernetes in Docker)
```bash
# Criar cluster
kind create cluster --name meu-cluster

# Listar clusters
kind get clusters

# Deletar cluster
kind delete cluster --name meu-cluster
```

### K3d (K3s in Docker)
```bash
# Criar cluster
k3d cluster create meu-cluster

# Listar clusters
k3d cluster list

# Deletar cluster
k3d cluster delete meu-cluster
```

## Servicos gerenciados (visao geral de criacao)

### EKS com Terraform (mencionado pelo instrutor como proximo passo)
```hcl
# Exemplo simplificado — sera detalhado em aulas futuras
resource "aws_eks_cluster" "main" {
  name     = "meu-cluster"
  role_arn = aws_iam_role.eks.arn

  vpc_config {
    subnet_ids = var.subnet_ids
  }
}
```

### GKE com gcloud
```bash
gcloud container clusters create meu-cluster \
  --zone us-central1-a \
  --num-nodes 3
```

### AKS com az cli
```bash
az aks create \
  --resource-group meu-rg \
  --name meu-cluster \
  --node-count 3
```

## Interagindo com qualquer cluster (kubectl)

```bash
# Verificar conexao com o cluster
kubectl cluster-info

# Listar nodes
kubectl get nodes

# Listar todos os recursos
kubectl get all --all-namespaces
```

O kubectl funciona igualmente para qualquer modelo de execucao (local, gerenciado, auto-gerenciado) — essa e a portabilidade do Kubernetes em acao.