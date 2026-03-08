---
name: rs-devops-quais-problemas-resolve
description: "Applies observability problem-solving framework when justifying instrumentation investment. Use when user asks to 'justify observability', 'reduce MTTD/MTTR', 'improve incident response', 'troubleshoot microservices', or 'measure system reliability'. Provides MTTD/MTTR mental model and cost-benefit analysis. Make sure to use this skill whenever discussing observability strategy or incident management. Not for CI/CD pipelines, Docker configuration, or Kubernetes manifests."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observability-problems
  tags: [observability, mttd, mttr, incident-response, tracing, reliability, monitoring]
---

# Quais Problemas a Observabilidade Resolve

> Observabilidade existe para descobrir e solucionar problemas de maneira rapida e eficiente, transformando dados em decisoes.

## Key concepts

Observabilidade nao e apenas "ter dashboards" — e a capacidade de entender o comportamento interno do sistema a partir dos dados que ele emite. O valor real esta em reduzir o tempo entre "algo quebrou" e "esta resolvido", medido por duas metricas fundamentais: MTTD e MTTR.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Sistema sem alertas ou com alertas ignorados | Medir MTTD — tempo medio ate alguem detectar o problema |
| Time demora para resolver incidentes | Medir MTTR — tempo medio de reparo apos deteccao |
| Microservicos sem rastreio | Implementar tracing distribuido para mapa de dependencias |
| Custos de infra crescendo sem explicacao | Usar metricas de CPU/memoria para identificar gargalos |
| Bugs consomem tempo do time vs features | Observabilidade reduz tempo em firefighting, libera capacity |
| Usuarios reportam problemas antes do time | MTTD esta alto — o time deveria detectar antes do usuario |

## How to think about it

### MTTD — Mean Time to Detect

Tempo medio entre o sistema emitir um alerta e alguem dar acknowledge. Se o time tem boa observabilidade mas MTTD alto, o problema nao e tecnico — e processual. Metrificar MTTD permite definir metas (ex: detectar em 5 min) e atuar na causa raiz do atraso.

### MTTR — Mean Time to Repair

Comeca a contar apos a deteccao. Quanto menor o MTTR, menor o impacto no usuario. Boa observabilidade com tracing distribuido reduz MTTR drasticamente porque elimina o "onde esta o problema?" em arquiteturas de microservicos.

### Confianca do usuario

Um sistema onde o time resolve problemas antes do usuario perceber gera confianca. O objetivo e: o usuario nunca deveria ser quem reporta o incidente.

### Troubleshooting em sistemas distribuidos

Sem observabilidade, descobrir qual microservico causa latencia e como procurar agulha no palheiro. Com tracing (rastreio de requisicoes), voce ve o caminho completo e identifica o responsavel.

### Comportamento do usuario como insight

Logs e metricas revelam padroes de uso que nao sao erros, mas oportunidades de produto. Um cliente usando o sistema de forma inesperada pode indicar uma feature faltando.

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Observabilidade = ter Grafana/dashboards | Dashboards sao visualizacao; observabilidade e a capacidade de investigar qualquer estado interno |
| So preciso monitorar quando algo quebra | Monitorar comportamento normal e essencial para detectar anomalias |
| Microservicos nao precisam de tracing | Sem tracing, troubleshooting em sistemas distribuidos e praticamente impossivel |
| Observabilidade e custo extra | Reduz custos: menos tempo em bugs, melhor capacity planning, menos downtime |
| O usuario reportar bugs e aceitavel | Se o usuario detecta antes do time, o MTTD esta falhando |

## When to apply

- Ao projetar arquitetura de microservicos — planejar tracing desde o inicio
- Ao definir SLAs/SLOs — MTTD e MTTR sao as metricas base
- Ao fazer capacity planning — metricas de observabilidade informam tamanho do time
- Ao revisar custos de infraestrutura — metricas de CPU/memoria revelam gargalos
- Ao decidir entre resilience patterns — Circuit Breaker, Outbox Pattern dependem de dados observaveis

## Limitations

- Observabilidade nao substitui bom design de software — sistemas mal projetados geram ruido excessivo
- Metricas sem contexto de negocio sao numeros vazios — MTTD de 5 min so importa se o impacto justifica
- Over-instrumentation gera custo de storage e noise — instrumentar com intencao, nao por default

