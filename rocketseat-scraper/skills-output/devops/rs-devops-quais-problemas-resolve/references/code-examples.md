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