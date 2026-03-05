# Code Examples: Executando TypeScript com tsx

## Setup completo passo a passo

### 1. Iniciar projeto e instalar tsx

```bash
mkdir meu-projeto && cd meu-projeto
npm init -y
npm i tsx@4.16.2 -D
```

### 2. Criar arquivo TypeScript

```typescript
// src/server.ts
function soma(a: number, b: number): number {
  return a + b
}

console.log(`Resultado da soma: ${soma(2, 5)}`)
```

### 3. Configurar package.json

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/server.ts"
  },
  "devDependencies": {
    "tsx": "4.16.2"
  }
}
```

### 4. Executar

```bash
npm run dev
```

Output:
```
Resultado da soma: 7
```

### 5. Testar watch mode

Altere `soma(2, 5)` para `soma(2, 7)` e salve. O tsx reinicia automaticamente:

```
Resultado da soma: 9
```

## Variacoes do script dev

### Com arquivo de entrada diferente

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts"
  }
}
```

### Sem watch (execucao unica)

```json
{
  "scripts": {
    "start:dev": "tsx src/server.ts"
  }
}
```

### Combinado com dotenv

```json
{
  "scripts": {
    "dev": "tsx watch --env-file=.env src/server.ts"
  }
}
```

## Remocao de arquivos JS antigos

Se voce tinha um fluxo anterior com `tsc`:

```bash
# Antes (fluxo manual)
npx tsc src/server.ts   # gera src/server.js
node src/server.js

# Depois de instalar tsx, apague o .js
rm src/server.js

# Agora use apenas
npm run dev
```

## Estrutura final do projeto

```
meu-projeto/
├── node_modules/
├── src/
│   └── server.ts       # ← seu codigo TypeScript
├── package.json         # ← script dev configurado
├── package-lock.json
└── tsconfig.json        # ← opcional mas recomendado
```