## Troubleshooting

### MTTD alto apesar de ter dashboards configurados
**Symptom:** Time demora para detectar incidentes mesmo com Grafana/dashboards ativos
**Cause:** Dashboards sao passivos — requerem que alguem olhe; faltam alertas proativos
**Fix:** Configurar alertas automaticos no Prometheus Alertmanager ou Grafana Alerting para metricas criticas (taxa de erro > 1%, latencia p99 > threshold)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

# Deep Explanation: Quais Problemas a Observabilidade Resolve

## Raciocinio completo do instrutor

### MTTD e MTTR como KPIs do ecossistema

O instrutor enfatiza que MTTD e MTTR nao sao apenas metricas tecnicas — sao KPIs de negocio. A ideia central e: voce pode ter a melhor observabilidade do mundo, mas se o time demora para reagir (MTTD alto), isso ja e um problema em si. A observabilidade revela nao apenas problemas tecnicos, mas problemas de processo.

O MTTR comeca a contar APOS a deteccao. Isso e importante porque separa duas responsabilidades: detectar (pode ser automatizado) e resolver (depende de skill do time + qualidade das ferramentas).

O instrutor sugere que metas podem ser definidas em cima dessas metricas. Por exemplo:
- Meta de deteccao: 5-10 minutos
- Meta de resolucao: 20-30 minutos

Mas ele ressalva: "numeros magicos" — cada time e ecossistema tera valores diferentes, e horarios tambem impactam (on-call noturno vs horario comercial).

### Do macro ao micro

Um ponto forte da explicacao e a ideia de que observabilidade permite ir do macro ao micro. Voce pode ter uma visao superficial ("o sistema esta saudavel?") e drill down ate o detalhe ("qual query esta causando latencia no servico X?"). Essa navegabilidade e o que diferencia observabilidade de monitoramento simples.

### Estressar o sistema intencionalmente

O instrutor menciona que voce pode estressar o sistema para ver como ele se comporta. Isso conecta observabilidade com chaos engineering e load testing — voce precisa de dados observaveis para que esses testes tenham valor.

### Software preparado para falhar

Uma das analogias mais fortes: "falhas vao acontecer e a gente nao consegue controlar". O objetivo nao e evitar falhas (impossivel), mas estar preparado. O instrutor menciona design patterns de resiliencia:

- **Circuit Breaker**: quando um servico dependente falha, o circuit breaker "abre" e evita cascata de falhas
- **Outbox Pattern**: garante consistencia em sistemas distribuidos mesmo quando comunicacao falha

Esses patterns dependem de observabilidade para funcionar — voce precisa saber quando o circuit breaker abriu, quantas vezes, qual servico esta instavel.

### Otimizacao de custos — o argumento financeiro

O instrutor faz uma conexao direta entre observabilidade e custo:
1. **Custo de time**: se o time gasta muito tempo corrigindo bugs (firefighting), nao entrega features novas
2. **Custo de infra**: metricas de CPU/memoria revelam gargalos que, se otimizados, reduzem custo de cloud
3. **Capacity planning**: com dados historicos, voce dimensiona o time corretamente

### Troubleshooting em sistemas distribuidos

O instrutor e enfatico: sem observabilidade, microservicos sao um pesadelo para debugar. O cenario descrito:
- Varios servicos, varias chamadas entre eles
- Um incidente acontece
- Sem tracing, voce nao sabe onde esta o problema, quem causa a latencia
- Com tracing, voce tem o mapa de dependencias e o caminho completo da requisicao

A palavra-chave aqui e **tracing** (rastreio) — a capacidade de seguir uma requisicao do inicio ao fim atraves de todos os servicos.

### Comportamento do usuario como fonte de insights

Um ponto menos obvio: observabilidade pode revelar oportunidades de produto. O exemplo do instrutor:
- Um cliente usa o sistema de uma forma que nao e erro, mas tambem nao e 100% atendida
- Logs e metricas captam esse comportamento
- Isso gera insight para evolucao do produto

O instrutor menciona ferramentas como Sentry para observabilidade no frontend, capturando acoes especificas do usuario.

### Conexao com os pilares

