# Code Examples: Conectando Beekeeper ao Postgres em Container

## Comandos Docker usados na aula

### Verificar containers rodando

```bash
docker ps
# Saida esperada:
# CONTAINER ID   IMAGE      COMMAND                  STATUS          PORTS
# abc123def456   postgres   "docker-entrypoint.s…"   Up 10 minutes   0.0.0.0:5432->5432/tcp
```

### Pausar container

```bash
# Copiar o CONTAINER ID do docker ps
docker pause abc123def456

# Verificar status
docker ps
# STATUS mostra "(Paused)" ao lado do tempo de execucao
```

### Despausar container

```bash
docker unpause abc123def456

# Verificar status
docker ps
# STATUS volta ao normal: "Up X minutes"
```

## SQL executado na aula

### Criar tabela product

```sql
CREATE TABLE product (
  id SERIAL PRIMARY KEY,
  nome VARCHAR NOT NULL,
  price DECIMAL NOT NULL
);
```

O instrutor cria via interface grafica do Beekeeper:
- `id` como auto-incremento (SERIAL)
- `nome` como texto sem permitir nulo
- `price` como decimal sem permitir nulo

### Inserir registros

Via interface grafica do Beekeeper (clicando no botao `+` e preenchendo campos):

```sql
-- Equivalente SQL do que foi feito visualmente:
INSERT INTO product (nome, price) VALUES ('teclado', 120);
INSERT INTO product (nome, price) VALUES ('mouse', 64.59);
```

### Consultar registros

```sql
SELECT * FROM product;
-- Resultado:
-- id | nome     | price
-- 1  | teclado  | 120
-- 2  | mouse    | 64.59
```

## Configuracao completa de conexao no Beekeeper

```
Connection Type: Postgres
Host: localhost
Port: 5432
User: postgres
Password: postgres
Default Database: postgres (padrao)
SSL: off (ambiente local)
```

## Variacoes uteis

### Se a porta do host for diferente

```bash
# Exemplo: porta 5433 no host mapeada para 5432 no container
docker run -p 5433:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres postgres
```

No Beekeeper, usar Port: `5433` (a porta do HOST, nao do container).

### Conectar via psql (alternativa CLI)

```bash
# Direto do host
psql -h localhost -p 5432 -U postgres

# De dentro do container
docker exec -it abc123def456 psql -U postgres
```

### Verificar se a porta esta acessivel

```bash
# Linux/Mac
nc -zv localhost 5432

# Ou com curl
curl -v telnet://localhost:5432
```