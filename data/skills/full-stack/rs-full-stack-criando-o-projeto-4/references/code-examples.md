# Code Examples: Criando Projeto Node.js API

## Exemplo 1: Scaffold completo via terminal

```bash
# Criar e entrar na pasta
mkdir api-restaurant
cd api-restaurant

# Inicializar com defaults
npm init -y
```

Output do `npm init -y`:

```json
{
  "name": "api-restaurant",
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

## Exemplo 2: package.json limpo (apos edicao)

```json
{
  "name": "api-restaurant",
  "version": "1.0.0",
  "description": "API para gerenciar pedidos das mesas de um restaurante",
  "main": "index.js",
  "scripts": {},
  "author": "Rodrigo",
  "license": "ISC"
}
```

Campos removidos:
- `keywords: []` — sem utilidade para API privada
- `scripts.test` placeholder — sera substituido por test runner real

Campos preenchidos:
- `description` — descreve o proposito da API
- `author` — identifica o responsavel

## Exemplo 3: Variacoes de nome para diferentes tipos de projeto

```bash
# API backend
mkdir api-restaurant
mkdir api-delivery
mkdir api-payments

# Aplicacao web
mkdir app-dashboard
mkdir app-admin

# Landing page / site
mkdir web-landing
mkdir web-docs
```

## Exemplo 4: Abrindo projeto no VSCode via terminal

```bash
# Se voce tem o comando `code` no PATH:
code api-restaurant

# Ou abra o VSCode e arraste a pasta (como o instrutor fez)
```

## Exemplo 5: Verificando que o projeto foi criado corretamente

```bash
ls -la
# Deve mostrar apenas: package.json

cat package.json
# Deve mostrar o JSON limpo com description preenchida
```