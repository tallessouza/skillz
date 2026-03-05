---
name: rs-devops-gateway-conceito-config
description: "Applies Istio Gateway configuration patterns in Kubernetes service mesh setups. Use when user asks to 'configure gateway', 'setup istio gateway', 'create service mesh entry point', 'centralize requests', or 'configure ingress for istio'. Covers Gateway CRD installation, gateway YAML structure, Ambient Mode vs Sidecar label differences, and load balancer setup. Make sure to use this skill whenever configuring Istio gateways or discussing service mesh entry points. Not for application code, CI/CD pipelines, or non-Istio ingress controllers like Nginx or Traefik."
---

# Gateway no Istio — Conceito e Configuracao Inicial

> O Gateway e uma configuracao de borda que centraliza todas as requisicoes em um unico ponto antes de entrar na sua rede.

## Conceito Central

O Gateway funciona como um portao na borda da rede. Tudo que chegar passa por ele, permitindo aplicar regras (rate limit, autenticacao) antes do trafego atingir os servicos internos. Sem gateway, voce bate diretamente em cada servico — com muitas aplicacoes, isso se torna incontrolavel.

## Rules

1. **Instale os Gateway API CRDs antes de criar Gateways** — o Istio nao inclui os CRDs do Kubernetes Gateway API por padrao, porque sao recursos separados mantidos pelo SIG-Network
2. **Use `gateway.networking.k8s.io` como apiVersion** — nao confunda com `networking.istio.io/v1beta1` (API legada), porque a API padrao do Kubernetes e o caminho recomendado
3. **Ambient Mode nao requer redeploy** — basta aplicar a label no namespace e todos os pods existentes ja respeitam, porque o ztunnel intercepta no nivel do node
4. **Sidecar Mode requer redeploy** — a injecao so ocorre na criacao do pod, porque o sidecar precisa ser adicionado como container no pod
5. **Gateway sem rotas retorna 404** — o gateway sozinho apenas ouve, porque sem HTTPRoute nao ha destino para redirecionar
6. **Restrinja allowedRoutes por namespace** — use `namespaces.from: Same` para limitar escopo, porque rotas de outros namespaces podem criar conflitos

## Configuracao do Gateway

### Passo 1: Instalar Gateway API CRDs

```bash
kubectl get crd gateways.gateway.networking.k8s.io &> /dev/null || \
  kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/latest/download/standard-install.yaml
```

### Passo 2: Criar o arquivo gateway.yaml

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: app-service-mesh-gtw
  namespace: app
spec:
  gatewayClassName: istio
  listeners:
    - name: http
      port: 80
      protocol: HTTP
      allowedRoutes:
        namespaces:
          from: Same
```

### Passo 3: Aplicar no cluster

```bash
kubectl apply -f gateway.yaml -n app
```

### Passo 4: Verificar criacao

O gateway cria um Service do tipo LoadBalancer. Em ambiente local (Kind/k3d), o external IP fica `<pending>` — isso e esperado.

## Ambient Mode vs Sidecar — Diferenca na Label

| Aspecto | Sidecar | Ambient Mode |
|---------|---------|--------------|
| Label no namespace | `istio-injection=enabled` | `istio.io/dataplane-mode=ambient` |
| Precisa redeploy? | Sim | Nao |
| Quando aplica? | Proximo deploy do pod | Imediatamente |
| Mecanismo | Container injetado no pod | ztunnel no node intercepta |

## Heuristics

| Situacao | Acao |
|----------|------|
| Gateway retorna 404 | Faltam HTTPRoutes — configure rotas com destino |
| CRD nao encontrado ao aplicar | Instale os Gateway API CRDs primeiro |
| External IP pendente em local | Esperado — use port-forward ou NodePort |
| Muitos servicos expostos individualmente | Centralize em um Gateway com rotas |

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Expor cada servico com seu proprio ingress | Centralizar em um Gateway com HTTPRoutes |
| Criar Gateway sem instalar CRDs | Verificar/instalar CRDs antes |
| Assumir que label do sidecar aplica sem redeploy | Redeploy pods apos aplicar label de sidecar |
| Deixar `allowedRoutes` aberto para todos namespaces | Restringir com `from: Same` ou lista explicita |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-primeiros-testes-e-conhecendo-o-conceito-de-gateway/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-primeiros-testes-e-conhecendo-o-conceito-de-gateway/references/code-examples.md)
