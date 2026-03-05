# Deep Explanation: Setup do Prisma

## Por que separar prisma CLI e @prisma/client?

O instrutor enfatiza que sao dois pacotes distintos com propositos diferentes. O `prisma` (CLI) e usado apenas em desenvolvimento para rodar migrations, gerar o client, e abrir o Prisma Studio. O `@prisma/client` e a biblioteca que roda em producao, fazendo as queries no banco. Por isso a CLI vai como `-D` (devDependency) e o client como dependency normal.

## A filosofia do naming no banco de dados

O instrutor tem uma preferencia clara e justificada: tabelas no banco devem seguir convencao SQL classica — lowercase, plural, com underscore. Isso contrasta com o naming do TypeScript (PascalCase para models, camelCase para campos). O Prisma permite essa separacao elegante com `@@map` (tabela) e `@map` (campo), mantendo o melhor dos dois mundos:

- No codigo TypeScript: `User`, `Question`, `createdAt` (convencao TS)
- No banco de dados: `users`, `questions`, `created_at` (convencao SQL)

## Foreign keys semanticas

Um ponto sutil mas importante: quando o Prisma gera automaticamente o relacionamento entre Question e User, ele cria um campo `userId`. O instrutor deliberadamente renomeia para `authorId` porque no contexto de um forum, quem cria uma question e um "author", nao apenas um "user" generico. Isso melhora a legibilidade do codigo e comunica a intencao do relacionamento.

## O campo updatedAt como opcional

O instrutor explica que `updatedAt` e `DateTime?` (opcional com `?`) porque quando uma question e criada pela primeira vez, ela nunca foi atualizada — entao o valor e `null`. O decorator `@updatedAt` do Prisma cuida de preencher esse campo automaticamente em qualquer update subsequente, eliminando a necessidade de logica manual.

## Workflow completo de setup

A sequencia que o instrutor segue:
1. Instalar pacotes (CLI + client)
2. `prisma init` — cria pasta prisma/ com schema.prisma e .env
3. Configurar .gitignore IMEDIATAMENTE (antes de qualquer commit)
4. Configurar DATABASE_URL no .env com credenciais do Docker
5. Criar models com convencoes de naming
6. `prisma migrate dev` — gera e aplica migrations
7. `prisma studio` — verificacao visual dos models

## Erro comum: credenciais do DATABASE_URL

O instrutor demonstra um erro real em aula: ao rodar `prisma migrate dev`, recebe "Authentication failed" porque esqueceu de trocar as credenciais default no DATABASE_URL. As credenciais devem bater exatamente com o que foi configurado no Docker Compose (usuario, senha, nome do banco, porta).

## Prisma Studio como substituto de ferramentas graficas

O instrutor menciona que o Prisma Studio elimina a necessidade de ferramentas como Postico (client PostgreSQL para Mac). O Studio roda no navegador e permite navegar pelos models e dados diretamente, sendo suficiente para desenvolvimento.