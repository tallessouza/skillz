# Deep Explanation: Variáveis Ambiente em Next.js Monorepo

## Por que o Next.js não lê o .env do monorepo?

O Next.js procura arquivos `.env` na raiz do **próprio projeto** (onde está o `package.json` do app). Em um monorepo com Turborepo, a estrutura típica é:

```
root/
├── .env              ← Arquivo único de env
├── apps/
│   ├── web/          ← Next.js procura .env AQUI, não na raiz
│   └── api/
└── packages/
```

O Next.js nunca vai subir diretórios para encontrar o `.env`. A solução é usar `dotenv-cli` para carregar explicitamente o arquivo antes de iniciar o Next.

## Por que não usar dotenv-cli no build/start?

O instrutor explica claramente: comandos `build` e `start` são para produção. Em produção, variáveis de ambiente são configuradas de outra forma — via painel do Vercel, variáveis do Docker, secrets do Kubernetes, etc. O `.env` é uma conveniência exclusiva de desenvolvimento local.

Se você adicionar `env:load` no build e estiver fazendo deploy no Vercel, o Vercel já injeta as variáveis — o dotenv-cli tentaria ler um `.env` que não existe e falharia.

## A separação server/client/shared

O `@t3-oss/env-nextjs` implementa um padrão de segurança:

- **server**: Variáveis que NUNCA devem chegar ao browser (DATABASE_URL, JWT_SECRET). Se você tentar acessar no client, recebe erro.
- **client**: Variáveis expostas ao browser via NEXT_PUBLIC_ prefix.
- **shared**: Variáveis que precisam estar disponíveis em ambos os contextos. É o caso de `NEXT_PUBLIC_API_URL` — usada em Server Components (SSR) e em Client Components (browser).

O erro que o instrutor encontrou foi colocar `NEXT_PUBLIC_API_URL` em `server` quando precisava estar em `shared`. O TypeScript reclamou porque a variável era acessada em contexto client-side.

## O problema de hydration com ícones de tema

O instrutor encontrou um erro clássico de hydration mismatch: o componente de theme switcher usa um hook client-side para determinar o tema ativo. No servidor, o tema é desconhecido, então o ícone renderizado difere do client.

A solução foi renderizar AMBOS os ícones (Sun e Moon) sempre, usando classes CSS para mostrar/esconder:

```tsx
<Sun className="size-4 dark:size-0" />
<Moon className="size-0 dark:size-4" />
```

Em modo light: Sun visível (size-4), Moon invisível (size-0).
Em modo dark: Sun invisível (dark:size-0), Moon visível (dark:size-4).

Isso evita o hydration mismatch porque o HTML é idêntico no servidor e no cliente — apenas CSS muda a visibilidade.

## runtimeEnv — por que repetir?

O campo `runtimeEnv` no `createEnv` parece redundante, mas existe porque:
1. O schema (server/client/shared) define a VALIDAÇÃO
2. O `runtimeEnv` define o MAPEAMENTO real para `process.env`
3. Em alguns frameworks, variáveis podem vir de fontes diferentes (não apenas process.env)