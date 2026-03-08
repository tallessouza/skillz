# Code Examples: Atualização Gradual de Dependências Node.js

## Exemplo completo de fluxo de atualização

### 1. Identificar dependências desatualizadas

```bash
npm outdated
```

Output típico:
```
Package          Current   Wanted   Latest   Location
express          4.17.1    4.17.3   4.18.2   my-app
cors             2.8.4     2.8.5    2.8.5    my-app
jsonwebtoken     8.5.1     8.5.1    9.0.2    my-app
typescript       4.9.5     4.9.5    5.3.3    my-app
jest             28.1.3    28.1.3   29.7.0   my-app
```

Análise:
- `cors`: 2.8.4 → 2.8.5 = **patch** (bug fix)
- `express`: 4.17.1 → 4.17.3 = **patch** (dentro do wanted), 4.18.2 = **minor** (latest)
- `jsonwebtoken`: 8.5.1 → 9.0.2 = **major** (breaking changes possíveis)
- `typescript`: 4.9.5 → 5.3.3 = **major**
- `jest`: 28.1.3 → 29.7.0 = **major**

### 2. Fase 1 — Patches

```bash
# npm update atualiza até o "wanted" (respeita o range do package.json)
npm update

# Verificar o que mudou
npm outdated
# cors e express devem sumir da lista (ou mostrar current = wanted)

# Testar
npm test
npm run build

# Commit isolado
git add package.json package-lock.json
git commit -m "chore: update patch dependencies (cors, express)"
```

### 3. Fase 2 — Minor

```bash
# Express 4.17.3 → 4.18.2 (minor dentro da mesma major)
npm install express@^4.18.2

# Testar
npm test
npm run build

# Commit isolado
git add package.json package-lock.json
git commit -m "chore: update express to 4.18.2 (minor)"
```

### 4. Fase 3 — Major (uma por vez)

```bash
# jsonwebtoken 8.x → 9.x
# PRIMEIRO: ler changelog
# https://github.com/auth0/node-jsonwebtoken/blob/master/CHANGELOG.md

npm install jsonwebtoken@latest

# Testar — pode quebrar!
npm test

# Se quebrou, corrigir as breaking changes
# Exemplo: API de verificação pode ter mudado
# Depois de corrigir:
git add -A
git commit -m "chore: update jsonwebtoken to v9 (major)

BREAKING: updated verify() API per migration guide"
```

```bash
# typescript 4.x → 5.x (separado do anterior)
npm install typescript@latest

npm run build  # Verificar se compila
npm test

git add -A
git commit -m "chore: update typescript to v5 (major)"
```

```bash
# jest 28.x → 29.x (separado)
npm install jest@latest
# Se usa ts-jest, atualizar junto:
npm install ts-jest@latest

npm test

git add -A
git commit -m "chore: update jest to v29 (major)"
```

## Variação: usando npm-check-updates (ncu)

```bash
# Instalar globalmente
npm install -g npm-check-updates

# Ver o que pode ser atualizado (sem alterar nada)
ncu

# Atualizar apenas patches
ncu -t patch -u
npm install
npm test
git commit -am "chore: update patch dependencies"

# Atualizar apenas minors
ncu -t minor -u
npm install
npm test
git commit -am "chore: update minor dependencies"

# Ver majors pendentes
ncu -t major
# Atualizar majors uma por uma manualmente
```

## Verificação final

```bash
# Confirmar que não há mais patches/minors pendentes
npm outdated

# Output esperado: apenas majors que você decidiu não atualizar agora
# Ou lista vazia se tudo foi atualizado
```