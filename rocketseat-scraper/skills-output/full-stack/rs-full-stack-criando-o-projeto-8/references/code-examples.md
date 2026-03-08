# Code Examples: Criando Projeto React com Vite

## Comando basico (usado na aula)

```bash
# Navegar ate a pasta desejada
# Dica do instrutor: arraste a pasta para o terminal apos digitar "cd "
cd /caminho/da/pasta

# Criar projeto com Vite
npm create vite@latest
```

Fluxo interativo:
```
? Package name: » classroom
? Select a framework: » React  (usar setas para navegar)
? Select a variant: » TypeScript
```

## Comando nao-interativo (one-liner)

Para pular os prompts e criar diretamente:

```bash
npm create vite@latest classroom -- --template react-ts
```

## Variantes disponiveis para React

```bash
# React + TypeScript (recomendado na aula)
npm create vite@latest meu-projeto -- --template react-ts

# React + TypeScript + SWC (build mais rapido)
npm create vite@latest meu-projeto -- --template react-swc-ts

# React + JavaScript (sem tipagem)
npm create vite@latest meu-projeto -- --template react

# React + JavaScript + SWC
npm create vite@latest meu-projeto -- --template react-swc
```

## Apos criar o projeto

```bash
# Entrar na pasta do projeto
cd classroom

# Instalar dependencias (obrigatorio antes de rodar)
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Saida esperada:
```
  VITE v5.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## Estrutura gerada pelo Vite

```
classroom/
├── node_modules/        # (apos npm install)
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.css
│   ├── App.tsx          # Componente principal
│   ├── index.css
│   ├── main.tsx         # Entry point
│   └── vite-env.d.ts    # Tipos do Vite
├── .gitignore
├── eslint.config.js
├── index.html           # HTML root (Vite usa como entry)
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts       # Configuracao do Vite
```

## Usando com outros gerenciadores de pacotes

```bash
# Com yarn
yarn create vite classroom --template react-ts

# Com pnpm
pnpm create vite classroom --template react-ts

# Com bun
bun create vite classroom --template react-ts
```