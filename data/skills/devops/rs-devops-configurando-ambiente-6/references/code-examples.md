# Code Examples: Configurando Ambiente Kubernetes Local

## Instalacao completa do ambiente (todos os SOs)

### kubectl — macOS

```bash
brew install kubectl
kubectl version --client
```

### kubectl — Linux

```bash
# Download do binario
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Tornar executavel
chmod +x kubectl

# Mover para PATH
sudo mv kubectl /usr/local/bin/

# Verificar
kubectl version --client
```

### kubectl — Windows

```powershell
choco install kubernetes-cli
# ou
winget install Kubernetes.kubectl
```

### kind — macOS

```bash
brew install kind
kind --version
```

### kind — Linux

```bash
# Para AMD64/x86_64
curl -Lo ./kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
kind --version
```

### kind — Windows

```powershell
choco install kind
```

## Gerenciamento de contextos kubectl

```bash
# Listar todos os contextos configurados
kubectl config get-contexts

# Saida exemplo:
# CURRENT   NAME              CLUSTER           AUTHINFO          NAMESPACE
# *         kind-meu-cluster  kind-meu-cluster  kind-meu-cluster
#           eks-producao      eks-producao      eks-producao-user

# Trocar contexto (apontar para outro cluster)
kubectl config use-context eks-producao

# Ver qual contexto esta ativo agora
kubectl config current-context
# eks-producao

# Voltar para o cluster local
kubectl config use-context kind-meu-cluster
```

## Comandos basicos kubectl apos ter um cluster

```bash
# Ver nodes do cluster
kubectl get nodes

# Ver pods em todos os namespaces
kubectl get pods -A

# Ver todos os recursos
kubectl get all
```

## Verificacao completa do ambiente

```bash
#!/bin/bash
echo "=== Verificando ambiente Kubernetes local ==="

echo -n "Docker: "
docker --version 2>/dev/null || echo "NAO INSTALADO"

echo -n "kubectl: "
kubectl version --client --short 2>/dev/null || echo "NAO INSTALADO"

echo -n "kind: "
kind --version 2>/dev/null || echo "NAO INSTALADO"

echo -n "k9s: "
k9s version --short 2>/dev/null || echo "NAO INSTALADO (opcional)"

echo ""
echo "Clusters kind ativos:"
kind get clusters 2>/dev/null || echo "Nenhum"

echo ""
echo "Contextos kubectl:"
kubectl config get-contexts 2>/dev/null || echo "Nenhum configurado"
```

## Links de referencia

| Ferramenta | URL |
|-----------|-----|
| Kubernetes docs | https://kubernetes.io/ |
| kubectl install | https://kubernetes.io/docs/tasks/tools/ |
| kind | https://kind.sigs.k8s.io/ |
| Lens | https://k8slens.dev/ |
| k9s | https://k9scli.io/ |
| minikube | https://minikube.sigs.k8s.io/ |
| k3s | https://k3s.io/ |