# Code Examples: Principios de Isolamento

## 1. Configurando cgroups via Docker

### Docker run com limites

```bash
# Limitar CPU a 500 millicores e memoria a 256MB
docker run -d \
  --name api \
  --cpus="0.5" \
  --memory="256m" \
  --memory-swap="512m" \
  my-api:latest

# Verificar limites aplicados
docker stats api --no-stream
```

### Docker Compose com resource limits

```yaml
version: "3.8"
services:
  api:
    image: my-api:latest
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 256M
        reservations:
          cpus: "0.25"
          memory: 128M
    # Sem limits: container pode monopolizar o host
```

## 2. Inspecionando namespaces

```bash
# Obter PID do processo principal do container
CONTAINER_PID=$(docker inspect --format '{{.State.Pid}}' my-container)

# Ver todos os namespaces desse processo
ls -la /proc/$CONTAINER_PID/ns/
# lrwxrwxrwx cgroup -> cgroup:[4026531835]
# lrwxrwxrwx ipc    -> ipc:[4026532486]
# lrwxrwxrwx mnt    -> mnt:[4026532484]
# lrwxrwxrwx net    -> net:[4026532489]
# lrwxrwxrwx pid    -> pid:[4026532487]
# lrwxrwxrwx user   -> user:[4026531837]
# lrwxrwxrwx uts    -> uts:[4026532485]

# Comparar com namespaces do host
ls -la /proc/1/ns/
# Numeros diferentes = isolamento ativo
```

### Verificando isolamento de processos

```bash
# No host: ve todos os processos
ps aux | wc -l
# 150+

# Dentro do container: ve apenas seus processos
docker exec my-container ps aux
# PID 1 = processo principal do container
# Poucos processos
```

### Verificando isolamento de rede

```bash
# No host
ip addr
# eth0, docker0, veth*, etc.

# Dentro do container
docker exec my-container ip addr
# Apenas lo e eth0 do container (namespace de rede proprio)
```

## 3. Unshare — Isolamento manual

```bash
# Criar namespace de PID isolado
sudo unshare --pid --fork --mount-proc /bin/bash
# Agora 'ps aux' mostra apenas o bash (PID 1)

# Criar namespace de rede isolado
sudo unshare --net /bin/bash
# 'ip addr' mostra apenas loopback

# Combinacao completa (simula o que Docker faz)
sudo unshare --pid --net --mount --uts --ipc --fork /bin/bash
```

## 4. Cenario problematico: sem cgroup limits

```bash
# Container sem limites — PERIGOSO
docker run -d --name hungry-app hungry-image:latest

# Se a app tiver memory leak, vai consumir TODA a RAM do host
# Outros containers e o proprio host podem cair

# CORRETO: sempre com limites
docker run -d \
  --name hungry-app \
  --memory="512m" \
  --cpus="1.0" \
  hungry-image:latest
# Se exceder 512MB, container e morto (OOM) sem afetar o host
```

## 5. Verificando OCI compliance

```bash
# Ver runtime OCI em uso
docker info | grep -i runtime
# Default runtime: runc (OCI-compliant)

# Inspecionar config OCI de um container
docker inspect my-container | jq '.[0].HostConfig'
# Mostra cgroup limits, namespace config, etc. no formato OCI
```