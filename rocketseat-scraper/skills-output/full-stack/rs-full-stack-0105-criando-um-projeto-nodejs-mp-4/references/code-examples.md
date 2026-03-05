# Code Examples: Criando um Projeto Node.js

## Fluxo completo de criacao

### 1. Criar pasta e navegar

```bash
# Criar pasta raiz para projetos (uma vez)
mkdir -p ~/nodejs-projects

# Criar pasta do projeto especifico
mkdir -p ~/nodejs-projects/api
cd ~/nodejs-projects/api
```

### 2. Inicializar com npm init -y

```bash
npm init -y
```

Saida esperada:
```json
Wrote to /home/user/nodejs-projects/api/package.json:

{
  "name": "api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### 3. Editar package.json

```json
{
  "name": "api",
  "version": "1.0.0",
  "description": "Meu primeiro projeto Node.js",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Seu Nome",
  "license": "ISC"
}
```

Campos removidos: `keywords` (vazio, desnecessario para projeto de estudo).

### 4. Abrir no VS Code

```bash
code .
```

## Variante: npm init interativo (para referencia)

```bash
npm init
# package name: (api) minha-api
# version: (1.0.0) 
# description: API de exemplo
# entry point: (index.js) server.js
# test command: 
# git repository: 
# keywords: node, api
# author: Joao Silva
# license: (ISC) MIT
```

Cancelar a qualquer momento com `Ctrl+C`.

## Variante: projeto privado

```json
{
  "name": "api-interna",
  "version": "1.0.0",
  "private": true,
  "description": "API interna da empresa",
  "main": "index.js",
  "scripts": {
    "dev": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Time Backend",
  "license": "UNLICENSED"
}
```

`"private": true` impede publicacao acidental no npm registry.

## Variante: com type module (ES Modules)

```json
{
  "name": "api",
  "version": "1.0.0",
  "type": "module",
  "description": "Projeto usando ES Modules",
  "main": "index.js",
  "scripts": {
    "dev": "node index.js"
  },
  "author": "Seu Nome",
  "license": "ISC"
}
```

Adicionar `"type": "module"` permite usar `import/export` ao inves de `require/module.exports`.