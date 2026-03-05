# Code Examples: O que e Kubernetes

## Nota sobre esta aula

Esta aula e 100% teorica e conceitual — nao contem exemplos de codigo. O instrutor explica que o modulo comeca com teoria antes de entrar na pratica.

No entanto, os conceitos mencionados se traduzem nos seguintes padroes que serao usados nas aulas praticas:

## Manifesto declarativo (conceito mencionado)

O instrutor menciona que no Kubernetes voce declara o estado desejado em manifestos. Um exemplo basico de como isso se materializa:

```yaml
# Exemplo conceitual de manifesto Kubernetes
# "Eu tenho ali a aplicacao A e eu quero que ela execute com tais caracteristicas"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aplicacao-a
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aplicacao-a
  template:
    metadata:
      labels:
        app: aplicacao-a
    spec:
      containers:
        - name: aplicacao-a
          image: aplicacao-a:1.0.0
          ports:
            - containerPort: 3000
```

Este manifesto declara: "quero 3 replicas da aplicacao-a rodando na porta 3000". O Kubernetes garante que esse estado seja mantido.

## Modo imperativo vs declarativo (mencionado pelo instrutor)

```bash
# Imperativo — roda um comando e executa (nao recomendado para producao)
kubectl run aplicacao-a --image=aplicacao-a:1.0.0 --port=3000

# Declarativo — aplica um manifesto (recomendado)
kubectl apply -f deployment.yaml
```

O instrutor deixa claro: "o ideal e ja no modo declarativo".

## CRI — Container Runtime Interface (mencionado)

O Kubernetes se conecta ao container runtime via CRI. Isso significa que qualquer runtime compativel funciona:

```
Kubernetes (kubelet)
       |
       v
      CRI (Container Runtime Interface)
       |
       ├── containerd (padrao atual)
       ├── CRI-O
       └── (qualquer runtime compativel com CRI)
```

O Docker foi removido como runtime direto no K8s 1.24, mas imagens Docker continuam funcionando porque o formato de imagem (OCI) e padrao.

## Servicos gerenciados vs self-hosted (mencionado)

```
# Gerenciado (paga gerenciamento do control plane)
AWS  → EKS (Elastic Kubernetes Service)
GCP  → GKE (Google Kubernetes Engine)
Azure → AKS (Azure Kubernetes Service)

# Self-hosted (gratuito, voce gerencia tudo)
kubeadm → Setup manual do cluster
k3s     → Kubernetes leve para edge/dev
kind    → Kubernetes in Docker (local dev)
minikube → Cluster local para aprendizado
```