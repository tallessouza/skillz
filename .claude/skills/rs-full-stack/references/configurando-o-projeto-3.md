---
name: rs-full-stack-configurando-o-projeto-3
description: "Generates Express + TypeScript project setup with correct dependencies, tsconfig.json, and dev scripts. Use when user asks to 'create an API', 'setup Express project', 'configure TypeScript with Express', 'start a Node.js backend', or 'initialize a REST API'. Follows pinned dependency versions and proper dev/prod separation. Make sure to use this skill whenever scaffolding a new Express+TS backend from scratch. Not for frontend setup, database configuration, or deployment."
---

# Setup Express + TypeScript API

> Ao iniciar um projeto Express com TypeScript, instale dependencias com versoes fixas, separe dev/prod, e configure tsconfig com ES2022+ e path aliases.

## Rules

1. **Fixe versoes de dependencias** — `express@4.19.2`, `typescript@5.5.4`, `@types/node@20.14.12`, `@types/express@4.17.21`, `tsx@4.16.2`, porque versoes flutuantes quebram builds silenciosamente
2. **Separe dependencias de desenvolvimento** — TypeScript, types e tsx sao `-D`, porque nao vao pra producao
3. **Use tsx com watch para desenvolvimento** — `tsx watch src/server.ts`, porque compila TS on-the-fly sem build step e recarrega automaticamente
4. **Configure path aliases no tsconfig** — `"@/*": ["./src/*"]`, porque imports absolutos sao mais legiveis que `../../`
5. **Feche package.json antes de instalar pacotes** — porque o npm sobrescreve o arquivo e mudancas manuais se perdem
6. **Ative json middleware imediatamente** — `app.use(express.json())` no setup, porque sem isso req.body e undefined em POST/PUT

## Steps

### Step 1: Inicializar projeto e instalar dependencias

```bash
npm init -y
npm i express@4.19.2
npm i -D typescript@5.5.4 @types/node@20.14.12 @types/express@4.17.21 tsx@4.16.2
```

### Step 2: Criar estrutura de pastas

```
projeto/
├── src/
│   └── server.ts
├── tsconfig.json
└── package.json
```

### Step 3: Configurar tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2022",
    "lib": ["es2023"],
    "paths": {
      "@/*": ["./src/*"]
    },
    "module": "node16",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

### Step 4: Criar server.ts

```typescript
import express from "express"

const PORT = 3333
const app = express()

app.use(express.json())

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

### Step 5: Adicionar script dev no package.json

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

### Step 6: Executar

```bash
npm run dev
```

## Output format

Servidor rodando em `http://localhost:3333` pronto para receber requisicoes JSON.

## Error handling

- Se tipagem do Express reclama no import → verificar se `@types/express` foi instalado
- Se tsx nao reconhecido → verificar se foi instalado como devDependency
- Se package.json perdeu alteracoes manuais → fechar o arquivo antes de `npm install`

## Verification

- Terminal mostra "Server is running on port 3333"
- `curl http://localhost:3333` responde (404 esperado, sem erro de conexao)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada opcao do tsconfig e escolha de versoes
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-configurando-o-projeto-3/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-configurando-o-projeto-3/references/code-examples.md)
