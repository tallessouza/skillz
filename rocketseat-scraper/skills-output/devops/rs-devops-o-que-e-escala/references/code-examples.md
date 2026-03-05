# Code Examples: O que e Escala no Kubernetes

Esta aula e conceitual — nao ha codigo no transcript. Os exemplos abaixo ilustram os conceitos discutidos com manifests Kubernetes reais que serao aprofundados nas aulas seguintes.

## Escala manual: definindo replicas fixas

```yaml
# deployment.yaml — escala manual com 3 replicas
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minha-api
spec:
  replicas: 3  # Numero fixo — nao reage a trafego
  selector:
    matchLabels:
      app: minha-api
  template:
    metadata:
      labels:
        app: minha-api
    spec:
      containers:
        - name: api
          image: minha-api:1.0
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 256Mi
```

**Observacao:** Com `replicas: 3` fixo, a aplicacao sempre tera 3 pods. Se o trafego subir 10x, continua com 3. Se o trafego cair a zero, continua com 3 (desperdicio).

## Escala automatica: HPA basico

```yaml
# hpa.yaml — auto escala baseada em CPU
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: minha-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: minha-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70  # Quando CPU media passar de 70%, escala
```

**Observacao:** O HPA monitora a metrica de CPU. Quando a media ultrapassa 70% (a "mediana" que o instrutor menciona), o Kubernetes cria mais pods. Quando normaliza, remove os extras.

## Teste de carga simples com k6

```javascript
// load-test.js — simula trafego para validar escala
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // ramp up: 50 usuarios
    { duration: '1m', target: 200 },    // pico: 200 usuarios (campanha de marketing)
    { duration: '30s', target: 0 },     // ramp down: trafego normaliza
  ],
};

export default function () {
  http.get('http://minha-api.default.svc.cluster.local/health');
  sleep(1);
}
```

```bash
# Executar teste de carga
k6 run load-test.js
```

**Observacao:** Este teste simula o cenario que o instrutor descreve — um pico de trafego seguido de normalizacao. Permite validar se o HPA reage corretamente.

## Comando kubectl para escala manual

```bash
# Escala manual via comando (sem editar manifest)
kubectl scale deployment minha-api --replicas=5

# Verificar pods apos escala
kubectl get pods -l app=minha-api

# Observar auto escala em acao
kubectl get hpa minha-api-hpa --watch
```