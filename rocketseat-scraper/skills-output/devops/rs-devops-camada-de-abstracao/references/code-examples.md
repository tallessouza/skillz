# Code Examples: Docker Network — Camada de Abstracao

## Listar redes existentes

```bash
docker network ls
```

Saida esperada (instalacao limpa):
```
NETWORK ID     NAME      DRIVER    SCOPE
a1b2c3d4e5f6   bridge    bridge    local
f6e5d4c3b2a1   host      host      local
1a2b3c4d5e6f   none      null      local
```

Toda instalacao Docker vem com essas tres redes. O ID sera diferente em cada maquina.

## Criar rede com driver default (bridge)

```bash
docker network create primeira-network
```

Saida:
```
<hash-da-rede>
```

Verificando:
```bash
docker network ls
```

```
NETWORK ID     NAME               DRIVER    SCOPE
a1b2c3d4e5f6   bridge             bridge    local
f6e5d4c3b2a1   host               host      local
1a2b3c4d5e6f   none               null      local
7g8h9i0j1k2l   primeira-network   bridge    local
```

## Criar rede especificando driver explicitamente

```bash
docker network create --driver bridge natural-bridge
```

Mesmo resultado — bridge e o default, entao especificar e opcional.

## Tentativa de criar segunda rede host (vai falhar)

```bash
docker network create --driver host minha-host
```

Erro:
```
Error response from daemon: only one instance of "host" network is allowed
```

**Conclusao:** Host e null nao permitem redes adicionais. Use as que ja existem.

## Comandos disponiveis em docker network

```bash
docker network
```

Saida:
```
Usage:  docker network COMMAND

Manage networks

Commands:
  connect     Connect a container to a network
  create      Create a network
  disconnect  Disconnect a container from a network
  inspect     Display detailed information on one or more networks
  ls          List networks
  prune       Remove all unused networks
  rm          Remove one or more networks
```

## Exemplo pratico: projeto com API + banco na mesma rede

```bash
# 1. Criar rede do projeto
docker network create api-rocket-network

# 2. Rodar banco na rede do projeto
docker run -d \
  --network api-rocket-network \
  --name api-rocket-db \
  -e POSTGRES_PASSWORD=secret \
  postgres:15

# 3. Rodar API na mesma rede
docker run -d \
  --network api-rocket-network \
  --name api-rocket \
  -p 3000:3000 \
  api-rocket:v1.0

# Agora api-rocket pode acessar o banco via hostname "api-rocket-db"
```

## Exemplo: container isolado (sem rede)

```bash
docker run -d \
  --network none \
  --name processador-batch \
  processador:v1.0

# Dentro deste container, apenas localhost esta disponivel
# Nenhuma comunicacao externa e possivel
```

## Exemplo: container com acesso total ao host

```bash
docker run -d \
  --network host \
  --name monitor \
  monitor:v1.0

# Container compartilha todas as interfaces de rede do host
# Nao precisa de -p (port mapping) — ja tem acesso direto
```