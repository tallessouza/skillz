# Code Examples: Configurações de Deploy

## Exemplo 1: package.json com engines (da aula)

### Antes (sem engines)

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsup src",
    "start": "node build/server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "tsx": "^4.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Depois (com engines)

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "main": "src/server.js",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsup src",
    "start": "node build/server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "tsx": "^4.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  }
}
```

Note a vírgula após `"src/server.js"` e a posição de `engines` entre `main` e `scripts`.

## Exemplo 2: .gitignore completo para projeto Node.js com build

```gitignore
# Dependencies
node_modules

# Build output
build
dist

# Environment variables
.env
.env.local

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/settings.json
.idea
```

## Exemplo 3: Variações de engines para diferentes cenários

### API com Node 18+ (cenário da aula)

```json
"engines": {
  "node": ">=18"
}
```

### Projeto que usa Node 20 features (como import.meta.dirname)

```json
"engines": {
  "node": ">=20"
}
```

### Projeto com restrição de npm também

```json
"engines": {
  "node": ">=18",
  "npm": ">=9"
}
```

### Projeto que usa pnpm

```json
"engines": {
  "node": ">=18",
  "pnpm": ">=8"
}
```

## Exemplo 4: .gitignore — o que incluir vs o que não incluir

### Incluir no .gitignore (artefatos gerados)

```gitignore
# Gerados por npm run build
build/
dist/
out/

# Gerados por npm install
node_modules/

# Gerados por TypeScript
*.js.map
*.d.ts
```

### NÃO incluir no .gitignore (código fonte necessário)

```
# Estes devem ir para o GitHub:
src/           # código fonte
package.json   # dependências e scripts
tsconfig.json  # configuração TypeScript
.gitignore     # o próprio gitignore
README.md      # documentação
```

## Exemplo 5: Fluxo completo de deploy com estas configurações

```bash
# 1. Desenvolvedor faz push (pasta build NÃO vai junto)
git add .
git commit -m "feat: prepare for deploy"
git push origin main

# 2. Plataforma de deploy recebe o código e executa:
npm install          # instala dependências
npm run build        # gera a pasta build/ no servidor
npm start            # executa node build/server.js

# 3. A plataforma lê engines e usa Node >= 18
# Se a plataforma só tem Node 16, ela avisa sobre incompatibilidade
```