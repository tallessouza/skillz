# Code Examples: O que e ou nao e Clean Code

## Nota sobre esta aula

Esta e uma aula introdutoria e conceitual — nao contem exemplos de codigo do instrutor. Os exemplos abaixo ilustram os conceitos discutidos para referencia pratica.

## Exemplo: Legibilidade nao e simplicidade

**Codigo simples mas ilegivel:**
```typescript
const r = u.filter(x => x.a && !x.d).map(x => x.n)
```

**Codigo complexo mas legivel:**
```typescript
const activeUserNames = users
  .filter(user => user.isActive && !user.isDeleted)
  .map(user => user.name)
```

O segundo e mais longo, mas qualquer dev com conhecimento basico entende o que faz.

## Exemplo: Codigo menor nao e codigo melhor

**Versao "esperta" (menor):**
```typescript
const g = (a: number[]) => a.reduce((p, c, i) => i ? { s: p.s + c, m: (p.s + c) / (i + 1) } : { s: c, m: c }, { s: 0, m: 0 }).m
```

**Versao limpa (maior):**
```typescript
function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0

  const sum = numbers.reduce((total, current) => total + current, 0)
  const average = sum / numbers.length

  return average
}
```

A versao maior e mais legivel, manutenivel e previsivel.

## Exemplo: Estrutura de pastas nao define Clean Code

**Estrutura "organizada" com codigo sujo dentro:**
```
src/
├── controllers/
│   └── userController.ts    // 500 linhas, sem separacao de responsabilidade
├── services/
│   └── userService.ts       // duplica logica do controller
├── repositories/
│   └── userRepository.ts    // queries SQL inline sem validacao
└── models/
    └── userModel.ts         // campos com nomes de uma letra
```

**Estrutura "simples" com codigo limpo dentro:**
```
src/
├── createUser.ts            // funcao pura, bem nomeada, testavel
├── findActiveUsers.ts       // query clara, tipada, com tratamento de erro
├── deactivateUser.ts        // logica isolada, previsivel
└── types.ts                 // tipos bem definidos
```

A segunda estrutura e "pior" em organizacao de pastas, mas o codigo dentro pode ser muito mais limpo.

## Exemplo: Confianca e Previsibilidade

**Sem confianca (efeitos colaterais escondidos):**
```typescript
function updateUser(user: User) {
  user.name = user.name.trim()
  user.updatedAt = new Date()
  database.save(user)
  emailService.sendUpdateNotification(user)  // surpresa!
  cache.invalidate(`user:${user.id}`)        // surpresa!
  analytics.track('user_updated', user)      // surpresa!
}
```

**Com confianca (comportamento previsivel):**
```typescript
function updateUserData(user: User, changes: UserChanges): User {
  return {
    ...user,
    ...changes,
    updatedAt: new Date(),
  }
}

// Efeitos colaterais explicitos e separados
await database.save(updatedUser)
await notifyUserUpdate(updatedUser)
```

No segundo caso, o dev sabe exatamente o que `updateUserData` faz — sem surpresas.