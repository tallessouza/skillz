# Code Examples: Tag Imutável e Rollback no Kubernetes

## 1. Alteração do imagePullPolicy no deployment

```yaml
# ANTES (problemático com tags imutáveis)
spec:
  containers:
    - name: app
      image: registry/app:v1
      imagePullPolicy: Always  # Faz pull toda vez, mesmo se já existe

# DEPOIS (correto para tags imutáveis)
spec:
  containers:
    - name: app
      image: registry/app:v2
      imagePullPolicy: IfNotPresent  # Só faz pull se a imagem não existir no node
```

## 2. Build e push com nova tag

```bash
# Build com tag versionada (nunca sobrescrever tag existente)
docker build -t usuario/app:v2 .

# Push para o registry
docker push usuario/app:v2
```

O build é rápido quando há cache e a alteração foi apenas no código fonte (layers anteriores cacheadas).

## 3. Atualizar manifesto e aplicar

```yaml
# deployment.yaml — alterar a tag
spec:
  containers:
    - name: app
      image: usuario/app:v2  # Era v1, agora v2
      imagePullPolicy: IfNotPresent
```

```bash
# Aplicar as mudanças
kubectl apply -f k8s/
# Output esperado:
# service/app unchanged
# deployment.apps/app configured
```

## 4. Verificar histórico de revisões

```bash
kubectl rollout history deployment/app -n primeira-aplicacao
# Output:
# REVISION  CHANGE-CAUSE
# 2         <none>
# 3         <none>
# 4         <none>
```

## 5. Rollback para revisão específica

```bash
# Voltar para revisão 3
kubectl rollout undo deployment/app --to-revision=3 -n primeira-aplicacao
```

## 6. Rollback para revisão imediatamente anterior

```bash
# Sem --to-revision, volta para a última revisão antes da atual
kubectl rollout undo deployment/app -n primeira-aplicacao
# Output: deployment.apps/app rolled back
```

## 7. Verificar o que está rodando após rollback

```bash
# Via kubectl (editar/visualizar o deployment)
kubectl edit deployment/app -n primeira-aplicacao
# Verificar o campo image: deve mostrar a tag da versão anterior (ex: v1)

# Via port-forward para testar
kubectl port-forward svc/app 3000:3000 -n primeira-aplicacao
# Acessar http://localhost:3000/exemplo-k8s
```

## 8. Fluxo completo: deploy + rollback + declaração

```bash
# === DEPLOY ===
# 1. Build
docker build -t usuario/app:v2 .

# 2. Push
docker push usuario/app:v2

# 3. Atualizar manifesto
# Editar deployment.yaml: image: usuario/app:v2

# 4. Apply
kubectl apply -f k8s/

# === PROBLEMA DETECTADO ===
# 5. Rollback emergencial
kubectl rollout undo deployment/app -n primeira-aplicacao

# === SINCRONIZAR ESTADO ===
# 6. Atualizar manifesto para refletir rollback
# Editar deployment.yaml: image: usuario/app:v1

# 7. Commitar
git add deployment.yaml
git commit -m "fix: rollback to v1, v2 had controller bug"

# Agora o YAML reflete o estado real do cluster
```

## 9. O que acontece no cluster durante deploy (observado no Lens)

```
Tempo 0: Pods v1 rodando (2 réplicas)
Tempo 1: Pod v2 criado (status: ContainerCreating) — pull da imagem v2
Tempo 2: Pod v2 rodando — Pod v1 (1) terminado
Tempo 3: Pod v2 (2) criado
Tempo 4: Pod v2 (2) rodando — Pod v1 (2) terminado
Tempo 5: Apenas pods v2 rodando

Durante: Pode haver v1 e v2 rodando simultaneamente (rolling update)
```

## 10. Evento do cluster no rollback (com IfNotPresent)

```
# Evento observado no Lens/kubectl:
# "Container image usuario/app:v1 already present on machine"
# Não fez pull — rollback instantâneo porque a imagem já estava no cache do node
```