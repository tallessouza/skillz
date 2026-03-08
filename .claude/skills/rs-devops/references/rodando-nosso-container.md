---
name: rs-devops-rodando-nosso-container
description: "Applies Docker container execution best practices for running, inspecting, and managing containers. Use when user asks to 'run a container', 'map ports', 'use docker run flags', 'check container logs', or 'manage container lifecycle'. Enforces --rm for ephemeral containers, explicit port mapping with -p, background mode with -d, and docker logs for debugging. Make sure to use this skill whenever executing docker run commands or managing container lifecycle operations. Not for Dockerfile creation, multi-container orchestration, or Kubernetes deployments."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: docker-containers
  tags: [docker, container, docker-run, port-mapping, detached, ephemeral, logs]
---

# Rodando Containers Docker

> Ao executar containers, trate-os como efemeros: use flags que reforcam o ciclo de vida correto e mapeie portas explicitamente.

## Rules

1. **Use `--rm` para containers descartaveis** — `docker run --rm` deleta o container ao parar, porque containers devem ser efemeros e recriados a partir da imagem sem prejuizo
2. **Mapeie portas explicitamente com `-p`** — `docker run -p HOST:CONTAINER`, porque sem mapeamento a aplicacao roda isolada e inacessivel
3. **Rode em background com `-d`** — `docker run -d` libera o terminal, porque modo interativo prende o console e impede outros comandos
4. **Use `docker ps` para inspecionar containers ativos** — mostra container ID, imagem, portas, status e nome
5. **Use `docker logs` para depurar containers em background** — `docker logs CONTAINER_ID` exibe o historico completo de execucao
6. **Entenda que `--rm` impede restart** — com `--rm`, `docker stop` deleta o container permanentemente; sem `--rm`, voce pode usar `docker start` para reiniciar

## How to write

### Container efemero (desenvolvimento rapido)
```bash
# --rm: deleta ao parar | -p: mapeia porta | imagem no final
docker run --rm -p 3000:3000 api-skillz
```

### Container persistente em background
```bash
# -d: background | sem --rm: permite stop/start
docker run -d -p 3001:3000 api-skillz
```

### Inspecionar e gerenciar
```bash
# Ver containers rodando
docker ps

# Ver logs de container em background
docker logs CONTAINER_ID

# Parar container (com --rm, sera deletado)
docker stop CONTAINER_ID

# Reiniciar container (somente sem --rm)
docker start CONTAINER_ID
```

## Example

**Before (preso no terminal, sem boas praticas):**
```bash
docker run api-skillz
# Terminal preso, sem mapeamento de porta, container orfao apos Ctrl+C
```

