# Deep Explanation: Route Handlers no Next.js

## Por que Next.js tambem e uma aplicacao Node

O instrutor explica que a funcionalidade de renderizacao server-side do Next.js implica que toda aplicacao Next e tambem uma aplicacao Node. Diferente de uma aplicacao React tradicional (que e puramente HTML, CSS e JavaScript executando no navegador), o Next.js tem uma camada de servidor embutida.

Essa camada de servidor e o que permite criar Route Handlers — rotas de API semelhantes ao que se faz com Express, Fastify ou NestJS, mas dentro do proprio projeto Next.

## A filosofia BFF (Backend for Frontend)

O instrutor enfatiza fortemente que Route Handlers **nao sao recomendados para criar APIs completas**. O raciocinio:

> "A gente ja avancou 20 anos na industria do desenvolvimento web, para aprender que geralmente o backend separado do frontend funciona melhor."

O conceito central e **BFF — Backend for Frontend**: funcionalidades backend que existem especificamente para servir um frontend particular, nao para ser uma API de proposito geral.

### Exemplo concreto: Login Social

O instrutor usa login com Google como exemplo perfeito de BFF:

1. O processo de login social exige **troca de tokens** (token exchange)
2. Esse processo usa **credenciais sensiveis** do Google que nao podem ficar expostas no lado do cliente
3. O fluxo de login e **diferente entre plataformas** (web vs mobile)
4. Portanto, nao faz sentido colocar isso na API global que serve todos os clientes

Esse tipo de funcionalidade pertence ao Route Handler do Next.js porque:
- E especifica deste frontend
- Precisa executar no servidor (credenciais sensiveis)
- Nao e compartilhada com outros clientes

## Response como variavel global

O instrutor demonstra que tentar retornar um valor diretamente de um Route Handler causa erro. A forma correta e usar `Response.json()`, que e uma variavel global disponivel no ambiente do Route Handler (Web API padrao).

## Organizacao de arquivos e roteamento

O filesystem define o roteamento:
- `app/api/products/route.ts` → `/api/products`
- `app/api/products/featured/route.ts` → `/api/products/featured`

Cada arquivo `route.ts` automaticamente se torna um Route Handler. O nome da funcao exportada determina qual metodo HTTP e atendido (`GET`, `POST`, etc.).

## Uso de JSON como mock de banco de dados

No contexto da aula (projeto de e-commerce para testes), o instrutor usa um arquivo `data.json` como fonte de dados. Ele reconhece que isso e valido para:
- Cenarios de teste
- Prototipos
- Situacoes onde so ha leitura de dados

O campo `featured` nos produtos permite filtrar produtos em destaque, que sao os exibidos na home da aplicacao.

## Ferramentas que expandem Route Handlers

O instrutor menciona o **tRPC** como exemplo de ferramenta que usa a camada de API do Next.js como backend completo, indicando que embora nao seja a recomendacao padrao, existem ecossistemas construidos em torno dessa abordagem.