---
name: rs-devops-subindo-o-nosso-primeiro-container-no-k-8-s
description: "Applies Kubernetes pod creation best practices with versioned images, dedicated namespaces, and declarative manifests. Use when user asks to 'create a pod', 'run container in Kubernetes', 'deploy to K8s', 'use kubectl run', or 'write pod manifest'. Enforces explicit image tags, namespace isolation, declarative YAML over imperative commands, and controller usage for production. Make sure to use this skill whenever creating standalone pods or writing basic pod manifests in Kubernetes. Not for Deployment/ReplicaSet configuration, Service exposure, or Helm charts."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-pods
  tags: [kubernetes, pod, kubectl, declarative, namespace, image-tag, container-runtime]
---

# Subindo Containers no Kubernetes

> Ao criar pods no Kubernetes, sempre use imagens versionadas com tag explicita, namespaces dedicados, e prefira a abordagem declarativa.

## Rules

1. **Sempre especifique a tag da imagem** — `nginx:alpine3.20-slim` nao `nginx` ou `nginx:latest`, porque sem tag o Kubernetes baixa `latest` que e imprevisivel e impossivel de rastrear em rollbacks
2. **Nunca use o namespace default para aplicacoes** — crie namespaces dedicados, porque o namespace default mistura workloads e dificulta organizacao e RBAC
3. **Prefira declarativo sobre imperativo** — use manifests YAML versionados no Git em vez de `kubectl run`, porque comandos imperativos nao deixam rastro e nao sao reproduziveis
4. **Entenda que pods sao efemeros** — pods sem controlador (Deployment/ReplicaSet) sao descartados permanentemente em caso de falha, porque o pod e a menor unidade hierarquica do K8s e nao tem auto-recuperacao
5. **Use controladores para aplicacoes reais** — Deployment + ReplicaSet garantem que o pod seja recriado automaticamente, porque pods sozinhos nao tem garantia de estabilidade
6. **Verifique logs apos criacao** — `kubectl logs <pod-name>` para confirmar que o container iniciou corretamente, porque o status Running nao garante que a aplicacao esta saudavel

## How to write

### Criacao imperativa (apenas para testes rapidos)

```bash
# Somente para exploracao — nunca em producao
kubectl run nginx --image=nginx:alpine3.20-slim
kubectl get pods
kubectl logs nginx
```

### Criacao declarativa (recomendada)

```yaml
# pod.yaml — versionado no Git
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  namespace: minha-app  # Nunca use default
spec:
  containers:
    - name: nginx
      image: nginx:alpine3.20-slim  # Tag explicita obrigatoria
```

```bash
kubectl apply -f pod.yaml
```

### Verificacao do pod

```bash
kubectl get pods -n minha-app
kubectl describe pod nginx -n minha-app
kubectl logs nginx -n minha-app
kubectl get events -n minha-app
```

## Example

**Before (pratica ruim):**
```bash
kubectl run nginx --image=nginx
# Sem tag, namespace default, sem versionamento, sem controlador
```

