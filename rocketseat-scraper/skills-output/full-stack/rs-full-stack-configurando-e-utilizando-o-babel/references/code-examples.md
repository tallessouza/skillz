# Code Examples: Configurando e Utilizando o Babel

## Exemplo 1: babel.config.js basico

```javascript
// babel.config.js — raiz do projeto
const presets = [
  "@babel/preset-env"
];

module.exports = { presets };
```

## Exemplo 2: babel.config.js com multiplos presets

```javascript
const presets = [
  "@babel/preset-env",
  "@babel/preset-react"      // se usar React
];

module.exports = { presets };
```

## Exemplo 3: babel.config.js com opcoes no preset

```javascript
const presets = [
  ["@babel/preset-env", {
    targets: {
      browsers: ["> 1%", "last 2 versions"]
    }
  }]
];

module.exports = { presets };
```

## Exemplo 4: Codigo fonte (main.js — entrada)

```javascript
class User {
  constructor(email) {
    this.email = email;
  }
}

let user = new User("rodrigo@email.com");
```

## Exemplo 5: Codigo compilado (dist/main.js — saida aproximada)

```javascript
"use strict";

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var User = function User(email) {
  _classCallCheck(this, User);
  this.email = email;
};

var user = new User("rodrigo@email.com");
```

Nota: a saida real inclui mais helpers dependendo da versao do preset-env e dos targets configurados.

## Exemplo 6: Comandos de execucao

```bash
# Execucao direta
./node_modules/.bin/babel main.js --out-dir dist

# Com npx (equivalente mais limpo)
npx babel main.js --out-dir dist

# Via npm script (package.json)
# "scripts": { "build": "babel src --out-dir dist" }
npm run build
```

## Exemplo 7: Arquivo vazio

Quando `main.js` esta vazio, o Babel gera apenas:
```javascript
"use strict";
```

O `"use strict"` e adicionado automaticamente pelo `@babel/preset-env` para ativar o modo estrito do JavaScript.