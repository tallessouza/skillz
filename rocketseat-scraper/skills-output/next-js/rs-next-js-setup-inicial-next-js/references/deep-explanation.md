# Deep Explanation: Setup Inicial Next.js

## Por que essas escolhas?

### TypeScript: Yes
O curso inteiro usa TypeScript. Ativar desde o inicio evita migracoes futuras e garante type safety em todos os componentes, API routes e server actions.

### ESLint: Yes
O Next.js vem com regras ESLint especificas para o framework (next/core-web-vitals). Na proxima aula do curso, o instrutor configura ESLint + Prettier com regras mais rigorosas de qualidade de codigo.

### Tailwind CSS: Yes
O projeto Pet Shop usa Tailwind para toda a estilizacao. Ativar na criacao ja configura o `tailwind.config.ts`, `postcss.config.mjs` e os imports no `globals.css`.

### Src directory: Yes
Separar codigo fonte em `src/` mantem a raiz do projeto limpa. Arquivos de configuracao (`next.config.ts`, `tsconfig.json`, `docker-compose.yaml`) ficam na raiz, codigo fica em `src/`.

### App Router: Yes
O curso usa App Router (nao Pages Router). Isso significa:
- Layouts aninhados com `layout.tsx`
- Server Components por padrao
- Route handlers em `route.ts`
- Loading/error states com convencoes de arquivo

### Turbopack: No
O instrutor escolheu nao usar Turbopack. Apesar de ser mais rapido em dev, ainda pode ter incompatibilidades com algumas bibliotecas.

### Import alias: Default (@/*)
O alias `@/*` permite imports como `@/components/Button` ao inves de `../../../components/Button`. O default `@/*` mapeia para `src/*`.

## Docker Compose como "Receita de Bolo"

O instrutor usa uma analogia didatica para explicar o `docker-compose.yaml`:

- **Ingredientes** = services listados no arquivo (banco de dados, cache, etc.)
- **Modo de preparo** = configuracoes de cada service (portas, volumes, variaveis de ambiente)
- **Docker executa** = o Docker le essa "receita" e cria os containers automaticamente

Isso e importante porque o projeto Pet Shop vai usar banco de dados (provavelmente PostgreSQL) via Docker, evitando instalacao local.

## Limpeza do Boilerplate

O `create-next-app` gera uma pagina inicial com bastante conteudo de exemplo (logos, links, grid de cards). O instrutor remove tudo imediatamente e deixa apenas um `<div>` com um `<h2>`, porque:

1. O boilerplate nao tem relacao com o projeto
2. Comecar limpo evita confusao sobre o que e do framework vs. do projeto
3. Facilita o desenvolvimento incremental

## Proximos passos mencionados

O instrutor menciona que as proximas aulas cobrem:
- Configuracao detalhada do Docker Compose (o que cada service faz)
- Qualidade de codigo com ESLint + Prettier na ultima versao do Next.js com App Router