O instrutor antecipa que os pilares da observabilidade serao abordados nas proximas aulas:
1. **Logs** — registros de eventos
2. **Traces** — rastreio de requisicoes
3. **Metricas** — medidas numericas do sistema

Esses tres pilares sao a base pratica dos conceitos discutidos acima.

---

# Code Examples: Quais Problemas a Observabilidade Resolve

Esta aula e conceitual e nao contem codigo. Os exemplos abaixo ilustram os conceitos discutidos com implementacoes praticas.

## Medindo MTTD e MTTR

```typescript
// Estrutura basica para tracking de incidentes
interface Incident {
  id: string
  detectedAt: Date        // Quando o alerta foi gerado
  acknowledgedAt?: Date   // Quando alguem deu ACK (MTTD termina aqui)
  resolvedAt?: Date       // Quando foi resolvido (MTTR termina aqui)
  severity: 'critical' | 'high' | 'medium' | 'low'
  service: string
}

// Calculo de MTTD em minutos
function calculateMTTD(incidents: Incident[]): number {
  const acknowledgedIncidents = incidents.filter(i => i.acknowledgedAt)
  const totalMinutes = acknowledgedIncidents.reduce((sum, incident) => {
    const diffMs = incident.acknowledgedAt!.getTime() - incident.detectedAt.getTime()
    return sum + diffMs / 60000
  }, 0)
  return totalMinutes / acknowledgedIncidents.length
}

// Calculo de MTTR em minutos
function calculateMTTR(incidents: Incident[]): number {
  const resolvedIncidents = incidents.filter(i => i.resolvedAt && i.acknowledgedAt)
  const totalMinutes = resolvedIncidents.reduce((sum, incident) => {
    const diffMs = incident.resolvedAt!.getTime() - incident.acknowledgedAt!.getTime()
    return sum + diffMs / 60000
  }, 0)
  return totalMinutes / resolvedIncidents.length
}
```

## Circuit Breaker — Pattern de resiliencia mencionado

```typescript
// Circuit Breaker simplificado
// Estados: CLOSED (normal) -> OPEN (falhas demais) -> HALF_OPEN (testando)
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  private failureCount = 0
  private lastFailureTime?: Date

  constructor(
    private readonly failureThreshold: number,
    private readonly resetTimeoutInMs: number
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime!.getTime() > this.resetTimeoutInMs) {
        this.state = 'HALF_OPEN'
      } else {
        throw new Error('Circuit breaker is OPEN — service unavailable')
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failureCount = 0
    this.state = 'CLOSED'
  }

  private onFailure() {
    this.failureCount++
    this.lastFailureTime = new Date()
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN'
    }
  }
}
```

## Exemplo de metas baseadas em MTTD/MTTR

```yaml
# observability-slos.yaml
# Exemplo de definicao de metas para o time
team: platform-engineering

detection:
  mttd_target_minutes: 5
  alert_channels:
    - slack
    - pagerduty
  on_call_rotation: true

repair:
  mttr_target_minutes: 30
  escalation_policy:
    - level: 1
      after_minutes: 15
      notify: on-call-engineer
    - level: 2
      after_minutes: 30
      notify: tech-lead
    - level: 3
      after_minutes: 60
      notify: engineering-manager

review:
  frequency: weekly
  metrics:
    - mttd_p50
    - mttd_p95
    - mttr_p50
    - mttr_p95
    - incidents_per_service
    - false_positive_rate
```

## Tracing distribuido — conceito ilustrado

```typescript
// Exemplo conceitual de como tracing funciona entre microservicos
// Cada requisicao carrega um trace-id que permite rastrear o caminho completo

// Servico A (API Gateway)
app.get('/orders/:id', async (req, res) => {
  const traceId = req.headers['x-trace-id'] || generateTraceId()

  // Chama Servico B com o mesmo trace-id
  const order = await fetch('http://order-service/orders/' + req.params.id, {
    headers: { 'x-trace-id': traceId }
  })

  // Chama Servico C com o mesmo trace-id
  const payment = await fetch('http://payment-service/payments?order=' + req.params.id, {
    headers: { 'x-trace-id': traceId }
  })

  // Com tracing, se payment-service esta lento,
  // voce ve no trace que o tempo total esta no span do payment-service
  // Sem tracing, voce so sabe que "GET /orders/:id esta lento"
})
```
