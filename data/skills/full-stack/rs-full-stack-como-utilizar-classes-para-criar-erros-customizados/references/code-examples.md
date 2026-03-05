# Code Examples: Erros Customizados com Classes

## Exemplo original da aula

```javascript
class MyCustomError {
  constructor(message) {
    this.message = `Classe de erro customizada: ${message}`
  }
}

try {
  // throw new Error('Erro genérico') // se descomentar, cai no else
  throw new MyCustomError('Erro personalizado lançado')
} catch (error) {
  if (error instanceof MyCustomError) {
    console.log(error.message)
    // Output: "Classe de erro customizada: Erro personalizado lançado"
  } else {
    console.log('Não foi possível executar')
  }
}
```

## Versão com extends Error (produção)

```javascript
class MyCustomError extends Error {
  constructor(message) {
    super(`Classe de erro customizada: ${message}`)
    this.name = 'MyCustomError'
  }
}

try {
  throw new MyCustomError('Erro personalizado lançado')
} catch (error) {
  if (error instanceof MyCustomError) {
    console.log(error.message)
  } else {
    console.log('Não foi possível executar')
  }
}
```

## Hierarquia de erros para uma API

```typescript
class AppError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
  }
}

class NotFoundError extends AppError {
  resource: string
  constructor(resource: string) {
    super(`[NotFoundError]: ${resource} não encontrado`, 404)
    this.name = 'NotFoundError'
    this.resource = resource
  }
}

class ValidationError extends AppError {
  field: string
  constructor(field: string, message: string) {
    super(`[ValidationError]: ${field} — ${message}`, 422)
    this.name = 'ValidationError'
    this.field = field
  }
}

class AuthError extends AppError {
  constructor(message: string = 'Não autorizado') {
    super(`[AuthError]: ${message}`, 401)
    this.name = 'AuthError'
  }
}
```

## Catch com múltiplos tipos (cadeia de instanceof)

```typescript
try {
  await processOrder(orderId)
} catch (error) {
  if (error instanceof ValidationError) {
    return res.status(422).json({ field: error.field, message: error.message })
  }
  if (error instanceof NotFoundError) {
    return res.status(404).json({ resource: error.resource, message: error.message })
  }
  if (error instanceof AuthError) {
    return res.status(401).json({ message: error.message })
  }
  // Fallback para erros inesperados
  console.error('Erro inesperado:', error)
  return res.status(500).json({ message: 'Erro interno do servidor' })
}
```

## Demonstração do throw interrompendo execução (da aula)

```javascript
try {
  throw new Error('Erro genérico')           // executa este
  throw new MyCustomError('Nunca executa')    // unreachable — código "apagado"
} catch (error) {
  if (error instanceof MyCustomError) {
    console.log(error.message)
  } else {
    console.log('Não foi possível executar')  // cai aqui
  }
}
```

## Erro customizado com toJSON (para serialização)

```typescript
class ApiError extends Error {
  code: string
  statusCode: number

  constructor(code: string, message: string, statusCode: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = statusCode
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    }
  }
}
```

## Wrapping de erros de terceiros

```typescript
class DatabaseError extends AppError {
  originalError: Error
  constructor(operation: string, originalError: Error) {
    super(`[DatabaseError]: falha em ${operation}`, 500)
    this.name = 'DatabaseError'
    this.originalError = originalError
  }
}

try {
  await db.query('SELECT * FROM users')
} catch (error) {
  throw new DatabaseError('buscar usuários', error as Error)
}
```