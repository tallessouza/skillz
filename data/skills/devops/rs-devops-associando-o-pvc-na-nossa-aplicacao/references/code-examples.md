# Code Examples: Associando PVC na Aplicação Kubernetes

## Exemplo 1: Configuração do volumeMount no container

Dentro do bloco `containers` do deployment, após `resources`:

```yaml
containers:
  - name: app
    image: app:latest
    resources:
      requests:
        cpu: "100m"
        memory: "128Mi"
    volumeMounts:
      - name: app-tsdata
        mountPath: /usr/source/app/uploads
```

**Explicação:**
- `name: app-tsdata` — identificador que será usado para associar ao volume
- `mountPath: /usr/source/app/uploads` — caminho completo no filesystem do container onde o volume será montado
- O diretório `/uploads` é criado automaticamente se não existir na imagem

## Exemplo 2: Configuração do volume no pod

Fora do bloco `containers`, no mesmo nível:

```yaml
spec:
  template:
    spec:
      containers:
        - name: app
          # ... config do container
      volumes:
        - name: app-tsdata
          persistentVolumeClaim:
            claimName: first-pvc
```

**Explicação:**
- `name: app-tsdata` — deve ser idêntico ao name do volumeMount
- `persistentVolumeClaim.claimName: first-pvc` — nome do PVC criado anteriormente

## Exemplo 3: Deployment completo com PVC

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: primeira-aplicacao
  namespace: primeira-aplicacao
spec:
  replicas: 6
  selector:
    matchLabels:
      app: primeira-aplicacao
  template:
    metadata:
      labels:
        app: primeira-aplicacao
    spec:
      containers:
        - name: app
          image: primeira-aplicacao:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
          volumeMounts:
            - name: app-tsdata
              mountPath: /usr/source/app/uploads
      volumes:
        - name: app-tsdata
          persistentVolumeClaim:
            claimName: first-pvc
```

## Exemplo 4: Testando persistência com kubectl

### Passo 1: Listar pods
```bash
kubectl get pods -n primeira-aplicacao
```

### Passo 2: Entrar no container
```bash
kubectl exec -it <pod-name> -n primeira-aplicacao -- /bin/sh
```

### Passo 3: Criar arquivo no volume montado
```bash
cd uploads
echo "olá" > file.txt
cat file.txt
# Output: olá
exit
```

### Passo 4: Deletar o pod
```bash
kubectl delete pod <pod-name> -n primeira-aplicacao
```

### Passo 5: Verificar que o ReplicaSet criou novo pod
```bash
kubectl get pods -n primeira-aplicacao
# Novo pod aparece com nome diferente
```

### Passo 6: Entrar em qualquer pod e verificar
```bash
kubectl exec -it <qualquer-pod> -n primeira-aplicacao -- /bin/sh
cat uploads/file.txt
# Output: olá  — arquivo persistiu!
```

## Exemplo 5: Verificando o PVC com describe

```bash
kubectl describe pod <pod-name> -n primeira-aplicacao
```

Output relevante:
```
Volumes:
  app-tsdata:
    Type:       PersistentVolumeClaim
    ClaimName:  first-pvc
    ReadOnly:   false
```

## Exemplo 6: Verificando a cadeia completa de storage

```bash
# PVC — deve estar Bound
kubectl get pvc -n primeira-aplicacao
# NAME        STATUS   VOLUME    CAPACITY   ACCESS MODES   STORAGECLASS
# first-pvc   Bound    first-pv  5Gi        RWO            standard

# PV — mostra qual claim fez o bind
kubectl get pv
# NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM
# first-pv   5Gi        RWO            Delete           Bound    primeira-aplicacao/first-pvc

# StorageClass
kubectl get storageclass
```

## Exemplo 7: Variação para banco de dados (PostgreSQL)

```yaml
containers:
  - name: postgres
    image: postgres:15
    volumeMounts:
      - name: pg-data
        mountPath: /var/lib/postgresql/data
volumes:
  - name: pg-data
    persistentVolumeClaim:
      claimName: postgres-pvc
```

## Exemplo 8: Variação com emptyDir (volume efêmero)

Para dados temporários que precisam ser compartilhados entre réplicas durante o ciclo de vida:

```yaml
containers:
  - name: app
    image: app:latest
    volumeMounts:
      - name: temp-data
        mountPath: /usr/source/app/temp
volumes:
  - name: temp-data
    emptyDir: {}
```

**Diferença:** com `emptyDir`, os dados são perdidos quando o deployment é recriado. Com `persistentVolumeClaim`, os dados sobrevivem.