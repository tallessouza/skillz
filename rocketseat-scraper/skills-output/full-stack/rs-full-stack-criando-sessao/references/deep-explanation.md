# Deep Explanation: Criando Sessão com JWT

## Por que mensagens genéricas de erro?

O instrutor Rodrigo explica que ao retornar erros de login, **nunca se deve indicar especificamente o que está errado** — se é o email/username ou a senha. A mensagem deve ser sempre genérica: "Usuário e/ou senha incorreta".

**Raciocínio de segurança:** Se um atacante tenta fazer login e recebe "Email não encontrado", ele sabe que aquele email não existe no sistema. Se recebe "Senha incorreta", ele confirma que o email existe e pode focar em brute-force da senha. Com mensagem genérica, o atacante não sabe se errou o email, a senha, ou ambos — "isso já complica um pouco ali a vida de quem está tentando usar de forma mal-intencionada".

## Arquitetura da validação

A verificação usa uma condição OR: se o username É DIFERENTE **OU** se o password É DIFERENTE, lança exceção. Isso garante que qualquer uma das credenciais erradas já barra o acesso.

```typescript
if (username !== fakeUser.username || password !== fakeUser.password) {
  throw new AppError("Usuário e/ou senha incorreta", 401)
}
```

## Simulação do banco de dados

Na aula, o instrutor cria um `fakeUser` com ID, username e password hardcoded para simular a busca no banco. Ele deixa claro que isso é temporário — "depois a gente faz conexão com o banco de dados, quando a gente for desenvolver um projeto, conectando tudo, banco de dados, autorização, validação, mas o foco agora é nessa parte do JWT".

O fakeUser fica dentro do método create para manter o escopo contido durante o aprendizado.

## Estrutura do JWT sign

O `sign()` do jsonwebtoken recebe três argumentos:

1. **Payload** — objeto com claims customizados. Na aula, vazio `{}` por enquanto
2. **Secret** — importado do `authConfig.jwt.secret`, nunca hardcoded
3. **Options** — objeto com:
   - `subject`: ID do usuário convertido para string (`String(fakeUser.id)`)
   - `expiresIn`: tempo de expiração, também do authConfig

## Por que subject e não payload?

O `sub` (subject) é um claim registrado no padrão JWT (RFC 7519) que identifica o principal/dono do token. Usar `subject` no options do `sign()` automaticamente popula o claim `sub`. Isso é mais correto do que colocar `{ id: user.id }` no payload, porque:

1. Segue o padrão JWT
2. Bibliotecas de verificação já reconhecem `sub`
3. Separa identidade (sub) de dados adicionais (payload)

## Token único por login

O instrutor demonstra que cada vez que o usuário faz login, um token diferente é gerado. Isso acontece porque o JWT inclui um timestamp (`iat` — issued at) automaticamente, então mesmo com os mesmos dados, cada token é único.

## Configuração externalizada (authConfig)

O secret e expiresIn são importados de um arquivo de configuração separado. Isso permite:
- Rotacionar secrets sem alterar código
- Usar variáveis de ambiente em produção
- Ter configurações diferentes por ambiente (dev/staging/prod)

## Fluxo completo testado no Insomnia

1. POST sem body → "Usuário e/ou senha incorreta" (401)
2. POST com username correto, password errado → mesma mensagem (401)
3. POST com username errado, password correto → mesma mensagem (401)
4. POST com ambos corretos → `{ token: "eyJhbG..." }` (200)