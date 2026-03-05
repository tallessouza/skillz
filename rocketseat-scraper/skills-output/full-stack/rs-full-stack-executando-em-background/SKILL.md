---
name: rs-full-stack-executando-em-background
description: "Applies Docker background execution patterns when user asks to 'run docker', 'start container', 'execute in background', 'free terminal', or 'docker run'. Enforces -d flag usage, docker ps monitoring, and container identification by name or ID. Make sure to use this skill whenever running Docker containers or troubleshooting blocked terminals. Not for Dockerfile creation, docker-compose, or image building."
---

# Docker: Executando Containers em Background

> Sempre execute containers com `-d` para liberar o terminal, e use `docker ps` para monitorar execucao.

## Rules

1. **Use `-d` para execucao em background** — `docker run -d` libera o terminal imediatamente, porque terminal bloqueado impede qualquer outro trabalho
2. **Monitore com `docker ps`** — sempre verifique containers em execucao apos iniciar, porque confirma que o container subiu corretamente
3. **Identifique containers por nome OU ID** — ambos funcionam em todos os comandos Docker, porque o ID abreviado e suficiente e o nome da imagem e mais legivel
4. **Mapeie portas explicitamente** — sempre use `-p` para definir mapeamento de portas, porque sem mapeamento a aplicacao nao e acessivel do host

## Steps

### Step 1: Executar container em background

```bash
# Com nome da imagem
docker run -d -p 3333:3333 nome-da-imagem

# Com ID da imagem
docker run -d -p 3333:3333 abc123def456
```

O `-d` (detached) retorna um hash e libera o terminal.

### Step 2: Verificar execucao

```bash
docker ps
```

Mostra: container ID, imagem, tempo de criacao, portas mapeadas e nome aleatorio.

### Step 3: Parar container

```bash
# Por container ID (abreviado)
docker stop abc123

# Ctrl+C se estiver em foreground (sem -d)
```

## Example

**Before (terminal bloqueado):**
```bash
docker run -p 3333:3333 minha-api
# Terminal travado - nao da pra fazer mais nada
# Precisa abrir outro terminal para trabalhar
```

**After (com background):**
```bash
docker run -d -p 3333:3333 minha-api
# Retorna: a1b2c3d4e5f6...
# Terminal livre para continuar trabalhando

docker ps
# Confirma container rodando
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Desenvolvimento local | Sempre use `-d` para nao bloquear terminal |
| Precisa ver logs em tempo real | Use sem `-d` ou `docker logs -f container_id` |
| Nao sabe se container esta rodando | `docker ps` para listar ativos |
| Precisa do ID da imagem | `docker image ls` para listar imagens disponiveis |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Executar sem `-d` e abrir novo terminal | `docker run -d` e continuar no mesmo terminal |
| Tentar lembrar o hash completo | Use o hash abreviado do `docker ps` |
| Esquecer o `-p` no mapeamento de porta | Sempre inclua `-p host:container` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre modos de execucao Docker e gerenciamento de terminal
- [code-examples.md](references/code-examples.md) — Todos os comandos Docker expandidos com variacoes