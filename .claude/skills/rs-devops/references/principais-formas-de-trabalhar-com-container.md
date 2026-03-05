---
name: rs-devops-formas-trabalhar-container
description: "Applies container tooling knowledge when choosing between Docker, Podman, LXC, or LXD for containerization. Use when user asks to 'setup containers', 'choose container runtime', 'install Docker', 'compare Docker vs Podman', or 'containerize an application'. Guides decisions on which container interface to use based on OCI standards. Make sure to use this skill whenever container runtime selection or Docker ecosystem navigation is relevant. Not for Dockerfile writing, docker-compose configuration, or Kubernetes orchestration."
---

# Formas de Trabalhar com Containers

> Containers seguem o padrao OCI — a interface que voce usa para gerencia-los e uma escolha, nao uma obrigacao.

## Key concept

A OCI (Open Container Initiative) define um padrao que torna containers **agnosticos de ferramenta**. Qualquer runtime ou interface que siga o padrao OCI pode gerenciar os mesmos containers. Docker e a interface mais popular, mas nao e a unica — e entender isso evita vendor lock-in mental.

Docker nao e o container em si. Docker e uma **interface** para manusear containers. Essa distincao e fundamental para decisoes de arquitetura.

## Decision framework

| Situacao | Ferramenta | Razao |
|----------|-----------|-------|
| Ambiente de producao corporativo | Docker | Maior comunidade, mais documentacao, padrao de mercado |
| Experimentacao local / aprendizado | Podman | Muito usado em ambientes locais, sem daemon, rootless por padrao |
| Infraestrutura Linux bare-metal | LXC / LXD | Mais proximo do sistema, LXD e o daemon do LXC |
| Precisa de compatibilidade maxima | Docker | Portabilidade entre sistemas operacionais comprovada |
| CI/CD pipelines | Docker ou Containerd | Containerd e o runtime usado por Kubernetes internamente |

## Ecossistema Docker

| Produto | Funcao |
|---------|--------|
| Docker Desktop | Interface local para desenvolvimento (Mac, Windows, Linux) |
| Docker Hub | Container Registry — armazena imagens de containers |
| Docker CLI | Interface de linha de comando para gerenciar containers |
| Docker Scout | Analise de seguranca de imagens |
| Docker Pro/Team/Business | Planos com features enterprise |

## Alternativas ao Docker (OCI-compliant)

| Ferramenta | Caracteristica principal |
|-----------|------------------------|
| **LXC** | Runtime original de containers Linux, baixo nivel |
| **LXD** | Daemon que gerencia LXC, mais proximo do sistema Linux |
| **Podman** | Sem daemon, rootless, compativel com comandos Docker |
| **Containerd** | Runtime usado internamente pelo Docker e Kubernetes |

## How to choose

### Criterios que fizeram Docker ser o padrao

1. **Adocao de mercado** — mais utilizado, mais vagas pedem Docker
2. **Portabilidade** — funciona em Linux, Mac (Intel e Apple Silicon), Windows
3. **Desempenho** — leve e escalavel
4. **Comunidade** — ativa, com documentacao abundante
5. **Suite completa** — nao e so runtime, e um ecossistema (Hub, Scout, Desktop)

### Quando considerar alternativas

- Podman quando precisa de containers **rootless por padrao** ou ambiente sem daemon
- LXC/LXD quando precisa de containers que se comportam mais como **VMs leves** em Linux
- Containerd quando trabalha diretamente com **Kubernetes** e quer eliminar camadas

## Instalacao

Acesse `https://docs.docker.com/get-docker/` e selecione seu sistema operacional:
- **Linux** — instalacao via package manager
- **Windows** — Docker Desktop com WSL2
- **Mac Intel** — Docker Desktop for Mac (Intel)
- **Mac Apple Silicon (M1+)** — Docker Desktop for Mac (Apple Silicon)

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Docker E o container | Docker e uma interface para gerenciar containers |
| So existe Docker | LXC, Podman, Containerd sao alternativas validas e OCI-compliant |
| Precisa de Docker para Kubernetes | Kubernetes usa Containerd internamente, Docker e opcional |
| Docker Hub e o unico registry | Existem N ferramentas de Container Registry (GitHub, AWS ECR, etc) |

## Limitations

- Esta skill nao cobre escrita de Dockerfiles ou docker-compose
- Nao cobre orquestracao (Kubernetes, Docker Swarm)
- Nao cobre arquitetura interna do Docker (proximo topico do curso)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-principais-formas-de-trabalhar-com-container/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-principais-formas-de-trabalhar-com-container/references/code-examples.md)
