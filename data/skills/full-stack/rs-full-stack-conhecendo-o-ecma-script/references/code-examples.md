# Code Examples: Conhecendo o ECMAScript

## Mapeamento de features por versao ES

Esta referencia ajuda a identificar rapidamente a qual versao do ECMAScript pertence cada feature.

### ES5 (2009) — Base do JavaScript "classico"

```javascript
// strict mode
"use strict";

// Array methods
var numbers = [1, 2, 3];
numbers.forEach(function(n) { console.log(n); });
numbers.map(function(n) { return n * 2; });
numbers.filter(function(n) { return n > 1; });

// JSON nativo
var json = JSON.stringify({ name: "João" });
var obj = JSON.parse(json);
```

### ES6 / ES2015 — O marco divisor

```javascript
// let e const (substituem var)
let count = 0;
const API_URL = "https://api.example.com";

// Arrow functions
const double = (n) => n * 2;

// Template literals
const greeting = `Hello, ${name}!`;

// Destructuring
const { name, age } = user;
const [first, ...rest] = items;

// Classes
class User {
  constructor(name) {
    this.name = name;
  }
}

// Modules
import { fetchUsers } from './api.js';
export const helper = () => {};

// Promises
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data));

// Spread operator
const merged = { ...defaults, ...overrides };

// Default parameters
function greet(name = "World") {
  return `Hello, ${name}!`;
}
```

### ES2017 (ES8) — async/await

```javascript
// async/await — acucar sintatico sobre Promises
async function getUsers() {
  const response = await fetch('/api/users');
  const users = await response.json();
  return users;
}

// Object.entries / Object.values
const config = { host: 'localhost', port: 3000 };
Object.entries(config); // [['host','localhost'], ['port',3000]]
Object.values(config);  // ['localhost', 3000]
```

### ES2020 (ES11) — Operadores de seguranca

```javascript
// Optional chaining
const city = user?.address?.city;

// Nullish coalescing
const port = config.port ?? 3000;

// BigInt
const huge = 9007199254740991n;

// Promise.allSettled
const results = await Promise.allSettled([
  fetch('/api/a'),
  fetch('/api/b'),
]);
```

### ES2022 (ES13)

```javascript
// Top-level await (em modules)
const data = await fetch('/api/config').then(r => r.json());

// Array.at()
const last = items.at(-1);

// Object.hasOwn (substitui hasOwnProperty)
Object.hasOwn(obj, 'key');
```

### ES2023 (ES14) — Versao mencionada pelo instrutor

```javascript
// Array.findLast / Array.findLastIndex
const lastEven = numbers.findLast(n => n % 2 === 0);
const lastEvenIndex = numbers.findLastIndex(n => n % 2 === 0);

// Hashbang grammar (para scripts CLI)
#!/usr/bin/env node
console.log("Hello from CLI");
```

## Como verificar suporte

```bash
# Verificar target no tsconfig.json
# "target": "ES2020" → compila para ES2020
# "lib": ["ES2023"] → permite usar types do ES2023

# No package.json (browserslist)
# "browserslist": "> 0.5%, not dead"
```

## Configurando transpilacao por versao

```jsonc
// tsconfig.json — escolha o target baseado no ambiente alvo
{
  "compilerOptions": {
    "target": "ES2020",    // Node 14+
    "target": "ES2022",    // Node 18+
    "lib": ["ES2023", "DOM"]
  }
}
```