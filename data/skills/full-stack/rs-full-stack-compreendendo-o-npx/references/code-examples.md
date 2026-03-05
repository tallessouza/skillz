# Code Examples: NPX vs NPM

## Exemplo 1: Instalacao com NPM

```bash
# Instalar TypeScript e tipos do Node
npm install typescript @types/node

# Instalar com versao especifica
npm install typescript @types/node@20

# Abreviacao de install
npm i typescript @types/node
```

## Exemplo 2: Compilacao TypeScript sem NPX

```bash
# Caminho completo ate o binario
./node_modules/.bin/tsc server.ts
```

Resultado: gera `server.js` a partir de `server.ts`.

## Exemplo 3: Compilacao TypeScript com NPX

```bash
# NPX resolve o binario automaticamente
npx tsc server.ts
```

Mesmo resultado: gera `server.js`. O NPX encontra `tsc` dentro de `node_modules/.bin/` automaticamente.

## Exemplo 4: NPX com pacotes remotos (nao instalados)

```bash
# Cria projeto React sem instalar create-react-app globalmente
npx create-react-app my-app

# Inicializa Prisma sem instalar globalmente
npx prisma init

# Executa cowsay sem instalar
npx cowsay "Hello"
```

## Exemplo 5: Fluxo completo do instrutor

```bash
# 1. Iniciar projeto
npm init -y

# 2. Instalar dependencias
npm install typescript @types/node

# 3. Compilar TypeScript (com npx)
npx tsc server.ts

# 4. Executar o JavaScript gerado
node server.js
```

## Variacao: Quando usar npm scripts em vez de npx

No `package.json`, scripts ja resolvem `node_modules/.bin/` automaticamente:

```json
{
  "scripts": {
    "build": "tsc server.ts"
  }
}
```

```bash
# Isso funciona porque npm scripts resolvem .bin automaticamente
npm run build
```

Dentro de `scripts`, nao precisa de `npx` — o npm ja resolve o caminho do binario.