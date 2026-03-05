# Code Examples: Métricas Customizadas com OpenTelemetry

## 1. Configuração completa do tracer.ts (com MeterProvider)

```typescript
// tracer.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { MeterProvider } from '@opentelemetry/sdk-metrics'
import { metrics } from '@opentelemetry/api'
import { resource } from './resource' // resource com serviceName e version

// NodeSDK para auto-instrumentação e tracing (SEM metric reader aqui)
const sdk = new NodeSDK({
  resource: resource,
  // ... tracing config
})

// MeterProvider separado para métricas customizadas
const meterProvider = new MeterProvider({
  resource: resource.merge(resource),
  readers: [metricReader], // metric reader configurado apenas aqui
})

// Registra globalmente
metrics.setGlobalMeterProvider(meterProvider)

// Exporta ambos
export { sdk, metrics }
```

## 2. Importação no domain.ts (entry point)

```typescript
// domain.ts
import { sdk } from './tracer'

sdk.start()
// ... resto da aplicação
```

## 3. Uso no service (AppService)

```typescript
// app.service.ts
import { metrics } from './tracer'

const meter = metrics.getMeter('app-skillz')

// Criação dos counters
const successMetric = meter.createCounter('hello_success')
const errorMetric = meter.createCounter('hello_error')

// Handler de sucesso (rota principal)
function handleHello() {
  successMetric.add(1)
  return { message: 'Hello World' }
}

// Handler simulando erro (rota /metric-test)
function handleMetricTest() {
  errorMetric.add(1)
  return { message: 'Métrica adicionada' }
}
```

## 4. Definição das rotas

```typescript
// Rota principal - incrementa success
app.get('/hello', (req, res) => {
  const result = appService.handleHello()
  res.json(result)
})

// Rota de teste de erro - incrementa error
app.get('/metric-test', (req, res) => {
  const result = appService.handleMetricTest()
  res.json(result)
})
```

## 5. Padrão real com try-catch

```typescript
// Como seria em produção (não simulado)
async function processOrder(orderId: string) {
  const meter = metrics.getMeter('app-skillz')
  const orderSuccess = meter.createCounter('order_process_success')
  const orderError = meter.createCounter('order_process_error')

  try {
    const result = await orderRepository.process(orderId)
    orderSuccess.add(1)
    return result
  } catch (error) {
    orderError.add(1)
    throw error
  }
}
```

## 6. Queries no Prometheus

```promql
# Ver total de sucessos
hello_success_total{service_name="app-skillz", service_version="1.0"}

# Ver total de erros
hello_error_total{service_name="app-skillz", service_version="1.0"}

# Comparar ambos no mesmo gráfico (adicione como query A e B)
# Query A: hello_success_total{service_name="app-skillz"}
# Query B: hello_error_total{service_name="app-skillz"}
```

## 7. Opções disponíveis no meter

```typescript
const meter = metrics.getMeter('app-skillz')

// Counter (monotônico, só incrementa)
const counter = meter.createCounter('name')
counter.add(1)    // incrementa em 1
counter.add(100)  // incrementa em 100 (possível mas incomum)

// Gauge (sobe e desce) - para próximas aulas
// const gauge = meter.createGauge('name')

// Histogram (distribuição) - próxima aula
// const histogram = meter.createHistogram('name')
```