# Code Examples: Instalação do Docker

## Comandos de verificação

### Versão completa

```bash
docker --version
# Output: Docker version 27.5.1, build 9f9e405
```

### Versão abreviada

```bash
docker -v
# Output: Docker version 27.5.1, build 9f9e405
```

Ambos os comandos fazem a mesma coisa. `docker -v` é apenas a forma curta de `docker --version`.

## Troubleshooting pós-instalação

### Docker não encontrado no terminal (command not found)

```bash
# Verificar se o binário existe
which docker
# Se não retornar nada, o Docker não está no PATH

# No macOS/Linux, verificar PATH
echo $PATH

# Reiniciar o terminal pode resolver (recarrega o PATH)
```

### Permissão negada no Linux

```bash
# Erro comum: Got permission denied while trying to connect to the Docker daemon socket
# Solução: adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Aplicar mudança sem logout (nova sessão de shell)
newgrp docker

# Verificar
docker -v
```

### Docker Desktop não inicia (Windows/macOS)

```bash
# Verificar se o serviço está rodando
# macOS:
ps aux | grep -i docker

# Windows (PowerShell):
Get-Process *docker*

# Se não estiver rodando, abra o Docker Desktop manualmente
# e aguarde o ícone indicar "running" antes de usar o terminal
```

### Verificação completa do ambiente

```bash
# Versão do Docker
docker -v

# Informações detalhadas do Docker (client + server)
docker info

# Verificar que o daemon está respondendo
docker ps
# Se retornar uma lista (mesmo vazia), está funcionando
```