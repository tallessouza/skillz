# Code Examples: Versoes Exatas do NPM

## Exemplo 1: Criando o arquivo .npmrc

```bash
# Na raiz do projeto, crie o arquivo .npmrc
echo "save-exact=true" > .npmrc
```

Conteudo do `.npmrc`:
```ini
save-exact=true
```

## Exemplo 2: package.json COM range (antes do .npmrc)

```json
{
  "devDependencies": {
    "@types/node": "^20.11.5",
    "tsx": "^4.7.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3"
  },
  "dependencies": {
    "fastify": "^4.26.0"
  }
}
```

Note o `^` em todas as versoes — isso permite atualizacoes automaticas dentro do range major.

## Exemplo 3: package.json SEM range (depois do .npmrc)

```json
{
  "devDependencies": {
    "@types/node": "20.11.5",
    "tsx": "4.7.0",
    "tsup": "8.0.1",
    "typescript": "5.3.3"
  },
  "dependencies": {
    "fastify": "4.26.0"
  }
}
```

Versoes exatas — sem `^`, sem `~`. Todos no time instalam exatamente estas versoes.

## Exemplo 4: Reinstalando dependencias apos criar .npmrc

```bash
# Remover dependencias existentes
rm -rf node_modules package-lock.json

# Reinstalar dependencias de desenvolvimento
npm i typescript @types/node tsx tsup -D

# Reinstalar dependencias de producao
npm i fastify

# Verificar que versoes estao sem prefixo
cat package.json
```

## Exemplo 5: Configuracao global (opcional, para sua maquina)

```bash
# Configura save-exact globalmente no npm
npm config set save-exact true

# Verifica a configuracao
npm config get save-exact
# Output: true
```

Isso garante que QUALQUER `npm install` na sua maquina fixa a versao, mesmo em projetos sem `.npmrc`.

## Exemplo 6: Semantic Versioning — o que ^ e ~ significam

```
Versao: MAJOR.MINOR.PATCH
Exemplo: 4.26.0

^4.26.0  → aceita qualquer 4.x.x >= 4.26.0 (caret — range major)
~4.26.0  → aceita qualquer 4.26.x >= 4.26.0 (tilde — range minor)
4.26.0   → aceita APENAS 4.26.0 (exata — sem range)
```

## Exemplo 7: Renovate bot em acao (ilustrativo)

Quando o Renovate detecta uma nova versao de uma dependencia, ele cria uma PR similar a:

```
Title: fix(deps): update dependency fastify to v4.26.1

Changes in package.json:
- "fastify": "4.26.0"
+ "fastify": "4.26.1"

CI Status: ✅ All tests passing
```

Se os testes falham:

```
Title: fix(deps): update dependency fastify to v5.0.0

Changes in package.json:
- "fastify": "4.26.0"
+ "fastify": "5.0.0"

CI Status: ❌ 3 tests failing
  - test/routes/users.spec.ts: TypeError: fastify.register is not a function
```

Neste caso, voce sabe exatamente o que quebrou e pode consultar o changelog do Fastify v5 para adaptar.