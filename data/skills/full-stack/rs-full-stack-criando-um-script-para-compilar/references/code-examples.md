# Code Examples: Scripts Personalizados no package.json

## Exemplo base da aula

### package.json completo

```json
{
  "scripts": {
    "build": "babel main.js --out-dir ./dist"
  },
  "devDependencies": {
    "@babel/cli": "^7.24.0",
    "@babel/core": "^7.24.0",
    "@babel/preset-env": "^7.24.0"
  }
}
```

### Execucao

```bash
# Compila main.js e salva em ./dist/main.js
npm run build
```

### Output no terminal

```
> babel main.js --out-dir ./dist

Successfully compiled 1 file with Babel (123ms).
```

## Variacoes

### Compilar pasta inteira

```json
{
  "scripts": {
    "build": "babel src --out-dir ./dist"
  }
}
```

### Compilar com watch mode

```json
{
  "scripts": {
    "build": "babel src --out-dir ./dist",
    "build:watch": "babel src --out-dir ./dist --watch"
  }
}
```

### Multiplos scripts para diferentes tarefas

```json
{
  "scripts": {
    "build": "babel src --out-dir ./dist",
    "lint": "eslint src/",
    "test": "jest",
    "dev": "nodemon server.js"
  }
}
```

### Script com multiplos comandos encadeados

```json
{
  "scripts": {
    "build": "babel src --out-dir ./dist",
    "prebuild": "rm -rf dist",
    "postbuild": "echo 'Build complete!'"
  }
}
```

O npm executa automaticamente `prebuild` antes de `build` e `postbuild` depois.

## Comparacao: com e sem script

### Sem script (improdutivo)

```bash
# Toda vez que precisa compilar:
./node_modules/.bin/babel main.js --out-dir ./dist
```

### Com script (produtivo)

```bash
# Uma vez no package.json:
# "build": "babel main.js --out-dir ./dist"

# Depois, toda vez que precisa compilar:
npm run build
```

## Erros comuns

### Erro: pacote nao encontrado

```bash
# Se o babel nao esta instalado:
npm run build
# > sh: babel: command not found

# Solucao:
npm install --save-dev @babel/cli @babel/core
```

### Erro: virgula extra no JSON

```json
{
  "scripts": {
    "build": "babel main.js --out-dir ./dist",  // <-- virgula extra se for ultimo
  }
}
```

JSON nao aceita trailing commas. Remova a virgula do ultimo item.