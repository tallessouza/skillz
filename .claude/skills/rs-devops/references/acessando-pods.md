---
name: rs-devops-acessando-pods
description: "Applies Kubernetes Service creation patterns when writing Service manifests, configuring cluster networking, or exposing deployments. Use when user asks to 'create a service', 'expose a deployment', 'configure cluster IP', 'access pods', or 'write service yaml'. Enforces selector matching, port mapping, and declarative-first principles. Make sure to use this skill whenever generating Kubernetes Service manifests or configuring intra-cluster networking. Not for Ingress, LoadBalancer, NodePort configuration, or external cluster access."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-services
  tags: [kubernetes, service, cluster-ip, networking]
---

# Acessando Pods com Services

> Todo acesso a pods passa por um Service — nunca acesse deployments diretamente, porque a quantidade de pods e sempre variavel.

## Rules

1. **Sempre crie um Service para expor um Deployment** — Deployments e ReplicaSets sao controladores sem interface de rede, porque nao possuem endpoint proprio acessivel
2. **Use ClusterIP como tipo padrao** — cria um IP interno do cluster, porque e a forma basica de service discovery intra-cluster
3. **Mantenha relacao 1:1 entre Service e Deployment** — um service por deployment, porque simplifica o roteamento e o service discovery
4. **Conecte via selector com match exato de labels** — o selector do Service deve corresponder exatamente as labels do template do Deployment, porque e assim que o Kubernetes roteia trafego para os pods corretos
5. **Diferencie port de targetPort** — `port` e a porta do Service, `targetPort` e a porta do container, porque sua aplicacao pode rodar em porta diferente da exposta
6. **Declarativo e sempre a fonte da verdade** — alteracoes imperativas (via UI ou CLI) serao sobrescritas no proximo apply, porque o manifesto YAML e o state desejado

## How to write

### Service basico com ClusterIP

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {app}-svc
spec:
  type: ClusterIP
  selector:
    app: {app}
  ports:
    - port: 80
      targetPort: 80
```

### Quando container roda em porta diferente

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-svc
spec:
  type: ClusterIP
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 3000
```

### Aplicar e verificar

```bash
kubectl apply -f service.yaml -n {namespace}
kubectl get svc -n {namespace}
kubectl port-forward svc/{app}-svc 8080:80 -n {namespace}
```

## Example

**Before (acesso direto ao deployment — errado):**
```bash
# Gambiarra — funciona mas nao e correto
kubectl port-forward deployment/nginx 8080:80
```

**After (acesso via Service — correto):**
```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  type: ClusterIP
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
```
```bash
kubectl apply -f service.yaml -n primeiro-app
kubectl port-forward svc/nginx-svc 8080:80 -n primeiro-app
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Precisa acessar pods dentro do cluster | ClusterIP |
| Precisa acessar de fora do cluster | NodePort, LoadBalancer ou Ingress (fora deste skill) |
| App roda na porta 3000 mas quer expor na 80 | `port: 80`, `targetPort: 3000` |
| Escalou replicas via UI emergencialmente | Replicar imediatamente no YAML declarativo |
| Nao sabe qual label usar no selector | Verificar `spec.template.metadata.labels` do Deployment |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `kubectl port-forward deployment/x` | Crie um Service e use `kubectl port-forward svc/x-svc` |
| Escalar replicas so via UI/CLI | Altere `spec.replicas` no YAML e aplique com `kubectl apply` |
| Service sem selector | Adicione selector com labels que casem com o Deployment |
| Mesmo nome para Service e Deployment | Use sufixo `-svc` no Service: `nginx-svc` |
| Alterar cluster sem atualizar declarativo | Declarativo e fonte da verdade — sempre atualize o YAML |

## Troubleshooting

### Service nao roteia trafego para os pods
**Symptom:** Port-forward no Service funciona mas nenhum pod recebe requisicoes
**Cause:** O selector do Service nao corresponde as labels do template do Deployment
**Fix:** Compare `spec.selector` do Service com `spec.template.metadata.labels` do Deployment — devem ser identicos

### Erro "no endpoints available" ao acessar Service
**Symptom:** `kubectl port-forward svc/app-svc 8080:80` retorna erro de endpoints
**Cause:** Nenhum pod com as labels corretas esta rodando no namespace
**Fix:** Verifique com `kubectl get pods -n <ns> --show-labels` se os pods existem e tem as labels esperadas

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-acessando-pods/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-acessando-pods/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
