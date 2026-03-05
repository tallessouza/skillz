# Code Examples: Compiladores e Transpilacao

## Exemplo da aula: Arrow Function transpilada

### Codigo original (moderno)
```javascript
const sum = (x, y) => x + y
```

### Saida ES2015
```javascript
var sum = function sum(x, y) {
  return x + y;
};
```

### Saida ES2016
```javascript
var sum = function (x, y) {
  return x + y;
};
```

Note a diferenca sutil: em ES2015 a funcao recebe o nome (`function sum`), em ES2016 e anonima. Cada versao tem suas proprias regras.

## Outros exemplos comuns de transpilacao

### Template Literals
```javascript
// Moderno
const greeting = `Hello, ${name}!`

// Transpilado (ES5)
var greeting = "Hello, " + name + "!"
```

### Destructuring
```javascript
// Moderno
const { name, age } = user

// Transpilado (ES5)
var name = user.name
var age = user.age
```

### Optional Chaining
```javascript
// Moderno
const city = user?.address?.city

// Transpilado (ES5)
var _user$address
var city = (_user$address = user === null || user === void 0
  ? void 0
  : user.address) === null || _user$address === void 0
    ? void 0
    : _user$address.city
```

### Nullish Coalescing
```javascript
// Moderno
const value = input ?? 'default'

// Transpilado (ES5)
var value = input !== null && input !== void 0 ? input : 'default'
```

### Async/Await
```javascript
// Moderno
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// Transpilado (ES5) — requer runtime helper
function fetchUser(id) {
  return _asyncToGenerator(function* () {
    var response = yield fetch("/api/users/" + id)
    return response.json()
  })()
}
```

## Ferramentas de compilacao populares

| Ferramenta | Linguagem | Velocidade | Uso tipico |
|-----------|-----------|------------|------------|
| **Babel** | JavaScript | Moderada | Mais configuravel, maior ecossistema de plugins |
| **SWC** | Rust | Rapida | Usado pelo Next.js, Parcel |
| **esbuild** | Go | Muito rapida | Usado pelo Vite como bundler |
| **TypeScript (tsc)** | TypeScript | Moderada | Compila TS → JS com transpilacao inclusa |

## Configuracao basica do Babel (referencia)

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.25%, not dead",
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ]
}
```

- `targets`: Define quais navegadores suportar (usa browserslist)
- `useBuiltIns: "usage"`: Inclui apenas os polyfills que o codigo realmente usa
- `corejs: 3`: Versao da biblioteca de polyfills