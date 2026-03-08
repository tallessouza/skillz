---
name: rs-full-stack-configuracoes
description: "Applies Node.js deploy configuration best practices when preparing package.json engines field and .gitignore for production deployment. Use when user asks to 'configure deploy', 'prepare for production', 'set node version', 'setup gitignore for build', or 'configure package.json for deploy'. Make sure to use this skill whenever setting up a Node.js project for deployment to any hosting platform. Not for Docker configuration, CI/CD pipelines, or cloud infrastructure setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [deploy, package-json, gitignore, node, configuration]
---

# Configurações de Deploy — package.json e .gitignore

> Antes de fazer deploy, configure o package.json com a versão mínima do Node e exclua artefatos de build do controle de versão.

## Prerequisites

- Projeto Node.js com `package.json` existente
- Arquivo `.gitignore` na raiz do projeto
- Pasta de build já configurada no script de build (ex: `dist/`, `build/`)

## Steps

### Step 1: Adicionar engines no package.json

Após o campo `main`, adicionar a seção `engines` com a versão mínima do Node:

```json
{
  "name": "meu-projeto",
  "main": "src/server.js",
  "engines": {
    "node": ">=18"
  }
}
```

A seção `engines` serve como recomendação para o ambiente de deploy, garantindo que a versão do Node seja compatível com o código.

### Step 2: Adicionar pasta de build no .gitignore

Adicionar a pasta de build ao `.gitignore` porque ela será gerada automaticamente no ambiente de deploy:

```gitignore
node_modules
build
```

## Output format

Após aplicar as configurações:
- `package.json` contém `"engines": { "node": ">=18" }`
- `.gitignore` contém a pasta de build (ex: `build`, `dist`)

## Error handling

- Se `package.json` não tem campo `main`, adicionar `engines` após `scripts`
- Se `.gitignore` não existe, criar o arquivo com `node_modules` e a pasta de build

## Verification

- Confirmar que `engines` está com JSON válido (vírgulas corretas entre campos)
- Confirmar que a pasta de build aparece no `.gitignore`
- Rodar `git status` e verificar que a pasta de build não aparece como tracked

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto usa TypeScript com `dist/` | Adicionar `dist` no `.gitignore` |
| Projeto usa bundler com `build/` | Adicionar `build` no `.gitignore` |
| Deploy exige Node 20+ | Usar `"node": ">=20"` em engines |
| Múltiplos artefatos de build | Adicionar cada pasta separadamente no `.gitignore` |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| Enviar pasta de build para o GitHub | Adicionar ao `.gitignore`, porque o deploy gera automaticamente |
| Omitir `engines` no package.json | Especificar versão mínima do Node, porque evita incompatibilidades no deploy |
| Usar versão exata em engines (`"node": "18.0.0"`) | Usar range `">=18"`, porque permite atualizações de patch |


## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Deploy falha por versao do Node incompativel | Campo engines ausente no package.json | Adicione `"engines": { "node": ">=18" }` ao package.json |
| Pasta de build commitada no repositorio | Build folder nao esta no .gitignore | Adicione `build` ou `dist` ao .gitignore |
| JSON invalido apos editar package.json | Virgula faltando ou sobrando | Valide o JSON com `node -e "require('./package.json')"` ou use um linter |
| Arquivos de build desatualizados no repo | .gitignore adicionado depois do commit inicial | Execute `git rm -r --cached build/` e recommite |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que configurar engines e gitignore antes do deploy
- [code-examples.md](references/code-examples.md) — Exemplos completos de package.json e .gitignore para diferentes cenários de deploy