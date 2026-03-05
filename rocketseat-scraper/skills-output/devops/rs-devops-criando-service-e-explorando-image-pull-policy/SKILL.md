---
name: rs-devops-criando-service-image-pull-policy
description: "Enforces Kubernetes Service creation and imagePullPolicy best practices when writing K8s manifests. Use when user asks to 'create a service', 'expose deployment', 'deploy new version', 'configure imagePullPolicy', or 'write kubernetes yaml'. Applies rules: ClusterIP as default type, port mapping from 80 to container port, label selectors matching deployment, imagePullPolicy IfNotPresent with immutable tags. Make sure to use this skill whenever generating Kubernetes Service manifests or configuring image pull strategies. Not for Ingress configuration, CI/CD pipelines, or Helm charts."
---

# Kubernetes Service e imagePullPolicy

> Ao criar Services no Kubernetes, mapeie portas corretamente para o deployment e mantenha imutabilidade de tags com imagePullPolicy IfNotPresent.

## Rules

1. **Use ClusterIP como tipo padrao de Service** — porque e uma exposicao interna segura, suficiente para redirecionamento de porta e compativel com Ingress na frente
2. **Mapeie porta 80 (ou 443) no Service para a porta do container** — `port: 80` com `targetPort: 3000`, porque o Service representa o ponto de acesso do usuario, nao a porta interna do container
3. **Labels do selector devem coincidir com o deployment** — o `selector.matchLabels` do Service deve ser identico ao do Deployment e do template spec, porque e assim que o Service descobre quais pods servir
4. **Sempre declare imagePullPolicy: IfNotPresent** — porque garante imutabilidade: se a imagem ja existe no cluster, nao rebaixa, forcando novas versoes a terem novas tags
5. **Nunca reutilize tags de imagem** — cada deploy deve ter uma tag unica (v1, v2, commit hash), porque reutilizar tags (como latest ou sobrescrever v1) quebra rastreabilidade, rollback e auditoria
6. **Nomeie Services com sufixo descritivo** — `app-svc` ou `app-service`, porque facilita identificacao no cluster

## How to write

### Service basico com ClusterIP

```yaml
apiVersion: v1
kind: Service
metadata:
  name: app-svc
spec:
  type: ClusterIP
  selector:
    matchLabels:
      app: app-name
  ports:
    - port: 80
      targetPort: 3000
```

### imagePullPolicy no Deployment

```yaml
spec:
  containers:
    - name: app
      image: usuario/app:v2
      imagePullPolicy: IfNotPresent
      ports:
        - containerPort: 3000
```

## Example

**Before (ma pratica — tag reutilizada, sem policy):**

```yaml
# Deployment com tag fixa reutilizada
containers:
  - name: app
    image: usuario/app:v1  # sobrescrita a cada push
    ports:
      - containerPort: 3000
```

**After (com esta skill aplicada):**

```yaml
# Deployment com tag imutavel e policy explicita
containers:
  - name: app
    image: usuario/app:v2  # nova tag para nova versao
    imagePullPolicy: IfNotPresent
    ports:
      - containerPort: 3000
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Exposicao interna entre servicos | `type: ClusterIP` |
| Acesso externo necessario (sem Ingress) | `type: NodePort` ou `LoadBalancer` |
| Deploy de nova versao | Criar nova tag (v2, v3, hash do commit) |
| Ambiente de desenvolvimento local | `imagePullPolicy: Always` pode ser aceitavel |
| Producao | Sempre `IfNotPresent` com tags imutaveis |
| Porta do Service | 80 ou 443 (ponta do usuario) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `image: app:latest` | `image: app:v2` ou `image: app:abc123` |
| Sobrescrever tag v1 com novo codigo | Criar tag v2 para o novo codigo |
| `imagePullPolicy: Always` em producao | `imagePullPolicy: IfNotPresent` |
| Omitir `imagePullPolicy` | Declarar explicitamente |
| `port: 3000` no Service | `port: 80, targetPort: 3000` |
| Labels diferentes entre Service e Deployment | Labels identicos no selector |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
