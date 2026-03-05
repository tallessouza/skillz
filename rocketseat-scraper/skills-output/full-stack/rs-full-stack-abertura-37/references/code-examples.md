# Code Examples: Abertura — Modulo de Containers

## Nota

Esta e a aula de abertura do modulo. Os exemplos praticos serao desenvolvidos nas aulas seguintes. Abaixo estao os cenarios que serao explorados:

### Cenario 1: Container Node.js
```bash
# Sera explorado nas proximas aulas
docker run -p 3000:3000 node-app
```

### Cenario 2: Container Postgres
```bash
# Banco relacional mais usado no mercado
docker run -e POSTGRES_PASSWORD=secret -p 5432:5432 postgres
```

### Cenario 3: Volume para persistencia
```bash
# Criar volume e vincular a container
docker volume create meu-volume
docker run -v meu-volume:/var/lib/postgresql/data postgres
```

### Cenario 4: Docker Compose
```yaml
# docker-compose.yml — multiplos containers com um comando
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres
    volumes:
      - db-data:/var/lib/postgresql/data
volumes:
  db-data:
```

Esses exemplos serao detalhados e executados passo a passo nas aulas subsequentes do modulo.