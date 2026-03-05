---
name: rs-devops-docker-fundamentals
description: "Applies Docker image and container concepts when writing Dockerfiles, docker commands, or containerized applications. Use when user asks to 'dockerize an app', 'create a Dockerfile', 'run a container', 'build an image', or mentions Docker workflow. Enforces understanding that images are immutable build artifacts and containers are ephemeral runtime instances. Make sure to use this skill whenever Docker containers or images are discussed. Not for Kubernetes orchestration, Docker Compose multi-service setups, or CI/CD pipeline configuration."
---

# Docker: Imagens e Containers

> Imagens sao modelos imutaveis de leitura que definem como um container sera executado; containers sao instancias efemeras de tempo de execucao dessas imagens.

## Rules

1. **Separe imagem de container** — imagem e o build (receita), container e o run (execucao), porque confundir os dois causa erros de persistencia e deploy
2. **Containers sao efemeros por padrao** — tudo salvo dentro de um container e perdido quando ele para, porque o container roda em cima da imagem imutavel sem persistencia propria
3. **Use volumes para persistencia** — nunca salve dados importantes apenas no filesystem do container, porque ao reiniciar o container os dados somem
4. **Siga a logica de comandos Docker** — `docker image <acao>` para imagens, `docker container <acao>` para containers, porque a CLI segue um padrao intuitivo de recurso + acao
5. **Build antes de Run** — sempre `docker build` para criar a imagem, depois `docker run` para executar o container, porque nao existe container sem imagem

## Key Concepts

### Imagem Docker
```
Imagem = modelo imutavel + somente leitura + receita de bolo
         Define TUDO que o container precisa para rodar
         Criada via: docker build
```

### Container Docker
```
Container = instancia em tempo de execucao de uma imagem
            Efemero por padrao (dados nao persistem)
            Criado via: docker run
```

### Ciclo de vida
```
Aplicacao → Dockerfile (manifesto) → docker build → Imagem → docker run → Container
                                                                              ↓
                                                                    Container para
                                                                              ↓
                                                                    Dados perdidos (sem volume)
```

## CLI Principal

### Comandos de Imagem
```bash
docker image ls          # Listar imagens
docker image rm <id>     # Remover imagem
docker build -t app .    # Criar imagem a partir do Dockerfile
```

### Comandos de Container
```bash
docker container ls      # Listar containers rodando
docker container ls -a   # Listar todos (incluindo parados)
docker run <imagem>      # Criar e executar container
docker container rm <id> # Remover container
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa persistir dados (uploads, DB) | Use volumes (`-v` ou `--mount`) |
| Quer inspecionar uma imagem | `docker image inspect <id>` |
| Container parou e dados sumiram | Comportamento esperado — use volumes |
| Quer verificar se Docker esta instalado | `docker --version` ou `docker info` |
| Precisa rebuildar apos mudanca no codigo | `docker build` novamente (imagem e imutavel) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Salvar uploads no filesystem do container sem volume | Montar volume para diretorio de uploads |
| Confundir `docker build` com `docker run` | Build cria imagem, Run executa container |
| Editar arquivos dentro do container em producao | Rebuildar a imagem com as mudancas |
| Ignorar que container e efemero | Planejar persistencia com volumes desde o inicio |
| Rodar `docker run` sem ter feito `docker build` | Sempre buildar a imagem primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
