# Deep Explanation: Criando Containers Direto do Docker Hub

## Por que criar containers sem Dockerfile?

O Dockerfile serve para **customizar** uma imagem — instalar dependencias, copiar codigo, definir comandos. Mas quando voce precisa de um servico "de prateleira" como um banco de dados, a imagem oficial ja vem pronta. Criar um Dockerfile so para rodar `FROM postgres` seria overhead desnecessario.

O `docker run` com flags resolve tudo: nome, credenciais, portas e modo de execucao em uma unica linha.

## Criterios para avaliar imagens no Docker Hub

O instrutor destaca tres criterios praticos ao comparar imagens:

### 1. Vulnerabilidades (aba Tags)
Cada tag de imagem mostra vulnerabilidades mapeadas. Compare entre imagens oficiais e de terceiros (como Bitnami). Menos vulnerabilidades = menos superficie de ataque.

### 2. Frequencia de atualizacao
O instrutor comparou: uma imagem atualizada "ha 2 horas" vs outra "ha 2 dias". Frequencia alta indica manutencao ativa e patches de seguranca rapidos.

### 3. Selo oficial (verified publisher)
Imagens com selo verde "Docker Official Image" passam por revisao da equipe Docker. Imagens de "Verified Publisher" (como Bitnami) sao mantidas por empresas reconhecidas.

## Imagens oficiais vs de terceiros

O Docker Hub tem:
- **Imagens oficiais** — mantidas pela comunidade Docker com revisao rigorosa (ex: `postgres`)
- **Verified Publishers** — empresas como Bitnami que publicam suas proprias versoes (ex: `bitnami/postgresql`)
- **Imagens da comunidade** — qualquer pessoa pode publicar

O instrutor optou pela imagem oficial `postgres` por ter menos vulnerabilidades e atualizacao mais frequente no momento da aula.

## Anatomia do comando docker run

```bash
docker run --name db-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

- `docker run` — cria E inicia um novo container
- `--name db-postgres` — nome para referenciar o container (sem isso, Docker gera nome aleatorio)
- `-e POSTGRES_USER=postgres` — variavel de ambiente para o usuario do banco
- `-e POSTGRES_PASSWORD=postgres` — variavel de ambiente para a senha
- `-p 5432:5432` — mapeia porta `host:container` (a porta 5432 e padrao do PostgreSQL)
- `-d` — roda em background (detached mode), liberando o terminal
- `postgres` — nome da imagem (sem tag, usa `latest` por padrao)

## O que acontece por baixo

1. Docker verifica se a imagem `postgres` existe localmente
2. Se nao encontra, faz download do Docker Hub (pull automatico)
3. Extrai as camadas da imagem
4. Cria o container com as configuracoes passadas
5. Inicia o container em background

O instrutor destacou que a mensagem "not found locally" aparece automaticamente antes do download — Docker sempre tenta local primeiro.

## Postgres: usuario e senha padrao

O PostgreSQL na imagem oficial aceita as variaveis:
- `POSTGRES_USER` — usuario (padrao: `postgres` se omitido)
- `POSTGRES_PASSWORD` — **obrigatoria** (container falha sem ela)
- `POSTGRES_DB` — nome do banco (padrao: mesmo nome do user)

O instrutor mencionou que `postgres` e o usuario padrao, mas prefere deixar explicito por clareza.

## Mapeamento de portas

A flag `-p` segue o formato `porta_host:porta_container`. O instrutor usa a mesma porta (5432:5432) por preferencia pessoal — facilita lembrar e nao precisa configurar porta diferente nos clients.

Se a porta 5432 ja estiver em uso na maquina (outro Postgres local, por exemplo), basta mapear para outra: `-p 5433:5432`.