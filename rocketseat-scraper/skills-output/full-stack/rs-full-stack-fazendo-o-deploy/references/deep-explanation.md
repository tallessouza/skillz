# Deep Explanation: Deploy Frontend na Vercel via GitHub

## Por que Vercel + GitHub?

A integração Vercel + GitHub é o caminho mais direto para deploy de aplicações frontend. A Vercel foi construída pelos criadores do Next.js, mas suporta qualquer framework frontend moderno. A integração com GitHub significa que cada push no repositório pode disparar um novo deploy automaticamente.

## Fluxo mental do deploy

O processo é intencionalmente simples:

1. **Conexão GitHub ↔ Vercel**: Feita uma vez. A Vercel pede autorização OAuth para acessar seus repositórios. Isso permite que ela leia o código e configure webhooks para deploys automáticos.

2. **Auto-detecção de framework**: A Vercel analisa o `package.json`, arquivos de configuração (como `vite.config.ts`, `next.config.js`), e a estrutura do projeto para determinar automaticamente qual framework está sendo usado. Isso define os comandos de build e output directory corretos.

3. **Build na nuvem**: A Vercel executa `npm install` (ou equivalente) seguido do build command na sua infraestrutura. O resultado é um bundle estático que é distribuído pela CDN global da Vercel.

4. **Environment Variables**: São injetadas em tempo de build. Para Vite, variáveis prefixadas com `VITE_` ficam disponíveis no código client-side via `import.meta.env.VITE_*`. Variáveis sem prefixo ficam disponíveis apenas no server-side (se aplicável).

## Autorização do GitHub

O instrutor destaca que se os repositórios não aparecem na lista, é porque a autorização ainda não foi concedida. O processo é:

1. Na tela de importação, a Vercel mostra um botão para conceder acesso
2. Isso redireciona para o GitHub OAuth
3. Você escolhe quais repositórios a Vercel pode acessar (todos ou específicos)
4. Retornando à Vercel, os repositórios aparecem na lista

Para repositórios de organizações, o admin da organização pode precisar aprovar o acesso.

## Repositórios privados

O instrutor mostra que repositórios privados aparecem com um ícone de cadeado na lista. Isso funciona normalmente — a Vercel usa tokens OAuth para acessar o código durante o build, sem expor nada publicamente.

## Root Directory e monorepos

O Root Directory padrão é `/` (raiz do repositório). Em monorepos onde o frontend está em uma subpasta (como `apps/web` ou `packages/frontend`), é necessário alterar esse campo. A Vercel executará os comandos de build a partir desse diretório.

## Variáveis de ambiente vs .env

O instrutor explica que ao invés de criar um arquivo `.env` dentro do projeto (que seria commitado no repositório), a Vercel oferece uma interface para definir variáveis de ambiente. Vantagens:

- **Segurança**: Secrets não ficam no código-fonte
- **Flexibilidade**: Diferentes valores para Preview, Production e Development
- **Gestão centralizada**: Todas as variáveis visíveis no dashboard

## Velocidade do deploy

O instrutor nota que o deploy é "bem rápido". Para projetos Vite/React típicos, o deploy leva entre 30 segundos e 2 minutos. Projetos maiores ou com mais dependências podem levar mais. A Vercel cacheia `node_modules` entre deploys, acelerando builds subsequentes.

## Página de Congratulations

Após o primeiro deploy bem-sucedido, a Vercel exibe uma página comemorativa com:
- Preview da aplicação funcionando
- Link para o dashboard do projeto
- URL de produção gerada automaticamente

## O que acontece nos bastidores

1. Vercel clona o repositório via GitHub token
2. Detecta o framework e define build settings
3. Executa `npm install` (com cache de dependências)
4. Executa o build command (`npm run build` / `vite build`)
5. Distribui o output para a CDN global (edge network)
6. Configura SSL automático para o domínio `.vercel.app`
7. Configura webhook no GitHub para deploys automáticos em futuros pushes