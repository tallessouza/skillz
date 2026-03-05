---
name: rs-devops-configurando-tracer-basico
description: "Applies Jaeger tracing setup and FortIO load testing within Istio service mesh on Kubernetes. Use when user asks to 'install Jaeger', 'configure tracing', 'distributed tracing', 'load test with FortIO', 'test service mesh', or 'observability setup'. Guides installation via Istio addons, runs in-cluster load tests, and validates trace collection in Kiali. Make sure to use this skill whenever setting up tracing in a Kubernetes service mesh environment. Not for application-level instrumentation, Grafana Tempo setup, or APM tool comparison."
---

# Configurando Tracer Basico com Jaeger e FortIO

> Instale o Jaeger como addon do Istio e valide o tracing distribuido com teste de carga usando FortIO dentro do cluster.

## Rules

1. **Instale Jaeger via manifesto oficial do Istio** — use `kubectl apply` apontando para `istio-system`, porque o Jaeger precisa estar no mesmo namespace do control plane do Istio para coletar spans automaticamente
2. **Rode testes de carga dentro do cluster** — use FortIO como pod no mesmo namespace da aplicacao, porque o trafego interno passa pelo proxy Envoy do Istio e gera traces reais
3. **Use DNS interno do Kubernetes para endpoints** — `app-service-mesh.svc` (nome-do-servico.svc), porque containers no mesmo cluster resolvem o DNS interno automaticamente
4. **Sempre passe --rm no kubectl run** — remove pods anteriores com mesmo nome antes de criar, porque evita conflitos de nomes em execucoes repetidas
5. **Valide traces no Kiali apos o teste** — verifique que o trafego aparece com metricas de RPS e distribuicao, porque confirma que Jaeger + Prometheus + Kiali estao integrados corretamente
6. **Considere limites de recursos ao interpretar resultados** — QPS real sera menor que o solicitado sem HPA e com recursos limitados, porque o teste reflete a capacidade real do pod

## Steps

### Step 1: Instalar Jaeger

```bash
# Baixar manifesto do Jaeger (addon do Istio)
wget https://raw.githubusercontent.com/istio/istio/release-1.x/samples/addons/jaeger.yaml

# Verificar que aponta para istio-system
cat jaeger.yaml | grep namespace

# Aplicar
kubectl apply -f jaeger.yaml
```

Aguarde os pods ficarem Running. O Jaeger cria o Collector e o serviço principal (HTTP + gRPC).

### Step 2: Verificar instalacao

```bash
kubectl get pods -n istio-system | grep jaeger
# Esperar: jaeger-xxxx  1/1  Running
```

### Step 3: Rodar teste de carga com FortIO

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

| Flag | Significado |
|------|-------------|
| `-it` | Modo interativo, trava o console |
| `--rm` | Remove pod anterior com mesmo nome |
| `--namespace=app` | Mesmo namespace da aplicacao |
| `-qps 8000` | Queries Per Second desejadas |
| `-t 60s` | Duracao do teste |
| `-c 35` | Conexoes simultaneas (threads) |

O FortIO no namespace `app` recebe automaticamente um sidecar proxy do Istio, garantindo que o trafego passe pela malha.

### Step 4: Validar no Kiali

1. Acesse o Kiali dashboard
2. Verifique o grafo de trafego — FortIO deve aparecer enviando 100% do trafego para o servico
3. Observe metricas: RPS, latencia media, codigos de resposta
4. Verifique traces no Jaeger integrado ao Kiali

## Output esperado do FortIO

```
Ended after 60s
Code 200 : 160000 (100.0 %)
Response time avg: 12ms
QPS: 2734 (abaixo dos 8000 solicitados)
```

QPS abaixo do solicitado indica que a aplicacao atingiu seu limite — considere HPA e mais recursos.

## Heuristics

| Situacao | Acao |
|----------|------|
| QPS real muito abaixo do solicitado | Verificar limites de CPU/memoria dos pods e considerar HPA |
| FortIO nao aparece no Kiali | Verificar se namespace tem label `istio-injection=enabled` |
| Jaeger nao coleta spans | Verificar se pods estao em `istio-system` e se o collector esta Running |
| Endpoint retorna erro | Verificar DNS interno: `nome-do-servico.svc` no namespace correto |
| Teste precisa de POST/payload | Adicionar flags `-payload` e `-content-type` no FortIO |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Rodar FortIO fora do cluster | Rodar como pod no mesmo namespace para trafego passar pelo mesh |
| Usar IP do pod como endpoint | Usar DNS do Service (`app.svc`) para load balancing correto |
| Ignorar o `--rm` no kubectl run | Sempre usar `--rm` para evitar conflito de nomes |
| Testar com QPS alto sem baseline | Comecar com QPS baixo, aumentar gradualmente |
| Instalar Jaeger em namespace separado do Istio | Instalar em `istio-system` como addon oficial |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-configurando-tracer-basico/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-configurando-tracer-basico/references/code-examples.md)
