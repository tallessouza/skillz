# Deep Explanation: Testes E2E de Usuarios no NestJS

## Por que `createTestingModule` em vez de subir o servidor?

O instrutor explica que a alternativa seria usar `pnpm run start:dev`, que subiria na porta 3333. Isso seria "muito ruim para rodar testes em paralelo, varios testes ao mesmo tempo". O `createTestingModule` sobe a aplicacao de forma **programatica** — ela funciona sem precisar de uma porta HTTP real, permitindo que o supertest faca requisicoes diretamente ao HTTP server interno.

## O padrao de acesso a servicos internos

O instrutor faz um paralelo direto com o `main.ts`:

> "Lembra la no main como que a gente tinha feito, usando o `get`? Exatamente, praticamente da mesma forma."

No `main.ts`, usamos `app.get(PrismaService)`. Nos testes, usamos `moduleRef.get(PrismaService)`. A diferenca e que no teste usamos o `moduleRef` (resultado do `compile()`) em vez do `app`.

Isso e importante porque reutiliza a mesma instancia do Prisma que a aplicacao usa, em vez de criar uma conexao separada.

## Por que validar no banco alem do status code?

O instrutor destaca:

> "Como e um test end-to-end, eu posso querer garantir que esse usuario realmente foi salvo no banco de dados."

Status 201 significa que o controller respondeu corretamente, mas nao garante que a logica de persistencia funcionou. A consulta ao banco e a segunda camada de validacao.

## Banco de dados isolado

> "Como a gente criou um ambiente isolado de banco de dados para os testes, eu posso rodar esse teste quantas vezes eu quiser, mesmo com o email igual ao anterior, porque ele vai estar rodando sempre no banco de dados zerado."

Isso se refere a configuracao feita em aulas anteriores com variavel de ambiente separada para testes, onde o banco e limpo antes de cada suite.

## Preparacao de dados para autenticacao

Para testar login, o instrutor cria o usuario **diretamente no banco** via Prisma, em vez de chamar a rota de criacao primeiro. Duas razoes:

1. O teste fica independente — nao depende da rota de criacao funcionar
2. A senha precisa ser hasheada com bcryptjs antes de salvar, porque a rota de login compara o hash

## Nomenclatura tecnica vs semantica

O instrutor escolhe deliberadamente nao usar `it('should create account')`:

> "Como e um teste de rota, eu nao vou usar o `it` aqui, porque eu nao vou deixar ele muito semantico. Aqui eu vou escrever algo mais tecnico mesmo."

Isso diferencia testes E2E (tecnico, por rota) de testes unitarios (semantico, por comportamento).

## Pacotes necessarios

- `supertest` — para fazer requisicoes HTTP no teste
- `@types/supertest` — porque supertest nao e feito em TypeScript, os types sao separados