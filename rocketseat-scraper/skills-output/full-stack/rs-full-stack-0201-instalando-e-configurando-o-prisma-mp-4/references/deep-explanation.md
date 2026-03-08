# Deep Explanation: Instalando e Configurando o Prisma

## Por que duas dependencias separadas?

O Prisma separa suas ferramentas em dois pacotes com propositos distintos:

1. **`prisma` (devDependency)** — E o CLI. Usado para `prisma init`, `prisma migrate`, `prisma generate`, `prisma studio`. So roda em desenvolvimento. Nao precisa existir no bundle de producao.

2. **`@prisma/client` (dependency de producao)** — E o runtime. O `PrismaClient` e o que a aplicacao usa para conectar ao banco e executar queries. Precisa estar disponivel quando a aplicacao roda em producao.

Essa separacao segue o principio de que ferramentas de build/dev nao devem ir para producao, porque reduz o tamanho do deploy e a superficie de ataque.

## O comando `prisma init`

```bash
npx prisma init --datasource-provider sqlite
```

O `npx` executa o CLI do Prisma instalado localmente. O flag `--datasource-provider` configura automaticamente o `schema.prisma` com o provider correto e gera a `DATABASE_URL` adequada no `.env`.

Sem esse flag, o Prisma usa PostgreSQL como padrao — o que pode causar confusao se o projeto usa SQLite ou outro banco.

### O que o `init` cria

- **`prisma/schema.prisma`** — Arquivo principal de configuracao. Contem o bloco `datasource` (provider + url) e o bloco `generator` (client). E aqui que os modelos (tabelas) serao definidos.

- **`.env`** — Arquivo de variaveis de ambiente. Para SQLite, a `DATABASE_URL` aponta para um arquivo local como `file:./dev.db`.

## Singleton Pattern para PrismaClient

O instrutor cria um unico arquivo `src/database/prisma.ts` que exporta uma instancia compartilhada:

```typescript
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient({
  log: ["query"],
})
```

### Por que singleton?

Cada `new PrismaClient()` abre um pool de conexoes com o banco. Se voce criar uma instancia nova em cada arquivo ou cada request, rapidamente esgota as conexoes disponiveis. O padrao correto e criar UMA instancia e importa-la onde necessario.

Este e um padrao tao comum que a documentacao oficial do Prisma recomenda explicitamente: "Instantiate PrismaClient once and reuse it."

### Por que `log: ["query"]`?

O instrutor habilita query logging porque:

1. **Debug facilitado** — Quando um select ou insert e executado, voce ve exatamente qual SQL o Prisma gerou
2. **Performance** — Consegue identificar queries N+1 ou queries desnecessarias
3. **Aprendizado** — Ajuda a entender como o Prisma traduz suas chamadas de API para SQL real

Opcoes de log disponiveis: `"query"`, `"info"`, `"warn"`, `"error"`. Voce pode combinar: `log: ["query", "warn", "error"]`.

Para producao, o instrutor sugere remover o `log` ou usar apenas `["warn", "error"]` para nao poluir os logs com queries rotineiras.

## Organizacao de pastas

O instrutor escolhe `src/database/prisma.ts` como local para o modulo de conexao. Essa decisao:

- Isola a configuracao do banco em uma pasta dedicada
- Segue a convencao de manter infraestrutura separada de logica de negocio
- Facilita encontrar e modificar configuracoes do banco no futuro
- Permite adicionar outros arquivos de database (seeds, helpers) na mesma pasta

## SQLite como escolha para desenvolvimento

O instrutor usa SQLite porque:

- Nao precisa instalar servidor de banco separado
- O banco e um arquivo local (zero configuracao de rede)
- Perfeito para desenvolvimento e aprendizado
- O Prisma abstrai as diferencas — trocar para PostgreSQL depois e so mudar o provider

A desvantagem e que SQLite nao suporta features avancadas como enums nativos ou full-text search avancado, mas para o escopo de uma aplicacao de estudo, e a escolha ideal.