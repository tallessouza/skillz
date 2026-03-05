# Code Examples: .gitignore para Projetos Node.js

## Exemplo 1: .gitignore minimo

```gitignore
node_modules
```

Isso e o minimo absoluto para qualquer projeto Node.js.

## Exemplo 2: .gitignore mais completo para projetos Node/TypeScript

```gitignore
node_modules
dist
build
.env
.env.local
*.log
```

## Exemplo 3: Fluxo completo do zero ao GitHub

```bash
# Criar projeto
mkdir minha-api
cd minha-api
npm init -y

# Instalar dependencias
npm install express
npm install -D typescript tsx @types/express

# Criar .gitignore ANTES de qualquer git init
echo "node_modules" > .gitignore

# Iniciar repositorio
git init

# Verificar que node_modules esta sendo ignorado
git status
# Deve mostrar .gitignore, package.json, package-lock.json
# NAO deve mostrar node_modules/

# Adicionar e comitar
git add .
git commit -m "feat: initial project setup"

# Conectar ao GitHub e push
git remote add origin https://github.com/user/minha-api.git
git push -u origin main
```

## Exemplo 4: Clonar e rodar projeto existente

```bash
# Clonar repositorio (vem sem node_modules)
git clone https://github.com/user/minha-api.git
cd minha-api

# Tentar rodar sem instalar — ERRO
npx tsx src/server.ts
# Error: Cannot find module 'express'

# Instalar dependencias (recria node_modules)
npm i

# Agora funciona
npx tsx src/server.ts
# Server running on port 3000
```

## Exemplo 5: Verificar tamanho de node_modules

```bash
# Linux/Mac
du -sh node_modules
# 38M    node_modules

# Ver quantos arquivos
find node_modules -type f | wc -l
# Pode ter milhares de arquivos
```

## Exemplo 6: Remover node_modules ja comitado

```bash
# Passo 1: Criar/atualizar .gitignore
echo "node_modules" >> .gitignore

# Passo 2: Remover do tracking (mantem arquivos locais)
git rm -r --cached node_modules

# Passo 3: Comitar
git add .
git commit -m "fix: remove node_modules from git tracking"

# Passo 4: Push
git push
```

## Exemplo 7: O papel de cada arquivo

```
projeto/
├── node_modules/       # Dependencias instaladas (IGNORAR no git)
├── package.json        # Lista de dependencias (COMITAR)
├── package-lock.json   # Versoes exatas (COMITAR)
├── .gitignore          # Regras de exclusao (COMITAR)
└── src/                # Codigo fonte (COMITAR)
```

### package.json — o que contem:
```json
{
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tsx": "^4.7.0"
  }
}
```

### .gitignore — o que contem:
```gitignore
node_modules
```

`npm i` le package.json + package-lock.json e recria node_modules identica.