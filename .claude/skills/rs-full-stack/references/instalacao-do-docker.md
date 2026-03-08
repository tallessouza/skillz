---
name: rs-full-stack-instalacao-do-docker
description: "Configures Docker installation and verification on any OS with CLI setup. Use when user asks to 'install Docker', 'setup Docker', 'verify Docker installation', 'check Docker version', or 'configure Docker environment'. Covers download, CLI setup, and post-install verification commands. Make sure to use this skill whenever setting up a new development environment that requires Docker. Not for Docker container management, Dockerfile creation, or docker-compose workflows."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: docker-setup
  tags: [docker, installation, cli, devops, environment]
---

# Instalação do Docker

> Instale o Docker e verifique a disponibilidade via CLI antes de prosseguir com qualquer trabalho de containers.

## Prerequisites

- Sistema operacional: macOS, Windows ou Linux
- Acesso ao terminal
- Permissões de administrador para instalação

## Steps

### Step 1: Download do Docker

1. Acesse [docker.com](https://docker.com)
2. O site detecta automaticamente seu sistema operacional
3. Clique no botão de download ou selecione manualmente o instalador correto para seu OS

### Step 2: Instalação

Execute o instalador baixado seguindo as instruções do wizard. A instalação inclui:
- **Docker Desktop** (interface gráfica)
- **Docker CLI** (comandos no terminal)

### Step 3: Verificação

Abra o terminal e execute:

```bash
docker --version
```

Ou a forma abreviada:

```bash
docker -v
```

Se a versão aparecer, o Docker está disponível na máquina.

## Output format

Verificação bem-sucedida retorna algo como:

```
Docker version 27.x.x, build xxxxxxx
```

## Error handling

- Se `docker` não é reconhecido como comando: reinicie o terminal ou a máquina após a instalação
- Se permissão negada no Linux: adicione seu usuário ao grupo `docker` com `sudo usermod -aG docker $USER` e reinicie a sessão

## Heuristics

| Situação | Recomendação |
|----------|-------------|
| Desenvolvimento local | Use Docker CLI no terminal, porque no deploy você usará terminal — acostume-se desde o início |
| Interface gráfica disponível | Ignore-a para prática; o mercado usa CLI |
| Após instalação | Sempre verifique com `docker -v` antes de prosseguir |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `docker` nao reconhecido como comando | Terminal nao atualizado apos instalacao | Reinicie o terminal ou a maquina |
| Permissao negada ao rodar `docker` no Linux | Usuario nao pertence ao grupo docker | Execute `sudo usermod -aG docker $USER` e reinicie a sessao |
| Docker Desktop nao inicia no Windows | Virtualizacao desabilitada na BIOS | Habilite VT-x/AMD-V na BIOS e reinicie |
| `docker -v` retorna versao antiga | Instalacao anterior conflitante | Desinstale a versao antiga e reinstale |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre CLI vs GUI e contexto de mercado
- [code-examples.md](references/code-examples.md) — Comandos de verificação e troubleshooting expandidos