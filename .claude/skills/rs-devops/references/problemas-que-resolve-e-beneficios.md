---
name: rs-devops-problemas-que-resolve-e-beneficios
description: "Applies Service Mesh adoption criteria when evaluating resilience, observability, and traffic control needs. Use when user asks to 'add circuit breaker', 'implement retry policy', 'setup service mesh', 'evaluate istio', 'configure canary deployment', or 'centralize resilience'. Enforces infrastructure-level resilience over code-level duplication. Make sure to use this skill whenever discussing microservice communication patterns. Not for application code, Docker configuration, or Terraform."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: service-mesh-benefits
  tags: [service-mesh, circuit-breaker, resilience, canary, blue-green, istio, mtls]
---

# Service Mesh — Problemas que Resolve e Benefícios

> Mova resiliência, observabilidade e controle de tráfego para a camada de infraestrutura, mantendo a aplicação agnóstica a esses conceitos.

## Rules

1. **Resiliência na infraestrutura, não no código** — circuit breaker, retry e timeout pertencem ao Service Mesh, não a cada microserviço, porque duplicar essa lógica em N serviços gera problemas de manutenibilidade
2. **Aplicação agnóstica** — o serviço não precisa saber o que é circuit breaker; a camada de infra intercepta e controla o tráfego, porque isso isola responsabilidades
3. **Nunca use Service Mesh só para mTLS** — se o único caso de uso é segurança entre serviços, é over-engineering; existem soluções mais simples para mTLS isolado
4. **Combine capacidades para justificar** — Service Mesh faz sentido quando você precisa de resiliência + observabilidade + controle de tráfego juntos, porque o overhead operacional precisa compensar
5. **Blast radius primeiro** — um problema local pode impactar a rede inteira; circuit breaker existe para conter o raio de explosão antes que ele se propague
6. **Deploy strategies são bônus** — Blue-Green, Canary e teste A/B são possíveis via Service Mesh, mas existem ferramentas específicas; use o Service Mesh para isso se já o utiliza para resiliência

## Decision Framework

| Cenário | Recomendação |
|---------|-------------|
| Poucos microserviços (<5), sem complexidade de rede | Code-level resilience (libs) |
| Muitos microserviços, resiliência + observabilidade necessárias | Service Mesh |
| Apenas mTLS entre serviços | Solução dedicada de segurança, não Service Mesh |
| Precisa de Canary/Blue-Green e já usa Service Mesh | Aproveite o Service Mesh |
| Precisa de Canary/Blue-Green sem Service Mesh | Ferramentas específicas de deploy |

## Circuit Breaker — Como Funciona

```
Circuito FECHADO (normal) → requisições passam normalmente
         │
    Serviço C retorna 5xx repetidamente (ex: 5 vezes)
         │
         ▼
Circuito ABERTO → B para de chamar C, retém eventos
         │
    Após cooldown period
         │
         ▼
Circuito HALF-OPEN → tenta algumas requisições
         │
    Se OK → FECHADO | Se falha → ABERTO novamente
```

## Capacidades do Service Mesh

### Resiliência
```yaml
# Exemplo conceitual de configuração
resilience:
  circuitBreaker:
    consecutive5xxErrors: 5
    action: open_circuit
  retry:
    attempts: 3
    perTryTimeout: 2s
  timeout:
    global: 30s
```

### Observabilidade
- Integração com Prometheus e Grafana
- Visualização da malha de serviços (service graph)
- Métricas de tráfego entre serviços automaticamente

### Deploy Strategies
| Estratégia | Descrição |
|-----------|-----------|
| **Blue-Green** | Nova versão só recebe tráfego quando estiver healthy |
| **Canary** | Libera para X% do tráfego gradualmente |
| **Teste A/B** | Duas versões simultâneas para comparação |
| **Rolling Update** | Padrão do Kubernetes, sem Service Mesh necessário |

### Segurança (mTLS)
- Validação mútua entre serviços dentro do cluster
- Apenas como benefício adicional, nunca como justificativa única

## Heuristics

| Situação | Faça |
|----------|------|
| Duplicando retry/timeout em cada serviço | Mova para Service Mesh |
| Um serviço instável derruba a rede toda | Implemente circuit breaker no mesh |
| Precisa de visibilidade da comunicação entre serviços | Aproveite observabilidade do mesh |
| Quer testar deploy em produção com segurança | Use Canary via mesh |
| Só precisa de mTLS e nada mais | Não use Service Mesh para isso |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Circuit breaker controlado por env var manual em cada serviço | Circuit breaker na camada de Service Mesh com limites configurados |
| Implementar retry em código em todos os microserviços | Retry policy centralizada no mesh |
| Adotar Service Mesh só para mTLS | Usar solução dedicada de segurança ou justificar com mais capacidades |
| Ignorar blast radius de falhas localizadas | Configurar circuit breaker para conter propagação |
| Rolling update sempre, mesmo quando precisa de zero-downtime | Blue-Green ou Canary via mesh quando disponível |