**After (com boas praticas aplicadas):**
```bash
# Desenvolvimento: efemero + porta mapeada
docker run --rm -p 3000:3000 api-skillz

# Teste prolongado: background + persistente
docker run -d -p 3001:3000 --name api-test api-skillz
docker logs api-test
docker stop api-test
docker start api-test
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Teste rapido local | `--rm -p HOST:CONTAINER` |
| Precisa ver logs depois | `-d` e depois `docker logs` |
| Precisa parar e reiniciar | NAO use `--rm` |
| Porta do host ja em uso | Mude a porta do host (ex: 3001:3000) |
| Quer nomear o container | Adicione `--name meu-container` |
| Precisa depurar interativamente | Rode sem `-d` para ver output em tempo real |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `docker run imagem` (sem -p) | `docker run -p 3000:3000 imagem` |
| Rodar sem `-d` e ficar preso | `docker run -d -p 3000:3000 imagem` |
| Usar `--rm` e esperar fazer restart | Remova `--rm` se precisa de stop/start |
| Ignorar `docker ps` apos rodar | Sempre confirme com `docker ps` |
| Tentar `docker start` com `--rm` ativo | Rode novo `docker run` |


## Troubleshooting

### Container roda mas aplicacao nao responde no browser
**Symptom:** `docker ps` mostra container Running mas `curl localhost:3000` retorna Connection refused
**Cause:** Porta nao foi mapeada — faltou flag `-p HOST:CONTAINER` no `docker run`
**Fix:** Pare o container e reinicie com `-p 3000:3000` (ou a porta correta)

### docker start falha com "No such container"
**Symptom:** Tentativa de reiniciar container retorna erro
**Cause:** Container foi criado com `--rm` e foi deletado ao parar
**Fix:** Rode novo `docker run` sem `--rm` se precisar de stop/start

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

# Deep Explanation: Rodando Containers Docker

## Ciclo de vida do container

O instrutor enfatiza que containers sao efemeros por natureza. A flag `--rm` reforça esse conceito: ao parar o container, ele e completamente deletado. A imagem permanece intacta — ela e o template imutavel, o container e a instancia descartavel.

**Analogia implicita:** A imagem e a receita, o container e o prato. Voce pode jogar o prato fora e fazer outro identico a partir da receita.

## Diferenca entre Image ID e Container ID

- **Image ID:** hash unica gerada no `docker build`, identifica a imagem
- **Container ID:** hash unica gerada no `docker run`, identifica a instancia em execucao

Sao IDs independentes. Uma imagem pode ter multiplos containers rodando simultaneamente, cada um com seu proprio ID.

## Port mapping (-p HOST:CONTAINER)

O mapeamento de portas conecta uma porta da maquina host a uma porta dentro do container. O formato e `HOST:CONTAINER`.

- A porta do host pode ser qualquer porta livre
- A porta do container e definida pela aplicacao (e idealmente pelo EXPOSE no Dockerfile)
- Coincidencia: neste exemplo ambas sao 3000, mas podem ser diferentes (ex: `-p 3001:3000`)

O instrutor demonstra isso trocando para 3001 no host enquanto o container continua na 3000.

## Modo interativo vs detached

**Sem `-d` (interativo):**
- O terminal fica preso ao processo do container
- Logs aparecem em tempo real
- Util para debug rapido
- Ctrl+C para parar

**Com `-d` (detached/background):**
- Terminal e liberado imediatamente
- Retorna apenas o hash do container
- Para ver logs: `docker logs CONTAINER_ID`
- Para parar: `docker stop CONTAINER_ID`

## O efeito do --rm no restart

O instrutor demonstra na pratica:
1. Roda com `--rm`, para com `docker stop` → container deletado, `docker start` falha
2. Roda sem `--rm`, para com `docker stop` → container preservado, `docker start` funciona

Isso mostra que `--rm` e ideal para desenvolvimento rapido, mas inadequado quando voce precisa inspecionar o estado do container apos parada.

## Docker logs e historico

`docker logs` mostra o historico completo de execucao, incluindo multiplos ciclos de start/stop. O instrutor mostra que apos dois starts, a pilha de logs contem ambas as execucoes com seus respectivos timestamps.

## Observacoes sobre tamanho da imagem

O instrutor menciona que a imagem tem quase 400MB na etapa do RUN e 225MB na copia de arquivos — valores altos que serao otimizados nas proximas aulas. Ele intencionalmente parte de um cenario fora das boas praticas para demonstrar a evolucao.

## docker history

O comando `docker history IMAGEM` mostra cada camada da imagem com seu tamanho, revelando onde o espaco esta sendo consumido. Util para identificar oportunidades de otimizacao.

---

# Code Examples: Rodando Containers Docker

## Exemplo 1: Primeiro container (modo interativo)

```bash
# Comando executado pelo instrutor
docker run --rm -p 3000:3000 api-skillz
```

**Resultado:** Aplicacao starta e exibe logs no terminal. Console fica preso.

**Teste de funcionamento (em outra aba):**
```bash
curl http://localhost:3000
# Retorna: hello world
```

## Exemplo 2: Verificar containers em execucao

```bash
docker ps
```

**Output tipico:**
```
CONTAINER ID   IMAGE        COMMAND          CREATED        STATUS    PORTS                    NAMES
abc123def456   api-skillz   "yarn run start" 2 minutes ago  Up 2 min  0.0.0.0:3000->3000/tcp   random_name
```

**Campos importantes:**
- `CONTAINER ID`: hash abreviada do container
- `IMAGE`: imagem base
- `COMMAND`: comando de entrada (definido no CMD/ENTRYPOINT)
- `STATUS`: Up/Down + tempo
- `PORTS`: mapeamento HOST->CONTAINER
- `NAMES`: nome auto-gerado (ou definido com `--name`)

## Exemplo 3: Parar container com --rm

```bash
# Para o container
docker stop abc123def456

# Tenta reiniciar — FALHA porque --rm deletou o container
docker start abc123def456
# Error: No such container: abc123def456
```

## Exemplo 4: Container em background sem --rm

```bash
# -d: detached | sem --rm | porta diferente para demonstrar
docker run -d -p 3001:3000 api-skillz
# Output: hash completa do container (ex: 7a8b9c0d1e2f...)
```

**Verificacao:**
```bash
docker ps
# Mostra container rodando na porta 3001

curl http://localhost:3001
# Retorna: hello world
```

## Exemplo 5: Stop e Start (sem --rm)

```bash
# Parar
docker stop CONTAINER_ID

# Verificar que parou
curl http://localhost:3001
# Connection refused

# Reiniciar
docker start CONTAINER_ID

# Verificar que voltou
curl http://localhost:3001
# hello world — funciona!
```

## Exemplo 6: Ver logs de container em background

```bash
docker logs CONTAINER_ID
```

**Output mostra historico completo:**
```
# Primeira execucao (timestamp 11:16)
Server running on port 3000

# Apos docker stop + docker start (timestamp 11:54)
Server running on port 3000
```

## Exemplo 7: Inspecionar camadas da imagem

```bash
docker history api-skillz
```

**Output mostra cada instrucao do Dockerfile com tamanho:**
```
IMAGE          CREATED        CREATED BY                                      SIZE
...            ...            RUN yarn install                                ~400MB
...            ...            COPY . .                                        ~225MB
```

## Exemplo 8: Nomear container explicitamente

```bash
docker run -d --name minha-api -p 3000:3000 api-skillz

# Agora pode usar o nome ao inves do ID
docker stop minha-api
docker start minha-api
docker logs minha-api
```

## Resumo de flags do docker run

| Flag | Significado | Quando usar |
|------|-------------|-------------|
| `--rm` | Deleta container ao parar | Testes rapidos, CI/CD |
| `-p HOST:CONTAINER` | Mapeia porta | Sempre que precisar acessar |
| `-d` | Executa em background | Quando nao precisa ver logs em tempo real |
| `--name NOME` | Nomeia o container | Quando quer referenciar por nome |
