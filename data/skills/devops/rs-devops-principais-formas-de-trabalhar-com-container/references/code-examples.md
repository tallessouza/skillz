# Code Examples: Formas de Trabalhar com Containers

## Instalacao do Docker

### Linux (Ubuntu/Debian)

```bash
# Remover versoes antigas
sudo apt-get remove docker docker-engine docker.io containerd runc

# Instalar dependencias
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg

# Adicionar chave GPG oficial do Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Adicionar repositorio
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Verificacao da instalacao

```bash
# Verificar se Docker esta rodando
docker --version
# Docker version 27.x.x, build xxxxxxx

# Testar com container hello-world
docker run hello-world
```

### Mac

```bash
# Via Homebrew
brew install --cask docker

# Depois abra o Docker Desktop pela primeira vez para completar setup
# Para Apple Silicon (M1+): selecione a versao Apple Silicon no download
```

### Windows (WSL2)

```powershell
# 1. Instalar WSL2 (se ainda nao tem)
wsl --install

# 2. Baixar Docker Desktop do site oficial
# 3. Durante instalacao, marcar "Use WSL 2 based engine"
# 4. Reiniciar e verificar
docker --version
```

## Comparando Docker vs Podman (comandos equivalentes)

```bash
# Docker
docker run -d nginx
docker ps
docker stop <container_id>
docker images

# Podman (mesmos comandos, compativel)
podman run -d nginx
podman ps
podman stop <container_id>
podman images
```

A compatibilidade de comandos e possivel porque ambos seguem o padrao OCI.

## Verificando o ecossistema Docker instalado

```bash
# Ver todos os componentes instalados
docker info

# Verificar Docker Compose
docker compose version

# Verificar Buildx
docker buildx version

# Login no Docker Hub (container registry)
docker login
```