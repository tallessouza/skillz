---
name: rs-devops-acessando-container-cluster
description: "Applies Kubernetes port-forward techniques when user asks to 'access a pod', 'expose container port', 'port forward kubernetes', 'connect to cluster app', or 'kubectl port-forward'. Covers GUI (Lens) and CLI approaches for redirecting local ports to pod containers. Make sure to use this skill whenever working with Kubernetes pod networking or container access. Not for Kubernetes Service/Ingress configuration, network policies, or production traffic routing."
---

# Acessando Container Dentro do Cluster Kubernetes

> Para acessar uma aplicacao rodando em um Pod, use port-forward para mapear uma porta local para a porta do container dentro do cluster.

## Rules

1. **Pods tem interface de rede propria** — cada Pod recebe um IP interno do cluster, acessivel somente dentro do cluster, porque sem uma camada de network (Service/Ingress) nao ha rota externa
2. **Use port-forward para acesso em desenvolvimento** — redireciona uma porta local para a porta do container, porque e o metodo mais rapido para testar sem criar recursos de network
3. **Sempre especifique o namespace** — passe `-n <namespace>` no kubectl, porque o Pod so existe dentro do namespace onde foi criado e o comando falhara silenciosamente sem ele
4. **Pod deletado = port-forward quebrado** — se o Pod for removido, o port-forward retorna NOT FOUND, porque o redirecionamento aponta para um recurso que nao existe mais
5. **Recrie Pods com kubectl apply** — apos deletar, basta `kubectl apply -f <manifesto>` para recriar, porque o declarativo e idempotente

## How to write

### Port-forward via CLI

```bash
# Sintaxe: kubectl port-forward pod/<nome> <porta-local>:<porta-container> -n <namespace>
kubectl port-forward pod/nginx 8081:80 -n primeira-app

# Acesse em http://localhost:8081
```

### Port-forward via Lens (GUI)

```
1. Abra o Lens → navegue ate o Pod
2. Clique no container → veja a porta (containerPort do manifesto)
3. Clique "Forward" → defina porta local (ex: 8080) → Start
4. Acesse no browser automaticamente
```

### Verificar recursos do Pod

```bash
# Listar pods no namespace
kubectl get pods -n primeira-app

# Consumo de CPU/memoria (requer Metrics API instalado)
kubectl top pods -n primeira-app
```

### Ciclo deletar e recriar

```bash
# Deletar pod
kubectl delete pod nginx -n primeira-app

# Recriar a partir do manifesto
kubectl apply -f pod.yaml
```

## Example

**Before (erro comum — esqueceu namespace):**
```bash
kubectl port-forward pod/nginx 8080:80
# Erro: pod "nginx" not found (esta no namespace primeira-app, nao no default)
```

**After (com namespace correto):**
```bash
kubectl port-forward pod/nginx 8080:80 -n primeira-app
# Forwarding from 127.0.0.1:8080 -> 80
# Acesse http://localhost:8080 → "Welcome to nginx!"
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa testar app no cluster rapidamente | `kubectl port-forward` com porta local diferente |
| Pod nao responde apos port-forward | Verifique se Pod ainda existe com `kubectl get pods -n <ns>` |
| Metrics mostram NA no Lens | Metrics API nao instalado — instale metrics-server |
| Porta local ja em uso | Escolha outra porta local (ex: 8081, 8082) |
| Precisa expor para outros usuarios | Port-forward nao serve — crie um Service (proximo topico) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `kubectl port-forward` sem `-n` quando Pod esta em namespace custom | Sempre passe `-n <namespace>` |
| Usar port-forward em producao | Crie Service + Ingress para trafego real |
| Assumir que port-forward sobrevive a delete do Pod | Verifique o Pod antes de acessar |
| Ignorar erro NOT FOUND no port-forward | Recrie o Pod com `kubectl apply -f` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-acessando-container-dentro-do-cluster/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-acessando-container-dentro-do-cluster/references/code-examples.md)
