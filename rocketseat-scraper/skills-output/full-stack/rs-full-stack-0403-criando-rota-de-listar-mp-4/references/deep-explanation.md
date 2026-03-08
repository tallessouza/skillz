# Deep Explanation: Criando Rota de Listar com Autorização

## Por que o método se chama `index`?

Na convenção RESTful, os métodos do controller seguem um padrão:
- `index` — listar todos os recursos (GET /)
- `create` — criar um recurso (POST /)
- `show` — exibir um recurso específico (GET /:id)
- `update` — atualizar (PUT/PATCH /:id)
- `delete` — remover (DELETE /:id)

O instrutor segue essa convenção ao criar o método `index` como assíncrono no controller de refunds.

## Middleware por rota vs por grupo — A distinção fundamental

O instrutor destaca duas formas de aplicar middleware, e a escolha entre elas é uma decisão arquitetural importante:

### Por grupo (router.use)

Quando você faz `router.use(middleware)`, todas as rotas registradas **depois** desse ponto passam pelo middleware. O instrutor mostra isso no contexto de autenticação — `ensureAuthenticated` é aplicado uma vez e vale para todo o grupo de rotas abaixo.

Vantagem: DRY, não precisa repetir em cada rota.
Risco: Se você adicionar uma rota que não precisa desse middleware, ela será afetada mesmo assim.

### Por rota (argumento intermediário)

Quando você passa o middleware como segundo argumento do `.get()` (ou `.post()`, etc.), ele se aplica **apenas àquela rota**. O instrutor usa essa abordagem para `verifyUserAuthorization("manager")` na rota de listagem.

A razão é clara: nem todas as rotas de refund precisam de restrição por role. A criação de refund pode ser feita por qualquer usuário autenticado, mas a listagem geral só pode ser feita por gerentes.

### Analogia do instrutor

O instrutor compara os dois cenários diretamente:
- "Aqui é quando a gente quer aplicar para várias rotas de uma vez" (grupo)
- "Aqui é quando a gente está aplicando especificamente o middleware na rota" (por rota)

## Fluxo de teste de autorização

O instrutor demonstra um fluxo completo de teste manual no Insomnia:

1. **Configurar token dinâmico** — No Insomnia, configura o header de autenticação para pegar automaticamente o token da resposta de login (response body → `$.token`, trigger: always)
2. **Testar com Employee** — Envia request, recebe "não autorizado" (perfil não tem permissão)
3. **Alterar role no banco** — Muda o campo `role` para "manager" diretamente no banco
4. **Criar nova sessão** — Importante: precisa fazer novo login para que o token JWT contenha a nova role
5. **Testar com Manager** — Agora recebe 200 OK

### Insight crucial: Token precisa ser regenerado

O instrutor comete um erro proposital que revela um conceito importante: ao mudar a role no banco, o token antigo ainda contém a role anterior. É necessário fazer novo login para gerar um token com as informações atualizadas. Isso acontece porque o JWT é um snapshot dos dados no momento da geração.

## Criando usuários de teste com roles diferentes

Para testes mais práticos, o instrutor cria dois usuários:
- Um com role "employee" (perfil padrão)
- Um com role "manager" (criado explicitamente com `role: "manager"`)

Isso permite alternar entre perfis apenas trocando as credenciais de login, sem precisar modificar o banco manualmente.

## Padrão de autorização: Manager vs Employee

O padrão estabelecido na aplicação:
- **Manager**: pode listar TODAS as solicitações de refund (visão gerencial)
- **Employee**: pode apenas criar solicitações (visão individual)

Isso segue o princípio de menor privilégio — cada perfil acessa apenas o que precisa para sua função.