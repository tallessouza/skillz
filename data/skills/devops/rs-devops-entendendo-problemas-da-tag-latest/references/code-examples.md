# Code Examples: Problemas da Tag Latest no Kubernetes

## Comandos demonstrados na aula

### Ver historico de rollout

```bash
kubectl rollout history deployment/appts -n primeira-aplicacao
```

Output esperado:
```
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```

### Rollback para versao anterior (undo simples)

```bash
kubectl rollout undo deployment/appts -n primeira-aplicacao
```

Volta para a revisao imediatamente anterior (revision 1 se voce esta na 2).

### Rollback para revisao especifica

```bash
kubectl rollout undo deployment/appts -n primeira-aplicacao --to-revision=1
```

Util quando voce esta na revision 5 e quer voltar para a revision 2, por exemplo.

## Cenario completo: demonstrando o problema

### Passo 1: Deploy inicial

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: appts
  namespace: primeira-aplicacao
spec:
  template:
    spec:
      containers:
        - name: appts
          image: registry/appts:v1  # Build A
          imagePullPolicy: Always
```

### Passo 2: Novo deploy (mesma tag, novo build)

```bash
# No Dockerfile, alteracoes foram feitas (nova rota adicionada)
docker build -t registry/appts:v1 .  # SOBRESCREVE a tag v1
docker push registry/appts:v1
```

```bash
kubectl rollout restart deployment/appts -n primeira-aplicacao
```

### Passo 3: Tentativa de rollback

```bash
kubectl rollout undo deployment/appts -n primeira-aplicacao
# Output: deployment.apps/appts rolled back
```

O Kubernetes reporta sucesso, mas a aplicacao continua com o build B porque `appts:v1` no registry agora aponta para build B.

## Solucao correta: tags imutaveis

### Em CI/CD (GitHub Actions exemplo)

```yaml
- name: Build and push
  run: |
    TAG="1.0.${{ github.run_number }}"
    docker build -t registry/appts:$TAG .
    docker push registry/appts:$TAG
    
    # Atualizar o deployment com a nova tag
    kubectl set image deployment/appts \
      appts=registry/appts:$TAG \
      -n primeira-aplicacao
```

### Com git SHA

```bash
TAG="sha-$(git rev-parse --short HEAD)"
docker build -t registry/appts:$TAG .
docker push registry/appts:$TAG
```

### Manifest com tag imutavel

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: appts
  namespace: primeira-aplicacao
spec:
  revisionHistoryLimit: 10
  template:
    spec:
      containers:
        - name: appts
          image: registry/appts:1.0.42  # Unica, nunca sobrescrita
          imagePullPolicy: IfNotPresent  # Seguro com tag imutavel
```

Agora `kubectl rollout undo` funciona corretamente porque cada revision aponta para uma tag unica que nunca foi sobrescrita.