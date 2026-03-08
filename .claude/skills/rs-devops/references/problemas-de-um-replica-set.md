---
name: rs-devops-problemas-de-um-replica-set
description: "Applies Kubernetes Deployment over ReplicaSet patterns when managing application updates. Use when user asks to 'update container image', 'do zero-downtime deploy', 'rollback deployment', 'use replicaset vs deployment', or 'fix pod image not updating'. Enforces Deployment usage for image updates. Make sure to use this skill whenever deploying or updating applications in Kubernetes. Not for Docker-only deployments, CI/CD pipeline configuration, or Terraform."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-deployments
  tags: [kubernetes, replicaset, deployment, rolling-update, zero-downtime, rollback]
---

# Problemas de um ReplicaSet

> ReplicaSet controla replicas, nao implantacao — nunca use ReplicaSet diretamente para gerenciar atualizacoes de imagem.

## Rules

1. **Nunca use ReplicaSet diretamente para deploys** — use Deployment, porque ReplicaSet nao suporta troca de tag de imagem sem deletar e recriar o objeto
2. **Nunca use tag `latest` em producao** — use tags associadas ao hash do commit, porque `latest` e imprevisivel e impede rollback confiavel
3. **Prefira zero downtime deployment** — use Deployment (que gerencia ReplicaSet internamente), porque deletar e recriar ReplicaSet causa indisponibilidade de 30-40s dependendo da aplicacao
4. **Entenda que `kubectl apply` em ReplicaSet nao atualiza pods existentes** — o ReplicaSet e um controlador de replicas, nao de implantacao; ele so garante o numero de pods, nao a versao da imagem

## Como funciona o problema

### Tag muda, pods nao atualizam

```yaml
# replicaset.yaml - voce muda a tag aqui...
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    spec:
      containers:
      - name: nginx
        image: nginx:1.27-alpine-slim  # mudou de alpine3.20-slim
```

```bash
# kubectl apply aceita, mas pods continuam com a tag antiga
kubectl apply -f replicaset.yaml
# "configured" — mas pods NAO foram recriados

# Unica opcao com ReplicaSet puro:
kubectl delete rs nginx
kubectl apply -f replicaset.yaml
# Funciona, mas causa INDISPONIBILIDADE total
```

## Example

**Before (ReplicaSet direto — causa downtime):**
```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: user-skillz
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-skillz
  template:
    spec:
      containers:
      - name: user-skillz
        image: user-skillz:abc123f
```

**After (Deployment — zero downtime):**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-skillz
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-skillz
  template:
    spec:
      containers:
      - name: user-skillz
        image: user-skillz:abc123f
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa trocar tag de imagem | Use Deployment, nunca ReplicaSet direto |
| Precisa controlar numero de replicas | Deployment faz isso via ReplicaSet interno |
| Precisa de rollback rapido | Deployment tem `kubectl rollout undo` |
| Precisa de zero downtime | Deployment com rolling update strategy |
| Estudando ReplicaSet para entender K8s | OK usar direto, mas nunca em producao |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `kind: ReplicaSet` para deploys de producao | `kind: Deployment` |
| `image: nginx:latest` | `image: nginx:1.27-alpine-slim` ou tag do commit |
| Deletar e recriar ReplicaSet para trocar tag | `kubectl set image deployment/name container=image:newtag` |
| Deploy manual em janelas de baixo acesso | Rolling update via Deployment (zero downtime) |

## Troubleshooting

### kubectl apply nao atualiza a imagem dos pods no ReplicaSet
**Symptom:** `kubectl apply` retorna "configured" mas pods continuam com a imagem antiga
**Cause:** ReplicaSet e um controlador de replicas, nao de implantacao — ele nao recria pods existentes quando a spec muda
**Fix:** Usar Deployment em vez de ReplicaSet; com Deployment, `kubectl apply` ou `kubectl set image` faz rolling update automaticamente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

# Deep Explanation: Problemas de um ReplicaSet

## Por que o ReplicaSet nao atualiza pods existentes?

O ReplicaSet e um **controlador de replicas**, nao um **objeto de implantacao**. Sua unica responsabilidade e garantir que o numero desejado de pods esteja rodando. Quando voce faz `kubectl apply` com uma nova tag de imagem, o ReplicaSet registra a mudanca na especificacao, mas nao recria os pods existentes — porque eles ja estao rodando e o numero de replicas esta correto.

