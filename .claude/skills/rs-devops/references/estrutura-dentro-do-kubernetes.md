---
name: rs-devops-estrutura-dentro-do-kubernetes
description: "Applies Kubernetes sidecar pattern when designing pod architectures with service mesh. Use when user asks to 'add istio', 'configure sidecar', 'setup service mesh', 'deploy with envoy proxy', or 'configure namespace injection'. Enforces correct multi-container pod usage: sidecars yes, multiple apps no. Make sure to use this skill whenever designing Kubernetes pod specs with proxies or service mesh components. Not for general container orchestration, Helm charts, or CI/CD pipeline configuration."
---

# Estrutura do Sidecar no Kubernetes

> Pods podem rodar multiplos containers, mas apenas sidecars (proxies, vaults) devem acompanhar o container principal — nunca outras aplicacoes.

## Rules

1. **Nunca rode multiplas aplicacoes no mesmo pod** — aplicacao A e aplicacao B no mesmo pod concorrem por recursos e dificultam roteamento de trafego
2. **Segregue aplicacoes em ReplicaSets separados** — cada aplicacao tem seu proprio ReplicaSet, seus proprios pods, porque escala e roteamento sao independentes
3. **Sidecars sao a excecao valida para multi-container** — um sidecar e um proxy/auxiliar, nao uma aplicacao concorrente, entao coexiste no pod
4. **Use injecao automatica de sidecar via namespace** — configurar sidecar manualmente em cada YAML nao escala, porque voce depende de todo YAML ter a referencia correta
5. **Configure no namespace ou como cluster policy** — garanta que toda aplicacao nova que subir ja tenha o service mesh rodando automaticamente
6. **Multiplos sidecars sao validos quando necessario** — alem do service mesh, voce pode ter sidecar para Vault ou outros servicos auxiliares

## How to write

### Namespace com injecao automatica de sidecar (Istio)

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: skillz
  labels:
    istio-injection: enabled  # Toda app neste namespace ganha sidecar automaticamente
```

### Pod com sidecar (estrutura resultante)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: minha-app
  namespace: skillz  # Namespace com injection habilitado
spec:
  containers:
    - name: app           # Container principal da aplicacao
      image: minha-app:latest
      ports:
        - containerPort: 8080
    # O sidecar do Istio (envoy) e injetado automaticamente
    # NAO adicione manualmente se istio-injection: enabled
```

## Example

**Before (anti-pattern — duas aplicacoes no mesmo pod):**

```yaml
spec:
  containers:
    - name: app-a
      image: aplicacao-a:latest
    - name: app-b
      image: aplicacao-b:latest  # ERRADO: outra aplicacao no mesmo pod
```

**After (correto — pods separados, sidecar automatico):**

```yaml
# ReplicaSet A
spec:
  containers:
    - name: app-a
      image: aplicacao-a:latest
    # sidecar injetado automaticamente via namespace
---
# ReplicaSet B (separado)
spec:
  containers:
    - name: app-b
      image: aplicacao-b:latest
    # sidecar injetado automaticamente via namespace
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nova aplicacao no cluster com service mesh | Use namespace com `istio-injection: enabled` |
| Precisa de sidecar para Vault + Istio | Dois sidecars no mesmo pod e valido |
| Duas aplicacoes precisam se comunicar | Pods separados, cada um com seu sidecar |
| Sidecar manual em YAML individual | Migre para injecao automatica por namespace |
| Cluster inteiro precisa de mesh | Use cluster policy ao inves de namespace individual |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Duas apps diferentes no mesmo pod | ReplicaSets separados, um pod por app |
| Sidecar configurado manualmente em cada YAML | `istio-injection: enabled` no namespace |
| Confiar que dev lembrou de adicionar sidecar | Injecao automatica como default |
| Rodar sem verificar se sidecar foi injetado | `kubectl get pods -o jsonpath='{.spec.containers[*].name}'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-estrutura-dentro-do-kubernetes/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-estrutura-dentro-do-kubernetes/references/code-examples.md)
