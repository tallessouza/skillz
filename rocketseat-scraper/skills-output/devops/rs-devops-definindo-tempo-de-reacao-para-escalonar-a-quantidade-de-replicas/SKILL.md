---
name: rs-devops-hpa-stabilization-window
description: "Applies Kubernetes HPA stabilization window and scaling policies when configuring Horizontal Pod Autoscaler behavior. Use when user asks to 'configure HPA', 'set up autoscaling', 'define scale up policy', 'scale down behavior', 'stabilization window', or 'HPA behavior'. Enforces proper stabilization windows, scaling policies with cadence, and selectPolicy configuration. Make sure to use this skill whenever writing or reviewing HPA manifests with behavior sections. Not for cluster-level autoscaling (Cluster Autoscaler), node scaling, or Vertical Pod Autoscaler."
---

# HPA Stabilization Window e Políticas de Escalabilidade

> Configure o bloco `behavior` do HPA com janelas de estabilização e políticas de cadência para controlar como e quando réplicas sobem ou descem.

## Rules

1. **Sempre defina pelo menos uma métrica no HPA** — sem métrica (CPU ou memória), o HPA não consegue escalar, porque ele precisa de um trigger para agir
2. **Scale Up com janela próxima de zero** — use 0 ou valor muito baixo (5s) para evitar downtime, porque se o trigger já bateu, você quer réplicas novas imediatamente
3. **Scale Down com janela maior que Scale Up** — default é 300s (5 min), ajuste conforme criticidade, porque derrubar pods rápido demais pode causar instabilidade se o pico voltar
4. **Use policies com cadência no Scale Down** — em vez de dropar tudo de uma vez, remova N pods a cada X segundos, porque isso dá tempo de detectar se o tráfego volta
5. **selectPolicy vai dentro de scaleDown/scaleUp, não em behavior** — colocar no nível errado causa erro de validação no kubectl apply
6. **Valores reais vêm da observabilidade em produção** — no dia zero você não tem esses números, ajuste conforme monitora a aplicação com tráfego real

## How to write

### Estrutura completa do behavior

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

### Policy por porcentagem

```yaml
policies:
  - type: Percent
    value: 20
    periodSeconds: 15
# Remove 20% dos pods a cada 15 segundos
```

### Scale Up imediato (100% de uma vez)

```yaml
scaleUp:
  stabilizationWindowSeconds: 0
  policies:
    - type: Percent
      value: 100
      periodSeconds: 5
```

## Example

**Before (sem behavior — defaults do Kubernetes):**
```yaml
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
# Scale down demora 5 min (300s default)
# Scale up sem controle de cadência
```

**After (com behavior configurado):**
```yaml
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

## Heuristics

| Situação | Faça |
|----------|------|
| Aplicação com tráfego sazonal e alta criticidade | `stabilizationWindowSeconds` maior no scaleDown (60-300s) |
| Aplicação tolerante a latência momentânea | `stabilizationWindowSeconds: 0` no scaleUp |
| Precisa escalar rápido no up | Policy `Percent: 100` com `periodSeconds` baixo |
| Precisa desescalar gradualmente | Policy `Pods` com value baixo e `periodSeconds` de 15-30s |
| Duas policies no mesmo bloco | Defina `selectPolicy: Min` (menos agressiva) ou `Max` (mais agressiva) |
| Dia zero sem dados de produção | Use defaults conservadores, ajuste após observabilidade |
| Scale down só acontece se estiver abaixo do target | Lembre que o trigger precisa estar inativo pelo período da janela inteira |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| HPA sem nenhuma métrica | Defina pelo menos CPU ou memória como métrica |
| `stabilizationWindowSeconds: 300` no scaleUp | Use 0 ou valor muito baixo (5s) para reagir rápido |
| `selectPolicy` dentro de `behavior` direto | Coloque dentro de `scaleDown` ou `scaleUp` |
| Dropar todas réplicas de uma vez no scaleDown | Use policy com cadência (ex: 2 pods a cada 15s) |
| Copiar valores de estabilização de tutoriais sem contexto | Calibre com dados reais de observabilidade da sua aplicação |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
