---
name: rs-devops-associando-pvc-aplicacao
description: "Applies Kubernetes Persistent Volume Claim (PVC) mounting patterns when configuring deployments with persistent storage. Use when user asks to 'mount a volume', 'persist data in k8s', 'configure PVC in deployment', 'add storage to pod', or 'keep files after pod restart'. Ensures correct volumeMounts and volumes configuration in deployment manifests. Make sure to use this skill whenever writing or modifying Kubernetes deployments that need persistent storage. Not for StorageClass creation, PV provisioning, or StatefulSet configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-storage
  tags: [kubernetes, github-actions, ci-cd, storage]
---

# Associando PVC na Aplicação Kubernetes

> Configure volumes persistentes no deployment para que dados sobrevivam ao ciclo de vida dos pods.

## Rules

1. **volumeMounts fica dentro do container** — declare dentro de `spec.containers[].volumeMounts`, porque é o container que monta o volume no seu filesystem
2. **volumes fica fora do container** — declare em `spec.template.spec.volumes`, no mesmo nível de `containers`, porque o volume pertence ao pod, não ao container
3. **O name deve coincidir** — `volumeMounts[].name` deve ser identico a `volumes[].name`, porque é assim que o Kubernetes associa mount ao volume
4. **mountPath aponta para o diretório de escrita** — use o path onde a aplicação escreve dados (ex: `/usr/source/app/uploads`), porque montar no workdir inteiro pode sobrescrever arquivos da imagem
5. **Dados persistidos sobrevivem a deletes de pod** — com PVC, mesmo deletando todos os pods, os dados permanecem, porque o volume está apartado da aplicação
6. **Sem volume, cada réplica é isolada** — arquivo criado em um pod não existe nos outros, porque cada container tem seu próprio filesystem efêmero

## How to write

### volumeMounts no container

```yaml
spec:
  containers:
    - name: app
      image: app:latest
      resources:
        requests:
          cpu: "100m"
          memory: "128Mi"
      volumeMounts:
        - name: app-data
          mountPath: /usr/source/app/uploads
```

### volumes no pod (referenciando o PVC)

```yaml
spec:
  template:
    spec:
      containers:
        - name: app
          # ... container config com volumeMounts acima
      volumes:
        - name: app-data
          persistentVolumeClaim:
            claimName: first-pvc
```

### Estrutura completa no deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
  namespace: primeira-aplicacao
spec:
  replicas: 6
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
    spec:
      containers:
        - name: app
          image: app:latest
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
          volumeMounts:
            - name: app-data
              mountPath: /usr/source/app/uploads
      volumes:
        - name: app-data
          persistentVolumeClaim:
            claimName: first-pvc
```

## Example

**Before (sem volume — dados efêmeros por pod):**
```yaml
spec:
  containers:
    - name: app
      image: app:latest
      resources:
        requests:
          cpu: "100m"
          memory: "128Mi"
      # Sem volumeMounts — arquivos criados morrem com o pod
```

**After (com PVC — dados persistidos entre pods):**
```yaml
spec:
  containers:
    - name: app
      image: app:latest
      resources:
        requests:
          cpu: "100m"
          memory: "128Mi"
      volumeMounts:
        - name: app-data
          mountPath: /usr/source/app/uploads
  volumes:
    - name: app-data
      persistentVolumeClaim:
        claimName: first-pvc
```

## Heuristics

| Situação | Faça |
|----------|------|
| Aplicação faz upload de arquivos | Use PVC com mountPath no diretório de uploads |
| Banco de dados em container | Use PVC montando no data dir do banco (ex: `/var/lib/postgresql/data`) |
| Dados temporários compartilhados entre réplicas | Use emptyDir (volume efêmero) |
| Dados que precisam sobreviver a redeploy | Use PVC (volume persistente) |
| Não sabe o mountPath | Consulte o Dockerfile da imagem para ver o WORKDIR |
| mountPath aponta para o workdir raiz | Monte em subdiretório (ex: `/app/uploads`) para não sobrescrever arquivos da imagem |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| `volumeMounts` fora de `containers[]` | `volumeMounts` dentro de cada container que precisa do volume |
| `volumes` dentro de `containers[]` | `volumes` no nível de `spec.template.spec` |
| Names diferentes entre volumeMounts e volumes | Mesmo `name` em ambos |
| Montar no workdir raiz `/usr/source/app` | Montar em subdiretório `/usr/source/app/uploads` |
| Ignorar persistência e confiar no filesystem do pod | Usar PVC para qualquer dado que precisa sobreviver ao pod |

## Verificação

```bash
# Verificar se o PVC está bound
kubectl get pvc -n <namespace>

# Verificar se o pod montou o volume
kubectl describe pod <pod-name> -n <namespace>
# Procure pela seção "Volumes" e "Mounts"

# Testar persistência: criar arquivo, deletar pod, verificar em outro pod
kubectl exec -it <pod> -n <ns> -- sh -c "echo teste > /usr/source/app/uploads/test.txt"
kubectl delete pod <pod> -n <ns>
kubectl exec -it <novo-pod> -n <ns> -- cat /usr/source/app/uploads/test.txt
```

## Troubleshooting

### Pod falha ao montar PVC com erro de volume not found
**Symptom:** Pod fica em Pending com evento de volume nao encontrado
**Cause:** O name em volumeMounts nao corresponde ao name em volumes, ou o PVC referenciado nao existe
**Fix:** Verifique que `volumeMounts[].name` e `volumes[].name` sao identicos e que o PVC esta Bound com `kubectl get pvc -n <ns>`

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-associando-o-pvc-na-nossa-aplicacao/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-associando-o-pvc-na-nossa-aplicacao/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
