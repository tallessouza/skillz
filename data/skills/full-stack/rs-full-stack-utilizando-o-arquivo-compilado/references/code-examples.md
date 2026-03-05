# Code Examples: Utilizando o Arquivo Compilado

## Exemplo completo da aula

### Código fonte (main.js na raiz)

```javascript
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  sendMessage() {
    console.log("Mensagem enviada para:", this.email);
  }
}

const user = new User("Rodrigo", "rodrigo@email.com");
user.sendMessage();
// Console: "Mensagem enviada para: rodrigo@email.com"
```

### HTML apontando para o compilado

```html
<!DOCTYPE html>
<html>
<head>
  <title>Exemplo Babel</title>
</head>
<body>
  <!-- Aponta para o arquivo COMPILADO, não o fonte -->
  <script src="./dist/main.js"></script>
</body>
</html>
```

### package.json com script de build

```json
{
  "name": "meu-projeto",
  "scripts": {
    "build": "babel src --out-dir dist"
  },
  "devDependencies": {
    "@babel/cli": "^7.x",
    "@babel/core": "^7.x",
    "@babel/preset-env": "^7.x"
  }
}
```

### babel.config.json

```json
{
  "presets": ["@babel/preset-env"]
}
```

## Demonstração do problema: alteração sem recompilação

### Passo 1: Alterar o fonte
```javascript
// Antes:
sendMessage() {
  console.log("Mensagem enviada para:", this.email);
}

// Depois:
sendMessage() {
  console.log("Mensagem enviada");
}
```

### Passo 2: Recarregar o navegador SEM recompilar
```
// Console ainda mostra:
// "Mensagem enviada para: rodrigo@email.com"
// Porque dist/main.js não foi atualizado!
```

### Passo 3: Recompilar e verificar
```bash
npm run build
# Agora dist/main.js contém a versão atualizada
```
```
// Console agora mostra:
// "Mensagem enviada"
```

## Variação: usando watch mode para evitar recompilação manual

```json
{
  "scripts": {
    "build": "babel src --out-dir dist",
    "dev": "babel src --out-dir dist --watch"
  }
}
```

```bash
# Em desenvolvimento, use watch:
npm run dev
# Babel recompila automaticamente a cada alteração no fonte

# Para produção, use build único:
npm run build
```

## Variação: estrutura de pastas mais organizada

```
projeto/
├── src/
│   └── main.js          # Fonte (código moderno)
├── dist/
│   └── main.js          # Compilado (gerado pelo Babel)
├── index.html            # Referencia ./dist/main.js
├── package.json
└── babel.config.json
```

## Código compilado pelo Babel (exemplo de saída)

O que o Babel gera a partir de classes ES6:

```javascript
// Entrada (ES6+):
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  sendMessage() {
    console.log("Mensagem enviada para:", this.email);
  }
}

// Saída Babel (ES5 compatível):
"use strict";

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var User = function () {
  function User(name, email) {
    _classCallCheck(this, User);
    this.name = name;
    this.email = email;
  }

  User.prototype.sendMessage = function sendMessage() {
    console.log("Mensagem enviada para:", this.email);
  };

  return User;
}();

var user = new User("Rodrigo", "rodrigo@email.com");
user.sendMessage();
```