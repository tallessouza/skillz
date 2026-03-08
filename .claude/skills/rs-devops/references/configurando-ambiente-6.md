---
name: rs-devops-configurando-ambiente-6
description: "Configures local Kubernetes environment using kind, kubectl, and Lens for development clusters. Use when user asks to 'setup kubernetes locally', 'install kind', 'configure kubectl', 'create local k8s cluster', or 'install kubernetes tools'. Enforces tool installation order, context switching discipline, and correct tool selection between kind/minikube/k3s. Make sure to use this skill whenever setting up a local Kubernetes development environment. Not for production cluster deployment, cloud-managed Kubernetes setup, or Helm chart configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: kubernetes-ambiente-local
  tags: [kubernetes, kind, kubectl, lens, k9s, local-development]
---

# Configurando Ambiente Kubernetes Local

> Instale e configure as ferramentas essenciais para rodar Kubernetes localmente: kubectl, kind e Lens.

## Prerequisites

- Docker instalado e rodando (kind executa Kubernetes dentro de containers Docker)
- Acesso a terminal (bash/zsh)
- Se ferramenta anterior nao encontrada: verificar `docker --version` antes de prosseguir

## Arquitetura das Ferramentas

```
kind (cria o cluster) ──► kubectl (CLI para interfacear) ──► Lens (GUI visual)
                                    │
                            contextos (switch entre clusters)
```

| Ferramenta | Funcao | Obrigatoria? |
|-----------|--------|-------------|
| **kubectl** | CLI para interagir com a API do Kubernetes | Sim |
| **kind** | Cria cluster Kubernetes local rodando em containers Docker | Sim |
| **Lens** | Interface grafica (IDE) para visualizar o cluster | Recomendada |
| **k9s** | Interface terminal rica para Kubernetes | Opcional (estudo) |

## Steps

### Step 1: Instalar kubectl

```bash
# macOS
brew install kubectl

# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl && sudo mv kubectl /usr/local/bin/

# Windows
choco install kubernetes-cli
```

Verificar: `kubectl version --client`

### Step 2: Instalar kind

```bash
# macOS
brew install kind

# Linux
curl -Lo ./kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64
chmod +x ./kind && sudo mv ./kind /usr/local/bin/kind

# Windows
choco install kind
```

Verificar: `kind --version`

### Step 3: Instalar Lens (opcional mas recomendado)

Baixar de https://k8slens.dev/ — disponivel para todos os SOs. Lens nao cria clusters, apenas visualiza clusters existentes.

### Step 4: Instalar k9s (opcional, para estudo)

```bash
brew install derailed/k9s/k9s
# ou via https://k9scli.io/
```

## Conceito-chave: Contextos do kubectl

kubectl gerencia multiplos clusters via **contextos**. Cada cluster (local ou gerenciado) tem seu proprio contexto:

```bash
# Listar contextos disponiveis
kubectl config get-contexts

# Trocar para outro contexto
kubectl config use-context kind-meu-cluster

# Ver contexto atual
kubectl config current-context
```

## Decision framework: Escolha da ferramenta local

| Ferramenta | Caracteristica | Quando usar |
|-----------|---------------|------------|
| **kind** | Kubernetes em Docker, completo | Padrao recomendado, ambiente de estudo |
| **minikube** | Primeira ferramenta criada para isso | Ja tem experiencia com ela |
| **k3d/k3s** | Versao lightweight do Kubernetes | Quer versao minima, menos recursos |
| **Rancher Desktop** | Inclui k3d built-in | Ja usa Rancher no dia a dia |

Resultado final e o mesmo: cluster Kubernetes local. A escolha e flexivel.

## Verification

```bash
docker --version      # Docker funcionando
kubectl version       # kubectl instalado
kind --version        # kind instalado
```

## Error handling

- Se `kind` falha ao criar cluster: verificar se Docker esta rodando (`docker ps`)
- Se `kubectl` nao conecta: verificar contexto (`kubectl config current-context`)
- Se Lens nao mostra cluster: cluster precisa existir primeiro (kind cria, Lens apenas visualiza)

## Troubleshooting

### kind create cluster falha ao criar o cluster
**Symptom:** Erro ao executar kind create cluster — falha na criacao dos containers
**Cause:** Docker nao esta rodando ou nao tem recursos suficientes
**Fix:** Verifique com `docker ps` se Docker esta ativo, e aumente recursos no Docker Desktop se necessario

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-configurando-ambiente-6/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-configurando-ambiente-6/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
