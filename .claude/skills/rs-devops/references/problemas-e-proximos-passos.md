---
name: rs-devops-problemas-e-proximos-passos
description: "Applies Kubernetes controller patterns when designing pod lifecycle management. Use when user asks to 'create pod', 'ensure pod availability', 'handle pod failure', 'use deployment vs pod', or 'understand kubernetes controllers'. Enforces Deployment/ReplicaSet usage over bare pods. Make sure to use this skill whenever creating workloads in Kubernetes. Not for Docker containers, CI/CD pipelines, or Terraform."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-controllers
  tags: [kubernetes, pods, deployment, replicaset, controllers, ephemeral, availability]
---

# Pods Efêmeros e Controladores Kubernetes

> Nunca execute pods isolados em producao — use controllers (ReplicaSet/Deployment) para garantir redundancia e auto-recuperacao.

## Conceito central

Pods sao 100% efemeros e descartaveis. Um pod deletado manualmente NAO e recriado automaticamente. Somente controllers (ReplicaSet, Deployment) garantem que o numero desejado de replicas esteja sempre rodando.

## Rules

1. **Nunca crie pods bare em producao** — use Deployment ou ReplicaSet, porque um pod isolado que morre nao e recriado automaticamente
2. **Defina replicas >= 2 para disponibilidade** — um unico pod significa downtime durante falhas, porque entre a morte e a recriacao voce fica indisponivel
3. **Pod e a menor unidade do Kubernetes** — ele nao tem logica de auto-recuperacao, porque essa responsabilidade pertence aos controllers acima dele na hierarquia
4. **Declare o estado desejado, nao o imperativo** — o controller verifica continuamente se o numero de pods rodando corresponde ao declarado, porque Kubernetes e declarativo

## Decision framework

| Situacao | Use |
|----------|-----|
| Teste local rapido, debug | Pod bare (kubectl run) OK |
| Qualquer carga em producao | Deployment (com replicas >= 2) |
| Workload stateless | Deployment |
| Workload stateful | StatefulSet |
| Job unico (batch) | Job/CronJob |

## Hierarquia de objetos

```
Deployment (controla)
  └── ReplicaSet (garante N replicas)
       └── Pod (unidade minima, efemero)
```

O Deployment gerencia ReplicaSets. O ReplicaSet garante que exatamente N pods estejam rodando. Se um pod morre ou e deletado, o ReplicaSet cria outro.

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `kind: Pod` em producao | `kind: Deployment` com `replicas: 2+` |
| `replicas: 1` para servicos criticos | `replicas: 2` minimo para disponibilidade |
| Deletar pod esperando recriacao automatica (sem controller) | Usar Deployment — ele recria automaticamente |
| Gerenciar pods manualmente com scripts | Declarar estado desejado no manifesto YAML |

## Exemplo

**Errado (pod bare — nao se recupera):**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: minha-app
spec:
  containers:
    - name: app
      image: minha-app:1.0
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 200m
          memory: 256Mi
```

**Correto (Deployment com replicas):**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minha-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: minha-app
  template:
    metadata:
      labels:
        app: minha-app
    spec:
      containers:
        - name: app
          image: minha-app:1.0
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 200m
              memory: 256Mi
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Usuario pede `kind: Pod` | Perguntar se e teste ou producao; sugerir Deployment |
| Manifesto sem `replicas` | Adicionar `replicas: 2` minimo |
| Pod deletado e nao volta | Verificar se existe controller gerenciando-o |
| Servico precisa de zero-downtime | `replicas >= 2` + readiness probes |

## Troubleshooting

### Pod deletado nao volta automaticamente
**Symptom:** Pod desaparece apos `kubectl delete pod` e nao e recriado
**Cause:** Pod foi criado diretamente (bare pod) sem controller (Deployment/ReplicaSet) gerenciando-o
**Fix:** Criar Deployment com `replicas >= 2` em vez de pod bare; o ReplicaSet do Deployment recria pods automaticamente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

# Deep Explanation: Pods Efêmeros e Controladores Kubernetes

## Por que pods não se auto-recuperam?

O instrutor demonstra ao vivo: deleta um pod com `kubectl delete` e ele simplesmente desaparece. Não volta. Isso surpreende quem viu a teoria antes, porque a expectativa é que "se eu coloquei um pod para rodar no cluster, ele sempre será executado". Mas o objeto Pod em si **não tem essa característica**.

O Pod é a **menor unidade hierárquica** do Kubernetes. Ele não possui lógica de reconciliação. Ele é puramente efêmero e descartável. A analogia é: o Pod é como um processo — se morre, morreu. Quem reinicia processos é o systemd, não o processo em si.

## O papel dos controllers

Controllers são objetos de nível superior que observam o estado do cluster e reconciliam com o estado desejado:

- **ReplicaSet**: Garante que exatamente N pods estejam rodando. Se detecta 4 quando deveria ter 5, cria mais um. Se detecta 6, remove um.
- **Deployment**: Gerencia ReplicaSets. Adiciona capacidades como rolling updates, rollbacks, e versionamento de configuração.

O instrutor enfatiza: "se é para rodar com 5 pods, ele a todo instante vai verificar se tem 5 pods ali sendo executados."

## O problema da disponibilidade

Com um único pod:
1. Pod morre (crash, OOM, node failure, deleção manual)
2. Até ser recriado (se houver controller), há **downtime**
3. Se não houver controller, **nunca é recriado**

Com múltiplos pods via Deployment:
1. Um pod morre
2. Os outros continuam servindo tráfego
3. O ReplicaSet detecta a diferença e cria um novo pod
4. Disponibilidade mantida

## Contexto da aula

Esta aula faz parte de uma progressão didática:
- Aulas anteriores: criação de pods, resources (requests/limits), cluster multi-nó, scheduling
- Esta aula: identifica o gap — pods bare não garantem disponibilidade
- Próximas aulas: ReplicaSet e Deployment como solução, depois ConfigMaps, networking

O instrutor deixa claro que ainda não abordou networking e config propositalmente ("é proposital, não estamos tentando gerar confusão").

## Comportamento observado vs esperado

| Ação | Esperado (teoria) | Real (pod bare) | Real (com Deployment) |
|------|-------------------|------------------|-----------------------|
| `kubectl delete pod X` | Pod recriado | Pod sumiu para sempre | Pod recriado pelo ReplicaSet |
| Node cai | Pod migra | Pod perdido | Scheduler coloca novo pod em outro node |
| OOM kill | Pod reinicia | Depende de restartPolicy | Controller + restartPolicy garantem |

---

# Code Examples: Pods Efêmeros e Controladores Kubernetes

## Demonstração da aula: deletar pod bare

O instrutor demonstra que um pod criado diretamente não é recriado após deleção:

```bash
# Listar pods
kubectl get pods

