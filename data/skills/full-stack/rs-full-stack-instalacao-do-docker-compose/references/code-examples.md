# Code Examples: Instalacao do Docker Compose

## Verificacao de versao

```bash
# Verificar versao do Docker Compose v2 (plugin)
docker compose version
# Output esperado: Docker Compose version v2.24.0

# Verificar versao legacy (v1)
docker-compose --version
# Output esperado: docker-compose version 1.29.2
```

## Instalacao por SO

### Ubuntu / Debian

```bash
# Metodo 1: Via apt (recomendado)
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Metodo 2: Download manual do binario
DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
```

### Fedora / RHEL / CentOS

```bash
sudo dnf install docker-compose-plugin
```

### macOS

```bash
# Docker Compose ja incluido no Docker Desktop
# Basta instalar/atualizar Docker Desktop

# Ou via Homebrew (standalone)
brew install docker-compose
```

### Windows

Docker Compose ja incluido no Docker Desktop para Windows. Instalar ou atualizar o Docker Desktop.

## Verificacao pos-instalacao

```bash
# Verificar que o compose funciona
docker compose version

# Testar com um comando basico
docker compose ps
# Deve retornar lista vazia (sem erro)

# Verificar que o Docker Engine tambem esta ok
docker info
```

## Primeiro uso rapido (preview da proxima aula)

```yaml
# docker-compose.yml minimo para teste
services:
  hello:
    image: hello-world
```

```bash
# Executar para confirmar que tudo funciona
docker compose up
# Deve baixar a imagem e mostrar mensagem de sucesso
```