# Code Examples: Compatibilidade de Versoes Angular

## Verificar versoes instaladas

```bash
# Versao do Node
node -v
# Exemplo output: v22.0.0

# Versao do NPM (vem com o Node)
npm -v
# Exemplo output: 10.5.0

# Versao do Angular CLI (se instalado globalmente)
ng version
# Ou
npx @angular/cli version
```

## Tabela de compatibilidade (Angular 19 como exemplo da aula)

| Angular CLI | Node.js | TypeScript | RxJS |
|-------------|---------|------------|------|
| 19.x | ^18.19.1 \| ^20.11.1 \| ^22.0.0 | >=5.5 <5.8 | ^6.5.3 \| ^7.4.0 |

## Cenario: criando projeto Angular 19

### Passo 1 — verificar Node
```bash
node -v
# Se output for v16.x ou v17.x → incompativel!
```

### Passo 2 — instalar versao compativel

**Sem NVM (desinstalar/reinstalar):**
```bash
# Desinstalar Node atual (varia por OS)
# Instalar Node 22.x do site oficial nodejs.org
```

**Com NVM (recomendado):**
```bash
nvm install 22
nvm use 22
node -v  # v22.x.x ✓
```

### Passo 3 — criar projeto
```bash
npx @angular/cli@19 new meu-projeto
# ou se Angular CLI esta instalado globalmente na v19:
ng new meu-projeto
```

## Cenario de erro tipico

```bash
$ ng serve
# Error: The Angular CLI requires a minimum Node.js version of...
# Node.js version v16.13.0 detected.
```

**Solucao:** instalar Node na versao compativel conforme tabela oficial.

## Consultar tabela oficial via terminal

```bash
# Abrir pagina de compatibilidade
open https://angular.dev/reference/versions
# Linux:
xdg-open https://angular.dev/reference/versions
```