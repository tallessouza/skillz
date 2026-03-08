# Code Examples: Atualizando Versão do React

## Verificando versão atual

```bash
# Via package.json
cat package.json | grep -E '"react"|"react-dom"'

# Via npm
npm list react react-dom
```

**Saída esperada (antes do upgrade):**
```
├── react@18.2.0
└── react-dom@18.2.0
```

## Upgrade com npm

```bash
# Step 1: Atualizar runtime
npm install react@19 react-dom@19

# Step 2: Atualizar tipagens (TypeScript)
npm install -D @types/react@19 @types/node@19

# Step 3: Sincronizar
npm install

# Step 4: Verificar
npm run dev
```

## Upgrade com yarn

```bash
# Step 1: Atualizar runtime
yarn add react@19 react-dom@19

# Step 2: Atualizar tipagens (TypeScript)
yarn add -D @types/react@19 @types/node@19

# Step 3: Verificar
yarn dev
```

## Upgrade com pnpm

```bash
# Step 1: Atualizar runtime
pnpm add react@19 react-dom@19

# Step 2: Atualizar tipagens (TypeScript)
pnpm add -D @types/react@19 @types/node@19

# Step 3: Verificar
pnpm dev
```

## package.json antes do upgrade

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/node": "^18.0.0"
  }
}
```

## package.json depois do upgrade

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/node": "^19.0.0"
  }
}
```

## Verificação pós-upgrade no navegador

```
1. Abrir http://localhost:5173 (ou porta do projeto)
2. Abrir DevTools (F12 ou Cmd+Opt+I)
3. Ir na aba Console
4. Confirmar: nenhum warning ou erro de versão
5. Navegar por algumas páginas para verificar estabilidade
```

## Troubleshooting: Conflito de peer dependencies

```bash
# Se npm install falha com ERESOLVE
npm install --legacy-peer-deps

# Ou investigue qual pacote conflita
npm explain react
```

## Troubleshooting: Tipagens incompatíveis

```bash
# Verificar versões instaladas
npm list @types/react @types/react-dom

# Forçar versão correta
npm install -D @types/react@19 @types/react-dom@19
```