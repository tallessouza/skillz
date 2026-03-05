# Deep Explanation: Setup Docker, Docker Compose e Prisma

## Por que OrbStack ao inves de Docker Desktop?

O instrutor recomenda OrbStack para usuarios macOS porque e significativamente mais leve e rapido que o Docker Desktop. Ele menciona que usou Docker Desktop por muito tempo antes de descobrir o OrbStack, e que a diferenca de performance e notavel. No entanto, enfatiza que Docker Desktop funciona perfeitamente — OrbStack e apenas uma otimizacao.

## Docker Compose como "receita de bolo"

O instrutor usa a analogia de "receita de bolo" para descrever o docker-compose.yml. A ideia e que o arquivo descreve todos os servicos necessarios de forma declarativa, tornando trivial:
- Subir o ambiente de desenvolvimento com um comando
- Replicar o ambiente em CI/CD
- Preparar para deploy futuro

## Postgres 17 Alpine

A escolha de `postgres:17-alpine` e intencional:
- **17**: versao mais recente e estavel
- **alpine**: imagem minima, mais leve e rapida para baixar

## Health check no docker-compose

O instrutor menciona que adicionou health checks como parte de testes que fez. O health check com `pg_isready` garante que o container so e considerado "healthy" quando o PostgreSQL esta de fato aceitando conexoes, nao apenas quando o container iniciou.

## Fluxo de configuracao do Prisma Client

O instrutor passou por um processo iterativo na aula:
1. Primeiro tentou importar `PrismaClient` do caminho padrao — falhou porque o output estava customizado
2. Rodou `npx prisma generate` para gerar o client na pasta `generated/prisma`
3. Corrigiu a importacao para `../../generated/prisma`
4. Verificou que o client funcionava testando autocompletion no editor (ex: `prisma.prompt.findFirst`)

Esse fluxo mostra que quando se usa `output` customizado no schema.prisma, a importacao muda de `@prisma/client` para o caminho relativo do output.

## .gitignore estrategico

Dois itens precisam ser ignorados:
- **pg-data**: dados do PostgreSQL (volume local). Sem isso, dados binarios do banco iriam para o repositorio
- **generated/prisma**: codigo gerado pelo Prisma. Deve ser regenerado no build/CI, nao versionado

## Conexao via DATABASE_URL

O formato da URL segue o padrao PostgreSQL:
```
postgresql://USUARIO:SENHA@HOST:PORTA/BANCO?schema=SCHEMA
```

Para desenvolvimento local com o docker-compose configurado:
```
postgresql://postgres:password@localhost:5432/nome-do-banco?schema=public
```