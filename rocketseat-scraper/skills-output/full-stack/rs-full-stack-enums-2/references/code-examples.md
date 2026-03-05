# Code Examples: Enums no TypeScript

## Exemplo basico da aula

```typescript
enum Profile {
  Admin = 1,
  Client = 2,
  Seller = 3
}

let profile: number = Profile.Admin
console.log(Profile.Seller) // Output: 3
console.log(Profile.Admin)  // Output: 1
```

## Uso em condicionais

```typescript
enum Profile {
  Admin = 1,
  Client = 2,
  Seller = 3
}

function getView(profile: Profile): string {
  switch (profile) {
    case Profile.Admin:
      return 'admin-dashboard'
    case Profile.Client:
      return 'client-portal'
    case Profile.Seller:
      return 'seller-panel'
  }
}

const view = getView(Profile.Admin) // 'admin-dashboard'
```

## Enum como parametro de funcao

```typescript
enum Profile {
  Admin = 1,
  Client = 2,
  Seller = 3
}

function hasAccess(profile: Profile, resource: string): boolean {
  if (profile === Profile.Admin) return true
  if (profile === Profile.Seller && resource === 'inventory') return true
  return false
}

hasAccess(Profile.Admin, 'reports')    // true
hasAccess(Profile.Client, 'inventory') // false
```

## Comparacao: antes e depois

### Antes (numeros magicos)
```typescript
function getUserPermissions(profile: number) {
  if (profile === 1) return ['read', 'write', 'delete', 'admin']
  if (profile === 2) return ['read']
  if (profile === 3) return ['read', 'write']
  return []
}

const permissions = getUserPermissions(1) // O que e 1?
```

### Depois (com enum)
```typescript
enum Profile {
  Admin = 1,
  Client = 2,
  Seller = 3
}

function getUserPermissions(profile: Profile) {
  if (profile === Profile.Admin) return ['read', 'write', 'delete', 'admin']
  if (profile === Profile.Client) return ['read']
  if (profile === Profile.Seller) return ['read', 'write']
  return []
}

const permissions = getUserPermissions(Profile.Admin) // Claro!
```

## Outros exemplos de enum no mundo real

### Status de pedido
```typescript
enum OrderStatus {
  Pending = 1,
  Processing = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5
}

let status = OrderStatus.Pending
```

### Metodo de pagamento
```typescript
enum PaymentMethod {
  CreditCard = 1,
  Pix = 2,
  BankSlip = 3
}
```

### Dias da semana (com inicio em 1)
```typescript
enum Weekday {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7
}
```