# Code Examples: Parâmetros e Desestruturação

## Exemplo 1: Fluxo completo rota → controller → repositório

### Antes (repasse cego)

```javascript
// route.js
function createUserRoute(body) {
  createUserController(body)
}

// controller.js
function createUserController(data) {
  usersRepository.create(data)
}

// repository.js
const usersRepository = {
  create(data) {
    // cria o usuário com tudo que vier dentro de data
    // campos extras? também vão pro banco
  }
}
```

**Problema:** Em cada arquivo separado, `data` é opaco. Campos extras no body vazam para o banco.

### Depois (desestruturação explícita)

```javascript
// route.js
function createUserRoute(body) {
  const { name, email, password } = body
  createUserController({ name, email, password })
}

// controller.js
function createUserController({ name, email, password }) {
  usersRepository.create({ name, email, password })
}

// repository.js
const usersRepository = {
  create({ name, email, password }) {
    const user = createUserOnDatabase({ name, email, password })
    return { user }
  }
}
```

**Ganho:** Cada arquivo é auto-documentado. Campos extras são filtrados em cada camada.

## Exemplo 2: Parâmetros posicionais vs objeto nomeado

### Antes (posicional)

```javascript
function createUserRoute(body, params) {
  // ...
}

// Chamada com body
createUserRoute({ name: 'John', email: 'john@test.com', password: '123' }, null)

// Chamada só com params — null placeholder obrigatório
createUserRoute(null, { id: 1 })
// O que é null? O que é { id: 1 }? Impossível saber sem ler a definição
```

### Depois (objeto nomeado)

```javascript
function createUserRoute({ body, params }) {
  // ...
}

// Chamada com body
createUserRoute({ body: { name: 'John', email: 'john@test.com', password: '123' } })

// Chamada só com params — sem placeholder
createUserRoute({ params: { id: 1 } })
// Claro: params é { id: 1 }, body foi omitido intencionalmente
```

## Exemplo 3: Retorno como objeto para extensibilidade

### Antes

```javascript
function createUser({ name, email, password }) {
  const user = createUserOnDatabase({ name, email, password })
  return user
}

// Consumidor
const user = createUser({ name: 'John', email: 'john@test.com', password: '123' })
```

### Depois

```javascript
function createUser({ name, email, password }) {
  const user = createUserOnDatabase({ name, email, password })
  return { user }
}

// Consumidor
const { user } = createUser({ name: 'John', email: 'john@test.com', password: '123' })

// Futuro: adicionar token sem quebrar nada
function createUser({ name, email, password }) {
  const user = createUserOnDatabase({ name, email, password })
  const token = generateToken(user)
  return { user, token }
}

// Consumidores antigos continuam funcionando — { user } ainda existe
```

## Exemplo 4: Variação com contexto HTTP real

```javascript
// Padrão Express/Fastify adaptado
function createUserRoute({ body, params, query }) {
  const { name, email, password } = body
  const { organizationId } = params
  const { referralCode } = query

  return createUserController({
    name,
    email,
    password,
    organizationId,
    referralCode,
  })
}
```

Cada fonte de dados (body, params, query) é desestruturada separadamente, e apenas os campos necessários são repassados com nomes explícitos.