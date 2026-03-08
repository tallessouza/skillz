# Deep Explanation: Finalizando Retorno do Usuário

## Por que nunca retornar o password

Mesmo que o password esteja hasheado (bcrypt, argon2), retorná-lo na resposta da API:
- Expõe o hash a ataques offline de brute-force
- Viola o princípio de menor privilégio — o front-end não precisa dessa informação
- Pode ser logado em ferramentas de monitoramento, proxies, ou DevTools do navegador

## Destructuring vs Delete vs Undefined

O instrutor usa **destructuring com rest operator**, que é a abordagem correta por três razões:

1. **Imutabilidade** — `delete user.password` muta o objeto original, o que pode causar bugs se o objeto for usado em outro lugar (ex: logging, cache)
2. **Clareza** — `const { password: hashedPassword, ...userWithoutPassword } = user` é declarativo e auto-documentado
3. **Extensibilidade** — se amanhã precisar remover mais campos (ex: `resetToken`, `refreshToken`), basta adicionar ao destructuring

### O rename no destructuring

O instrutor mostra `{ password: hashedPassword, ...userWithoutPassword }` — o rename de `password` para `hashedPassword` é intencional. Ele clarifica que não é a senha em texto plano, mas o hash. Isso evita confusão no código entre o password que o usuário enviou no body e o password armazenado no banco.

## Flat vs Agrupado — Trade-offs

O instrutor demonstra duas formas de retornar os dados:

### Agrupado (recomendado pelo instrutor)
```json
{
  "token": "eyJhbG...",
  "user": {
    "id": "uuid",
    "name": "João",
    "email": "joao@email.com"
  }
}
```

**Vantagens:**
- Separação clara entre autenticação (token) e dados de perfil (user)
- Facilita tipagem no TypeScript: `{ token: string; user: User }`
- Front-end pode salvar `response.data.user` diretamente no estado

### Flat (alternativa mostrada)
```json
{
  "token": "eyJhbG...",
  "id": "uuid",
  "name": "João",
  "email": "joao@email.com"
}
```

**Vantagens:**
- Menos aninhamento
- Acesso direto aos campos

**Desvantagens:**
- Mistura conceitos (auth + perfil no mesmo nível)
- Mais difícil de tipar — tipo específico que combina token com campos de usuário
- Risco de colisão de nomes se token ou outros campos de auth crescerem

### Decisão do instrutor

O instrutor escolhe a versão **agrupada** (`{ token, user }`) justificando que "deixa separado o token e os dados do usuário dentro do próprio usuário." Mas mostra a alternativa flat para que o aluno saiba que existe, e que a escolha depende da expectativa do front-end.

## Integração com Front-end

A estrutura agrupada facilita o consumo no front-end:

```typescript
const { data } = await api.post('/sessions', { email, password })

// Salvar token
localStorage.setItem('token', data.token)

// Salvar dados do usuário no estado
setUser(data.user)
```

Se fosse flat, seria necessário separar manualmente:
```typescript
const { token, ...user } = data
localStorage.setItem('token', token)
setUser(user)
```