**After (com boas praticas):**
```yaml
# k8s/nginx-pod.yaml — versionado no repositorio
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  namespace: web-apps
spec:
  containers:
    - name: nginx
      image: nginx:alpine3.20-slim
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Teste rapido local | `kubectl run` e aceitavel, delete depois |
| Qualquer ambiente compartilhado | Manifest YAML + namespace dedicado |
| Aplicacao que precisa estar sempre disponivel | Use Deployment, nao Pod direto |
| Imagem propria em registry privado | Configure imagePullSecrets no cluster |
| Precisa ver o que aconteceu no pod | `kubectl describe pod` para eventos, `kubectl logs` para stdout |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `kubectl run app --image=myapp` | `kubectl apply -f pod.yaml` com tag explicita |
| Deploy no namespace `default` | Crie namespace dedicado por projeto/equipe |
| Pod sozinho em producao | Deployment com ReplicaSet |
| `image: nginx:latest` | `image: nginx:alpine3.20-slim` (tag fixa) |
| Ignorar eventos apos criacao | `kubectl get events` para verificar pull/start |


## Troubleshooting

### Pod fica em status ImagePullBackOff
**Symptom:** `kubectl get pods` mostra status ImagePullBackOff ou ErrImagePull
**Cause:** Imagem nao existe no registry, tag esta errada, ou registry privado sem credenciais configuradas
**Fix:** Verifique nome e tag da imagem, confirme que existe no Docker Hub (ou registry privado), e configure `imagePullSecrets` se necessario

### Pod criado mas nao aparece no kubectl get pods
**Symptom:** `kubectl get pods` retorna "No resources found"
**Cause:** Pod foi criado em namespace diferente do que esta sendo consultado
**Fix:** Use `kubectl get pods -n <namespace>` ou `kubectl get pods --all-namespaces` para encontrar

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Subindo Containers no Kubernetes

## Hierarquia de objetos no Kubernetes

O instrutor apresenta uma "escada" de objetos dentro de Workloads no Kubernetes:
- **Pod** — menor unidade, onde o container de fato roda
- **Deployment** — controlador que gerencia pods
- **DaemonSet** — garante um pod por node
- **StatefulSet** — para aplicacoes com estado
- **ReplicaSet** — garante N replicas de um pod
- **ReplicationController** — versao legada do ReplicaSet
- **CronJob/Job** — execucoes pontuais ou agendadas

O pod e a base de tudo. Dentro de um pod e que o container e executado. Exemplo pratico: o CoreDNS que roda dentro do cluster e um pod com um container dentro.

## Por que o Kubernetes exige containers

Dentro de um cluster Kubernetes, nao e possivel rodar o "executavel" da aplicacao diretamente. O que se executa e a **imagem de container** da aplicacao. Pre-requisito: a aplicacao precisa estar containerizada.

## Container Registry e Docker Hub

O Kubernetes, por padrao, busca imagens no Docker Hub. Se a imagem for privada (registry corporativo), e necessario configurar credenciais no cluster via `imagePullSecrets`. O Docker Hub e o registry publico mais utilizado.

## Imperativo vs Declarativo

Este e um tema que permeia todo o Kubernetes:

- **Imperativo**: comandos diretos no terminal (`kubectl run`). Rapido para testes, mas sem rastreabilidade.
- **Declarativo**: manifests YAML aplicados com `kubectl apply`. Permite versionamento no Git, auditoria e reproducibilidade.

O instrutor enfatiza: "a recomendada sempre e utilizar o declarativo para ter todo o laco" — referindo-se ao ciclo completo de versionamento e rastreabilidade.

## Por que tags importam

A analogia do instrutor: a tag da imagem e "muito parecida com a tag do commit" no Git. Voce tem uma hash, um versionamento. Sem tag, o Kubernetes baixa `latest`, que pode mudar a qualquer momento e quebrar deployments de forma imprevisivel.

## Natureza efemera do pod

O instrutor destaca dois problemas criticos de um pod criado imperativamente sem controlador:

1. **Sem versionamento** — o comando foi executado no terminal, nao esta em nenhum arquivo
2. **Sem controlador** — se o pod falhar, ninguem o recria. O pod e "100% descartavel" por natureza

Controladores como Deployment e ReplicaSet resolvem o segundo problema garantindo que o pod seja recriado automaticamente.

## Fluxo interno do Kubernetes ao criar um pod

Os eventos mostrados pelo instrutor revelam a sequencia:
1. **Pull** — download da imagem (equivalente a `docker pull`, mas o K8s e agnostico ao runtime)
2. **Created** — container criado
3. **Started** — container iniciado e em execucao

O Kubernetes nao usa Docker diretamente; ele e agnostico ao container runtime (pode usar containerd, CRI-O, etc.).

## Namespace default

O instrutor criou o pod no namespace `default` propositalmente como anti-exemplo. Aplicacoes nao devem rodar no namespace default porque:
- Dificulta organizacao e isolamento
- Complica politicas de RBAC
- Mistura workloads de diferentes propositos

---

# Code Examples: Subindo Containers no Kubernetes

## 1. Explorando o kubectl

```bash
# Ver documentacao e comandos disponiveis
kubectl
# O output mostra os "Basic Commands" incluindo `run`
```

## 2. Criacao imperativa de um pod

```bash
# Formato: kubectl run <nome-do-pod> --image=<imagem>:<tag>
kubectl run nginx --image=nginx:alpine3.20-slim
# Output: pod/nginx created
```

O `kubectl run` sempre cria um objeto **Pod** por default — nao e necessario especificar o tipo de objeto.

### Escolha da imagem

No Docker Hub, o instrutor filtrou por "alpine" e escolheu `alpine3.20-slim` (~5MB). A escolha de imagens slim/alpine reduz:
- Tempo de pull
- Superficie de ataque (menos pacotes)
- Uso de disco no node

## 3. Verificando o pod criado

```bash
# Listar pods (ambas formas funcionam)
kubectl get po
kubectl get pods

# Output exemplo:
# NAME    READY   STATUS    RESTARTS   AGE
# nginx   1/1     Running   0          30s
```

## 4. Verificando eventos do pod

```bash
kubectl get events
# Mostra a sequencia:
# - Pulled image "nginx:alpine3.20-slim"
# - Created container nginx
# - Started container nginx
```

No Lens (UI), o mesmo pode ser visto em: Pod > Events/Overview.

## 5. Verificando logs

```bash
# Via terminal
kubectl logs nginx

# Via Lens: clicar no pod > Pod Logs
```

## 6. Versao declarativa equivalente (boa pratica)

```yaml
# nginx-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  namespace: web-apps
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx:alpine3.20-slim
      ports:
        - containerPort: 80
```

```bash
# Criar namespace primeiro
kubectl create namespace web-apps

# Aplicar o manifest
kubectl apply -f nginx-pod.yaml

# Verificar
kubectl get pods -n web-apps
kubectl describe pod nginx -n web-apps
kubectl logs nginx -n web-apps
```

## 7. Limpeza

```bash
# Deletar pod imperativo
kubectl delete pod nginx

# Deletar pod declarativo
kubectl delete -f nginx-pod.yaml
```

## Comparacao: Imperativo vs Declarativo

| Aspecto | Imperativo | Declarativo |
|---------|-----------|-------------|
| Comando | `kubectl run nginx --image=nginx:tag` | `kubectl apply -f pod.yaml` |
| Rastreabilidade | Nenhuma (terminal) | Git (versionado) |
| Reproducibilidade | Manual | Automatica |
| Uso recomendado | Testes rapidos | Todos os ambientes |
| Rollback | Impossivel | `git revert` + `kubectl apply` |
