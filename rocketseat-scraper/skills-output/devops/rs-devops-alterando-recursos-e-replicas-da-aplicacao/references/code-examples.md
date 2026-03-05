# Code Examples: Alterando Recursos e Réplicas da Aplicação

## Configuração completa do cenário otimizado

### HPA (autoscaling/v1)

```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
  namespace: primeira-aplicacao
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app-deployment
  minReplicas: 6
  maxReplicas: 10
  targetCPUUtilizationPercentage: 75
```

### Deployment com recursos aumentados

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
  namespace: primeira-aplicacao
spec:
  replicas: 6  # Igual ao minReplicas do HPA
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
          image: minha-app:latest
          resources:
            requests:
              cpu: "400m"    # 400 milicores garantidos
            limits:
              cpu: "700m"    # Pode fazer burst até 700 milicores
```

## Comandos de operação

### Aplicar configuração

```bash
# Aplicar todo o diretório de manifests
kubectl apply -f ./k8s/ -n primeira-aplicacao
```

### Monitorar escala em tempo real

```bash
# Assistir HPA (mostra current vs target CPU, replicas)
kubectl get hpa -n primeira-aplicacao -w

# Exemplo de output:
# NAME      REFERENCE              TARGETS   MINPODS   MAXPODS   REPLICAS
# app-hpa   Deployment/app-dep     1%/75%    6         10        6
# app-hpa   Deployment/app-dep     97%/75%   6         10        8
# app-hpa   Deployment/app-dep     85%/75%   6         10        10
```

### Monitorar consumo por pod

```bash
# Ver CPU e memória de cada pod
kubectl top pods -n primeira-aplicacao

# Exemplo de output durante teste:
# NAME                       CPU(cores)   MEMORY(bytes)
# app-dep-xxx-aaa            389m         61Mi
# app-dep-xxx-bbb            412m         59Mi
# app-dep-xxx-ccc            356m         62Mi
# ...
```

### Verificar capacidade do nó

```bash
# Ver recursos disponíveis no nó
kubectl top nodes

# Descrever nó (mostra allocatable vs allocated)
kubectl describe node <node-name> | grep -A 5 "Allocated resources"
```

## Teste de estresse com Fortio

### Executar teste (pod efêmero com --rm)

```bash
# --rm: remove o pod após execução
# -c 50: 50 conexões simultâneas
# -qps 6000: target de 6000 queries por segundo
# -t 2m: duração de 2 minutos
kubectl run fortio --rm -i \
  --image=fortio/fortio \
  -- load -c 50 -qps 6000 -t 2m \
  http://app-svc.primeira-aplicacao.svc.cluster.local/exe
```

### Executar teste (pod persistente, sem --rm)

```bash
# Sem --rm: pod permanece para reutilização
kubectl run fortio -i \
  --image=fortio/fortio \
  -- load -c 50 -qps 6000 -t 2m \
  http://app-svc.primeira-aplicacao.svc.cluster.local/exe

# Para rodar novamente depois:
kubectl exec -it fortio -- \
  fortio load -c 50 -qps 6000 -t 2m \
  http://app-svc.primeira-aplicacao.svc.cluster.local/exe
```

## Variações de configuração para experimentação

### Teste com trigger alto (para observar degradação)

```yaml
# NÃO recomendado para produção — apenas para entender o comportamento
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
spec:
  targetCPUUtilizationPercentage: 95  # Escala muito tarde
  # Resultado esperado: mais timeouts, menos requests bem-sucedidos
```

### Teste com mais réplicas (sem aumentar CPU)

```yaml
# Mais pods com mesmos recursos — distribui carga
spec:
  minReplicas: 10
  maxReplicas: 20
  # Trade-off: mais pods = mais consumo do nó
```

### Teste com mais CPU (sem aumentar réplicas)

```yaml
# Pods mais potentes, mesma quantidade
resources:
  requests:
    cpu: "800m"
  limits:
    cpu: "1000m"
# Trade-off: cada pod consome mais do nó, menos pods cabem
```

## Processo completo de tuning (passo a passo)

```bash
# 1. Aplicar configuração base
kubectl apply -f ./k8s/ -n primeira-aplicacao

# 2. Aguardar pods estabilizarem
kubectl get pods -n primeira-aplicacao -w
# Esperar todos ficarem Running + Ready

# 3. Verificar HPA pegou métricas
kubectl get hpa -n primeira-aplicacao
# CPU deve mostrar valor real (ex: 1%/75%), não <unknown>

# 4. Rodar teste de estresse
kubectl run fortio --rm -i --image=fortio/fortio -- \
  load -c 50 -qps 6000 -t 2m http://app-svc.primeira-aplicacao.svc.cluster.local/exe

# 5. Em outro terminal, observar escala
kubectl get hpa -n primeira-aplicacao -w
kubectl top pods -n primeira-aplicacao

# 6. Anotar resultados (total requests, latência, QPS)

# 7. Ajustar configuração e repetir de 1
```