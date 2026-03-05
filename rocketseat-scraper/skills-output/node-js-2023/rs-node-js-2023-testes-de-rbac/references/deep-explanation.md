# Deep Explanation: Testes de RBAC

## Por que os testes quebram apos implementar RBAC

Quando voce adiciona verificacao de role (ex: `verifyUserRole('ADMIN')`) nas rotas da aplicacao, todos os testes end-to-end que dependem dessas rotas comecam a falhar com erro **401 Unauthorized**. Isso acontece porque o helper original de criacao de usuario usava a rota `POST /users`, que cria usuarios com a role padrao `MEMBER`.

O instrutor destaca que ao rodar os testes e2e, "deu bastante erros, mais erros do que eu esperava" — porque o impacto cascateia: testes que criam academias (que exigem admin) falham, e testes que dependem dessas academias existirem tambem falham.

## A decisao de usar Prisma direto vs rota da API

O instrutor faz uma escolha arquitetural importante: em vez de criar uma rota especial para testes ou modificar a rota de registro, ele opta por **inserir o usuario diretamente no banco via Prisma**. Isso porque:

1. A rota de registro nao deve aceitar role como parametro (seria uma vulnerabilidade de seguranca)
2. Em testes e2e, voce tem acesso direto ao banco — usar isso e legitimo
3. Permite controlar exatamente o estado do banco sem depender de outras rotas

## O parametro `isAdmin` com default false

A escolha de usar `isAdmin = false` como parametro booleano em vez de `role: string` e intencional:

- **Simplicidade**: a maioria dos testes precisa de usuario comum, entao o default false evita alterar testes existentes
- **Legibilidade**: `createAndAuthenticateUser(app, true)` e claro no contexto
- **Backward compatibility**: testes que ja existiam continuam funcionando sem mudanca

## O hash do bcrypt no helper

O instrutor usa `await hash('123456', 6)` porque ao criar o usuario diretamente no banco, voce precisa fornecer o password_hash ja processado. Quando usava a rota da API, o hash era feito automaticamente pelo use case. Agora, contornando a API, o helper assume essa responsabilidade.

Os 6 rounds sao os mesmos usados na aplicacao — manter consistencia aqui e importante para que a autenticacao funcione.

## Quais testes precisam de admin

O instrutor identifica especificamente:
- **validate check-in** — apenas admin pode validar check-ins
- **create gym** — apenas admin pode criar academias
- **nearby gyms** — nao exige admin diretamente, mas o teste cria academias como pre-condicao (via rota que exige admin)
- **search gyms** — mesma situacao: precisa criar academias antes

A observacao sobre nearby/search e importante: o teste em si nao testa uma rota admin, mas depende de dados criados por uma rota admin. Duas alternativas existem:
1. Criar academias diretamente via Prisma (bypass total)
2. Fazer o usuario do teste ser admin para poder criar as academias

O instrutor escolhe a opcao 2, mantendo o teste mais proximo do fluxo real.

## Impacto no design de testes

Este padrao revela um principio importante: **testes e2e devem refletir a realidade da aplicacao**. Quando a aplicacao muda (adiciona RBAC), os testes devem mudar para refletir isso. Nao e um bug nos testes — e os testes cumprindo seu papel de detectar mudancas de comportamento.