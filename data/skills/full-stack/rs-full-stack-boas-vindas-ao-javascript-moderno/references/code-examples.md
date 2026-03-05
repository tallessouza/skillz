# Code Examples: JavaScript Moderno Antes do Framework

## Preview de cada conceito (exemplos introdutorios)

### 1. Imutabilidade

```javascript
// ERRADO: mutacao direta
const user = { name: 'João', age: 25 }
user.age = 26 // mutou o objeto original

// CORRETO: criar novo objeto
const updatedUser = { ...user, age: 26 }
// user original permanece intacto
```

### 2. Modulos (ES Modules)

```javascript
// math.js — exportando
export function sum(a, b) {
  return a + b
}

// app.js — importando
import { sum } from './math.js'
console.log(sum(2, 3)) // 5
```

### 3. Funcoes assincronas

```javascript
// Fetch com async/await
async function fetchUsers() {
  const response = await fetch('https://api.example.com/users')
  const users = await response.json()
  return users
}
```

### 4. Pacotes

```bash
# Inicializar projeto
npm init -y

# Instalar dependencia
npm install axios

# Usar no codigo
```

```javascript
import axios from 'axios'

const response = await axios.get('/api/users')
```

### 5. APIs (fetch nativo)

```javascript
// GET
const response = await fetch('https://api.example.com/posts')
const posts = await response.json()

// POST
await fetch('https://api.example.com/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Novo post' })
})
```

### 6. Compiladores (conceitual)

```jsx
// O que voce escreve (JSX):
const element = <h1>Hello</h1>

// O que o compilador (Babel/SWC) transforma em:
const element = React.createElement('h1', null, 'Hello')
```

### 7. Bundlers (conceitual)

```
// Seu projeto:
src/
  index.js      (import App from './App')
  App.js        (import Header from './Header')
  Header.js
  utils.js

// Depois do bundler (Vite/webpack):
dist/
  index-a1b2c3.js    (tudo junto, minificado, otimizado)
  index.html
```

## Conexao com React

Cada conceito aparece diretamente no React:

| Conceito JS | Onde aparece no React |
|-------------|----------------------|
| Imutabilidade | `useState`, `useReducer`, spread operator em state |
| Modulos | Todo componente e um modulo (`import/export`) |
| Async/await | `useEffect` com fetch, React Query, SWR |
| Pacotes | `npm install react`, dependencias do projeto |
| APIs | Data fetching em qualquer app real |
| Compiladores | JSX → JavaScript, TypeScript → JavaScript |
| Bundlers | Vite (Create React App usava webpack) |