---
name: rs-full-stack-introducao-ao-docker
description: "Applies Docker container concepts and architecture decisions when user asks to 'dockerize an app', 'create a Dockerfile', 'set up containers', 'deploy with Docker', or discusses virtualization vs containers. Enforces correct mental models for images, containers, kernel isolation (cgroups/namespaces), and Docker Hub usage. Make sure to use this skill whenever Docker or containerization is mentioned in any development context. Not for Kubernetes orchestration, Docker Compose multi-service setups, or CI/CD pipeline configuration."
---

# Introdução ao Docker

> Docker usa containers que compartilham o kernel Linux do host, proporcionando isolamento leve sem a sobrecarga de máquinas virtuais completas.

## Key concept

Docker é um sistema de virtualização não convencional. Em vez de criar máquinas virtuais com sistemas operacionais completos, Docker usa containers que compartilham o mesmo kernel Linux do host. Cada container é um ambiente isolado contendo apenas o código, dependências e bibliotecas necessárias para a aplicação funcionar.

A analogia: um navio cargueiro (host) carrega containers isolados. Se um container cai no mar, os demais não são afetados — cada container só conhece seu próprio conteúdo.

## Decision framework

| Quando você encontrar | Aplique |
|----------------------|---------|
| "Preciso rodar minha app em outro ambiente" | Container Docker — resolve o "na minha máquina funciona" |
| "Preciso de um SO completo isolado" | VM tradicional (VirtualBox, VMware) — overhead maior, isolamento total |
| "Preciso de ambiente leve e portável" | Container Docker — compartilha kernel, muito mais enxuto que VM |
| "Preciso garantir mesmas versões/deps em dev e prod" | Dockerfile define o ambiente padronizado |

## How to think about it

### Virtualização convencional vs Containers

```
VM Tradicional:              Docker Container:
┌─────────┐ ┌─────────┐    ┌─────────┐ ┌─────────┐
│  App A  │ │  App B  │    │  App A  │ │  App B  │
│  Libs   │ │  Libs   │    │  Libs   │ │  Libs   │
│  SO     │ │  SO     │    └────┬────┘ └────┬────┘
│ completo│ │ completo│         │            │
└────┬────┘ └────┬────┘    ┌───┴────────────┴───┐
┌────┴────────────┴────┐   │  Kernel Linux       │
│  Hypervisor          │   │  (compartilhado)    │
└──────────┬───────────┘   └──────────┬──────────┘
┌──────────┴───────────┐   ┌──────────┴──────────┐
│  Host OS             │   │  Host                │
└──────────────────────┘   └─────────────────────┘
```

VMs: cada uma tem SO completo instalado. Containers: compartilham o mesmo kernel Linux.

### Mecanismos de isolamento

Três pilares garantem o isolamento no Docker:

1. **Kernel Linux** — coração do SO, faz a ponte entre software e hardware, controla processos, memória e dispositivos
2. **cgroups** — controla e limita alocação de recursos (CPU, memória) para que nenhum container monopolize o host
3. **namespaces** — isola recursos para que cada container só enxergue seus próprios processos e arquivos

### Cadeia de conceitos Docker

```
Dockerfile → Image → Container
   │            │         │
   │            │         └─ Instância em execução de uma imagem
   │            └─ Ambiente completo (código + deps + libs)
   └─ Arquivo com instruções para gerar a imagem
```

**Docker Hub** = repositório de imagens (oficiais e da comunidade).

## Common misconceptions

| As pessoas pensam | Realidade |
|-------------------|-----------|
| Docker é uma VM | Containers compartilham o kernel do host — não virtualizam SO completo |
| Containers podem ver dados uns dos outros | Namespaces garantem isolamento total entre containers |
| Docker funciona nativamente em qualquer SO | Docker usa kernel Linux; no Windows/Mac roda via VM Linux leve |
| Container é a mesma coisa que imagem | Imagem é o template; container é a instância em execução |

## When to apply

- Ao padronizar ambiente de desenvolvimento entre membros do time
- Ao preparar aplicação para deploy em servidores
- Ao eliminar problemas de "funciona na minha máquina"
- Ao precisar de ambientes isolados e leves para múltiplos serviços

## Limitations

- Containers Linux em hosts Windows/Mac requerem uma VM Linux intermediária
- Isolamento de containers não é tão forte quanto VMs para workloads de segurança crítica
- Não substitui orquestração (Kubernetes) para ambientes multi-container em produção

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre virtualização vs containers, analogias e mecanismos de isolamento
- [code-examples.md](references/code-examples.md) — Exemplos práticos de Dockerfile, imagens e containers