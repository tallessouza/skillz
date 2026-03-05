# Code Examples: Kubernetes Readiness Probe

## Manifesto completo com startup + readiness

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: primeira-aplicacao
spec:
  replicas: 1
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: api:v8
          ports:
            - containerPort: 3000
          startupProbe:
            httpGet:
              path: /healthz
              port: 3000
            failureThreshold: 30
            periodSeconds: 1
          readinessProbe:
            httpGet:
              path: /readyz
              port: 3000
            failureThreshold: 3
            successThreshold: 1
            timeoutSeconds: 1
            periodSeconds: 15
```

## Endpoint readyz (NestJS)

```typescript
// ready.controller.ts
@Controller()
export class ReadyController {
  @Get('readyz')
  checkReadiness() {
    // Aqui validaria conexoes externas
    return { status: 'ok' };
  }
}
```

## Endpoint healthz com erro aleatorio (simulacao)

```typescript
// health.service.ts
@Injectable()
export class HealthService {
  checkHealth(): boolean {
    if (new Date().getMilliseconds() % 2 === 0) {
      return true;
    }
    return false;
  }
}

// health.controller.ts
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('healthz')
  checkHealth() {
    const isHealthy = this.healthService.checkHealth();
    if (isHealthy) {
      return { status: 'ok' };
    }
    throw new Error('Health check failed');
  }
}
```

## Simulacao de alto tempo de bootstrap

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

// Simula 30 segundos de bootstrap (conectando a Kafka, DB, cache, etc)
setTimeout(bootstrap, 30000);
```

## Comandos para verificar o estado dos pods

```bash
# Verificar pods no namespace
kubectl get pods -n primeira-aplicacao

# Acompanhar logs do pod (mostra checagens de saude e prontidao)
kubectl logs -f <pod-name> -n primeira-aplicacao

# Aplicar manifestos
kubectl apply -f k8s/

# Ver eventos do pod (mostra falhas de probe)
kubectl describe pod <pod-name> -n primeira-aplicacao
```

## Observando os logs

Ao verificar os logs do pod, voce vera entradas como:
```
Chequei a saúde da aplicação    # startup/liveness batendo em /healthz
Chequei a prontidão da aplicação # readiness batendo em /readyz
```

Essas mensagens aparecem periodicamente (a cada 15s para readiness), confirmando que os probes estao funcionando.

## Docker build para a nova versao

```bash
docker build -t api:v8 .
```