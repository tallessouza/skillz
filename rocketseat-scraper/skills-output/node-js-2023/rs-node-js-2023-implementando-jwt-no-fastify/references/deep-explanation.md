# Deep Explanation: Implementando JWT no Fastify

## Por que JWT fica FORA dos use cases?

O instrutor Diego enfatiza um principio arquitetural fundamental: **use cases sao funcionalidades puras, desconectadas do meio externo.**

A analogia e clara: o caso de uso de criacao de uma academia nao se importa se a academia esta sendo criada pelo front-end, pelo app mobile, por uma integracao com o sistema da prefeitura, ou por uma API externa. O use case e a regra de negocio pura.

Se voce colocar geracao de JWT dentro do use case, e amanha esse use case for chamado por uma fila de processamento (que nao usa HTTP), o JWT estara la — inutil, gerando tokens que ninguem vai consumir, ou pior, quebrando o fluxo.

**Regra derivada:** Tudo que for do "meio externo" (restricoes de acesso, autenticacao, formato de resposta) fica nas camadas mais externas — controllers, middlewares, etc.

## JWT nao e seguro para dados sensiveis

O instrutor demonstra no jwt.io que qualquer pessoa pode decodificar o payload de um JWT. O payload e apenas **encoded** (Base64), nao criptografado. A assinatura (signature) garante apenas que o token nao foi adulterado — nao que o conteudo e secreto.

Por isso:
- O `sub` (user.id) e aceitavel — e um UUID sem valor sensivel
- Email, senha, CPF, dados pessoais sao proibidos

## O fluxo completo de autenticacao

1. Usuario faz POST /sessions com email + senha
2. Controller chama o AuthenticateUseCase (que valida credenciais e retorna o `user`)
3. Controller gera o JWT com `reply.jwtSign({}, { sign: { sub: user.id } })`
4. Controller retorna `{ token }` ao front-end
5. Front-end armazena o token e envia em todas as requisicoes seguintes no header `Authorization: Bearer <token>`
6. Rotas protegidas chamam `request.jwtVerify()` que:
   - Busca o token no header Authorization
   - Valida a assinatura com a chave secreta
   - Se invalido/ausente: lanca erro (codigo subsequente nao executa)
   - Se valido: popula `request.user` com os dados do token
7. Controller acessa `request.user.sub` para saber o id do usuario

## Por que `@fastify/jwt` e nao `jsonwebtoken` direto?

O modulo `@fastify/jwt` integra com o ecossistema Fastify:
- Adiciona `reply.jwtSign()` automaticamente
- Adiciona `request.jwtVerify()` automaticamente
- Adiciona `request.user` com tipagem
- Gerencia o secret de forma centralizada no `app.register`

## A chave secreta (secret)

- Deve ser uma string forte e unica por ambiente
- Nunca deve estar no codigo-fonte
- Fica em variavel ambiente (`JWT_SECRET`)
- Para desenvolvimento local, qualquer string serve (ex: `ignite-node-03`)
- Em producao, deve ser gerada aleatoriamente e armazenada em secrets manager

## JWT vs outros metodos de autenticacao

O instrutor menciona que JWT e ideal para comunicacao front-end ↔ back-end (99% dos casos). Para outros cenarios:
- **Integracao com terceiros:** API tokens podem ser mais adequados
- **Auth delegada:** OAuth
- **Sessoes tradicionais:** Cookies com session ID

A escolha depende do contexto — JWT nao e bala de prata.

## TypeScript e FastifyJWT

O modulo `@fastify/jwt` nao sabe quais campos voce colocou no token. Para que `request.user.sub` funcione sem erro de tipagem, voce precisa declarar a interface `FastifyJWT` em um arquivo `.d.ts`. Isso e **declaration merging** do TypeScript — voce esta estendendo a tipagem do modulo.