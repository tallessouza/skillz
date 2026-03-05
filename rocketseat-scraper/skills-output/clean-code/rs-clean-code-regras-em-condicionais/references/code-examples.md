# Code Examples: Regras em Condicionais

## 1. Negacoes — O problema

### Codigo original do instrutor (com negacao)

```typescript
const isUserOlderThan18Years = true

// Negacao simples — ainda legivel
if (!isUserOlderThan18Years) {
  // ...
}

// Negacao composta — ruim de ler
if (!isUserOlderThan18Years && !userLivesInBrazil) {
  // O cerebro precisa: entender cada variavel, negar cada uma, combinar
}
```

### Refatoracao do instrutor (sem negacao)

```typescript
const isUserYoungerThan18Years = true
const userLivesOutsideBrazil = true

// Leitura natural: "se o usuario e menor de 18 E mora fora do Brasil"
if (isUserYoungerThan18Years && userLivesOutsideBrazil) {
  // logica
}
```

### Variacoes praticas

```typescript
// RUIM: negacao com operador OR
if (!isAuthenticated || !hasPermission) {
  throw new UnauthorizedError()
}

// BOM: variaveis auxiliares afirmativas
const isUnauthenticated = !isAuthenticated
const lacksPermission = !hasPermission

if (isUnauthenticated || lacksPermission) {
  throw new UnauthorizedError()
}

// ALTERNATIVA: early return separado
if (!isAuthenticated) {
  throw new UnauthorizedError('Not authenticated')
}

if (!hasPermission) {
  throw new UnauthorizedError('No permission')
}
```

## 2. Early return vs else

### Codigo do instrutor (com else)

```typescript
function isUserOlderThan18(user) {
  if (!user) {
    return new Error('User not provided')
  } else {
    return user.age >= 18
  }
}
```

### Refatoracao do instrutor (com early return)

```typescript
function isUserOlderThan18(user) {
  if (!user) {
    return new Error('User not provided')
  }

  return user.age >= 18
}
```

### Quando usar else (caso do instrutor)

```typescript
// Funcao complexa onde early returns ficam escondidos
function processPayment(order, user, paymentMethod) {
  if (order.isPaid) {
    // 20 linhas de logica de reembolso
    // early return escondido aqui dentro
    // dificil de ver
    return refundResult
  } else {
    // Fica claro que isso SO acontece se o pedido NAO estiver pago
    // 30 linhas de logica de pagamento
    return paymentResult
  }
}
```

### Variacao: multiplos early returns

```typescript
// BOM: guard clauses no topo, fluxo principal no final
function createAccount(data: CreateAccountInput) {
  if (!data.email) {
    return { error: 'Email required' }
  }

  if (!data.password || data.password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  if (await emailExists(data.email)) {
    return { error: 'Email already in use' }
  }

  // Fluxo principal — sem indentacao extra
  const user = await db.users.create(data)
  await sendWelcomeEmail(user.email)

  return { user }
}
```

## 3. Condicionais aninhadas

### O que o instrutor mostrou como pessimo

```typescript
// Ternario aninhado — NUNCA faca isso
const result = user.age >= 18
  ? user.age === 18
    ? 'just18'
    : 'adult'
  : 'minor'
```

### If aninhado — tambem ruim

```typescript
if (user.age > 18) {
  if (user.country === 'BR') {
    if (user.hasDocument) {
      // 3 niveis de indentacao = 8 caminhos possiveis
    }
  }
}
```

### Refatoracao: combinar + early return

```typescript
// Opcao 1: combinar condicoes
if (user.age > 18 && user.country === 'BR' && user.hasDocument) {
  // logica
}

// Opcao 2: early return sequencial
if (user.age <= 18) {
  return 'underage'
}

if (user.country !== 'BR') {
  return 'international'
}

if (!user.hasDocument) {
  return 'missing document'
}

// Fluxo principal — todas as condicoes ja validadas
processUser(user)
```

## 4. Exemplo completo: aplicando as 3 regras juntas

### Antes (todas as violacoes)

```typescript
function handleRegistration(user: User | null) {
  if (user) {
    if (!user.isBlocked) {
      if (user.age >= 18) {
        if (!user.emailVerified) {
          sendVerificationEmail(user.email)
          return { status: 'verification_sent' }
        } else {
          return { status: 'registered', user }
        }
      } else {
        return { status: 'underage' }
      }
    } else {
      return { status: 'blocked' }
    }
  } else {
    return { status: 'error', message: 'No user' }
  }
}
```

### Depois (3 regras aplicadas)

```typescript
function handleRegistration(user: User | null) {
  if (!user) {
    return { status: 'error', message: 'No user' }
  }

  if (user.isBlocked) {
    return { status: 'blocked' }
  }

  if (user.isYoungerThan18) {
    return { status: 'underage' }
  }

  if (user.emailNotVerified) {
    sendVerificationEmail(user.email)
    return { status: 'verification_sent' }
  }

  return { status: 'registered', user }
}
```

**O que mudou:**
- Negacoes removidas: `!user.isBlocked` → `user.isBlocked` (invertendo a logica)
- Variavel afirmativa: `!user.emailVerified` → `user.emailNotVerified`
- Early returns em cascata: cada guard clause no topo
- Zero aninhamento: todos os ifs no mesmo nivel
- Fluxo principal no final: o "caminho feliz" e a ultima linha