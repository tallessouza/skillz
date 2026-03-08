---
name: rs-devops-readiness
description: "Applies Kubernetes readiness probe configuration when ensuring applications are ready to receive traffic. Use when user asks to 'configure readiness probe', 'validate app readiness', 'separate health from readiness', 'configure /readyz endpoint', or 'prevent traffic to unready pods'. Enforces dedicated readiness endpoints and proper threshold configuration. Make sure to use this skill whenever deploying applications with external dependencies to Kubernetes. Not for application logic, Docker configuration, or CI/CD pipelines."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-readiness
  tags: [kubernetes, readiness, probe, health-check, nestjs, traffic, endpoint]
---

# Kubernetes Readiness Probe

> Configure readiness probes para validar continuamente se a aplicacao esta pronta para receber trafego, separando prontidao de saude.

## Rules

1. **Readiness usa rota dedicada `/readyz`** — nunca reutilize `/healthz`, porque readiness valida prontidao (conexoes externas prontas), health valida saude (aplicacao funcionando)
2. **Readiness roda continuamente** — diferente do startup probe que roda apenas na subida, readiness executa de tempos em tempos durante toda a vida do pod
3. **periodSeconds deve refletir a criticidade** — 15s e um bom padrao para maioria das aplicacoes, porque equilibra responsividade com carga de checagem
4. **failureThreshold em 3** — permite falhas transitorias sem derrubar o pod imediatamente, porque erros momentaneos nao significam que a aplicacao parou
5. **successThreshold em 1** — basta um sucesso para considerar pronto novamente, porque se respondeu ok uma vez, esta pronto
6. **timeoutSeconds em 1** — se a rota de readiness demora mais que 1s para responder, algo ja esta errado

## How to write

### Readiness Probe no manifesto

```yaml
readinessProbe:
  httpGet:
    path: /readyz
    port: 3000
  failureThreshold: 3
  successThreshold: 1
  timeoutSeconds: 1
  periodSeconds: 15
```

### Endpoint readyz no NestJS

```typescript
// ready.controller.ts
@Get('readyz')
checkReadiness() {
  // Validar conexoes externas: DB, cache, message broker
  return { status: 'ok' };
}
```

## Example

**Before (sem readiness, apenas startup):**
```yaml
spec:
  containers:
    - name: api
      image: api:v7
      startupProbe:
        httpGet:
          path: /healthz
          port: 3000
      # Pod marcado como ready assim que inicia — sem validacao continua
```

**After (com readiness probe configurado):**
```yaml
spec:
  containers:
    - name: api
      image: api:v8
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

## Heuristics

| Situation | Do |
|-----------|-----|
| Aplicacao conecta a servicos externos (DB, Kafka, Redis) | Readiness valida essas conexoes |
| Aplicacao e stateless simples | Readiness pode ser um ping basico na `/readyz` |
| Alto tempo de bootstrap (30s+) | Startup probe cuida da subida, readiness cuida depois |
| Erros aleatorios em producao | failureThreshold 3 absorve transitoriedades |
| Precisa de checagem mais frequente | Reduza periodSeconds (minimo razoavel: 5s) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Readiness e healthz na mesma rota | Rotas separadas: `/healthz` (startup/liveness) e `/readyz` (readiness) |
| `periodSeconds: 1` no readiness | `periodSeconds: 15` — readiness nao precisa ser agressivo |
| Readiness sem failureThreshold | Sempre defina failureThreshold (padrao 3) |
| Logica de negocio no endpoint readyz | Apenas validacao de prontidao (conexoes, dependencias) |
| Confundir readiness com liveness | Readiness = pronto para trafego, Liveness = ainda vivo |

## Troubleshooting

### Pod nunca fica Ready apesar de aplicacao estar rodando
**Symptom:** Pod permanece em 0/1 Ready, eventos mostram readiness probe failing
**Cause:** Endpoint `/readyz` nao implementado na aplicacao ou retornando status diferente de 200
**Fix:** Verificar se a rota `/readyz` existe no codigo, testar com `kubectl exec <pod> -- curl localhost:3000/readyz` para confirmar resposta

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

# Deep Explanation: Kubernetes Readiness Probe

## Diferenca fundamental entre os tres probes

O instrutor enfatiza que existem tres probes com papeis distintos:

- **Startup Probe**: roda apenas uma vez, na subida da aplicacao. Quando o servico sobe, o startup probe termina seu trabalho. Ele nao roda de tempos em tempos.
- **Readiness Probe**: roda continuamente, de tempos em tempos (ex: a cada 15 segundos). Valida se a aplicacao esta pronta para receber trafego.
- **Liveness Probe**: tambem roda continuamente. Valida se a aplicacao ainda esta viva (coberto em aula separada).

Frase-chave do instrutor: "O Startup Probe ele não roda de tempos em tempos. O Startup Probe é simplesmente na camada de subida. Subiu, o serviço dele terminou. O Readiness e o Liveness, eles ficam rodando de tempos em tempos."

## Por que rotas separadas

O readiness probe usa `/readyz` enquanto startup/liveness usam `/healthz`. Isso permite que:
- Readiness falhe (tirando o pod do balanceamento) sem que o liveness mate o pod
- Cada endpoint valide exatamente o que precisa

## Simulacao de cenarios reais

O instrutor simula dois cenarios criticos:

### 1. Alto tempo de bootstrap
Usando `setTimeout` de 30 segundos envolvendo o `bootstrap()` do NestJS para simular aplicacoes que demoram para subir (ex: conectando ao Kafka, banco de dados, cache). Isso testa se o startup probe aguenta esperar.

### 2. Erros aleatorios
Usando `new Date().getMilliseconds() % 2 === 0` para gerar erros 50% das vezes no health check. Simula instabilidade real de aplicacoes. O instrutor explica que isso impacta startup e liveness, mas NAO impacta readiness (que bate em `/readyz`, nao em `/healthz`).

Analogia do instrutor: "Aqui é como se a gente tivesse, por exemplo, um Kafka subindo também, ou pelo menos não a subida do Kafka, mas a aplicação se conectando ao Kafka, se conectando ao banco, se conectando ao cache, ou qualquer outro serviço externo."

## Parametros e seus significados

- **failureThreshold: 3** — precisa falhar 3 vezes seguidas para considerar nao-pronto
- **successThreshold: 1** — basta 1 sucesso para voltar a ser considerado pronto
- **timeoutSeconds: 1** — timeout de cada checagem individual
- **periodSeconds: 15** — intervalo entre checagens (o instrutor escolheu 15s para readiness, diferente do 1s do startup)

## O que acontece quando readiness falha

Quando o readiness probe falha alem do threshold, o Kubernetes:
1. Remove o pod do Service (para de enviar trafego)
2. Gera alertas nos eventos do pod
3. Pode causar restarts dependendo da configuracao

O instrutor menciona: "Caso tenha algum problema, nós vamos ter ali alguns alertas, nós vamos ter também alguns restarts."

---

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
