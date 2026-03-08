# Deep Explanation: Recuperando o Usuário na Autenticação

## Por que mensagens genéricas?

O instrutor enfatiza um princípio fundamental de segurança: **nunca revelar ao usuário se o erro está no e-mail ou na senha**. A frase exata do instrutor: *"Para não dar na cara que o cara tá errando o e-mail ou a senha. Então a gente não facilita tanto assim também pro usuário."*

Isso previne **ataques de enumeração de usuários** (user enumeration attacks). Se a API retorna "Usuário não encontrado" para um e-mail inexistente e "Senha incorreta" para uma senha errada, um atacante pode:

1. Testar e-mails aleatórios até receber "Senha incorreta" (confirmando que o e-mail existe)
2. Fazer brute-force apenas na senha desse e-mail confirmado

Com a mensagem genérica "E-mail ou senha inválido", o atacante não sabe se precisa tentar outro e-mail ou outra senha.

## Por que status 401 e não 404?

- **404** indica "recurso não encontrado" — semanticamente revela que o usuário não existe
- **401** indica "não autorizado" — genérico, não revela nada sobre a existência do recurso
- Usar 401 para ambos os casos (email inexistente e senha errada) mantém a consistência

## Fluxo completo do controller

O fluxo de autenticação segue uma sequência linear:

1. **Receber credenciais** — email e password do body da requisição
2. **Buscar usuário** — `prisma.user.findFirst({ where: { email } })`
3. **Validar existência** — se null, lançar AppError com 401
4. **Comparar senha** — `compare(password, user.password)` do bcrypt
5. **Validar senha** — se não bate, lançar AppError com 401
6. **Prosseguir** — usuário autenticado, próximo passo seria gerar token

## Por que findFirst e não findUnique?

O `findFirst` é usado porque funciona com qualquer campo, enquanto `findUnique` exige que o campo tenha constraint `@unique` no schema do Prisma. Em muitos projetos, o e-mail pode não ter essa constraint definida inicialmente, então `findFirst` é uma escolha mais segura e flexível.

## bcrypt.compare — como funciona internamente

A função `compare` do bcrypt:
1. Extrai o salt do hash armazenado no banco
2. Aplica o mesmo algoritmo de hash na senha fornecida usando esse salt
3. Compara os dois hashes resultantes
4. Retorna `true` ou `false`

Isso é seguro porque:
- Nunca precisa descriptografar a senha armazenada
- O salt é único por senha, prevenindo ataques com rainbow tables
- A comparação é feita em tempo constante, prevenindo timing attacks

## Importações organizadas

O controller importa de três módulos distintos:
- `@/database/prisma` — instância do Prisma Client (acesso ao banco)
- `bcrypt` — biblioteca de hashing (compare)
- `@/utils/AppError` — classe de erro customizada da aplicação

Essa separação de responsabilidades mantém o controller focado na lógica de negócio.