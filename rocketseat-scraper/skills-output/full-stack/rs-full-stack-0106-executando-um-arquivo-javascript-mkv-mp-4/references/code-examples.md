# Code Examples: Executando Arquivo JavaScript com Node.js

## Exemplo 1: Hello World (primeiro teste)

```javascript
// src/server.js
console.log('hello world')
```

```bash
$ node src/server.js
hello world
```

## Exemplo 2: Mensagem customizada

```javascript
// src/server.js
console.log('meu primeiro projeto node.js')
```

```bash
$ node src/server.js
meu primeiro projeto node.js
```

## Exemplo 3: Operacoes com variaveis

```javascript
// src/server.js
const a = 10
const b = 5
const result = a + b

console.log('resultado:', result)
```

```bash
$ node src/server.js
resultado: 15
```

O instrutor mostra duas formas de passar multiplos valores ao console.log:
- Concatenacao: `console.log('resultado: ' + result)`
- Virgula (separador): `console.log('resultado:', result)` — imprime ambos os conteudos separados por espaco

## Exemplo 4: Estrutura de pastas completa

```
meu-projeto/
├── package.json          # Configuracao (main: "src/server.js")
├── node_modules/         # Dependencias (gitignore)
├── .gitignore
└── src/
    └── server.js         # Entry point da aplicacao
```

## Exemplo 5: package.json configurado

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "description": "",
  "main": "src/server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## Variacoes de execucao

```bash
# A partir da raiz do projeto (recomendado)
node src/server.js

# Dentro da pasta src (funciona, mas menos comum)
cd src
node server.js

# Path absoluto (funciona, mas desnecessario)
node /home/user/projects/meu-projeto/src/server.js
```