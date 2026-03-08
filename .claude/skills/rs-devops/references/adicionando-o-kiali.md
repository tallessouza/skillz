---
name: rs-devops-adicionando-o-kiali
description: "Configures Kiali as an Istio service mesh observability addon alongside Prometheus dependency. Use when user asks to 'install Kiali', 'visualize service mesh', 'monitor Istio traffic', 'add Istio addon', or 'service mesh observability'. Enforces Prometheus co-installation, local manifest versioning, and CRD prerequisite validation. Make sure to use this skill whenever setting up Istio observability or service mesh visualization. Not for general Kubernetes monitoring, Grafana standalone setup, or application-level observability without Istio."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: istio-observability
  tags: [istio, service-mesh, kiali, prometheus, observability]
---

# Adicionando o Kiali ao Istio

> Instale o Kiali como console de visualizacao do Istio Service Mesh, junto com o Prometheus como dependencia de metricas.

## Rules

1. **Sempre instale o Prometheus junto com o Kiali** — o Kiali depende do Prometheus para coletar metricas; sem ele, o dashboard exibe erro "Code Not Found Matrix" ao tentar buscar `prometheus.istio-system`
2. **Baixe os manifests para controle local** — use `wget` para salvar os YAMLs na pasta de infra do projeto, porque ter os manifestos versionados garante rastreabilidade e controle sobre o que roda no cluster
3. **Use os addons do repositorio oficial do Istio** — acesse `github.com/istio/istio/tree/master/samples/addons/` para garantir compatibilidade de versao com o Istio instalado
4. **Instale os CRDs do Kiali antes do deploy** — rode o comando de instalacao dos Kubernetes Gateway API CRDs para evitar problemas futuros
5. **Remova containers desnecessarios em ambiente local** — o config-reloader do Prometheus pode falhar ao baixar imagem localmente; remova-o do YAML para ambiente de desenvolvimento

## Steps

### Step 1: Baixar os manifestos

```bash
# Na pasta infra/ do projeto
wget https://raw.githubusercontent.com/istio/istio/master/samples/addons/kiali.yaml
wget https://raw.githubusercontent.com/istio/istio/master/samples/addons/prometheus.yaml
```

### Step 2: Instalar Gateway API CRDs

```bash
kubectl get crd gateways.gateway.networking.k8s.io &> /dev/null || \
  kubectl kustomize "github.com/kubernetes-sigs/gateway-api/config/crd?ref=v1.2.0" | kubectl apply -f -
```

### Step 3: Instalar Kiali

```bash
kubectl apply -f kiali.yaml
# Verificar
kubectl get pods -n istio-system -l app=kiali
```

### Step 4: Instalar Prometheus

```bash
kubectl apply -f prometheus.yaml
# Verificar
kubectl get pods -n istio-system -l app=prometheus
```

### Step 5: Acessar o Kiali

```bash
# Via port-forward ou kubectl proxy
kubectl port-forward svc/kiali -n istio-system 20001:20001
# Acesse http://localhost:20001
```

## Error handling

- Se Prometheus exibir `ImagePullBackOff` no container `config-reloader`: edite `prometheus.yaml`, remova o container `configmap-reload` do spec, e reaplique
- Se Kiali exibir "cannot load the graph" com erro de Prometheus: verifique se o pod do Prometheus esta Running em `istio-system`
- Se CRDs do Gateway API nao existirem: o Kiali pode falhar silenciosamente; sempre execute o Step 2

## Heuristics

| Situacao | Acao |
|----------|------|
| Ambiente local (Kind/Minikube) | Remover config-reloader do Prometheus, ignorar warnings de resources |
| Cluster de producao | Manter config-reloader, definir resources limits, configurar autenticacao no Kiali |
| Atualizou versao do Istio | Re-baixar os YAMLs do branch correspondente para manter compatibilidade |
| Precisa de tracing | Instalar tambem o Jaeger dos addons (proximo passo apos Kiali) |

## Verification

- `kubectl get pods -n istio-system` mostra Kiali e Prometheus como Running
- Dashboard do Kiali carrega sem erros de metricas
- Kiali exibe namespaces, aplicacoes, workloads e trafego da malha

## Troubleshooting

### Kiali exibe erro Code Not Found Matrix ao carregar dashboard
**Symptom:** Dashboard do Kiali mostra erro ao tentar buscar metricas
**Cause:** Prometheus nao esta instalado ou nao esta rodando no namespace istio-system
**Fix:** Instale o Prometheus dos addons do Istio e verifique que o pod esta Running com `kubectl get pods -n istio-system -l app=prometheus`

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-adicionando-o-kiali/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-adicionando-o-kiali/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
