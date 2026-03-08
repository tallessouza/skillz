# Deep Explanation: Padrão Repetível de Testes em Controllers

## Por que testes de controllers são repetíveis

O instrutor destaca que, ao implementar testes para UserController e SessionsController, o padrão é essencialmente o mesmo para qualquer outro controller da API. Isso acontece porque controllers em APIs REST têm uma estrutura previsível:

1. **Recebem um request** (com parâmetros, body, headers)
2. **Delegam para um caso de uso** (service/use case)
3. **Retornam uma response** (status code + body)

Essa estrutura triangular (input → processamento → output) se repete em todo controller, independente do domínio.

## O raciocínio do instrutor

O instrutor optou por não implementar testes em todos os controllers porque "seria bem repetitivo, porque basicamente é a mesma coisa". Isso não é preguiça — é reconhecer que o valor pedagógico de repetir o mesmo padrão 10 vezes é baixo. Porém, em um projeto real, a cobertura completa é necessária.

O desafio proposto (implementar testes nos demais controllers) é justamente para que o aluno internalize o padrão pela repetição prática.

## Como escalar a cobertura

### Nível 1: Factories compartilhadas

Extraia a criação de dados de teste em factories reutilizáveis:

```typescript
// test/factories/make-user.ts
export function makeUser(overrides?: Partial<User>): User {
  return {
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
    ...overrides,
  }
}
```

### Nível 2: Helper de autenticação

Como a maioria dos endpoints requer autenticação, crie um helper:

```typescript
// test/helpers/authenticate.ts
export async function authenticate(app: Express) {
  const user = makeUser()
  await request(app).post('/users').send(user)
  const session = await request(app).post('/sessions').send({
    email: user.email,
    password: user.password,
  })
  return session.body.token
}
```

### Nível 3: Template de teste por operação CRUD

Cada operação CRUD tem um padrão previsível:

- **CREATE**: POST com body válido → 201, POST com body inválido → 400
- **READ**: GET com ID válido → 200, GET com ID inexistente → 404
- **UPDATE**: PUT com dados válidos → 200, PUT sem autenticação → 401
- **DELETE**: DELETE com permissão → 204, DELETE sem permissão → 403

## Projeto como portfólio

O instrutor destaca que essa aplicação de entregas é um bom projeto de portfólio. Uma API com:
- CRUD completo
- Autenticação (sessions)
- Testes automatizados
- Domínio realista (entregas/encomendas)

...demonstra competência prática em desenvolvimento backend. A adição de testes em todos os controllers eleva ainda mais a qualidade do projeto.

## Conexão com outros conceitos

- **DRY nos testes**: Factories e helpers eliminam duplicação sem sacrificar clareza
- **Pirâmide de testes**: Controller tests são testes de integração — acima de unit tests, abaixo de E2E
- **Cobertura pragmática**: Não é necessário 100%, mas controllers são o ponto de entrada da API e merecem cobertura completa