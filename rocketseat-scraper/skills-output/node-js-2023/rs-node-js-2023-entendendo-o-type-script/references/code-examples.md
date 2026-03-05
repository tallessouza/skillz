# Code Examples: Entendendo o TypeScript

## Setup completo do projeto

### 1. Criar projeto e instalar TypeScript

```bash
mkdir 02-api-rest-nodejs
cd 02-api-rest-nodejs
npm init -y
npm i -D typescript
```

### 2. Gerar tsconfig.json

```bash
npx tsc --init
```

Isso e equivalente a:
```bash
./node_modules/.bin/tsc --init
```

### 3. Configurar target no tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020"
  }
}
```

**Por que ES2020?** Node.js moderno suporta todas as features dessa versao. Target mais antigo gera codigo desnecessariamente complexo.

## Exemplo da aula: calculateAgeOfUser

### Versao JavaScript (sem protecao)

```javascript
// src/index.js
function calculateAgeOfUser(user) {
  const age = new Date().getFullYear() - user.birthYear
  return age
}

// Todas essas chamadas sao aceitas pelo editor, mas quebram em runtime:
calculateAgeOfUser("Diego")      // user.birthYear → undefined → NaN
calculateAgeOfUser()              // Cannot read property 'birthYear' of undefined
calculateAgeOfUser({})            // NaN (undefined - number)
```

### Versao TypeScript (com protecao)

```typescript
// src/index.ts
interface User {
  birthYear: number
}

function calculateAgeOfUser(user: User) {
  const age = new Date().getFullYear() - user.birthYear
  return age
}

// O editor IMEDIATAMENTE mostra erros:

calculateAgeOfUser("Diego")
// ❌ Argument of type 'string' is not assignable to parameter of type 'User'

calculateAgeOfUser()
// ❌ Expected 1 arguments, but got 0

calculateAgeOfUser({})
// ❌ Property 'birthYear' is missing in type '{}' but required in type 'User'

calculateAgeOfUser({ birthYear: 1990 })
// ✅ Funciona, autocomplete mostra 'birthYear'

calculateAgeOfUser({ birthYear: "1990" })
// ❌ Type 'string' is not assignable to type 'number'
```

### Compilacao e execucao

```bash
# Compilar TS → JS
npx tsc src/index.ts

# O arquivo gerado (src/index.js) nao tem interfaces nem tipos:
# function calculateAgeOfUser(user) {
#   var age = new Date().getFullYear() - user.birthYear;
#   return age;
# }

# Executar o JS compilado
node src/index.js    # ✅ Funciona

# Tentar executar TS diretamente
node src/index.ts    # ❌ SyntaxError — Node nao entende TypeScript
```

## Demonstracao do autocomplete

Sem tipo definido no parametro:
```typescript
function calculateAgeOfUser(user) {
  // Ctrl+Space dentro de `user.` → nenhuma sugestao util
}

calculateAgeOfUser({ /* Ctrl+Space → nada */ })
```

Com tipo definido:
```typescript
function calculateAgeOfUser(user: User) {
  // Ctrl+Space dentro de `user.` → birthYear: number
}

calculateAgeOfUser({ /* Ctrl+Space → birthYear */ })
```

## Campo opcional vs obrigatorio

```typescript
// birthYear OBRIGATORIO
interface User {
  birthYear: number
}

// birthYear OPCIONAL (com ?)
interface User {
  birthYear?: number
}
```

O instrutor explica: se a funcao **depende** do campo para funcionar, ele deve ser obrigatorio. Use `?` apenas quando ha um valor padrao ou fallback.