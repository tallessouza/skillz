# Deep Explanation: Criando Projeto Next.js

## O que e Next.js

Next.js e um framework em cima do React. Frameworks trazem um leque de funcionalidades comuns de maneira **opinada** — com convencoes maiores. O lema do Next e **"Convention Over Configuration"**: muitas regras sobre como estruturar a aplicacao, escrever codigo e escolher bibliotecas.

Isso significa que voce nao pode usar qualquer estrutura de pastas ou extensoes que quiser. Existem nomenclaturas pre-determinadas (como `app/` e `src/`) que nao podem ser renomeadas. Isso e bom na maioria das vezes — reduz decisoes desnecessarias.

## Posicionamento no ecossistema React

Desde 2023, a documentacao oficial do React (react.dev) recomenda usar frameworks para novos projetos. A ordem de recomendacao:

1. **Next.js** — framework hibrido (SSR + SPA + SSG)
2. **Remix** — framework totalmente baseado em servidor (sempre precisa de Node rodando)
3. **Gatsby** — focado em geracao estatica (blogs, sites que nao atualizam muito)
4. **Expo** — para React Native (aplicativos moveis)

### Next.js vs Remix

A grande diferenca: Remix e **totalmente dinamico** — a aplicacao sempre precisa rodar com servidor Node. Next.js e **hibrido**:
- Pode exportar como SPA pura (HTML/CSS/JS, sem Node)
- Pode rodar com servidor para funcionalidades server-side
- Mais flexivel para diferentes cenarios de deploy

### Gatsby

O instrutor questiona por que Gatsby ainda esta na documentacao. Foi muito usado para blogs e paginas estaticas, mas perdeu relevancia.

## App Router vs Pages Router

A partir do Next.js 13, foi introduzido o **App Router** — uma nova estrutura de pastas que trouxe funcionalidades novas. No momento da aula, o App Router estava listado como "Bleeding Edge" na documentacao do React (tecnologias muito recentes/hypadas), mas o instrutor enfatiza: **e o futuro do Next.js**.

O termo "Bleeding Edge" significa tecnologias legais de usar mas que ainda nao sao recomendacoes oficiais fieis. Porem, a expectativa era de que se tornaria recomendacao oficial em poucos meses.

## Por que pnpm

O instrutor usa pnpm por dois motivos principais:
1. **Economia de espaco**: se dois projetos tem a mesma dependencia, pnpm nao instala duas vezes — cria um symbolic link. Importante especialmente para quem usa Mac com pouco armazenamento.
2. **Performance**: ganhos em velocidade de instalacao.

## Import Alias `@/`

O alias `@/` mapeia para a pasta `src/`. Quando voce esta em um arquivo muito profundo na arvore de pastas e precisa importar algo do `src/`, basta usar `@/caminho` em vez de `../../../caminho`. Elimina a navegacao relativa confusa.

## ESLint padrao do Next

O ESLint que vem com o Next e "cru" — poucas convencoes. Por isso a Skillz tem seu proprio pacote (`@skillz/eslint-config`) com regras mais completas. O pacote tem variantes:
- `/next` — para projetos Next.js
- `/react` — para React puro
- `/node` — para projetos Node.js

## Limpeza pos-criacao

O Next gera uma landing page padrao com gradientes e estilos no Tailwind config. Esses arquivos devem ser limpos antes de comecar a desenvolver porque:
- O `globals.css` vem com estilos especificos da landing page
- O `tailwind.config.ts` vem com `theme.extend` contendo gradientes da landing page
- O `page.tsx` vem com JSX complexo da pagina de demonstracao

Manter apenas o essencial evita confusao e deixa o projeto pronto para desenvolvimento.