# Code Examples: Gerenciando Redes Docker

## Exemplo completo: Fluxo com container existente

```bash
# 1. Listar redes existentes
docker network ls
# NETWORK ID     NAME                    DRIVER    SCOPE
# a1b2c3d4e5f6   bridge                  bridge    local
# f6e5d4c3b2a1   primeira-network        bridge    local

# 2. Verificar containers rodando
docker ps
# CONTAINER ID   IMAGE          PORTS                    NAMES
# abc123def456   minha-app:v1   0.0.0.0:3000->3000/tcp   keen_darwin

# 3. Conectar container a rede (ID da rede, depois ID do container)
docker network connect f6e5d4c3b2a1 abc123def456
# (sem output = sucesso)

# 4. Verificar pela perspectiva da rede
docker network inspect f6e5d4c3b2a1
# {
#   "Name": "primeira-network",
#   "Driver": "bridge",
#   "Containers": {
#     "abc123def456...": {
#       "Name": "keen_darwin",
#       "IPv4Address": "172.18.0.2/16",
#       "MacAddress": "02:42:ac:12:00:02"
#     }
#   }
# }

# 5. Verificar pela perspectiva do container
docker container inspect abc123def456
# Na secao "Networks":
# {
#   "bridge": {
#     "Gateway": "172.17.0.1",
#     "IPAddress": "172.17.0.2"
#   },
#   "primeira-network": {
#     "Gateway": "172.18.0.1",
#     "IPAddress": "172.18.0.2"
#   }
# }
# NOTA: bridge aparece porque o container foi criado sem --network
```

## Exemplo completo: Fluxo com container novo

```bash
# 1. Parar container anterior (se porta estiver em uso)
docker ps
docker stop abc123def456

# 2. Criar container ja na rede
docker run -p 3000:3000 -d --network primeira-network minha-app:v1

# 3. Verificar
docker container inspect <novo-container-id>
# Na secao "Networks":
# {
#   "primeira-network": {
#     "Gateway": "172.18.0.1",
#     "IPAddress": "172.18.0.2"
#   }
# }
# NOTA: bridge NAO aparece — container criado com --network
```

## Exemplo: Desconectar rede

```bash
docker network disconnect primeira-network abc123def456
# (sem output = sucesso)

# Verificar
docker container inspect abc123def456
# Networks agora so mostra "bridge"
```

## Exemplo: Arquitetura de microservicos

```bash
# Criar redes por dominio
docker network create rede-pagamentos
docker network create rede-usuarios
docker network create rede-gateway

# Subir servicos na rede do dominio
docker run -d --network rede-pagamentos --name svc-pagamento pagamento:latest
docker run -d --network rede-pagamentos --name db-pagamento postgres:15

docker run -d --network rede-usuarios --name svc-usuarios usuarios:latest
docker run -d --network rede-usuarios --name db-usuarios postgres:15

# Adicionar servicos a rede do gateway (multiplas redes)
docker network connect rede-gateway svc-pagamento
docker network connect rede-gateway svc-usuarios
docker run -d --network rede-gateway --name api-gateway nginx:latest

# Resultado:
# svc-pagamento: rede-pagamentos + rede-gateway (2 redes)
# svc-usuarios: rede-usuarios + rede-gateway (2 redes)
# db-pagamento: rede-pagamentos (isolado, 1 rede)
# db-usuarios: rede-usuarios (isolado, 1 rede)
# api-gateway: rede-gateway (1 rede)
```

## Comandos de referencia rapida

```bash
# Associar rede a container existente
docker network connect <rede> <container>

# Criar container na rede
docker run --network <rede> [outras-flags] <imagem>

# Inspecionar rede (ver containers dentro)
docker network inspect <rede>

# Inspecionar container (ver redes associadas)
docker container inspect <container>

# Desconectar
docker network disconnect <rede> <container>

# Listar redes
docker network ls
```