---
name: rs-full-stack-build-da-aplicacao
description: "Applies TypeScript-to-JavaScript build workflow when preparing a Node.js application for production deployment. Use when user asks to 'build the app', 'prepare for deploy', 'convert TypeScript to JavaScript', 'create a production build', or 'configure tsup'. Covers tsup installation, package.json build script, output directory customization, and dist/build folder structure. Make sure to use this skill whenever setting up a build pipeline for a TypeScript Node.js project. Not for frontend bundling with Webpack/Vite, Docker image builds, or CI/CD pipeline configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: tooling
  tags: [typescript, build, tsup, production, node-js, deployment]
---

# Build da Aplicação — TypeScript para JavaScript

> Converta o projeto TypeScript para JavaScript puro antes do deploy, porque TypeScript serve apenas para desenvolvimento — produção roda JavaScript.

## Rules

1. **Instale tsup como dependência de desenvolvimento** — `npm i tsup -D`, porque a build é uma ferramenta de desenvolvimento, não uma dependência de produção
2. **Aponte o build para a pasta src** — `tsup src`, porque todo código-fonte fica em `src/` e o tsup precisa saber o entry point
3. **Defina o script build no package.json** — padronize a execução com `npm run build`, porque qualquer desenvolvedor ou pipeline CI espera esse comando
4. **Customize o diretório de saída quando necessário** — use `--out-dir build` para nomear a pasta de saída, porque o padrão `dist` pode não seguir a convenção do projeto
5. **Nunca inclua a pasta de build no controle de versão** — adicione `dist/` ou `build/` ao `.gitignore`, porque artefatos de build são gerados, não versionados

## Prerequisites

- Node.js instalado
- Projeto TypeScript com código-fonte em `src/`
- `package.json` existente com scripts configurados

## Steps

### Step 1: Instalar tsup

```bash
npm i tsup -D
```

### Step 2: Adicionar script de build no package.json

```jsonc
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsup src"
  }
}
```

### Step 3: Executar o build

```bash
npm run build
```

Gera a pasta `dist/` com todos os arquivos `.js` convertidos.

### Step 4 (opcional): Customizar nome da pasta de saída

```jsonc
{
  "scripts": {
    "build": "tsup src --out-dir build"
  }
}
```

## Output format

```
build/          # ou dist/ (padrão)
├── app.js
├── server.js
├── controllers/
│   └── users-controller.js
├── middlewares/
│   └── ...
└── prisma/
    └── ...
```

Todos os arquivos `.ts` são convertidos para `.js` puro, incluindo código gerado a partir das tipagens utilizadas.

## Error handling

- Se `tsup` não for encontrado, verificar se foi instalado como devDependency: `npm ls tsup`
- Se a pasta de saída não aparecer, verificar se o caminho `src` está correto no script
- Se houver erros de compilação, corrigir os erros TypeScript antes de rodar o build

## Verification

- Confirmar que a pasta de saída contém apenas arquivos `.js` (não `.ts`)
- Verificar que a estrutura de pastas espelha a estrutura do `src/`
- Testar execução com `node build/server.js` ou `node dist/server.js`

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto usa `src/` como entry point | `tsup src` |
| Precisa de nome customizado para output | Adicionar `--out-dir <nome>` |
| Pipeline CI precisa do build | Garantir que `npm run build` existe no `scripts` |
| Pasta de build aparece no git | Adicionar ao `.gitignore` |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `tsc` sem configuração para build de produção | `tsup src` — mais simples e otimizado |
| Instalar tsup como dependência de produção | `npm i tsup -D` — é ferramenta de desenvolvimento |
| Versionar a pasta `dist/` ou `build/` | Adicionar ao `.gitignore` |
| Rodar TypeScript diretamente em produção | Converter para JS com build antes do deploy |


## Troubleshooting

| Problema | Solução |
|----------|---------|
| **tsup command not found** | Verify it was installed as a devDependency: `npm ls tsup`. If missing, run `npm i tsup -D`. |
| **Build output folder is empty** | Check that the entry point path is correct in the script — `tsup src` expects a `src/` directory with TypeScript files. |
| **Runtime errors after build** | Test the built output with `node dist/server.js` — TypeScript-only constructs like `enum` may need tsup configuration adjustments. |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que TypeScript não vai para produção e como o tsup funciona
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações