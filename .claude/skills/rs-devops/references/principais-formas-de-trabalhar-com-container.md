---
name: rs-devops-principais-formas-de-trabalhar-com-container
description: "Applies container runtime selection criteria when choosing between Docker, Podman, LXC, or containerd. Use when user asks to 'choose container runtime', 'compare docker vs podman', 'install docker', 'understand OCI', or 'evaluate container tools'. Provides decision framework for runtime selection based on context. Make sure to use this skill whenever discussing container tooling choices. Not for Dockerfile writing, Kubernetes orchestration, or CI/CD pipelines."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: container-fundamentals
  tags: [docker, podman, containers, oci, lxc, containerd, runtime]
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

## Troubleshooting

### Docker daemon nao inicia apos instalacao
**Symptom:** `docker ps` retorna erro "Cannot connect to the Docker daemon"
**Cause:** Docker daemon nao esta rodando ou usuario nao tem permissao no socket
**Fix:** Iniciar o daemon com `sudo systemctl start docker` e adicionar usuario ao grupo docker com `sudo usermod -aG docker $USER`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

# Deep Explanation: Formas de Trabalhar com Containers

## O papel da OCI na decisao de tooling

O instrutor enfatiza que a OCI (Open Container Initiative) foi criada justamente para possibilitar multiplas ferramentas e interfaces. Isso significa que containers sao uma **estrutura agnostica** — voce tem o container, e a interface que usa para lidar com ele fica a seu criterio.

Essa e uma distincao arquitetural importante: o container em si e padronizado. O que muda e a ferramenta que voce usa para construir, executar e gerenciar esses containers. Todas seguem o mesmo padrao OCI, entao imagens criadas com Docker funcionam no Podman e vice-versa.

## Por que Docker venceu o mercado

O instrutor destaca que Docker foi quem **popularizou** o assunto containers. Antes do Docker, containers existiam (LXC ja estava la), mas nao tinham adocao massiva. Docker trouxe:

1. **Simplicidade** — abstraiu a complexidade do LXC
2. **Portabilidade forte** — "portabilidade entre maquinas" e um dos pontos que o instrutor mais enfatiza
3. **Leveza e desempenho** — containers Docker sao extremamente leves
4. **Escalabilidade** — facilidade de escalar horizontalmente
5. **Comunidade ativa** — o instrutor destaca que comunidade e "um ponto muito importante quando voce vai escolher uma tecnologia para trabalhar"

## Docker como suite, nao ferramenta unica

Um insight importante do instrutor: "quando nos falamos do Docker para se trabalhar localmente, geralmente a gente esta falando do Docker Desktop". Mas Docker e na verdade uma **suite de produtos**:

- Docker Desktop (desenvolvimento local)
- Docker Hub (container registry)
- Docker Scout (seguranca)
- Docker CLI (linha de comando)
- Planos: Pro, Personal, Team, Business

Isso significa que ao escolher Docker, voce esta entrando em um ecossistema, nao apenas instalando uma ferramenta.

## Sobre Container Registry

O instrutor menciona que Docker Hub e "basicamente um container registry" — voce armazena suas imagens de container la. Mas ele tambem nota que "existem N ferramentas" de registry, e que o conceito de Container Registry sera explorado mais a fundo no curso.

## Recomendacao do instrutor sobre Podman

O instrutor faz uma recomendacao especifica: "se quiser brincar um pouquinho, eu recomendo a utilizacao do Podman" para ambientes locais. Isso sugere que Podman e uma alternativa viavel para experimentacao, mesmo que Docker seja o padrao para trabalho profissional.

## LXC vs LXD

O instrutor esclarece a relacao: LXD esta "muito proximo do LXC" — LXD e o daemon que gerencia containers LXC no Linux. Sao complementares, nao concorrentes.

---

# Code Examples: Formas de Trabalhar com Containers

## Instalacao do Docker

### Linux (Ubuntu/Debian)

```bash
# Remover versoes antigas
sudo apt-get remove docker docker-engine docker.io containerd runc

# Instalar dependencias
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg

# Adicionar chave GPG oficial do Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Adicionar repositorio
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Verificacao da instalacao

```bash
# Verificar se Docker esta rodando
docker --version
# Docker version 27.x.x, build xxxxxxx

# Testar com container hello-world
docker run hello-world
```

### Mac

```bash
# Via Homebrew
brew install --cask docker

# Depois abra o Docker Desktop pela primeira vez para completar setup
# Para Apple Silicon (M1+): selecione a versao Apple Silicon no download
```

### Windows (WSL2)

```powershell
# 1. Instalar WSL2 (se ainda nao tem)
wsl --install

# 2. Baixar Docker Desktop do site oficial
# 3. Durante instalacao, marcar "Use WSL 2 based engine"
# 4. Reiniciar e verificar
docker --version
```

## Comparando Docker vs Podman (comandos equivalentes)

```bash
# Docker
docker run -d nginx
docker ps
docker stop <container_id>
docker images

# Podman (mesmos comandos, compativel)
podman run -d nginx
podman ps
podman stop <container_id>
podman images
```

A compatibilidade de comandos e possivel porque ambos seguem o padrao OCI.

## Verificando o ecossistema Docker instalado

```bash
# Ver todos os componentes instalados
docker info

# Verificar Docker Compose
docker compose version

# Verificar Buildx
docker buildx version

# Login no Docker Hub (container registry)
docker login
```
