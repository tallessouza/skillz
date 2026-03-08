# Code Examples: Grupos de Atualizações

## Comando básico — listar atualizações

```bash
# Lista todas as dependências com versões disponíveis
npx npm-check-updates
```

Saída exemplo:
```
 @prisma/client   ^5.10.0  →  ^5.22.0
 @types/express   ^4.17.0  →  ^5.0.0
 @types/node      ^20.11.0 →  ^22.0.0
 prisma           ^5.10.0  →  ^5.22.0
```

## Modo interativo com agrupamento

```bash
# Interativo + agrupamento por tipo semver
npx npm-check-updates --interactive --format group
```

Saída agrupada:
```
Patch   Backwards-compatible bug fixes
❯ ◯ prisma           ^5.10.0  →  ^5.10.2

Minor   Backwards-compatible features
❯ ◯ @prisma/client   ^5.10.0  →  ^5.22.0

Major   Potentially breaking API changes
❯ ◯ @types/express   ^4.17.0  →  ^5.0.0
❯ ◯ @types/node      ^20.11.0 →  ^22.0.0
```

## Comparação com npm outdated

```bash
# npm nativo — mostra current, wanted e latest
npm outdated
```

Saída exemplo:
```
Package          Current   Wanted   Latest
@types/express   4.17.21   4.17.21  5.0.0
@types/node      20.11.5   20.11.19 22.0.0
prisma           5.10.0    5.10.2   5.22.0
```

Diferença-chave: `npm outdated` mostra a coluna "Wanted" (máxima versão dentro do range do package.json), enquanto `npm-check-updates` mostra direto a "Latest".

## Flags úteis do npm-check-updates

```bash
# Apenas listar (não modifica package.json)
npx npm-check-updates

# Atualizar o package.json (sem instalar)
npx npm-check-updates -u

# Modo interativo simples (sem agrupamento)
npx npm-check-updates --interactive

# Modo interativo com agrupamento (recomendado)
npx npm-check-updates --interactive --format group

# Filtrar por tipo de dependência
npx npm-check-updates --dep dev
npx npm-check-updates --dep prod

# Filtrar por pacote específico
npx npm-check-updates --filter prisma
```

## Fluxo completo recomendado

```bash
# 1. Visão geral com npm nativo
npm outdated

# 2. Visão com recomendação direta
npx npm-check-updates

# 3. Atualização interativa por grupo
npx npm-check-updates --interactive --format group

# 4. Após selecionar pacotes, instalar
npm install

# 5. Verificar se nada quebrou
npm test
npm run build
```