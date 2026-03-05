# Deep Explanation: Executando Containers em Background

## Por que o terminal bloqueia?

Quando voce executa `docker run` sem flags adicionais, o Docker anexa (attach) o processo do container ao seu terminal. Isso significa que:

- O stdout/stderr do container e redirecionado para seu terminal
- O terminal fica "preso" ao ciclo de vida do container
- `Ctrl+C` envia SIGTERM para o container, parando-o

Isso e util para debug rapido, mas inviavel para trabalho real.

## O que `-d` (detached) faz

O flag `-d` instrui o Docker a:

1. Iniciar o container em background
2. Desanexar o terminal do processo
3. Retornar apenas o hash completo do container
4. Liberar o terminal imediatamente

O instrutor usa a analogia "desanexada" — o container roda independente do terminal.

## Identificacao de containers

O Docker oferece multiplas formas de identificar containers e imagens:

### Imagens (`docker image ls`)
- **Nome da imagem** — ex: `minha-api` (mais legivel)
- **ID da imagem** — ex: `abc123def456` (hash unico)

Ambos funcionam em `docker run`. O instrutor demonstra ambos:
```bash
docker run -p 3333:3333 minha-api      # por nome
docker run -p 3333:3333 abc123def456   # por ID
```

### Containers (`docker ps`)
- **Container ID** — hash abreviado mostrado na primeira coluna
- **Nome aleatorio** — Docker gera um nome aleatorio se voce nao especificar `--name`

O hash retornado pelo `docker run -d` e o mesmo container ID mostrado no `docker ps`, so que abreviado.

## Fluxo completo demonstrado na aula

1. `docker run -p 3333:3333 api` → terminal bloqueado
2. Abrir segundo terminal → `docker ps` mostra container rodando
3. `Ctrl+C` no primeiro terminal → para o container
4. `docker ps` → container nao aparece mais
5. `docker run -d -p 3333:3333 api` → retorna hash, terminal livre
6. `docker ps` → confirma execucao em background

## Mapeamento de portas

O `-p 3333:3333` mapeia:
- Porta do host (esquerda): 3333
- Porta do container (direita): 3333

Sem esse mapeamento, a aplicacao roda dentro do container mas nao e acessivel externamente.