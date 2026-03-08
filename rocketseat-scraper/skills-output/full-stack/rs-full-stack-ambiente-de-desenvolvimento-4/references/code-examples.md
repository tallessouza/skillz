# Code Examples: Ambiente de Desenvolvimento React com Vite

## Verificacao do ambiente

### Verificar Node.js e NPM

```bash
# Verificar versao do Node
node --version
# Exemplo de saida: v20.11.0

# Verificar versao do NPM
npm --version
# Exemplo de saida: 10.2.4
```

### Se Node nao esta instalado

```bash
# No Ubuntu/WSL
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# No macOS com Homebrew
brew install node

# Ou baixar diretamente de nodejs.org (versao LTS)
```

## Criando projeto React com Vite

### Comando interativo (recomendado pelo instrutor)

```bash
npm create vite@latest
```

O wizard pergunta:
1. Nome do projeto
2. Framework (selecionar React)
3. Variante (JavaScript ou TypeScript)

### Comando direto (sem wizard)

```bash
# React com JavaScript
npm create vite@latest meu-projeto -- --template react

# React com TypeScript
npm create vite@latest meu-projeto -- --template react-ts
```

### Com outros gerenciadores

```bash
# Yarn
yarn create vite meu-projeto --template react

# PNPM
pnpm create vite meu-projeto --template react

# Bun
bun create vite meu-projeto --template react
```

## Organizacao de pastas

### Estrutura recomendada pelo instrutor

```bash
# Criar pasta de organizacao
mkdir -p aulas/react
cd aulas/react

# Criar projeto dentro da pasta organizada
npm create vite@latest meu-primeiro-projeto -- --template react
```

### Estrutura resultante

```
aulas/
└── react/
    └── meu-primeiro-projeto/
        ├── node_modules/
        ├── public/
        ├── src/
        │   ├── App.css
        │   ├── App.jsx
        │   ├── index.css
        │   └── main.jsx
        ├── index.html
        ├── package.json
        └── vite.config.js
```

## Iniciando o projeto

```bash
# Entrar no diretorio do projeto
cd meu-primeiro-projeto

# Instalar dependencias
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Saida esperada:

```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## Scripts disponiveis no package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

| Script | Comando | Funcao |
|--------|---------|--------|
| dev | `npm run dev` | Inicia servidor de desenvolvimento com HMR |
| build | `npm run build` | Gera build de producao na pasta `dist/` |
| preview | `npm run preview` | Serve o build de producao localmente |