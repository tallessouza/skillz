# Deep Explanation: Teste no Cadastro do Usuário

## Por que separar app do server?

O instrutor enfatiza que a separação entre `app` e `server` é fundamental para testabilidade. O `server.ts` inicia a aplicação definindo o número da porta — isso é comportamento de runtime. O `app.ts` configura rotas e middlewares — isso é a aplicação em si.

Quando o supertest recebe o `app`, ele cria internamente um servidor temporário em uma porta aleatória, faz a requisição, e destrói o servidor. Se você importasse o `server` (que já faz `listen`), teria conflito de portas e o teste falharia.

**Analogia:** O `app` é a receita do bolo. O `server` é o forno ligado. Para testar a receita, você não precisa do forno — o supertest tem seu próprio forno de teste.

## Estratégia de asserções em camadas

O instrutor demonstra três camadas de validação:

1. **Status code (`toBe(201)`)** — Confirma que o endpoint respondeu com o código correto. No `UsersController`, quando o usuário é cadastrado, o status 201 (Created) é retornado explicitamente.

2. **Propriedade estrutural (`toHaveProperty("id")`)** — Confirma que o banco de dados gerou um ID para o recurso. Isso valida que o registro foi realmente persistido, porque o ID só existe após a inserção.

3. **Valor específico (`name).toBe("Test User")`)** — Confirma que os dados enviados foram salvos corretamente e retornados na resposta. Isso pega bugs de mapeamento (ex: campo trocado).

**Por que não basta validar só o status?** Porque um endpoint pode retornar 201 com body vazio ou com dados errados. O status code sozinho é uma validação superficial.

## Verificação no banco de dados

O instrutor mostra como confirmar que o teste realmente persistiu dados usando `npx prisma studio`. Isso é uma verificação manual complementar — em testes automatizados, você pode fazer uma query direta ao banco após a requisição para confirmar a persistência.

A verificação no Prisma Studio mostrou o "Test User" na tabela de usuários, confirmando que o fluxo completo funcionou: requisição HTTP → controller → banco de dados.

## Convenção de nomenclatura de testes

O padrão `it("should create a new user successfully")` segue a convenção BDD (Behavior-Driven Development):
- `it` + `should` + verbo + contexto = especificação legível
- Quando o teste falha, a mensagem descreve exatamente o que deveria ter acontecido
- Facilita a leitura do relatório de testes como documentação

## Dados de teste

O instrutor usa propositalmente nomes genéricos de teste:
- `"Test User"` — claramente fictício
- `"testuser@example.com"` — domínio `example.com` é reservado (RFC 2606), nunca é real
- `"password123"` — senha óbvia de teste

Isso evita confusão com dados reais e torna os testes auto-documentados.