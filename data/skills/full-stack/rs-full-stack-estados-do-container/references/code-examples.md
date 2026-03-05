# Code Examples: Estados do Container Docker

## Verificar containers em execucao

```bash
docker ps
```

Output esperado (container rodando):
```
CONTAINER ID   IMAGE     COMMAND       CREATED          STATUS          PORTS                    NAMES
abc123def456   myapp     "node app"    10 minutes ago   Up 10 minutes   0.0.0.0:3333->3333/tcp   mycontainer
```

## Pausar um container

```bash
# Copie o CONTAINER ID do docker ps
docker pause abc123def456
```

Verificando o estado apos pausar:
```bash
docker ps
```

Output (note o "(Paused)"):
```
CONTAINER ID   IMAGE     COMMAND       CREATED          STATUS                   PORTS                    NAMES
abc123def456   myapp     "node app"    12 minutes ago   Up 12 minutes (Paused)   0.0.0.0:3333->3333/tcp   mycontainer
```

Neste estado, acessar `http://localhost:3333` no navegador resultara em timeout — a requisicao fica pendente indefinidamente.

## Despausar um container

```bash
docker unpause abc123def456
```

Verificando:
```bash
docker ps
```

Output (sem "(Paused)"):
```
CONTAINER ID   IMAGE     COMMAND       CREATED          STATUS          PORTS                    NAMES
abc123def456   myapp     "node app"    15 minutes ago   Up 15 minutes   0.0.0.0:3333->3333/tcp   mycontainer
```

Agora `http://localhost:3333` responde normalmente com "hello world".

## Parar um container

```bash
docker stop abc123def456
```

Verificando com `docker ps` (sem flag):
```bash
docker ps
```

Output (lista vazia — container nao esta em execucao):
```
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

Verificando com `docker ps -a` (mostra todos):
```bash
docker ps -a
```

Output (note o status "Exited"):
```
CONTAINER ID   IMAGE     COMMAND       CREATED          STATUS                     PORTS     NAMES
abc123def456   myapp     "node app"    20 minutes ago   Exited (0) 2 minutes ago             mycontainer
```

Neste estado, acessar `http://localhost:3333` retorna erro de conexao imediatamente.

## Iniciar um container parado

```bash
docker start abc123def456
```

Verificando:
```bash
docker ps
```

Output (container rodando novamente):
```
CONTAINER ID   IMAGE     COMMAND       CREATED          STATUS         PORTS                    NAMES
abc123def456   myapp     "node app"    22 minutes ago   Up 5 seconds   0.0.0.0:3333->3333/tcp   mycontainer
```

`http://localhost:3333` volta a responder com "hello world".

## Resumo de comandos

```bash
# Ver containers rodando
docker ps

# Ver TODOS os containers (incluindo parados)
docker ps -a

# Pausar (congela processos, mantem memoria)
docker pause <container_id>

# Despausar (retoma processos)
docker unpause <container_id>

# Parar (encerra tudo, libera recursos)
docker stop <container_id>

# Iniciar (re-executa container parado)
docker start <container_id>
```