---
name: rs-full-stack-efemeridade-em-containers
description: "Enforces container ephemerality principles when designing Docker architectures or writing Dockerfiles. Use when user asks to 'create a container', 'write a Dockerfile', 'store data in Docker', 'persist container data', or 'design container architecture'. Ensures data is never stored inside containers without external volumes. Make sure to use this skill whenever working with Docker containers or container orchestration. Not for host OS storage, cloud storage services, or non-containerized applications."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: docker
  tags: [docker, containers, efemeridade, volumes, persistencia]
---

# Efemeridade em Containers

> Containers sao efemeros por design — nunca armazene dados persistentes dentro de um container sem volume externo.

## Key concept

Efemero significa temporario. Containers sao projetados para serem descartaveis: podem ser facilmente parados, destruidos ou substituidos. Um container pode ser recriado a qualquer momento a partir de seu Dockerfile, tornando-o intercambiavel. Dados armazenados apenas dentro do container serao perdidos quando ele for encerrado ou removido.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Dados que precisam sobreviver ao restart do container | Use volumes Docker ou bind mounts |
| Logs de aplicacao | Monte volume externo ou envie para servico de logging |
| Banco de dados rodando em container | Volume nomeado obrigatorio para o diretorio de dados |
| Arquivos de upload do usuario | Volume externo ou object storage (S3, MinIO) |
| Cache temporario que pode ser recriado | Pode ficar dentro do container — e efemero por natureza |
| Configuracao/secrets | Use environment variables, Docker secrets ou config files montados |

## How to think about it

### Analogia: container como copo descartavel

Um container e como um copo descartavel. Voce usa, joga fora e pega outro. Se voce colocou algo importante dentro do copo e jogou fora, perdeu. A solucao e guardar o que importa em outro lugar (volume) antes de descartar o copo (container).

### Recriacao trivial

O Dockerfile contem todas as definicoes para recriar o container. Isso torna a substituicao trivial — basta rodar `docker build` e `docker run` novamente. O container em si nao tem valor, o valor esta na imagem (receita) e nos dados (volumes).

## Rules

1. **Nunca persista dados apenas no filesystem do container** — use volumes, porque o container pode ser destruido a qualquer momento e os dados serao perdidos
2. **Trate containers como descartaveis** — projete para que qualquer container possa ser parado e substituido sem impacto, porque essa e a premissa fundamental do modelo
3. **Separe estado de computacao** — dados (estado) vivem em volumes ou servicos externos, logica (computacao) vive no container, porque isso permite escalar e substituir independentemente
4. **Use volumes nomeados para dados criticos** — `docker volume create` para bancos de dados, uploads e qualquer dado que nao pode ser perdido

## Example

```bash
# Container SEM volume — dados perdidos ao remover
docker run --name db postgres
docker rm db  # dados perdidos

# Container COM volume — dados persistem
docker run --name db -v pgdata:/var/lib/postgresql/data postgres
docker rm db  # dados preservados no volume pgdata
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Salvar uploads dentro do container sem volume | Montar volume externo no diretorio de uploads |
| Rodar banco de dados sem volume para `/var/lib/...` | `docker run -v db_data:/var/lib/postgresql/data` |
| Guardar logs apenas em `/var/log` dentro do container | Montar volume ou usar logging driver |
| Fazer `docker exec` para editar arquivos de config manualmente | Usar bind mount ou Docker configs |
| Assumir que o container vai "continuar rodando" | Projetar para restart/substituicao a qualquer momento |

## Heuristics

| Situacao | Acao |
|----------|------|
| `docker run` sem flag `-v` para app com dados | BLOCK — adicione volume antes de rodar |
| Dockerfile com `COPY` de dados mutaveis | WARN — dados mutaveis devem vir de volume, nao da imagem |
| docker-compose sem `volumes:` para servico de banco | BLOCK — banco sem volume = perda de dados garantida |
| Container stateless (API, worker) | OK sem volume — e efemero por natureza |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Dados do banco perdidos apos restart | Container sem volume montado para o diretorio de dados | Adicione `-v pgdata:/var/lib/postgresql/data` ao `docker run` |
| `docker run` sem `-v` para app com estado | Esqueceu de montar volume para dados persistentes | Adicione volume antes de rodar: `-v volume:/path` |
| Uploads desaparecem apos `docker rm` | Arquivos salvos dentro do container sem bind mount | Monte volume externo: `-v ./uploads:/app/uploads` |
| Logs inacessiveis apos container parar | Logs salvos apenas no filesystem do container | Use logging driver ou monte volume em `/var/log` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre efemeridade, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos praticos de Docker com e sem volumes