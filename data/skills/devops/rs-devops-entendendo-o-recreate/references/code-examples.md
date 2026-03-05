# Code Examples: Estrategia Recreate no Kubernetes

## Manifest completo com Recreate

Baseado no commit da aula ([761e04f](https://github.com/skillz-education/devops-primeiro-cluster/commit/761e04f5cffb3d2bcc41ce1d0a10a04488b26e59)):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: meu-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: meu-app
  strategy:
    type: Recreate
    # Nao ha bloco rollingUpdate aqui — seria invalido
  template:
    metadata:
      labels:
        app: meu-app
    spec:
      containers:
        - name: meu-app
          image: minha-imagem:v2
          ports:
            - containerPort: 3000
```

## Comparacao lado a lado: Recreate vs RollingUpdate

### Recreate
```yaml
spec:
  strategy:
    type: Recreate
```

Comportamento ao atualizar imagem:
```
Pod-1 (v1): Running → Terminating → Terminated
Pod-2 (v1): Running → Terminating → Terminated
Pod-3 (v1): Running → Terminating → Terminated
  [DOWNTIME - nenhum pod servindo]
Pod-1 (v2): Pending → ContainerCreating → Running
Pod-2 (v2): Pending → ContainerCreating → Running
Pod-3 (v2): Pending → ContainerCreating → Running
```

### RollingUpdate (maxUnavailable: 0, maxSurge: 1)
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

Comportamento ao atualizar imagem:
```
Pod-1 (v1): Running    Pod-2 (v1): Running    Pod-3 (v1): Running
Pod-4 (v2): Creating → Running → Ready
Pod-1 (v1): Terminating → Terminated
Pod-5 (v2): Creating → Running → Ready
Pod-2 (v1): Terminating → Terminated
Pod-6 (v2): Creating → Running → Ready
Pod-3 (v1): Terminating → Terminated
  [ZERO DOWNTIME - sempre pelo menos 3 pods servindo]
```

## Comandos usados na aula

```bash
# Aplicar o deployment
kubectl apply -f deployment.yaml

# Observar pods em tempo real
kubectl get pods -w

# Verificar status do deployment
kubectl get deployment
```

## Quando usar cada estrategia — decision tree

```
Meu servico responde requests de usuarios?
├── SIM → RollingUpdate (ou blue-green/canary para mais seguranca)
└── NAO
    ├── Duas versoes podem coexistir?
    │   ├── SIM → RollingUpdate (ainda e mais suave)
    │   └── NAO → Recreate e aceitavel
    └── E um job/worker que tolera downtime?
        ├── SIM → Recreate e aceitavel
        └── NAO → RollingUpdate
```