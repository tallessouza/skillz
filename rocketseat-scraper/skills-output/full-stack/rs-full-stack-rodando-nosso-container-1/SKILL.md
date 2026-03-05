---
name: rs-full-stack-rodando-nosso-container-1
description: "Applies Docker container execution with port mapping when user asks to 'run a container', 'start docker', 'expose a port', 'map ports', or 'docker run'. Enforces correct -p flag syntax for port mapping between host and container. Make sure to use this skill whenever running Docker containers or configuring port exposure. Not for Dockerfile creation, image building, or docker-compose."
---

# Rodando Container Docker

> Ao executar um container, sempre mapeie explicitamente as portas entre host e container usando a flag `-p`.

## Rules

1. **Sempre use `-p` para mapear portas** — `docker run -p HOST:CONTAINER image`, porque sem mapeamento o container roda isolado e inacessivel da maquina host
2. **Prefira mesma porta host e container** — `3333:3333` em vez de portas diferentes, porque simplifica debugging e comunicacao no time
3. **Referencie a porta do EXPOSE** — a porta do container no `-p` deve corresponder ao `EXPOSE` do Dockerfile, porque inconsistencia causa conexao recusada silenciosamente
4. **Rode por nome ou ID** — ambos funcionam em `docker run`, mas nome e mais legivel para scripts e documentacao

## Steps

### Step 1: Identificar a porta da aplicacao

Verifique o `EXPOSE` no Dockerfile ou a porta configurada na aplicacao:

```dockerfile
EXPOSE 3333
```

### Step 2: Executar o container com mapeamento de porta

```bash
# Por nome da imagem (preferido)
docker run -p 3333:3333 nome-da-imagem

# Por ID da imagem
docker run -p 3333:3333 abc123def
```

### Step 3: Verificar acesso

```bash
# No navegador ou via curl
curl http://localhost:3333
```

## Sintaxe do -p

```
-p <porta-host>:<porta-container>
```

| Exemplo | Significado |
|---------|-------------|
| `-p 3333:3333` | Host 3333 → Container 3333 (mesma porta) |
| `-p 5433:3333` | Host 5433 → Container 3333 (porta diferente) |
| `-p 8080:80` | Host 8080 → Container 80 |

## Example

**Errado (sem mapeamento de porta):**
```bash
docker run nome-da-imagem
# Container roda mas localhost:3333 nao responde
```

**Correto (com mapeamento):**
```bash
docker run -p 3333:3333 nome-da-imagem
# localhost:3333 acessivel, logs visiveis no terminal
```

## Heuristics

| Situacao | Acao |
|----------|------|
| API Node/Express | Mapear porta do `app.listen()` |
| Multiplas portas expostas | Usar multiplos `-p`: `-p 3333:3333 -p 5432:5432` |
| Container roda mas nao responde | Verificar se `-p` esta correto e porta bate com EXPOSE |
| Precisa rodar em background | Adicionar `-d`: `docker run -d -p 3333:3333 imagem` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `docker run imagem` (sem -p) | `docker run -p 3333:3333 imagem` |
| Porta host diferente sem necessidade | Mesma porta host:container |
| Ignorar o EXPOSE do Dockerfile | Mapear exatamente a porta exposta |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre networking Docker e fluxo de requisicao host→container
- [code-examples.md](references/code-examples.md) — Todos os exemplos de execucao com variacoes de porta e flags