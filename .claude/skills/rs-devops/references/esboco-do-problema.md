---
name: rs-devops-esboco-do-problema
description: "Applies Kubernetes core concepts when designing container orchestration architectures. Use when user asks to 'deploy to kubernetes', 'scale an application', 'configure pods', 'set resource limits', 'create HPA', or 'containerize for k8s'. Covers pod replication, resource requests, self-healing, stateless design, and horizontal pod autoscaling. Make sure to use this skill whenever planning Kubernetes workloads or discussing container orchestration trade-offs. Not for Docker-only setups, CI/CD pipelines, or Helm chart templating."
---

# Kubernetes: Esboço do Problema

> Aplicacoes containerizadas precisam de orquestracao para garantir redundancia, elasticidade e gestao de recursos — o Kubernetes resolve isso com pods efemeros, replicacao horizontal e autoscaling.

## Conceitos Fundamentais

1. **Container = unidade efemera** — containers morrem a qualquer momento, porque o Kubernetes mata e recria containers como mecanismo padrao de recuperacao (self-healing)
2. **Pod = container no Kubernetes** — pod e replica sao sinonimos praticos; cada pod e isolado mesmo rodando a mesma aplicacao
3. **Stateless por padrao** — pods nao guardam estado local, porque multiplas replicas da mesma app tornam estado local inconsistente
4. **Recursos sao declarativos** — cada pod declara quanto de RAM e CPU precisa, porque o cluster precisa saber quanto alocar por replica
5. **Replicacao horizontal primeiro** — escale adicionando mais pods (HPA), nao aumentando recursos de um pod (VPA), porque horizontal e o padrao do Kubernetes
6. **Elasticidade tem custo** — mais replicas = mais custo; configure minimo e maximo para otimizar

## Como Declarar Recursos

```yaml
# Cada pod declara seus recursos individualmente
# 3 replicas x 1GB RAM = 3GB total no cluster
resources:
  requests:
    memory: "1Gi"
    cpu: "1000m"    # 1000 millicores = 1 vCPU
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

## Como Configurar HPA

```yaml
# HPA = Horizontal Pod Autoscaler
# Define minimo, maximo e condicao de escala
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-a-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app-a
  minReplicas: 3
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 70   # escala quando atingir 70% de RAM
```

## Exemplo

**Antes (sem orquestracao):**
- Container morre → ninguem sabe por que
- Sem restart automatico
- Sem replicacao
- Sem controle de recursos

**Depois (com Kubernetes):**
- Container morre → self-healing restarta automaticamente
- 3 replicas garantem redundancia
- HPA escala de 3 a 8 pods quando RAM > 70%
- Recursos declarados: 1Gi RAM + 1 vCPU por pod
- Volta ao minimo quando trafego reduz (economia)

## Heuristics

| Situacao | Faca |
|----------|------|
| App precisa guardar estado (logs, assets) | Desacople: S3 para assets, Prometheus para logs |
| Precisa de estado no pod | Use PersistentVolume ou StatefulSet (caso especifico) |
| Container usando 70%+ de recurso | Configure HPA com threshold nesse valor |
| Multiplas apps no cluster | Declare recursos diferentes por app conforme necessidade |
| Atingiu maximo de replicas | Configure alerta; avalie se precisa aumentar o max |
| Periodo de pico passou | HPA reduz automaticamente ao minimo (economia) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Guardar logs dentro do container | Exportar para Prometheus/ferramenta de observabilidade |
| Guardar assets no filesystem do pod | Enviar para S3/Blob Storage |
| Rodar sem limite de recursos | Declarar requests e limits para cada pod |
| Escalar apenas verticalmente | Usar HPA (horizontal) como padrao |
| Ignorar efemeridade do container | Projetar app stateless desde o inicio |
| Rodar replicas fixas sem autoscaling | Configurar HPA com min/max adequados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-esboco-do-problema/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-esboco-do-problema/references/code-examples.md)
