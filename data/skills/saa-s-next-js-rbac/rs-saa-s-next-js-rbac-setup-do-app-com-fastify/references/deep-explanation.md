# Deep Explanation: Setup de API com Fastify

## Por que essa estrutura?

O instrutor Diego escolhe uma estrutura deliberadamente simples: `http/server.ts` para o servidor e `http/routes/` para as rotas. O foco do curso nao e o framework em si, entao a organizacao e minimalista mas funcional.

## Pasta HTTP como namespace

A escolha de criar uma pasta `http/` e intencional — ela isola tudo que e relacionado ao protocolo HTTP (servidor, rotas, middlewares) de outras camadas da aplicacao (banco de dados, servicos, etc). Isso facilita trocar o framework HTTP no futuro se necessario.

## Fastify Type Provider Zod — o que cada peca faz

### ValidatorCompiler
Diz ao Fastify COMO validar os dados de entrada. Sem isso, o schema Zod que voce define na rota nao e executado — ele seria apenas decorativo.

### SerializerCompiler
Diz ao Fastify COMO serializar os dados de saida. Serialização é o processo de transformação dos dados de entrada e saída dos endpoints HTTP.

### ZodTypeProvider (generic)
Conecta o sistema de tipos do TypeScript ao Zod. Quando voce faz `withTypeProvider<ZodTypeProvider>()`, o TypeScript entende que `request.body` tem o tipo inferido do schema Zod que voce definiu.

### jsonSchemaTransform
Mencionado mas nao usado nessa aula — sera usado mais para frente para gerar documentacao automatica da API (provavelmente Swagger/OpenAPI).

## Por que withTypeProvider aparece 2 vezes?

1. No `server.ts`: configura o app globalmente
2. Em cada rota: necessario para que o TypeScript infira os tipos corretamente dentro daquela funcao especifica

Isso e uma limitacao do sistema de tipos do Fastify — o type provider nao propaga automaticamente para plugins registrados.

## CORS — decisao pragmatica

O `fastifyCors` sem configuracao permite acesso de qualquer origem. Para um curso, isso e aceitavel. Em producao, voce configuraria `origin` com os dominios permitidos.

## Sobre arquivos grandes

O instrutor faz um ponto importante: "a gente nao precisa ter esse medo gigantesco de ter arquivos grandes na nossa aplicacao". O `server.ts` vai ter muitos `app.register()`, e isso e OK — desde que seja organizado. Criar um `index.ts` intermediario so para reexportar imports e overengineering desnecessario nesse contexto.

## import type — otimizacao de bundle

O TypeScript com `Prefer type-only auto-import` (configuracao do VS Code) adiciona `type` automaticamente quando detecta que a importacao e apenas uma tipagem. Isso garante que no bundle final esses imports sao completamente removidos, ja que nao trazem funcionalidade JavaScript.

## Validacao automatica

Quando voce define o schema no objeto de configuracao da rota, o Fastify intercepta a request ANTES de chegar no handler. Se os dados nao batem com o schema Zod, o endpoint retorna erro automaticamente — o handler nem executa. As mensagens de erro padrao nao sao as melhores, mas serao melhoradas em aulas futuras.

## Organizacao de rotas por modulo

As rotas sao organizadas espelhando a estrutura do README do projeto (que define os modulos da aplicacao). Exemplo: rotas de autenticacao ficam em `routes/auth/`, rotas de organizacoes em `routes/orgs/`, etc.