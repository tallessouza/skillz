# Code Examples: Escaneando Dependências do Projeto

## Exemplo completo de output do `npm outdated`

### Cenário: projeto Node.js com Express, Prisma e TypeScript

```bash
$ npm outdated
```

```
Package          Current   Wanted    Latest    Location               Depended by
@prisma/client   5.19.1    5.22.0    5.22.0    node_modules/@prisma   api-project
@types/express   4.17.21   4.17.21   5.0.0     node_modules/@types    api-project
@types/node      20.14.12  20.17.6   22.9.0    node_modules/@types    api-project
express          4.21.0    4.21.0    5.0.1     node_modules/express   api-project
jest             29.7.0    29.7.0    30.0.0    node_modules/jest      api-project
jsonwebtoken     9.0.0     9.0.2     9.0.2     node_modules/jwt       api-project
prisma           5.19.1    5.22.0    5.22.0    node_modules/prisma    api-project
tsup             8.0.2     8.3.5     8.3.5     node_modules/tsup      api-project
tsx              4.16.2    4.19.2    4.19.2    node_modules/tsx       api-project
typescript       5.5.4     5.7.2     5.7.2     node_modules/ts        api-project
```

## Análise passo a passo

### Passo 1: Identificar atualizações seguras (Wanted == Latest ou mesma major)

```
@prisma/client   5.19.1  → 5.22.0   ✅ Seguro (minor bump)
jsonwebtoken     9.0.0   → 9.0.2    ✅ Seguro (patch bump)
prisma           5.19.1  → 5.22.0   ✅ Seguro (minor bump)
tsup             8.0.2   → 8.3.5    ✅ Seguro (minor bump)
tsx              4.16.2  → 4.19.2   ✅ Seguro (minor bump)
typescript       5.5.4   → 5.7.2    ✅ Seguro (minor bump)
```

### Passo 2: Identificar breaking changes (major diferente)

```
@types/express   4.17.21 → 5.0.0    ⚠️ Major bump 4→5
@types/node      20.14.12 → 22.9.0  ⚠️ Major bump 20→22
express          4.21.0  → 5.0.1    ⚠️ Major bump 4→5
jest             29.7.0  → 30.0.0   ⚠️ Major bump 29→30
```

## Executando a Fase 1: atualizações seguras

```bash
# Atualiza todas as dependências dentro do range compatível
$ npm update

# Verificar resultado
$ npm outdated
```

Output esperado após `npm update`:

```
Package          Current   Wanted    Latest    Location               Depended by
@types/express   4.17.21   4.17.21   5.0.0     node_modules/@types    api-project
@types/node      20.17.6   20.17.6   22.9.0    node_modules/@types    api-project
express          4.21.0    4.21.0    5.0.1     node_modules/express   api-project
jest             29.7.0    29.7.0    30.0.0    node_modules/jest      api-project
```

Restaram apenas as dependências que requerem major bump.

## Executando a Fase 2: migrações com breaking changes

### Exemplo: migrando Express 4 → 5

```bash
# 1. Ler o migration guide primeiro
# https://expressjs.com/en/guide/migrating-5.html

# 2. Atualizar o pacote
$ npm install express@5

# 3. Atualizar os types correspondentes
$ npm install @types/express@5

# 4. Rodar testes
$ npm test

# 5. Verificar erros de compilação
$ npx tsc --noEmit

# 6. Refatorar o que quebrou baseado nos erros
```

### Exemplo: migrando @types/node 20 → 22

```bash
# 1. Verificar compatibilidade com a versão do Node.js instalada
$ node --version
# Se v22.x.x → seguro atualizar @types/node para 22
# Se v20.x.x → manter @types/node em 20

# 2. Se compatível
$ npm install @types/node@22
$ npx tsc --noEmit
```

## Verificando o package.json antes e depois

### Antes do scan (package.json):

```json
{
  "dependencies": {
    "@prisma/client": "^5.19.1",
    "express": "^4.21.0",
    "jsonwebtoken": "^9.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.14.12",
    "jest": "^29.7.0",
    "prisma": "^5.19.1",
    "tsup": "^8.0.2",
    "tsx": "^4.16.2",
    "typescript": "^5.5.4"
  }
}
```

### Após `npm update` (package.json atualizado):

```json
{
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "express": "^4.21.0",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.17.6",
    "jest": "^29.7.0",
    "prisma": "^5.22.0",
    "tsup": "^8.3.5",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}
```

## Usando npm outdated com flags úteis

```bash
# Formato JSON para processamento programático
$ npm outdated --json

# Apenas dependências de produção
$ npm outdated --omit=dev

# Nível de profundidade (incluir subdependências)
$ npm outdated --depth=1

# Versão longa com mais detalhes
$ npm outdated --long
```

### Output JSON (útil para automação):

```json
{
  "express": {
    "current": "4.21.0",
    "wanted": "4.21.0",
    "latest": "5.0.1",
    "dependent": "api-project",
    "location": "node_modules/express"
  }
}
```