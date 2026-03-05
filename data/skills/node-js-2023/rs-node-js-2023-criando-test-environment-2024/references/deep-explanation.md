# Deep Explanation: Criando Test Environment

## Por que schemas e nao databases separados?

O instrutor (Diego) explica que schemas no PostgreSQL funcionam como "branches do banco de dados". Assim como no Git voce tem branches isoladas, no Postgres cada schema e um ambiente isolado com suas proprias tabelas, sem interferir nas tabelas de outros schemas.

O schema `public` e o padrao do Postgres — equivalente ao `main` do Git. Ao criar um schema com UUID aleatorio, voce tem um ambiente completamente isolado para rodar testes, sem precisar criar um banco de dados inteiro (que seria muito mais pesado).

Vantagens:
- Criacao instantanea (vs criar database que envolve filesystem)
- Destruicao com `DROP SCHEMA CASCADE` remove tudo de uma vez
- Nao precisa de permissoes especiais de CREATE DATABASE
- Parallelismo natural — cada schema tem UUID unico

## O padrao Setup/Teardown

O Vitest permite definir custom environments que seguem o ciclo:

1. **Setup**: executado ANTES de cada suite de testes
   - Gera UUID para schema
   - Modifica `DATABASE_URL` com o novo schema nos search params
   - Roda `prisma db push` para criar tabelas no schema
   
2. **Teardown**: executado DEPOIS de cada suite de testes
   - `DROP SCHEMA IF EXISTS "uuid" CASCADE` — o CASCADE garante que tabelas com foreign keys sejam deletadas na ordem correta, sem conflitos
   - `prisma.$disconnect()` — limpa a conexao

## A evolucao do Vitest e as breaking changes

Diego gravou esta aula como update porque o Vitest mudou significativamente:

1. **vite.config.js → .mjs**: Vitest 3+ exige ESM no config
2. **Vite deixou de vir bundled**: precisa instalar `vite` explicitamente como devDependency
3. **@vitest/coverage-c8 → @vitest/coverage-v8**: pacote renomeado
4. **workspace → projects** (Vitest 3.2.0): a chave `workspace` foi depreciada

## O construtor URL do JavaScript

Diego usa `new URL(process.env.DATABASE_URL)` para manipular a URL de conexao. Isso e um construtor global do JavaScript que permite:
- Acessar `url.searchParams` para ler/modificar query parameters
- `url.searchParams.set('schema', schema)` troca o schema na URL
- `url.toString()` reconstroi a URL completa

Exemplo pratico:
```
Input:  postgresql://user:pass@localhost:5432/mydb?schema=public
Output: postgresql://user:pass@localhost:5432/mydb?schema=a1b2c3d4-uuid
```

## Por que `db push` e nao `migrate deploy` (Prisma 6.13+)

A partir do Prisma 6.13.0, o suporte a Multi-schema se tornou padrao. Isso fez com que `prisma migrate deploy` sempre aponte para o schema `public`, ignorando o schema customizado na URL. O `prisma db push` respeita o schema da connection string, funcionando corretamente com o test environment.

## transformMode: 'ssr'

O `transformMode: 'ssr'` indica que o codigo sera transformado pelo lado do servidor. Como estamos em ambiente Node.js (nao browser), toda transformacao TypeScript → JavaScript acontece server-side. Isso e obrigatorio para testes backend.