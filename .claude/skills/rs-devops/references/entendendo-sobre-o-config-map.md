---
name: rs-devops-entendendo-sobre-o-config-map
description: "Applies Kubernetes ConfigMap creation and injection patterns for non-sensitive configuration. Use when user asks to 'create ConfigMap', 'inject environment variables from ConfigMap', 'externalize configuration in K8s', or 'use configMapKeyRef'. Enforces ConfigMap for non-sensitive data only, namespace matching, independent naming with configMapKeyRef mapping, and envFrom for many variables. Make sure to use this skill whenever creating ConfigMap manifests or injecting configuration into Kubernetes pods. Not for secrets (use explorando-o-objeto-secret) or application config files."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-configuracao
  tags: [kubernetes, configmap, environment-variables, namespace, env, configmapkeyref]
---

# Kubernetes ConfigMap — Criacao e Injecao

> Separe a criacao do mapa de configuracao da injecao no pod — sao duas etapas distintas com nomes independentes.

## Rules

1. **ConfigMap so para dados nao-sensiveis** — senhas e tokens pertencem a Secrets
2. **Namespace deve coincidir com a aplicacao** — pod so enxerga ConfigMaps do proprio namespace
3. **Nomes no ConfigMap sao independentes da app** — mapeamento acontece no `configMapKeyRef`
4. **Proteja o .env em dois lugares** — `.gitignore` E `.dockerignore`
5. **ConfigMap escala mal para muitas variaveis** — para 10+ variaveis, use `envFrom`

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
```

### Injecao no Deployment
```yaml
spec:
  containers:
    - name: appts
      env:
        - name: APP
          valueFrom:
            configMapKeyRef:
              name: appts
              key: appname
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Guardar senha em ConfigMap | Use Secret |
| Esquecer namespace no apply | `kubectl apply -f configmap.yml -n NAMESPACE` |
| `.env` so no `.gitignore` | Adicione em `.gitignore` E `.dockerignore` |
| Hardcodar valor direto no deployment | Extraia para ConfigMap |

## Troubleshooting

### Pod nao inicia com erro "configmap not found"
**Symptom:** Pod fica em CreateContainerConfigError referenciando ConfigMap inexistente
**Cause:** ConfigMap nao foi criado no mesmo namespace do Pod ou nome esta incorreto
**Fix:** Verificar que o ConfigMap existe no mesmo namespace com `kubectl get configmap -n <namespace>` e que o nome bate com o `configMapKeyRef.name`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
