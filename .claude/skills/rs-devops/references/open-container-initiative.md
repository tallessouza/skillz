---
name: rs-devops-open-container-initiative
description: "Applies Open Container Initiative (OCI) standards when building, configuring, or reviewing container images and runtimes. Use when user asks to 'create a Dockerfile', 'build a container', 'review container setup', 'configure runtime', or 'ensure container portability'. Enforces vendor-agnostic, portable, OCI-compliant container practices. Make sure to use this skill whenever generating Dockerfiles or container configurations. Not for application code, CI/CD pipelines, or Kubernetes orchestration specifics."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: containers-fundamentos
  tags: [oci, containers, docker, portability, runtime, image-spec, runc]
---

# Open Container Initiative (OCI)

> Containers devem ser agnósticos, portáteis e seguir padrões abertos — nunca vinculados a fornecedor, cliente ou pilha de orquestração específica.

## Key concept

A OCI é uma estrutura de governança Open Source mantida pela Linux Foundation que padroniza o ecossistema de containers em três pilares: **image spec** (formato de imagens), **runtime spec** (execução de containers) e **distribution spec** (distribuição de imagens). O objetivo é garantir que containers funcionem em qualquer runtime compatível, qualquer SO e qualquer arquitetura, sem lock-in.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Escolha de base image | Preferir imagens OCI-compliant, multi-arch |
| Escolha de runtime | Verificar compatibilidade OCI (runc, crun, containerd) |
| Formato de imagem | Usar OCI image format, não formatos proprietários |
| Registry/distribuição | Usar registries que suportam OCI distribution spec |
| Vinculação a fornecedor | Questionar — container deve ser portátil entre plataformas |

## How to think about it

### Portabilidade como princípio

Um container bem construído executa em Docker, Podman, containerd ou qualquer runtime OCI-compliant. Se o container depende de features específicas de um runtime, ele quebra o princípio de portabilidade. A curto prazo parece irrelevante, mas a longo prazo facilita migração entre orquestradores (Docker Swarm → Kubernetes, por exemplo).

### Os três pilares OCI

```
OCI Specs
├── Image Spec      → Como a imagem é empacotada (layers, manifest, config)
├── Runtime Spec    → Como o container executa (runc é a implementação referência)
└── Distribution Spec → Como imagens são distribuídas (push/pull entre registries)
```

**runc** é a implementação de referência do runtime spec — projeto Open Source mantido pela OCI. É o que executa por baixo do Docker e do containerd.

### Container agnóstico

Significa que o container:
1. Não depende de um cliente específico (Docker CLI vs Podman vs nerdctl)
2. Não depende de um orquestrador específico (Swarm vs K8s vs Nomad)
3. Não depende de um fornecedor específico (AWS vs GCP vs Azure)
4. Executa em diferentes SOs e arquiteturas (linux/amd64, linux/arm64)

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Docker É o container | Docker é uma interface para trabalhar com containers; existem outras (Podman, containerd, CRI-O) |
| OCI só importa em produção | Os padrões afetam desde a construção da imagem até a execução local |
| Portabilidade é só "rodar em Linux" | Inclui arquiteturas (amd64, arm64), SOs e diferentes runtimes |
| runc é coisa do Docker | runc é projeto OCI independente, usado por Docker, containerd e outros |

## When to apply

- Ao construir Dockerfiles ou container images
- Ao escolher base images (preferir OCI-compliant, multi-platform)
- Ao avaliar ferramentas de container (verificar conformidade OCI)
- Ao planejar migração entre plataformas de orquestração
- Ao revisar containers existentes para portabilidade

## Limitations

- OCI não define orquestração (isso é domínio do Kubernetes/Swarm)
- OCI não define networking entre containers
- OCI não define CI/CD pipelines
- Para detalhes de runtime avançado e Kubernetes, consultar documentação específica de runc e CRI

## Troubleshooting

### Container funciona no Docker mas falha em outro runtime
**Symptom:** Imagem construida com Docker nao executa corretamente em Podman ou containerd
**Cause:** O Dockerfile usa features especificas do Docker que nao sao parte da spec OCI (ex: BuildKit syntax exclusiva)
**Fix:** Verifique que o Dockerfile usa apenas instrucoes padrao OCI-compliant e teste a imagem em multiplos runtimes antes de distribuir

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