O instrutor demonstrou isso na pratica: apos mudar a tag de `alpine3.20-slim` para `1.27-alpine-slim` e aplicar o manifesto, o ReplicaSet reportou "configured", mas ao inspecionar o pod (via Labs > Edit no dashboard), a imagem continuava sendo `alpine3.20-slim`. Os pods so foram atualizados apos deletar o ReplicaSet inteiro e reaplicar.

## O ciclo real de tags em producao

O instrutor trouxe uma analogia pratica com o fluxo real de desenvolvimento:

1. Aplicacao "User Skillz" esta containerizada e no Docker Hub
2. Desenvolvedor faz commit → gera hash → primeiros caracteres viram a tag
3. Isso acontece **varias vezes por dia** em equipes ativas
4. Tags mudam constantemente: `...tag7` → `...tag8` → `...tag9`

Com ReplicaSet direto, cada mudanca de tag exigiria:
- `kubectl delete rs nome`
- `kubectl apply -f manifesto.yaml`
- Esperar pods subirem novamente

## O problema da indisponibilidade

O instrutor destacou cenarios concretos:
- **Nginx**: sobe quase instantaneamente, mas ainda fica offline brevemente
- **Aplicacao real**: pode levar 30-40 segundos para o container iniciar
- **Cenario de rollback**: versao 8 tem bug, precisa voltar para 7 — com ReplicaSet, precisa dropar tudo e resubir

Isso forca deploys em **janelas de baixo acesso** e cria um **fluxo muito manual**.

## O que vem depois: Deployment

O instrutor antecipou que o objeto Deployment:
- Usa ReplicaSet **por debaixo dos panos** (indiretamente)
- Cuida da parte de **implantacao** (troca de imagem, rolling update)
- Oferece **zero downtime deployment**

Por isso, ao longo do curso, o ReplicaSet e usado **indiretamente** via Deployment, nunca diretamente para gerenciar atualizacoes.

---

# Code Examples: Problemas de um ReplicaSet

## Exemplo 1: ReplicaSet com tag inicial

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:alpine3.20-slim
```

## Exemplo 2: Tentando trocar a tag (nao funciona)

```yaml
# Mudanca no manifesto:
image: nginx:1.27-alpine-slim  # era alpine3.20-slim
```

```bash
# Aplicar a mudanca
kubectl apply -f replicaset.yaml
# Output: replicaset.apps/nginx configured

# Verificar pods — AINDA com tag antiga
kubectl get pods
# nginx-xxxxx   1/1   Running   0   17m  ← sem recriacao

# Inspecionar pod individual
kubectl describe pod nginx-xxxxx | grep Image
# Image: nginx:alpine3.20-slim  ← NAO ATUALIZOU
```

## Exemplo 3: Unica solucao com ReplicaSet puro

```bash
# Deletar o ReplicaSet (causa indisponibilidade)
kubectl delete rs nginx
# replicaset.apps "nginx" deleted

# Todos os pods sao removidos neste momento — DOWNTIME

# Reaplicar o manifesto com nova tag
kubectl apply -f replicaset.yaml
# replicaset.apps/nginx created

# Agora os novos pods tem a tag correta
kubectl describe pod nginx-xxxxx | grep Image
# Image: nginx:1.27-alpine-slim  ← AGORA SIM
```

## Exemplo 4: Como deveria ser feito (com Deployment)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0  # zero downtime
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:alpine3.20-slim
```

```bash
# Trocar a tag — Deployment faz rolling update automaticamente
kubectl set image deployment/nginx nginx=nginx:1.27-alpine-slim
# deployment.apps/nginx image updated

# Pods sao substituidos gradualmente — SEM downtime
kubectl rollout status deployment/nginx
# Waiting for deployment "nginx" rollout to finish...
# deployment "nginx" successfully rolled out

# Rollback se necessario
kubectl rollout undo deployment/nginx
# deployment.apps/nginx rolled back
```

## Exemplo 5: Boa pratica de tags (hash do commit)

```bash
# No CI/CD pipeline:
COMMIT_HASH=$(git rev-parse --short HEAD)  # ex: abc123f
docker build -t user-skillz:${COMMIT_HASH} .
docker push user-skillz:${COMMIT_HASH}

# No manifesto Kubernetes:
# image: user-skillz:abc123f  ← tag rastreavel ao commit

# NUNCA:
# image: user-skillz:latest   ← imprevisivel, impossivel rastrear
```
