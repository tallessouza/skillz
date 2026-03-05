---
name: rs-devops-entendendo-sobre-o-config-map
description: "Applies Kubernetes ConfigMap creation and injection patterns when writing K8s manifests. Use when user asks to 'create a configmap', 'inject environment variables in kubernetes', 'configure env vars in pods', 'pass config to containers', or 'manage non-sensitive configuration in k8s'. Covers configmap.yml authoring, valueFrom/configMapKeyRef injection in deployments, and namespace alignment. Make sure to use this skill whenever generating Kubernetes deployment manifests that need environment variables from ConfigMaps. Not for Secrets, sensitive data, or bulk env injection via envFrom."
---

# Kubernetes ConfigMap — Criacao e Injecao

> Separe a criacao do mapa de configuracao da injecao no pod — sao duas etapas distintas com nomes independentes.

## Rules

1. **ConfigMap so para dados nao-sensiveis** — use ConfigMap para nomes de app, feature flags, URLs publicas, porque dados sensiveis (senhas, tokens, API keys) pertencem a Secrets
2. **Namespace deve coincidir com a aplicacao** — sempre aplique o ConfigMap no mesmo namespace do Deployment, porque o pod so enxerga ConfigMaps do proprio namespace
3. **Nomes no ConfigMap sao independentes da app** — a key no ConfigMap (`appname`) nao precisa ser igual a env var do container (`APP`), porque o mapeamento acontece no `configMapKeyRef`
4. **Uma variavel = uma entrada name/valueFrom** — cada env var injetada via ConfigMap precisa de seu proprio bloco `name` + `valueFrom.configMapKeyRef`, porque nao ha atalho para injecao individual
5. **Proteja o .env em dois lugares** — adicione `.env` tanto no `.gitignore` quanto no `.dockerignore`, porque em build local o gitignore nao protege o contexto do Docker
6. **ConfigMap escala mal para muitas variaveis** — para 10+ variaveis, prefira `envFrom` com `configMapRef` em vez de injecao individual, porque o manifesto fica verboso e propenso a erro

## How to write

### ConfigMap manifest

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: appts
  namespace: primeira-aplicacao
data:
  appname: skillzapp
  # adicione mais chaves conforme necessario
  # outra_chave: outro_valor
```

### Injecao no Deployment via valueFrom

```yaml
spec:
  containers:
    - name: appts
      image: usuario/appts:v3
      env:
        - name: APP          # nome que a aplicacao espera
          valueFrom:
            configMapKeyRef:
              name: appts     # nome do ConfigMap
              key: appname    # chave dentro do ConfigMap
```

### Aplicar ConfigMap e Deployment

```bash
kubectl apply -f k8s/configmap.yml -n primeira-aplicacao
kubectl apply -f k8s/deployment.yaml -n primeira-aplicacao
```

## Example

**Before (pod sem ConfigMap — variavel undefined):**

```yaml
# deployment.yaml — sem env configurado
spec:
  containers:
    - name: appts
      image: usuario/appts:v3
      # nenhuma env definida → console.log imprime "undefined"
```

**After (com ConfigMap injetado):**

```yaml
# configmap.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: appts
data:
  appname: skillzapp

# deployment.yaml
spec:
  containers:
    - name: appts
      image: usuario/appts:v3
      env:
        - name: APP
          valueFrom:
            configMapKeyRef:
              name: appts
              key: appname
# → console.log imprime "skillzapp"
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Dado nao-sensivel (nome de app, URL publica) | ConfigMap |
| Dado sensivel (senha, token, API key) | Secret (proxima aula) |
| Poucas variaveis (1-5) | Injecao individual com `valueFrom` |
| Muitas variaveis (10+) | Usar `envFrom.configMapRef` |
| Build local com Docker | Adicionar `.env` no `.dockerignore` tambem |
| Pod mostra `undefined` apos deploy | Verificar se ConfigMap foi aplicado no mesmo namespace e fazer restart do deployment |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|--------------|
| Guardar senha em ConfigMap | Use Secret para dados sensiveis |
| Esquecer namespace no apply | `kubectl apply -f configmap.yml -n NAMESPACE` |
| Usar mesmo nome para key do ConfigMap e env var sem mapear | Mapeie explicitamente via `configMapKeyRef.key` |
| Colocar `.env` so no `.gitignore` em build local | Adicione em `.gitignore` E `.dockerignore` |
| Hardcodar valor direto no deployment | Extraia para ConfigMap para desacoplar config do deploy |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
