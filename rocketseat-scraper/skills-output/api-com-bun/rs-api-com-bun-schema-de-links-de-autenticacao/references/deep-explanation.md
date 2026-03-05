# Deep Explanation: Schema de Links de Autenticação (Magic Link)

## Por que Passwordless?

O instrutor explica que "passwordless" vem do inglês "password-less" — literalmente "sem senha". A motivação principal é dupla:

1. **Segurança para o desenvolvedor:** Não precisar armazenar credenciais sensíveis como senhas no banco de dados. Isso reduz drasticamente o risco em caso de vazamento de dados.
2. **Conveniência para o usuário:** O usuário não precisa criar mais uma senha para mais um serviço.

## Tipos de Autenticação Passwordless

O instrutor menciona que não existe uma única forma:

- **OTP (One Time Password):** Usuário recebe código via SMS ou e-mail, digita o código. Também é passwordless.
- **Magic Link:** Usuário recebe link no e-mail, clica e já está autenticado. É a estratégia escolhida na aula.
- **Login Social (OAuth):** Google, GitHub, Twitter, Meta. Resolve problema parecido mas exige integração com providers externos.

A escolha pelo Magic Link é explícita: **é muito mais simples de implementar** e não depende de integração com providers terceiros.

## O Fluxo Completo do Magic Link

1. Usuário insere o e-mail
2. Backend verifica se o usuário existe na base de dados
3. Backend cria um **código único de acesso** (NÃO é o JWT ainda)
4. Esse código é **salvo no banco de dados** — diferente do JWT que é stateless
5. Backend envia e-mail com link contendo esse código
6. Usuário clica no link
7. Backend valida o código, gera o JWT, redireciona ao frontend

### Por que salvar o código no banco?

O instrutor faz uma distinção importante: o JWT é stateless (não é salvo em nenhum banco). Mas o magic link token **precisa** ser persistido. A razão:

> "Para eu garantir que algo que o usuário vai fazer no futuro, que é clicar num link para se autenticar — para eu garantir que isso foi gerado pela minha aplicação, eu preciso ter armazenado isso na minha aplicação de alguma forma."

Ou seja, o token no banco serve como **prova de origem** — garante que o link clicado foi realmente gerado pelo backend.

## Design do Schema

### Campos escolhidos e justificativas:

- **`id`**: CUID2, mesmo padrão das outras tabelas do projeto
- **`code`**: O código único que vai no link. Precisa ser aleatório e único. Pode ser CUID2, UUID, ou qualquer gerador com boa entropia.
- **`userId`**: Foreign key para `users.id`. Todo link pertence a exatamente um usuário. Não pode ser nulo.
- **`createdAt`**: Timestamp de criação. O instrutor menciona explicitamente: "caso a gente queira fazer validação no futuro, por exemplo, aquele link só é válido por uma semana". Salvar a data de criação permite implementar expiração sem alterar o schema.

## Estrutura de Rotas

O instrutor define duas rotas, não uma:

1. **Rota de Login** (`POST /auth/login`): Recebe e-mail, busca user, cria o authLink no banco, envia o e-mail com o link
2. **Rota de Callback** (`GET /auth/callback`): Acessada quando o usuário clica no link. Valida o token, cria o JWT, redireciona para o frontend

Essa separação é fundamental porque são dois momentos distintos no fluxo e têm responsabilidades diferentes.

## Workflow de Migration

Após criar o schema:
1. `docker compose up -d` — sobe o banco PostgreSQL
2. `bun generate` — gera a migration a partir do schema Drizzle
3. `bun migrate` — executa a migration no banco

A migration gerada automaticamente cria a tabela `auth_links` com a constraint de foreign key para `users`.