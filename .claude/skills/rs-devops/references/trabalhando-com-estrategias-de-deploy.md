---
name: rs-devops-estrategias-de-deploy
description: "Applies Kubernetes rolling update deploy strategy configuration when writing Deployment manifests. Use when user asks to 'configure deploy strategy', 'set rolling update', 'configure maxSurge', 'zero downtime deployment', or 'scale replicas'. Enforces correct strategy block structure with maxSurge and maxUnavailable properties. Make sure to use this skill whenever creating or modifying Kubernetes Deployment manifests that involve update strategies. Not for Docker, CI/CD pipelines, or Helm chart templating."
---

# Estratégias de Deploy no Kubernetes

> Ao configurar deploys no Kubernetes, defina explicitamente a estratégia de atualização com maxSurge e maxUnavailable para controlar o cadenciamento e garantir zero downtime.

## Rules

1. **Sempre declare strategy explicitamente** — mesmo que use RollingUpdate (o default), porque torna o comportamento visível e auditável no manifesto
2. **Use porcentagem em vez de número inteiro** — `maxSurge: "20%"` escala automaticamente com o número de réplicas, evitando reconfiguração manual ao escalar
3. **maxUnavailable controla indisponibilidade** — define quantos pods podem ficar fora durante a atualização; use `0` se zero downtime for crítico, porque garante que nenhum pod antigo morra antes de um novo estar pronto
4. **maxSurge controla velocidade** — define quantos pods extras podem existir temporariamente; valores maiores = deploy mais rápido, porque mais pods novos sobem em paralelo
5. **imagePullPolicy: IfNotPresent** — evita pull desnecessário quando a imagem já existe no nó, porque acelera significativamente o rolling update
6. **Strategy só tem efeito na virada de versão** — alterar strategy sem mudar a tag não dispara novo deploy; o deploy ocorre quando há mudança no template do pod

## How to write

### Deployment com RollingUpdate explícito

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: minha-aplicacao
  namespace: minha-aplicacao
spec:
  replicas: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: "20%"
      maxUnavailable: "10%"
  selector:
    matchLabels:
      app: minha-aplicacao
  template:
    metadata:
      labels:
        app: minha-aplicacao
    spec:
      containers:
        - name: minha-aplicacao
          image: usuario/app:v2
          imagePullPolicy: IfNotPresent
```

### Deployment com Recreate (mata tudo, sobe tudo)

```yaml
spec:
  strategy:
    type: Recreate
  # Sem rollingUpdate block — Recreate não aceita essas propriedades
```

## Example

**Before (sem strategy — comportamento implícito e lento):**
```yaml
spec:
  replicas: 10
  selector:
    matchLabels:
      app: api
  template:
    spec:
      containers:
        - name: api
          image: usuario/api:v1
```

**After (strategy explícita com controle de cadenciamento):**
```yaml
spec:
  replicas: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 2
      maxUnavailable: 1
  selector:
    matchLabels:
      app: api
  template:
    spec:
      containers:
        - name: api
          image: usuario/api:v2
          imagePullPolicy: IfNotPresent
```

## Heuristics

| Situação | Faça |
|----------|------|
| Produção com SLA de uptime | `maxUnavailable: 0`, `maxSurge: "25%"` — nunca perde pod, sobe extras |
| Ambiente de staging/dev | `maxSurge: "50%"`, `maxUnavailable: "50%"` — deploy rápido, downtime aceitável |
| Poucos recursos no cluster | `maxSurge: 1`, `maxUnavailable: 1` — cadenciamento conservador |
| Muitas réplicas (20+) | Use porcentagem — escala proporcionalmente sem reconfiguração |
| Precisa derrubar tudo e recriar | `type: Recreate` — aceita downtime total entre versões |
| Mudou strategy mas não mudou tag | Nada acontece — force deploy mudando a tag ou annotation |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Omitir strategy e confiar no default implícito | Declarar `strategy.type: RollingUpdate` explicitamente |
| Usar `maxUnavailable: 0` com `maxSurge: 0` | Pelo menos um deve ser > 0, senão o deploy trava |
| Usar número inteiro fixo com réplicas variáveis | Usar porcentagem que escala automaticamente |
| Colocar `rollingUpdate` block com `type: Recreate` | Recreate não aceita sub-propriedades — remove o block |
| Ignorar `imagePullPolicy` em rolling updates | Setar `IfNotPresent` para evitar pulls redundantes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-trabalhando-com-estrategias-de-deploy/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-trabalhando-com-estrategias-de-deploy/references/code-examples.md)