## Troubleshooting

### Circuit breaker nao abre mesmo com servico retornando 5xx
**Symptom:** Servico downstream retorna erros 500 repetidamente mas trafego continua sendo enviado
**Cause:** DestinationRule com outlierDetection nao aplicada ou consecutive5xxErrors threshold muito alto
**Fix:** Verificar se DestinationRule esta no namespace correto com `kubectl get dr`, ajustar `consecutive5xxErrors` para valor menor (ex: 5)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

# Deep Explanation: Service Mesh — Problemas que Resolve

## Por que não resolver resiliência no código?

O instrutor destaca que é perfeitamente possível implementar circuit breaker, retry e timeout no código — existem libs para isso. O problema surge quando você escala para muitos microserviços. Cada serviço precisa da mesma lógica, gerando:

1. **Duplicação de código** — mesma lógica de retry em 20 serviços
2. **Manutenibilidade degradada** — mudar uma política de timeout significa alterar N repositórios
3. **Controle manual** — o instrutor cita o exemplo real de circuit breaker controlado por env var: alguém precisa ir lá manualmente desligar um fluxo quando há problema

## A analogia do Blast Radius

O instrutor traz o conceito de "raio de explosão" (blast radius) da observabilidade: um problema **local** no serviço C pode causar impacto **global** na rede. O circuit breaker é a contenção desse raio — o serviço B para de chamar C e retém eventos para retentar depois, em vez de propagar a falha cascaticamente.

## Circuit Breaker em detalhe

Três estados:
- **Fechado** — tudo normal, requisições passam
- **Aberto** — detectou falhas recorrentes (ex: 5 respostas 5xx consecutivas), bloqueia chamadas
- **Half-open** — após período de cooldown, tenta algumas requisições; se OK, fecha; se falha, reabre

O ponto-chave: na camada de Service Mesh, a **aplicação não sabe** que existe um circuit breaker. A infra intercepta e controla. Isso é fundamentalmente diferente de ter a lib no código onde o serviço precisa implementar a lógica.

## Observabilidade ampliada

O Service Mesh cria a "malha de serviços" e, por natureza, tem visibilidade de toda a comunicação. Isso permite integração direta com:
- **Prometheus** — métricas automáticas de tráfego entre serviços
- **Grafana** — dashboards da malha
- **Jaeger** — tracing distribuído (mencionado como algo a explorar)

## Deploy Strategies — Bônus, não razão principal

O instrutor é explícito: existem **ferramentas específicas** para estratégias de deploy. O Service Mesh **também** oferece essa capacidade, mas não é a razão principal para adotá-lo. Se você já usa Service Mesh para resiliência, aproveite para Canary/Blue-Green. Se não, considere ferramentas dedicadas.

Comparação com Kubernetes puro:
- **Kubernetes padrão** oferece rolling update (cadência: remove réplicas antigas, sobe novas)
- **Service Mesh** amplia para Blue-Green, Canary, A/B testing

## mTLS — O aviso contra over-engineering

O instrutor faz um alerta direto: usar Service Mesh **somente** para mTLS é over-engineering. O mTLS é um benefício que "já vem no plano" quando você adota Service Mesh por outras razões. Mas se segurança é sua única necessidade, existem soluções mais simples e com menos overhead operacional.

## Gerenciamento de tráfego adicional

Além de deploy strategies, o Service Mesh oferece:
- Roteamento inteligente (baseado em headers, peso, etc.)
- Balanceamento de carga avançado (além do round-robin do Kubernetes)
- Controle de complexidades de comunicação entre serviços

## Quando Service Mesh faz sentido (síntese do instrutor)

O combinado é: Service Mesh se justifica quando você precisa de **múltiplas capacidades** simultaneamente. A soma de resiliência + observabilidade + controle de tráfego + segurança é o que justifica o overhead de operar um mesh. Qualquer uma isoladamente provavelmente tem uma solução mais simples.

---

# Code Examples: Service Mesh — Problemas que Resolve

## 1. Circuit Breaker — Código vs Service Mesh

### No código (o que o Service Mesh substitui)

```typescript
// Exemplo de circuit breaker a nível de código (lib)
// Cada serviço precisa implementar isso individualmente
import { CircuitBreaker } from 'some-circuit-breaker-lib'

const breaker = new CircuitBreaker(callServiceC, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
})

// Controle manual via env var (anti-pattern mencionado pelo instrutor)
if (process.env.CIRCUIT_BREAKER_ENABLED === 'true') {
  breaker.fire(request)
} else {
  callServiceC(request) // bypass manual
}
```

