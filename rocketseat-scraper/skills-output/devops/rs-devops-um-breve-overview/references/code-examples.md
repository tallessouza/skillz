# Code Examples: Orquestração de Containers Local

## Configuração TypeORM da aplicação

A aplicação usa TypeORM com MySQL, configuração hardcoded para exemplo:

```typescript
// app.module.ts (configuração TypeORM)
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',  // funciona quando app roda FORA do container
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'rocketdb',
  // ... demais configs
})
```

## Docker run completo para MySQL

```bash
docker run -d \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=rocketdb \
  --name mysql \
  mysql:8
```

### Breakdown de cada flag:

| Flag | Função |
|------|--------|
| `-d` | Detach mode — roda em background |
| `-p 3306:3306` | Porta host:porta container |
| `-e MYSQL_ROOT_PASSWORD=root` | Senha do root |
| `-e MYSQL_DATABASE=rocketdb` | Banco criado automaticamente no startup |
| `--name mysql` | Nome do container (usado como hostname) |
| `mysql:8` | Imagem e tag específica |

## Verificação de logs

```bash
docker logs mysql
```

Output esperado:
```
MySQL init process done. Ready for startup.
...
ready for connections. Version: '8.x.x'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306
```

## Gerenciamento de container existente

Se o container já existe com o mesmo nome:
```bash
# Remover container parado
docker container rm mysql

# Depois rodar novamente
docker run -d -p 3306:3306 ... --name mysql mysql:8
```

## Alternativa: Dockerfile para MySQL (quando necessário)

```dockerfile
# Dockerfile.mysql — só vale a pena se precisar de instruções extras
FROM mysql:8
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=rocketdb
```

Build e run:
```bash
docker build -f Dockerfile.mysql -t my-mysql .
docker run -d -p 3306:3306 --name mysql my-mysql
```

## Múltiplas variáveis de ambiente

Padrão: repita `-e` para cada variável:
```bash
docker run -d \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=rocketdb \
  -e MYSQL_USER=admin \
  -e MYSQL_PASSWORD=admin123 \
  --name mysql \
  mysql:8
```

## Teste fora do container

```bash
# App no host conecta via localhost:3306 (port mapping ativo)
yarn run start

# Saída esperada: TypeORM module initialized
# Saída de erro: Unable to connect to the database
```