# Code Examples: npm-check-updates Modo Interativo

## Exemplo 1: Setup do cenario de teste

Reverter dependencias para versoes anteriores (simular cenario com pacotes desatualizados):

```bash
# Instalar versoes especificas (anteriores)
npm i express@4.19.0
npm i jsonwebtoken@9.0.0

# Verificar quais estao desatualizadas
npm outdated
```

Saida esperada do `npm outdated`:

```
Package        Current  Wanted  Latest  Location
express        4.19.0   4.21.2  4.21.2  node_modules/express
jsonwebtoken   9.0.0    9.0.2   9.0.2   node_modules/jsonwebtoken
```

## Exemplo 2: Executar modo interativo

```bash
npx npm-check-updates --interactive --format group
```

Interface exibida:

```
? Choose which packages to update ›

  Minor Semver Updates
  ❯ ◉ express         4.19.0  →  4.21.2
    ◉ jsonwebtoken     9.0.0  →  9.0.2

  ↑/↓: navigate | space: toggle | a: toggle all | enter: update selected
```

## Exemplo 3: Atualizar apenas um pacote

1. Navegar ate `jsonwebtoken` com seta para baixo
2. Pressionar `espaco` para desmarcar (`◉` vira `◯`)
3. Pressionar `Enter`

Resultado:

```
express  4.19.0  →  4.21.2

Run npm install to install new versions? Yes

Installing...
```

## Exemplo 4: Verificar apos atualizacao parcial

```bash
npx npm-check-updates --interactive --format group
```

Agora so aparece o pacote nao atualizado:

```
? Choose which packages to update ›

  Minor Semver Updates
  ❯ ◉ jsonwebtoken     9.0.0  →  9.0.2
```

## Exemplo 5: Confirmar que tudo esta atualizado

```bash
npm outdated
```

Se nao retornar nada, todas as dependencias estao na versao mais recente.

Ou via modo interativo:

```bash
npx npm-check-updates --interactive --format group
```

Saida quando tudo esta atualizado:

```
All dependencies match the latest package versions :)
```

## Exemplo 6: Variacao — desmarcar tudo e selecionar individualmente

Util quando ha muitos pacotes e voce quer apenas alguns:

```bash
npx npm-check-updates --interactive --format group
```

1. Pressionar `a` para desmarcar todos
2. Navegar ate o pacote desejado
3. Pressionar `espaco` para marcar
4. Repetir para outros pacotes desejados
5. Pressionar `Enter`

## Exemplo 7: Flags complementares uteis

```bash
# Interativo filtrando apenas um pacote
npx npm-check-updates --interactive --format group --filter express

# Interativo ignorando pacotes especificos
npx npm-check-updates --interactive --format group --reject typescript

# Interativo limitando a minor/patch (sem major)
npx npm-check-updates --interactive --format group --target minor
```