# Code Examples: Gerenciadores de Pacote

## Inicializando um projeto

```bash
# Cria package.json com valores padrao
npm init -y

# Cria package.json interativo (pergunta cada campo)
npm init
```

O `package.json` gerado:
```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## Instalando dependencias de producao

```bash
# Instala e adiciona em "dependencies"
npm install express
npm install dayjs
npm install react react-dom

# Versao especifica
npm install express@4.18.2

# A partir de um range
npm install express@^4.0.0
```

Resultado no `package.json`:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "dayjs": "^1.11.10",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

## Instalando dependencias de desenvolvimento

```bash
# Flag -D (ou --save-dev) coloca em "devDependencies"
npm install -D typescript
npm install -D jest
npm install -D eslint prettier
npm install -D @types/node @types/express
```

Resultado no `package.json`:
```json
{
  "devDependencies": {
    "typescript": "^5.3.3",
    "jest": "^29.7.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.4",
    "@types/node": "^20.11.5",
    "@types/express": "^4.17.21"
  }
}
```

## Removendo pacotes

```bash
# Remove e atualiza package.json
npm uninstall dayjs

# Remove dependencia de dev
npm uninstall -D jest
```

## Atualizando pacotes

```bash
# Atualiza todos dentro dos ranges permitidos
npm update

# Atualiza pacote especifico
npm update express

# Instala a versao mais recente (ignora range)
npm install express@latest

# Verifica quais pacotes estao desatualizados
npm outdated
```

Saida do `npm outdated`:
```
Package   Current  Wanted  Latest  Location
express   4.18.2   4.18.3  4.19.0  meu-projeto
dayjs     1.11.9   1.11.10 1.11.10 meu-projeto
```

## Instalando dependencias de um projeto existente

```bash
# Clonei o repo, preciso instalar tudo
npm install

# Instala APENAS producao (para deploy)
npm install --production

# Equivalente moderno
npm ci  # Clean install — usa lockfile estritamente
```

**`npm ci` vs `npm install`:**
- `npm ci` deleta `node_modules` e instala do zero a partir do lockfile
- Mais rapido e reproduzivel em CI/CD
- Falha se lockfile esta desatualizado em relacao ao package.json

## Executando scripts

```json
{
  "scripts": {
    "dev": "node --watch src/server.js",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/"
  }
}
```

```bash
npm run dev
npm run build
npm test        # "test" e "start" nao precisam de "run"
npm start       # atalho para npm run start
npm run lint
```

## Usando npx para executar sem instalar

```bash
# Executa pacote sem instalar globalmente
npx create-react-app meu-app
npx tsc --init
npx eslint --init
```

## Verificando seguranca

```bash
# Auditoria de vulnerabilidades
npm audit

# Corrigir automaticamente o que for possivel
npm audit fix

# Forcas atualizacoes major se necessario (cuidado)
npm audit fix --force
```

## .gitignore essencial

```gitignore
# Dependencias — NUNCA commitar
node_modules/

# Lockfile — SEMPRE commitar
# NAO adicione package-lock.json aqui
```

## Anatomia do node_modules

```
node_modules/
├── express/           # Pacote que voce instalou
│   ├── package.json   # Metadados do express
│   ├── index.js       # Entry point
│   └── lib/           # Codigo fonte
├── body-parser/       # Dependencia do express (transitiva)
├── cookie/            # Dependencia do express (transitiva)
└── ...                # Centenas de pastas (normal)
```

Voce nao edita nada em `node_modules/`. Se precisar modificar um pacote, use `patch-package` ou fork o repositorio.