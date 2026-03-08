---
name: rs-next-js-tailwind-content-paths
description: "Enforces Tailwind CSS content path configuration when restructuring project folders in Next.js. Use when user asks to 'move components', 'create new folder', 'refactor project structure', 'reorganize files', or reports 'styles not working after refactor'. Ensures tailwind.config content array includes all directories containing Tailwind classes. Make sure to use this skill whenever project folders are added, renamed, or reorganized. Not for Tailwind theme customization, plugin setup, or CSS-in-JS configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: tailwind-configuration
  tags: [tailwind, content-paths, project-structure, next-js, tree-shaking, purge]
---

# Tailwind Content Paths

> Ao criar ou renomear pastas no projeto, atualize imediatamente o array `content` do `tailwind.config` para incluir o novo caminho.

## Rules

1. **Sempre mapeie pastas novas no Tailwind** — adicione em `tailwind.config.js/ts` no array `content`, porque o Tailwind faz tree-shaking baseado nesses paths e classes em pastas nao mapeadas sao silenciosamente removidas do CSS final
2. **Use o mesmo padrao glob das pastas existentes** — copie o formato `./src/{pasta}/**/*.{js,ts,jsx,tsx,mdx}` ja presente no config, porque consistencia evita bugs sutis de matching
3. **Verifique o content apos qualquer reestruturacao** — mover arquivos entre pastas pode quebrar estilos sem erro no console, porque o Tailwind nao avisa quando classes sao purgadas

## How to write

### Adicionando pasta nova ao content

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/templates/**/*.{js,ts,jsx,tsx,mdx}', // Nova pasta adicionada
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ...
}
```

## Example

**Before (estilos quebrados apos refatoracao):**
```javascript
// tailwind.config.js — pasta templates NAO mapeada
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
// Resultado: landing page em src/templates/ perde TODOS os estilos Tailwind
```

**After (com skill aplicada):**
```javascript
// tailwind.config.js — todas as pastas mapeadas
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/templates/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
// Resultado: estilos funcionam imediatamente apos salvar
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Criou pasta nova dentro de `src/` | Adicionar ao `content` do Tailwind |
| Moveu componentes para pasta diferente | Verificar se pasta destino esta no `content` |
| Estilos sumiram sem erro no console | Primeiro lugar para checar: `tailwind.config` content |
| Renomeou pasta existente | Atualizar o nome no `content` |
| Usa monorepo com pacotes separados | Cada pacote com classes Tailwind precisa estar no `content` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar pasta e esquecer do Tailwind | Adicionar ao `content` imediatamente |
| Debugar CSS achando que e problema de classe | Checar `tailwind.config` content primeiro |
| Usar `content: ['./src/**/*.{js,ts,jsx,tsx}']` generico demais | Listar pastas explicitamente para clareza e performance |
| Ignorar extensoes `.mdx` no glob | Incluir todas as extensoes que podem conter classes Tailwind |

## Troubleshooting

### Estilos Tailwind nao aplicam
**Symptom:** Classes Tailwind no JSX nao geram CSS correspondente
**Cause:** Arquivo/pasta nao esta mapeado no array `content` do tailwind.config
**Fix:** Adicionar o path da pasta no `content` do tailwind.config: `'./src/{nova-pasta}/**/*.{js,ts,jsx,tsx}'`. Reiniciar o servidor de desenvolvimento

### Fontes customizadas nao carregam
**Symptom:** Fonte do Google Fonts/local nao aparece, fallback e usado
**Cause:** Configuracao incorreta do next/font ou CSS variable nao aplicada
**Fix:** Usar `next/font/google` ou `next/font/local` e aplicar a className no elemento raiz do layout. Verificar que a variavel CSS esta sendo referenciada no Tailwind config

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-adicionando-a-nova-pasta-no-tailwind/references/deep-explanation.md) — O Tailwind CSS usa um processo chamado **purging** (ou tree-shaking) para remover classes CSS nao ut
- [code-examples.md](../../../data/skills/next-js/rs-next-js-adicionando-a-nova-pasta-no-tailwind/references/code-examples.md) — // tailwind.config.js — config padrao do Next.js
