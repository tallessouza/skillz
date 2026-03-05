# Deep Explanation: Setup Next.js com Prisma

## Por que pnpm e nao npm/yarn?

O instrutor usa pnpm como padrao da Skillz. pnpm tem instalacao mais rapida e economiza espaco em disco com hard links. A CLI do Next.js suporta pnpm nativamente.

## Por que nao usar o template automatico (--example)?

O instrutor deliberadamente escolheu nao usar `--example` ou templates prontos para ter controle total sobre as configuracoes. Isso permite entender cada decisao: TypeScript, ESLint, Tailwind, src directory, App Router.

## Decisoes de CLI explicadas

- **Turbopack (compiler):** O instrutor disse "nao vai fazer muita diferenca agora" — Turbopack ainda e experimental para producao, entao nao e necessario habilitar no setup inicial.
- **src/ directory:** Sim, porque separa codigo da aplicacao dos arquivos de configuracao na raiz.
- **App Router:** "Com certeza" — e o padrao moderno do Next.js, nao usar Pages Router em projetos novos.

## ESLint vs Biome

O instrutor mencionou o Biome como alternativa interessante ao ESLint, mas seguiu com ESLint por ser o padrao. Biome e mais rapido e combina linter + formatter, mas tem menos ecossistema de plugins.

## Schema Prisma: decisoes de modelagem

### CUID vs UUID vs autoincrement
O instrutor escolheu CUID (`@default(cuid())`). CUIDs sao:
- Mais curtos que UUIDs
- URL-safe
- Ordenados por tempo de criacao (parcialmente)
- Nao expoe contagem de registros como autoincrement

### @map para convencao de banco
O padrao do Prisma gera colunas com o mesmo nome do field (camelCase). Usando `@map("created_at")`, o codigo fica idiomatico em TypeScript (`createdAt`) enquanto o banco segue convencao SQL (`created_at`).

### @@map para nome da tabela
`@@map("prompts")` garante que a tabela no banco e plural, seguindo convencao SQL, enquanto o model no Prisma e singular (`Prompt`).

### title como @unique
O instrutor colocou `@unique` no title, indicando que cada prompt deve ter um titulo unico — previne duplicatas no nivel do banco.

## Extensao do Prisma para VS Code

O instrutor destacou que o autocomplete e syntax highlighting vem da extensao oficial do Prisma. Sem ela, o arquivo `.prisma` nao tem suporte no editor. Pesquisar "Prisma" nas extensoes e instalar a oficial.

## O que ficou pendente

1. Configuracao do Docker (proxima aula)
2. Configuracao do `.env` com connection string real
3. Rodar `prisma migrate dev` (so depois do Docker)
4. Configuracao completa do ESLint

O instrutor deliberadamente nao rodou a migration porque o banco ainda nao existe — sera configurado via Docker na proxima aula.