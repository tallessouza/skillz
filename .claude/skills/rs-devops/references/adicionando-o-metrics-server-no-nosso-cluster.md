---
name: rs-devops-metrics-server-cluster
description: "Guides Metrics Server installation on local Kubernetes clusters. Use when user asks to 'install metrics server', 'setup cluster metrics', 'configure kubectl top', 'fix TLS certificate error in k8s', or 'prepare cluster for HPA'. Applies steps: download YAML locally (GitOps), disable TLS verification for local clusters, verify pod status, troubleshoot certificate errors. Make sure to use this skill whenever setting up monitoring or autoscaling prerequisites in Kubernetes. Not for HPA configuration, production TLS setup, or Prometheus/Grafana monitoring."
---

# Instalação do Metrics Server em Cluster Kubernetes Local

> Baixe o manifesto YAML localmente, ajuste para ambiente local desabilitando verificação TLS, e aplique com kubectl — nunca rode apply direto de URL remota em projetos reais.

## Rules

1. **Nunca aplique YAML direto de URL remota em projetos reais** — use `wget` para baixar e versionar o arquivo, porque aplicar de URL fere o princípio GitOps (sem lastro local do que foi aplicado)
2. **Metrics Server é componente de cluster, não de aplicação** — não especifique namespace no apply, o próprio manifesto declara `namespace: kube-system` no metadata
3. **Em ambiente local, desabilite verificação TLS** — adicione `--kubelet-insecure-tls` nos args do container, porque clusters locais (Kind, minikube) não possuem Certificate Authority válido
4. **Renomeie o arquivo baixado** — `components.yaml` genérico vira `metricserver.yml`, porque nomes descritivos facilitam manutenção
5. **Verifique logs antes de assumir que funciona** — pod em `0/1 Ready` indica problema; use `kubectl logs` para diagnosticar
6. **Múltiplos recursos no mesmo YAML são separados por `---`** — ServiceAccount, ClusterRole, RoleBinding, Deployment e Service podem coexistir no mesmo arquivo

## Steps

### Step 1: Baixar o manifesto localmente

```bash
# Dentro do diretório k8s/ do projeto
wget https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
mv components.yaml metricserver.yml
```

### Step 2: Adicionar flag de TLS inseguro (ambiente local)

No arquivo `metricserver.yml`, localizar o Deployment e adicionar nos `args` do container:

```yaml
spec:
  containers:
  - args:
    - --cert-dir=/tmp
    - --secure-port=10250
    - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
    - --kubelet-use-node-status-port
    - --metric-resolution=15s
    - --kubelet-insecure-tls    # Adicionar esta linha
    image: registry.k8s.io/metrics-server/metrics-server:v0.7.0
```

### Step 3: Aplicar o manifesto local

```bash
kubectl apply -f metricserver.yml
```

### Step 4: Verificar se o pod está rodando

```bash
kubectl get po -n kube-system
# Metrics Server deve estar 1/1 Running
```

### Step 5: Validar métricas disponíveis

```bash
kubectl top po -n primeira-aplicacao
# Deve mostrar CPU (millicores) e memória por pod
```

## Error handling

- Se pod mostra `0/1 Ready`: rodar `kubectl logs <pod-name> -n kube-system` e verificar erros TLS
- Se erro `failed to verify certificate for IP 172.x.x.x`: falta a flag `--kubelet-insecure-tls`
- Se aplicou direto da URL e precisa refazer: `kubectl delete -f <url>` remove todos os recursos criados

## Heuristics

| Situação | Ação |
|----------|------|
| Cluster local (Kind, minikube, k3d) | Sempre adicionar `--kubelet-insecure-tls` |
| Cluster cloud (EKS, GKE, AKS) | Não desabilitar TLS — certificados válidos existem |
| Quer separar recursos em arquivos | Criar pasta `metricserver/` com `service.yml`, `deployment.yml` etc. |
| Namespace do pod aparece como kube-system | Está declarado no metadata do manifesto, não precisa passar `-n` no apply |
| `kubectl top` mostra `<unknown>` | Metrics Server ainda não coletou dados — aguardar ~15s |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| `kubectl apply -f https://...yaml` em projetos reais | `wget` + versionar + `kubectl apply -f local.yml` |
| Ignorar pod em `0/1 Ready` | `kubectl logs <pod> -n kube-system` para diagnosticar |
| Criar Metrics Server em namespace da aplicação | Deixar em `kube-system` (é componente de cluster) |
| Achar que sem Metrics Server o HPA funciona | HPA depende do Metrics Server para coletar CPU/memória |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-adicionando-o-metrics-server-no-nosso-cluster/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-adicionando-o-metrics-server-no-nosso-cluster/references/code-examples.md)
