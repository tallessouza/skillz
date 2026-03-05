# Code Examples: HPA Stabilization Window e Políticas de Escalabilidade

## Exemplo 1: HPA completo com behavior (usado na aula)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  minReplicas: 6
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 70
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 30
      policies:
        - type: Pods
          value: 2
          periodSeconds: 15
      selectPolicy: Max
    scaleUp:
      stabilizationWindowSeconds: 5
      policies:
        - type: Pods
          value: 2
          periodSeconds: 5
```

## Exemplo 2: Duas policies no scaleDown (exemplo didático)

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 30
    policies:
      - type: Pods
        value: 2
        periodSeconds: 15
      - type: Percent
        value: 20
        periodSeconds: 15
    selectPolicy: Min  # Escolhe a menos agressiva entre as duas
```

**Como funciona com 10 pods:**
- Policy Pods: remove 2 pods a cada 15s
- Policy Percent: remove 20% = 2 pods a cada 15s
- Com `selectPolicy: Min`: escolhe a que remove MENOS (neste caso, empate)

**Com 20 pods:**
- Policy Pods: remove 2 pods a cada 15s
- Policy Percent: remove 20% = 4 pods a cada 15s
- Com `selectPolicy: Min`: escolhe Pods (remove 2, que é menos)
- Com `selectPolicy: Max`: escolhe Percent (remove 4, que é mais)

## Exemplo 3: Scale Up imediato e agressivo

```yaml
behavior:
  scaleUp:
    stabilizationWindowSeconds: 0
    policies:
      - type: Percent
        value: 100
        periodSeconds: 5
```

Sobe todas as réplicas necessárias de uma vez em 5 segundos. Útil para aplicações de alta criticidade.

## Exemplo 4: Scale Down conservador (aplicação crítica com tráfego sazonal)

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 120  # 2 minutos de observação
    policies:
      - type: Pods
        value: 1
        periodSeconds: 30  # Remove 1 pod a cada 30s
```

Espera 2 minutos após tráfego cair, depois remove 1 pod por vez a cada 30 segundos. Muito conservador — mantém capacidade extra caso o pico retorne.

## Exemplo 5: Somente com CPU (sem memória)

```yaml
spec:
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50
  # Memória não é obrigatória — pelo menos UMA métrica é suficiente
```

## Comandos utilizados na aula

```bash
# Aplicar configuração do HPA
kubectl apply -f k8s/hpa.yaml

# Verificar estado do HPA (mostra current vs target e réplicas)
kubectl get hpa

# Ver utilização de CPU/memória dos pods
kubectl top pod

# Teste de estresse (executado dentro do cluster)
# O instrutor usou um pod fortio para gerar carga por 2 minutos
```

## Fluxo observado no teste

```
Estado inicial:
  - 6 réplicas (mínimo configurado)
  - CPU ociosa

Teste de estresse iniciado:
  - CPU sobe para 142% do target
  - HPA detecta em ~5s (stabilizationWindowSeconds do scaleUp)
  - Pods sobem de 2 em 2 a cada 5s
  - Chega a 10 réplicas (máximo)

Teste de estresse finalizado (após ~2 min):
  - CPU cai rapidamente para abaixo do threshold
  - Após 30s (stabilizationWindowSeconds do scaleDown):
    - Começa a dropar 2 pods a cada 15s
    - selectPolicy: Max → mais agressivo
  - Volta a 6 réplicas em menos de 1 minuto

Comparação com defaults:
  - Default scaleDown (300s): levaria 5+ minutos para voltar a 6
  - Com behavior configurado (30s): voltou em ~1 minuto
```