# Code Examples: Configurando Tracer Basico

## 1. Instalacao do Jaeger

```bash
# Download do manifesto oficial do Istio
wget https://raw.githubusercontent.com/istio/istio/release-1.x/samples/addons/jaeger.yaml

# Aplicar no cluster (namespace istio-system)
kubectl apply -f jaeger.yaml
```

Resultado esperado:
```
deployment.apps/jaeger created
service/tracing created
service/zipkin created
service/jaeger-collector created
```

## 2. Verificacao dos Pods

```bash
kubectl get pods -n istio-system | grep jaeger
```

Resultado esperado:
```
jaeger-7d8b7c8f4-xxxxx   1/1     Running   0   2m
```

Verificar que tanto HTTP quanto gRPC estao funcionando:
```bash
kubectl get svc -n istio-system | grep jaeger
```

## 3. Teste de Carga com FortIO — Comando Completo

```bash
kubectl run fortio -it --rm \
  --namespace=app \
  --image=fortio/fortio \
  -- load \
  -qps 8000 \
  -t 60s \
  -c 35 \
  http://app-service-mesh.svc/healthz
```

### Breakdown do comando:

```bash
kubectl run fortio    # Nome do pod
  -it                 # Interativo + TTY (trava o console)
  --rm                # Remove pod existente com mesmo nome
  --namespace=app     # Namespace onde a app roda
  --image=fortio/fortio  # Imagem Docker do FortIO (latest)
  --                  # Separador: tudo depois vai pro entrypoint do container
  load                # Comando FortIO: modo teste de carga
  -qps 8000           # 8000 queries per second desejadas
  -t 60s              # Duracao: 60 segundos
  -c 35               # 35 conexoes simultaneas
  http://app-service-mesh.svc/healthz  # Endpoint alvo (DNS interno)
```

## 4. Variacoes do Teste

### Teste conservador (baseline)
```bash
kubectl run fortio -it --rm \
  --namespace=app \
  --image=fortio/fortio \
  -- load \
  -qps 1000 \
  -t 30s \
  -c 10 \
  http://app-service-mesh.svc/healthz
```

### Teste com POST e payload
```bash
kubectl run fortio -it --rm \
  --namespace=app \
  --image=fortio/fortio \
  -- load \
  -qps 2000 \
  -t 60s \
  -c 20 \
  -content-type "application/json" \
  -payload '{"key": "value"}' \
  http://app-service-mesh.svc/api/endpoint
```

### Teste em outro namespace
```bash
kubectl run fortio -it --rm \
  --namespace=testing \
  --image=fortio/fortio \
  -- load \
  -qps 5000 \
  -t 45s \
  -c 25 \
  http://app-service-mesh.app.svc.cluster.local/healthz
```

Nota: quando o FortIO esta em namespace diferente, usar FQDN completo (`servico.namespace.svc.cluster.local`).

## 5. Resultado Tipico do FortIO

```
Fortio 1.x running at 8000 queries per second, 35->35 procs
Starting at 8000 qps with 35 thread(s) for 1m0s

Ended after 1m0.012345s : 160000 calls. qps=2734.5
Aggregated Function Time : count 160000 avg 0.012 +/- 0.005 min 0.001 max 0.089 sum 1920

# target 50% 0.010
# target 75% 0.014
# target 90% 0.018
# target 99% 0.035

Code 200 : 160000 (100.0 %)
Response Header Sizes : count 160000 avg 230 +/- 0 min 230 max 230 sum 36800000
Response Body/Total Sizes : count 160000 avg 450 +/- 0 min 450 max 450 sum 72000000
All done 160000 calls (plus 0 warmup) 12.000 ms avg, 2734.5 qps
```

### Como interpretar:
- **qps=2734.5** — QPS real alcancado (vs 8000 solicitados = 34% da meta)
- **avg 0.012** — latencia media de 12ms
- **Code 200: 100%** — nenhum erro, toda disponibilidade
- **target 99% 0.035** — P99 de 35ms

## 6. Verificacao no Kiali

Apos o teste, acesse o Kiali e observe:
- **Graph view**: FortIO → App Service Mesh com seta de trafego
- **Traffic tab**: RPS, success rate, latencia
- **Traces tab**: spans individuais do Jaeger

O FortIO aparece com sidecar proxy do Istio automaticamente porque esta no namespace com injection habilitado.