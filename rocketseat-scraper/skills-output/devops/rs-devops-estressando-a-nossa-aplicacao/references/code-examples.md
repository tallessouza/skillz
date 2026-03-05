# Code Examples: Teste de Estresse no Kubernetes com FortIO

## Exemplo 1: Verificar servicos no namespace

Antes de rodar o teste, confirme o nome do servico:

```bash
kubectl get svc -n primeira-aplicacao
```

Saida esperada:
```
NAME          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
app-ts-svc    ClusterIP   10.96.xxx.xxx   <none>        80/TCP    2d
```

O `app-ts-svc` e o nome que sera usado na URL do teste.

## Exemplo 2: Comando completo do FortIO

```bash
kubectl run fortio --rm -it \
  --namespace=primeira-aplicacao \
  --image=fortio/fortio \
  -- load \
  -qps 6000 \
  -t 120s \
  -c 50 \
  http://app-ts-svc/exemplo-k8s
```

**Decomposicao dos parametros:**

| Parametro | Valor | Significado |
|-----------|-------|-------------|
| `--rm` | — | Remove o pod quando terminar |
| `-it` | — | Modo interativo (ve output em tempo real) |
| `--namespace` | `primeira-aplicacao` | Namespace onde o pod sera criado |
| `--image` | `fortio/fortio` | Imagem do Docker Hub |
| `-qps` | `6000` | 6000 queries por segundo (target) |
| `-t` | `120s` | Duracao de 2 minutos |
| `-c` | `50` | 50 conexoes simultaneas (threads) |
| URL | `http://app-ts-svc/exemplo-k8s` | Servico interno + rota da aplicacao |

## Exemplo 3: Monitorar HPA em tempo real

```bash
kubectl get hpa -n primeira-aplicacao -w
```

Saida durante o teste:
```
NAME     REFERENCE       TARGETS           MINPODS   MAXPODS   REPLICAS   AGE
app-hpa  Deployment/app  cpu: 85%/50%      3         8         3          1d
app-hpa  Deployment/app  cpu: 120%/50%     3         8         6          1d
app-hpa  Deployment/app  cpu: 95%/50%      3         8         8          1d
```

## Exemplo 4: Verificar consumo de recursos

```bash
kubectl top pods -n primeira-aplicacao
```

Saida durante estresse:
```
NAME                   CPU(cores)   MEMORY(bytes)
app-xxx-abc            200m         64Mi
app-xxx-def            180m         62Mi
app-xxx-ghi            195m         65Mi
...
```

## Exemplo 5: Ver eventos detalhados do HPA

```bash
kubectl describe hpa app-hpa -n primeira-aplicacao
```

Eventos relevantes durante o teste:
```
Events:
  Type    Reason             Message
  ----    ------             -------
  Normal  SuccessfulRescale  New size: 6; reason: cpu resource utilization above target
  Normal  SuccessfulRescale  New size: 8; reason: cpu resource utilization above target
```

## Exemplo 6: Variacoes de parametros para diferentes cenarios

### Teste leve (validacao basica)
```bash
kubectl run fortio --rm -it \
  --namespace=primeira-aplicacao \
  --image=fortio/fortio \
  -- load -qps 1000 -t 30s -c 10 \
  http://app-ts-svc/exemplo-k8s
```

### Teste pesado (estresse maximo)
```bash
kubectl run fortio --rm -it \
  --namespace=primeira-aplicacao \
  --image=fortio/fortio \
  -- load -qps 10000 -t 300s -c 100 \
  http://app-ts-svc/exemplo-k8s
```

### Teste com FQDN (pod em namespace diferente)
```bash
kubectl run fortio --rm -it \
  --namespace=default \
  --image=fortio/fortio \
  -- load -qps 6000 -t 120s -c 50 \
  http://app-ts-svc.primeira-aplicacao.svc.cluster.local/exemplo-k8s
```

## Exemplo 7: Exercicio — teste sem HPA

```bash
# 1. Remover o HPA
kubectl delete hpa app-hpa -n primeira-aplicacao

# 2. Rodar o mesmo teste
kubectl run fortio --rm -it \
  --namespace=primeira-aplicacao \
  --image=fortio/fortio \
  -- load -qps 6000 -t 120s -c 50 \
  http://app-ts-svc/exemplo-k8s

# 3. Observar: sem escala, espere falhas e timeouts
# O relatorio deve mostrar respostas != 200

# 4. Recriar o HPA depois
kubectl apply -f k8s/hpa.yaml
```

## Saida tipica do FortIO (relatorio)

```
Ended after 120.05s : 480000 calls. qps=3999.5
Aggregated Function Time : count 480000 avg 0.012345 +/- 0.005 min 0.001 max 0.250
# target 50% 0.010
# target 75% 0.015
# target 90% 0.020
# target 99% 0.045
# target 99.9% 0.100
Code 200 : 480000 (100.0 %)
All done 480000 calls (plus 50 warmup) 12.345 ms avg, 3999.5 qps
```

**Como interpretar:**
- `qps=3999.5` — QPS efetivo alcancado (pode ser menor que o target)
- `avg 0.012345` — tempo medio de resposta em segundos (~12ms)
- `target 99% 0.045` — 99% das requisicoes responderam em ate 45ms
- `Code 200 : 480000 (100.0 %)` — todas as requisicoes retornaram sucesso