# Deletar um pod (duas formas equivalentes mostradas na aula)
kubectl delete pod minha-app

# Verificar — pod sumiu, não voltou
kubectl get pods
# Resultado: o pod não existe mais
```

## Pod bare (o que foi usado na aula)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: minha-app
  labels:
    app: minha-app
spec:
  containers:
    - name: app
      image: minha-app:1.0
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 200m
          memory: 256Mi
```

**Problema**: Se este pod for deletado (`kubectl delete pod minha-app`), ele desaparece permanentemente.

## Deployment (solução introduzida conceitualmente)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minha-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: minha-app
  template:
    metadata:
      labels:
        app: minha-app
    spec:
      containers:
        - name: app
          image: minha-app:1.0
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 200m
              memory: 256Mi
```

**Comportamento com Deployment:**

```bash
# Ver pods gerenciados pelo deployment
kubectl get pods
# NAME                         READY   STATUS    RESTARTS   AGE
# minha-app-7d4b8c6f9-abc12   1/1     Running   0          5m
# minha-app-7d4b8c6f9-def34   1/1     Running   0          5m
# minha-app-7d4b8c6f9-ghi56   1/1     Running   0          5m

# Deletar um pod
kubectl delete pod minha-app-7d4b8c6f9-abc12

# Verificar — ReplicaSet já criou um substituto
kubectl get pods
# NAME                         READY   STATUS    RESTARTS   AGE
# minha-app-7d4b8c6f9-def34   1/1     Running   0          6m
# minha-app-7d4b8c6f9-ghi56   1/1     Running   0          6m
# minha-app-7d4b8c6f9-jkl78   1/1     Running   0          3s  ← NOVO!
```

## ReplicaSet (gerenciado pelo Deployment)

```bash
# Ver o ReplicaSet criado pelo Deployment
kubectl get replicaset
# NAME                   DESIRED   CURRENT   READY   AGE
# minha-app-7d4b8c6f9   3         3         3       10m

# Descrever para ver o controle de réplicas
kubectl describe replicaset minha-app-7d4b8c6f9
# Replicas: 3 current / 3 desired
# Pods Status: 3 Running / 0 Waiting / 0 Succeeded / 0 Failed
```

## Escalar réplicas

```bash
# Aumentar para 5 pods
kubectl scale deployment minha-app --replicas=5

# Verificar — 2 novos pods sendo criados
kubectl get pods
# 5 pods listados, 2 com Age recente
```

## Verificar que o controller está reconciliando

```bash
# Em um terminal: watch nos pods
kubectl get pods -w

# Em outro terminal: deletar pods repetidamente
kubectl delete pod minha-app-7d4b8c6f9-def34

# No primeiro terminal: verá o pod sendo terminado e um novo aparecendo
# minha-app-7d4b8c6f9-def34   1/1   Terminating   0   10m
# minha-app-7d4b8c6f9-mno90   0/1   Pending       0   0s
# minha-app-7d4b8c6f9-mno90   1/1   Running       0   2s
```
