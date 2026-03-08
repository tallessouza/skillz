# Code Examples: Limpando Containers e Imagens Docker

## Fluxo completo demonstrado na aula

### 1. Listar todos os containers

```bash
docker ps -a
```

Saida esperada (com containers existentes):
```
CONTAINER ID   IMAGE      COMMAND                  CREATED       STATUS                   PORTS     NAMES
a1b2c3d4e5f6   postgres   "docker-entrypoint.s…"   2 days ago    Exited (0) 1 day ago               my-postgres
```

### 2. Remover container por ID

```bash
docker rm -f a1b2c3d4e5f6
```

Saida:
```
a1b2c3d4e5f6
```

### 3. Confirmar remocao

```bash
docker ps -a
```

Saida esperada (vazio):
```
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

### 4. Listar imagens

```bash
docker image ls
```

Saida esperada (com imagens existentes):
```
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
postgres     latest    f1g2h3i4j5k6   2 weeks ago    379MB
```

### 5. Remover imagem por ID

```bash
docker rmi f1g2h3i4j5k6
```

Saida:
```
Untagged: postgres:latest
Deleted: sha256:f1g2h3i4j5k6...
```

### 6. Confirmar ambiente limpo

```bash
docker ps -a
docker image ls
```

Ambos devem retornar listas vazias.

---

## Variacoes uteis

### Remover container pelo nome

```bash
docker rm -f my-postgres
```

### Remover imagem pelo nome

```bash
docker rmi postgres:latest
```

### Remover multiplos containers de uma vez

```bash
docker rm -f container1_id container2_id container3_id
```

### Remover TODOS os containers parados

```bash
docker container prune
```

Saida:
```
WARNING! This will remove all stopped containers.
Are you sure you want to continue? [y/N] y
Deleted Containers:
a1b2c3d4e5f6
Total reclaimed space: 150MB
```

### Remover TODAS as imagens sem uso

```bash
docker image prune -a
```

### Limpeza total do sistema

```bash
docker system prune -a
```

Remove containers parados, imagens sem uso, networks orfas e cache de build.

### Parar container antes de remover (sem -f)

```bash
docker stop a1b2c3d4e5f6
docker rm a1b2c3d4e5f6
```

### Verificar espaco em disco usado pelo Docker

```bash
docker system df
```

Saida:
```
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          3         1         1.2GB     800MB (66%)
Containers      2         1         50MB      25MB (50%)
Local Volumes   5         2         500MB     300MB (60%)
Build Cache     10        0         200MB     200MB (100%)
```