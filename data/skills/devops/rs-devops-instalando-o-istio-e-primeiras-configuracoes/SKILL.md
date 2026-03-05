---
name: rs-devops-instalando-istio-config
description: "Guides Istio installation and initial configuration on Kubernetes clusters. Use when user asks to 'install Istio', 'setup service mesh', 'configure Istio on cluster', 'install istioctl', or 'setup sidecar proxy'. Covers istioctl download, cluster installation, profile selection, and verification via kubectl and Lens. Make sure to use this skill whenever setting up Istio or troubleshooting Istio installation. Not for Istio traffic management rules, VirtualService config, or application sidecar injection."
---

# Instalando o Istio e Primeiras Configuracoes

> Instale o Istio no cluster Kubernetes usando istioctl, verifique os componentes e confirme que Istiod e Ingress Gateway estao operacionais antes de integrar aplicacoes.

## Prerequisites

- Cluster Kubernetes rodando (kind, minikube, EKS, GKE, etc.)
- `kubectl` configurado e apontando para o cluster
- Acesso a internet para download do istioctl
- Se usar Lens: instalado e configurado (opcional, apenas visualizacao)

## Steps

### Step 1: Baixar e instalar o istioctl

```bash
# Download do Istio (inclui istioctl)
curl -L https://istio.io/downloadIstio | sh -

# Entrar no diretorio (ajustar versao conforme disponivel)
cd istio-1.26.0

# Exportar o binario como variavel de ambiente
export PATH=$PWD/bin:$PATH
```

Apos o export, reiniciar todas as abas do terminal ou rodar `source ~/.bashrc` / `source ~/.zshrc` para garantir que o comando esteja disponivel em todas as sessoes.

### Step 2: Verificar a instalacao do istioctl

```bash
istioctl version
```

Resultado esperado: versao do client exibida + mensagem informando que Istio nao esta presente no cluster (ainda).

### Step 3: Instalar o Istio no cluster

```bash
# Instalacao completa (perfil default — inclui Istiod + Ingress Gateway)
istioctl install
```

Confirmar com `y` quando solicitado. Instala:
- **IstioCore** — componentes base
- **Istiod** — control plane (discovery, config, certificados)
- **Ingress Gateway** — entrada de trafego externo

Para instalar SEM gateways (apenas Istiod):

```bash
istioctl install --set profile=minimal
```

### Step 4: Verificar componentes instalados

```bash
# Ver pods no namespace istio-system
kubectl get pods -n istio-system

# Ver services criados
kubectl get svc -n istio-system
```

Resultado esperado:
- Pod `istiod-*` rodando (1 container)
- Pod `istio-ingressgateway-*` rodando (1 container)
- Service `istiod` (ClusterIP)
- Service `istio-ingressgateway` (LoadBalancer)

### Step 5: Verificar logs (opcional)

```bash
# Logs do Ingress Gateway — deve mostrar "Envoy proxy is ready"
kubectl logs -n istio-system -l app=istio-ingressgateway

# Logs do Istiod — deve mostrar validacoes sem erros
kubectl logs -n istio-system -l app=istiod
```

## Output format

Apos instalacao bem-sucedida:
- Namespace `istio-system` com Istiod e Ingress Gateway rodando
- Nenhuma aplicacao ainda tem sidecar (dois containers so aparecem apos injecao na aplicacao)
- Kubernetes Gateway API CRD NAO instalado por default no kind — instalar separadamente quando necessario

## Error handling

- Se `istioctl` nao encontrado apos export: fechar e reabrir o terminal, ou rodar `source` no profile
- Se pods nao sobem: verificar recursos do cluster (`kubectl describe pod -n istio-system`)
- Se Lens mostrar erro de conexao: recarregar o kubeconfig no Lens

## Heuristics

| Situacao | Acao |
|----------|------|
| Cluster novo, instalacao completa | `istioctl install` (perfil default) |
| Quer apenas control plane | `istioctl install --set profile=minimal` |
| Precisa verificar estado do Istio | `istioctl version` ou `kubectl get pods -n istio-system` |
| Kubernetes Gateway API faltando | Instalar CRD separadamente (nao vem por default no kind) |
| Visualizacao grafica do cluster | Usar Lens como IDE para Kubernetes |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Instalar via Helm sem entender os componentes | Usar `istioctl install` para controle direto |
| Ignorar o namespace istio-system na verificacao | Sempre usar `-n istio-system` nos comandos kubectl |
| Assumir que sidecar ja esta injetado | Sidecars so aparecem quando aplicacao e deployada com label de injecao |
| Esquecer de atualizar abas do terminal apos export | Rodar `source` ou reiniciar terminal |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