### No Service Mesh (configuração declarativa)

```yaml
# DestinationRule no Istio (exemplo conceitual)
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: service-c-circuit-breaker
spec:
  host: service-c
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        h2UpgradePolicy: DEFAULT
        http1MaxPendingRequests: 100
    outlierDetection:
      consecutive5xxErrors: 5        # Abre circuito após 5 erros 5xx
      interval: 10s                   # Janela de verificação
      baseEjectionTime: 30s          # Tempo com circuito aberto
      maxEjectionPercent: 50         # Máximo de hosts ejetados
```

## 2. Retry e Timeout — Centralizado no Mesh

### Sem Service Mesh (em cada serviço)

```typescript
// Serviço A — retry manual
async function callServiceB(data: unknown, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)
      const response = await fetch('http://service-b/api', {
        signal: controller.signal,
        method: 'POST',
        body: JSON.stringify(data)
      })
      clearTimeout(timeout)
      return response.json()
    } catch (error) {
      if (i === retries - 1) throw error
    }
  }
}

// Serviço B — mesma lógica duplicada
// Serviço C — mesma lógica duplicada
// ... N serviços com o mesmo código
```

### Com Service Mesh (declarativo, uma vez)

```yaml
# VirtualService no Istio
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: service-b-resilience
spec:
  hosts:
    - service-b
  http:
    - route:
        - destination:
            host: service-b
      retries:
        attempts: 3
        perTryTimeout: 2s
        retryOn: 5xx,reset,connect-failure
      timeout: 10s
```

## 3. Deploy Strategies via Service Mesh

### Canary Deployment (liberar para X% do tráfego)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: my-service-canary
spec:
  hosts:
    - my-service
  http:
    - route:
        - destination:
            host: my-service
            subset: stable
          weight: 90          # 90% vai para versão estável
        - destination:
            host: my-service
            subset: canary
          weight: 10          # 10% vai para versão nova
---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: my-service-versions
spec:
  host: my-service
  subsets:
    - name: stable
      labels:
        version: v1
    - name: canary
      labels:
        version: v2
```

### Blue-Green (nova versão só recebe tráfego quando healthy)

```yaml
# Fase 1: Todo tráfego para blue (versão atual)
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: my-service-blue-green
spec:
  hosts:
    - my-service
  http:
    - route:
        - destination:
            host: my-service
            subset: blue
          weight: 100

# Fase 2: Após validar green, switch instantâneo
# Alterar weight: blue=0, green=100
```

### A/B Testing (duas versões para comparação)

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: my-service-ab-test
spec:
  hosts:
    - my-service
  http:
    - match:
        - headers:
            x-test-group:
              exact: "B"
      route:
        - destination:
            host: my-service
            subset: version-b
    - route:
        - destination:
            host: my-service
            subset: version-a
```

## 4. mTLS entre serviços

```yaml
# PeerAuthentication — ativa mTLS no namespace
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: my-namespace
spec:
  mtls:
    mode: STRICT    # Todas as comunicações devem usar mTLS
```

## 5. Observabilidade — Integração automática

```yaml
# O Service Mesh automaticamente expõe métricas para Prometheus
# Exemplo de métricas disponíveis sem código adicional:
#
# istio_requests_total          — Total de requisições entre serviços
# istio_request_duration_ms     — Latência por rota
# istio_tcp_connections_opened  — Conexões TCP abertas
#
# Grafana dashboards pré-configurados mostram:
# - Service graph (visualização da malha)
# - Request rate entre serviços
# - Error rate por serviço
# - Latência P50/P95/P99
```

## Comparação: Kubernetes Rolling Update vs Service Mesh Strategies

```
Rolling Update (K8s padrão):
  Réplica v1 ████████████
  Réplica v1 ████████████  → remove gradualmente
  Réplica v2     ████████████  → sobe gradualmente
  Réplica v2         ████████████

Blue-Green (Service Mesh):
  Blue v1  ████████████████████  (100% tráfego)
  Green v2 ████████████████████  (0% tráfego, validando)
  --- switch instantâneo ---
  Blue v1  (0%)
  Green v2 ████████████████████  (100% tráfego)

Canary (Service Mesh):
  Stable v1  ██████████████████  (90%)
  Canary v2  ██                  (10%)
  --- gradual ---
  Stable v1  ██████████████      (70%)
  Canary v2  ██████              (30%)
  --- confiança ---
  v2         ████████████████████ (100%)
```
