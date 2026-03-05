# Code Examples: Removendo Container e Imagem no Docker

## Fluxo completo demonstrado na aula

### 1. Verificar containers em execucao

```bash
$ docker ps
CONTAINER ID   IMAGE          COMMAND   CREATED          STATUS          PORTS     NAMES
a1b2c3d4e5f6   minha-imagem   "..."     10 minutes ago   Up 10 minutes             meu-container
```

### 2. Tentativa de remover container em execucao (FALHA)

```bash
$ docker rm a1b2c3d4e5f6
Error response from daemon: You cannot remove a running container a1b2c3d4e5f6.
Stop the container before attempting removal or force remove.
```

### 3. Opcao A: Parar e depois remover

```bash
# Parar o container
$ docker stop a1b2c3d4e5f6
a1b2c3d4e5f6

# Verificar que parou (status Exited)
$ docker ps -a
CONTAINER ID   IMAGE          COMMAND   CREATED          STATUS                     NAMES
a1b2c3d4e5f6   minha-imagem   "..."     12 minutes ago   Exited (0) 5 seconds ago   meu-container

# Agora remover
$ docker rm a1b2c3d4e5f6
a1b2c3d4e5f6

# Confirmar remocao
$ docker ps -a
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
```

### 4. Recriar container para demonstrar force

```bash
$ docker run -d minha-imagem
b2c3d4e5f6a7

$ docker ps
CONTAINER ID   IMAGE          STATUS
b2c3d4e5f6a7   minha-imagem   Up 3 seconds
```

### 5. Opcao B: Forcar remocao direta

```bash
$ docker rm -f b2c3d4e5f6a7
b2c3d4e5f6a7

# Confirmar
$ docker ps
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES

$ docker ps -a
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
```

### 6. Remover imagem

```bash
$ docker image ls
REPOSITORY     TAG       IMAGE ID       CREATED        SIZE
minha-imagem   latest    c3d4e5f6a7b8   2 hours ago    150MB

$ docker image rm c3d4e5f6a7b8
Untagged: minha-imagem:latest
Deleted: sha256:c3d4e5f6a7b8...

$ docker image ls
REPOSITORY   TAG   IMAGE ID   CREATED   SIZE
```

## Variacoes uteis

### Remover container por nome (em vez de ID)

```bash
docker rm -f meu-container
```

### Remover todos os containers parados

```bash
docker container prune
```

### Remover todas as imagens nao utilizadas

```bash
docker image prune -a
```

### Remover tudo (containers, imagens, volumes, networks)

```bash
docker system prune -a
```

### Remover imagem por nome e tag

```bash
docker image rm minha-imagem:latest
```

### Remover multiplos containers de uma vez

```bash
docker rm -f container1 container2 container3
```

### Remover multiplas imagens de uma vez

```bash
docker image rm img1 img2 img3
```