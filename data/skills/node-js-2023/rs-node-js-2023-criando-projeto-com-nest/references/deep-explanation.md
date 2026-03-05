# Deep Explanation: Criando Projeto com NestJS

## NestJS como framework opinado

O Diego explica que NestJS e fundamentalmente diferente de Express, Fastify ou Koa. Esses sao "micro frameworks" — dao liberdade total mas nenhuma direcao. NestJS e "opinado": traz receitas prontas para GraphQL, mensageria assincrona, WebSockets, validacao, ORM, etc.

A analogia com outros ecossistemas e precisa:
- **PHP** → Laravel
- **Ruby** → Rails
- **Python** → Django
- **Java** → Spring Boot

Todos sao frameworks opinados que trazem convencoes fortes.

## Quando usar NestJS vs micro frameworks

A decisao chave segundo o Diego: **voce tem alguem no time que vai guiar as escolhas tecnicas?**

- **Sim** → micro framework (Express/Fastify) pode funcionar, porque essa pessoa define as convencoes
- **Nao** → NestJS e ideal, porque ele proprio assume o papel de "guia tecnico"

O NestJS reduz tempo gasto em decisoes tecnicas ("qual lib de validacao?", "qual ORM?") e direciona direto para o codigo.

## Liberdade arquitetural dentro da opiniao

Ponto importante: NestJS e opinado nas **ferramentas** (qual lib usar), mas livre na **arquitetura** (como organizar pastas). Diferente de Laravel, onde controllers devem ficar em pasta especifica, NestJS permite estruturar pastas como quiser.

Isso permite, por exemplo, seguir Clean Architecture dentro do NestJS — exatamente o que o curso propoe (nome do projeto: `05-nest-clean`).

## NestJS sobre Express (ou Fastify)

O NestJS e construido **em cima** do Express por padrao, mas pode ser adaptado para usar Fastify por baixo dos panos na camada HTTP. Isso significa que NestJS nao substitui Express — ele o envolve com uma camada de convencoes e estrutura.

## Por que pnpm

Diego menciona especificamente que pnpm lida melhor com cache:
- npm/yarn duplicam pacotes em cada projeto
- pnpm mantem pasta global e so instala no projeto o que ainda nao existe globalmente
- Resultado: instalacao mais rapida, menos espaco em disco

## Por que remover Jest

O Jest sera substituido por Vitest no curso, por questoes de performance. Por isso todo o scaffolding relacionado a Jest (configs, dependencias, scripts) e removido antes de comecar qualquer desenvolvimento.

## A porta 3000

Diego destaca que 3000 e a porta padrao nao so do NestJS mas tambem de React, Next.js e outros projetos frontend. Em desenvolvimento fullstack, manter 3000 no backend causa conflito. A convencao dele: **3353 para projetos backend**.

## Nest CLI e scaffolding

A CLI do Nest (`nest -h`) oferece varios comandos de scaffolding — gerar controllers, services, modules, etc. O Diego menciona que vai fazer na mao no curso, mas reconhece que os scaffolders sao uteis para produtividade.