# Code Examples: Docker Client e Comandos Docker Compose

## Exemplo completo do fluxo de trabalho

### 1. Levantar container (modo attached)

```bash
# Navegar ate a raiz do projeto (onde esta o docker-compose.yml)
cd ~/projetos/pet-shop

# Levantar containers — terminal fica travado com logs
docker compose up
```

**Output esperado (primeira execucao):**
```
[+] Running 1/1
 ✔ Network pet-shop_default  Created
 ✔ Container PetShopDB       Created
Attaching to PetShopDB
PetShopDB  | PostgreSQL init process complete; ready for start up.
PetShopDB  | LOG:  database system is ready to accept connections
```

**Output esperado (execucoes seguintes):**
```
[+] Running 1/0
 ✔ Container PetShopDB       Started
Attaching to PetShopDB
PetShopDB  | LOG:  database system is ready to accept connections
```

> Nota: Na primeira vez, o Docker baixa a imagem (ex: postgres:17). Nas vezes seguintes, reutiliza a imagem local.

### 2. Levantar container (modo detached)

```bash
docker compose up -d
```

**Output esperado:**
```
[+] Running 1/1
 ✔ Container PetShopDB  Started
```

O terminal fica livre imediatamente.

### 3. Verificar containers rodando

```bash
docker compose ps
```

**Output esperado:**
```
NAME        IMAGE         COMMAND                  SERVICE   CREATED          STATUS          PORTS
PetShopDB   postgres:17   "docker-entrypoint.s…"   db        10 seconds ago   Up 10 seconds   0.0.0.0:5432->5432/tcp
```

### 4. Parar e remover containers

```bash
docker compose down
```

**Output esperado:**
```
[+] Running 1/1
 ✔ Container PetShopDB       Removed
 ✔ Network pet-shop_default  Removed
```

### 5. Referenciar o docker-compose.yml usado na aula

```yaml
# docker-compose.yml (referencia da aula)
services:
  db:
    image: postgres:17
    container_name: PetShopDB
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: petshop
```

### 6. Fluxo completo de uma sessao de trabalho

```bash
# 1. Abrir terminal na raiz do projeto
cd ~/projetos/pet-shop

# 2. Levantar banco de dados
docker compose up -d

# 3. Verificar que esta rodando
docker compose ps

# 4. ... trabalhar no projeto ...

# 5. Ao terminar, desligar
docker compose down
```

### 7. Quando precisar ver logs (debug)

```bash
# Opcao A: levantar sem -d (logs em tempo real, terminal travado)
docker compose up

# Opcao B: levantar detached e ver logs separadamente
docker compose up -d
docker compose logs -f
```