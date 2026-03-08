# Deep Explanation: Recuperando o Usuário na Autenticação

## Por que nunca revelar qual campo falhou

O instrutor enfatiza um princípio fundamental de segurança: quando alguém tenta fazer login e falha, a API deve retornar **exatamente a mesma mensagem** independentemente de ser o e-mail ou a senha que está errado.

A frase usada é: **"E-mail ou senha inválidos"**.

### Raciocínio do instrutor

> "Geralmente a gente não vai dizer se é o e-mail ou a senha que tá errado. A gente diz assim: 'olha, e-mail ou senha inválido', para dificultar um pouco aí para quem tá às vezes tentando ficar adivinhando senha ali do usuário."

Se a API retornasse "Usuário não encontrado" para e-mail errado e "Senha incorreta" para senha errada, um atacante poderia:
1. Testar e-mails até receber "Senha incorreta" — confirmando que aquele e-mail existe no sistema
2. Então focar em adivinhar a senha daquele e-mail confirmado

Com a mensagem genérica, o atacante nunca sabe se errou o e-mail, a senha, ou ambos.

## Validação separada no código, mensagem única para o usuário

O instrutor faz uma distinção importante: **internamente** no código, as validações são separadas (primeiro verifica se o usuário existe, depois compara a senha). Mas **externamente** (na mensagem de erro), é sempre a mesma string.

> "Embora aqui dentro do código eu estou fazendo a validação separado, primeiro eu verifico se o usuário de fato foi encontrado com esse e-mail e também verifico se a senha bate, mas eu mando aqui a mesma mensagem para dificultar um pouco, digamos assim."

Isso é intencional — o código precisa saber a razão exata da falha para o fluxo correto, mas o cliente não precisa dessa informação.

## Por que `findFirst` em vez de `findUnique`

O instrutor inicialmente considera `findUnique`, mas muda para `findFirst`. O `findFirst` é mais flexível porque:
- Não exige que o campo tenha a constraint `@unique` no schema Prisma
- Permite filtros compostos mais facilmente
- Retorna `null` quando não encontra (mesmo comportamento do `findUnique`)

## Fluxo completo da autenticação

O instrutor constrói o fluxo passo a passo:

1. **Importações** — Prisma (database), Zod (validação), bcrypt (compare), AppError (erros)
2. **Validação de input** — Schema Zod com email + password min 6
3. **Busca do usuário** — `prisma.user.findFirst({ where: { email } })`
4. **Verificação de existência** — Se null, AppError 401
5. **Comparação de senha** — `bcrypt.compare(password, user.password)`
6. **Verificação de match** — Se false, AppError 401 (mesma mensagem)

## O `async` no controller

O instrutor nota que é preciso adicionar `async` antes do método `create` porque:
- `prisma.user.findFirst` retorna uma Promise (precisa de `await`)
- `bcrypt.compare` também retorna uma Promise (precisa de `await`)

Sem `async`, os `await` dentro do método causariam erro de sintaxe.

## Testando no Insomnia

O instrutor demonstra o fluxo de testes:

1. **Sem body** → Zod rejeita (precisa de email e password)
2. **E-mail inválido (sem @)** → Zod rejeita ("e-mail inválido")
3. **E-mail válido mas inexistente + senha < 6 chars** → Zod rejeita pela senha
4. **E-mail inexistente + senha válida** → "E-mail ou senha inválidos" (401)
5. **E-mail correto + senha errada** → "E-mail ou senha inválidos" (401)
6. **E-mail correto + senha correta** → Autenticação passa

O ponto é que nos casos 4 e 5, a mensagem é **idêntica** — impossível distinguir externamente.

## Status code 401

O instrutor usa 401 (Unauthorized) para credenciais inválidas. Este é o código correto porque:
- 400 (Bad Request) é para input malformado — já coberto pelo Zod
- 401 (Unauthorized) é para credenciais inválidas — é o caso aqui
- 403 (Forbidden) é para quando o usuário está autenticado mas sem permissão
- 404 (Not Found) revelaria que o recurso não existe — quebraria a segurança