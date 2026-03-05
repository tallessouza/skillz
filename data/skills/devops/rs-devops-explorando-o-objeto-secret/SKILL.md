---
name: rs-devops-explorando-o-objeto-secret
description: "Applies Kubernetes Secret object patterns when creating or reviewing K8s manifests. Use when user asks to 'create a secret', 'store sensitive data in k8s', 'add environment variables', 'configure deployment secrets', or 'handle API keys in Kubernetes'. Ensures base64 encoding, Opaque type usage, and correct secretKeyRef in Deployments. Make sure to use this skill whenever generating Kubernetes manifests that involve sensitive data like passwords, tokens, API keys, or connection strings. Not for ConfigMaps, Helm charts, or external secret managers like Vault."
---

# Kubernetes Secrets

> Informacoes sensiveis (API keys, tokens, connection strings) devem ser armazenadas em objetos Secret, nunca em ConfigMaps ou no codigo.

## Rules

1. **Nunca use ConfigMap para dados sensiveis** — ConfigMap e para informacao aberta; Secret e para informacao sensivel, porque ConfigMap expoe valores em texto plano
2. **Sempre encode valores em base64** — `echo -n "valor" | base64`; o Kubernetes rejeita Secrets com valores raw (erro `illegal base64`)
3. **Use type Opaque como padrao** — para segredos genericos (API keys, tokens, senhas); outros types existem para casos especificos como image pull secrets
4. **Referencie via secretKeyRef no Deployment** — nunca hardcode o valor; use `valueFrom.secretKeyRef` com `name` (metadata do Secret) e `key` (chave especifica)
5. **Nao converta base64 na aplicacao** — o Kubernetes injeta o valor ja decodificado automaticamente em tempo de injecao
6. **Separe valores por ambiente** — staging e producao devem ter Secrets distintos; o pipeline controla qual valor e injetado

## How to write

### Secret manifest

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  API_KEY: c3VwZXJTZWNyZXRLZXkxMjM=  # base64 encoded
  DATABASE_URL: cG9zdGdyZXM6Ly91c2VyOnBhc3NAaG9zdC9kYg==
```

### Encoding do valor

```bash
# Sempre use -n para evitar newline no final
echo -n "superSecretKey123" | base64
```

### Referencia no Deployment

```yaml
env:
  - name: APP_CONFIG
    valueFrom:
      configMapKeyRef:
        name: app-configmap
        key: APP_CONFIG
  - name: API_KEY
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: API_KEY
```

## Example

**Before (errado — valor raw no Secret):**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  API_KEY: minhaSenha123  # ERRO: illegal base64
```

**After (correto — valor em base64):**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  API_KEY: bWluaGFTZW5oYTEyMw==  # base64 de "minhaSenha123"
```

## Heuristics

| Situacao | Acao |
|----------|------|
| API key, token, senha, connection string | Sempre Secret, nunca ConfigMap |
| Valor de configuracao nao sensivel (app name, feature flag) | ConfigMap |
| Multiplas secrets no Deployment deixando arquivo grande | Usar envFrom (proxima evolucao) |
| Image registry privado | Secret com type diferente de Opaque |
| Aplicacao lendo valor estranho (base64 raw) | Verificar se esta usando secretKeyRef corretamente |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Colocar API key no ConfigMap | Usar Secret com type Opaque |
| Passar valor raw no campo data do Secret | Encodar com `echo -n "val" \| base64` |
| Hardcodar secrets no codigo-fonte | Injetar via Secret + env no Deployment |
| Decodificar base64 na aplicacao | Confiar na decodificacao automatica do K8s |
| Commitar .env com secrets no repositorio | Usar Secret objects gerenciados pelo pipeline |
| Usar o mesmo Secret para staging e producao | Separar Secrets por ambiente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
