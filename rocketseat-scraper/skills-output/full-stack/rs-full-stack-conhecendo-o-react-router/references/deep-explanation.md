# Deep Explanation: React Router — Navegação em Aplicações React

## Por que React não tem navegação por padrão?

React foi projetado como uma biblioteca de construção de interfaces (UI library), não como um framework completo. A filosofia do React é ser minimalista no core e permitir que o desenvolvedor escolha as ferramentas complementares para cada necessidade.

Navegação é uma dessas necessidades complementares. Diferente de frameworks como Angular (que inclui router nativo) ou Next.js (que tem filesystem-based routing), React delega essa responsabilidade para o ecossistema.

## O papel do React Router

React Router é a solução mais popular e amplamente adotada para navegação em aplicações React. Ele funciona interceptando mudanças de URL no navegador e renderizando os componentes correspondentes, sem causar um reload completo da página (comportamento de SPA — Single Page Application).

### O que o React Router faz:
- Mapeia URLs para componentes React
- Gerencia o histórico de navegação do navegador (back/forward)
- Permite navegação programática (redirecionamentos)
- Suporta rotas dinâmicas com parâmetros
- Oferece nested routes (rotas aninhadas com layouts compartilhados)

### O que o React Router NÃO faz:
- Não substitui o sistema de rotas de um servidor (Express, Fastify)
- Não faz server-side rendering por conta própria (para isso, considere Next.js ou Remix)
- Não gerencia estado da aplicação

## Quando usar React Router vs alternativas

| Cenário | Solução |
|---------|---------|
| SPA com Vite ou CRA | React Router |
| Aplicação com SSR/SSG | Next.js (rotas baseadas em filesystem) |
| Projeto Remix | React Router está integrado ao Remix |
| Micro-frontend | Depende da arquitetura — pode usar React Router por micro-app |

## Documentação oficial

O instrutor recomenda acessar **reactrouter.com** e navegar para a seção **docs** para consultar a documentação completa. A documentação é a fonte primária para aprender sobre todas as funcionalidades disponíveis.

## Contexto no curso

Esta aula é uma introdução conceitual. O instrutor explica o "porquê" do React Router antes de partir para a implementação prática na próxima aula, onde o projeto será criado e o React Router será incluído.