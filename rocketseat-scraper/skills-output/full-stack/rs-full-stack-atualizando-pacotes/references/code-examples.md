# Code Examples: Atualizando Pacotes Node.js

## Fluxo completo demonstrado na aula

### 1. Verificar pacotes desatualizados (sem modificar)

```bash
npx npm-check-updates
```

Saída esperada quando há pacotes desatualizados:
```
 express  ^4.19.0  →  ^4.21.1
 jsonwebtoken  ^8.5.1  →  ^9.0.2

Run npx npm-check-updates -u to upgrade package.json
```

### 2. Atualizar package.json

```bash
npx npm-check-updates -u
```

Saída esperada:
```
 express  ^4.19.0  →  ^4.21.1
 jsonwebtoken  ^8.5.1  →  ^9.0.2

Run npm install to install new versions.
```

### 3. Verificar que o lockfile está desincronizado

```bash
npm outdated
```

Saída ANTES de `npm install` (mostra discrepância):
```
Package        Current  Wanted  Latest  Location
express        4.19.0   4.21.1  4.21.1  node_modules/express
```

### 4. Sincronizar lockfile e node_modules

```bash
npm install
```

Ou forma abreviada:
```bash
npm i
```

### 5. Confirmar que tudo está atualizado

```bash
npm outdated
```

Saída esperada: nenhuma (sem output = tudo atualizado).

```bash
npx npm-check-updates
```

Saída esperada:
```
All dependencies match the latest package versions :)
```

## Variações úteis

### Atualizar apenas dependências de produção

```bash
npx npm-check-updates -u --dep prod
```

### Atualizar apenas devDependencies

```bash
npx npm-check-updates -u --dep dev
```

### Atualizar um pacote específico

```bash
npx npm-check-updates -u --filter express
```

### Ver atualizações sem aplicar (modo interativo)

```bash
npx npm-check-updates -i
```

Permite selecionar quais pacotes atualizar individualmente.

### Usar forma abreviada do comando

```bash
npx ncu        # equivale a npx npm-check-updates
npx ncu -u     # equivale a npx npm-check-updates -u
```

### Checar com npm outdated (forma longa e abreviada)

```bash
npm outdated    # forma completa
npm out         # forma abreviada (demonstrada pelo instrutor)
```

## Script package.json para automação

```json
{
  "scripts": {
    "deps:check": "npx npm-check-updates",
    "deps:update": "npx npm-check-updates -u && npm install",
    "deps:verify": "npm outdated"
  }
}
```

Uso:
```bash
npm run deps:check    # ver o que pode ser atualizado
npm run deps:update   # atualizar tudo e sincronizar lockfile
npm run deps:verify   # confirmar que está tudo em dia
```