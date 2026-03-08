---
name: rs-full-stack-organizando-o-projeto-2024
description: "Applies React project cleanup workflow when scaffolding a new React/Vite project, removing boilerplate files, and preparing a clean structure. Use when user asks to 'clean up React project', 'organize project structure', 'remove boilerplate', 'start fresh React app', or 'prepare project for development'. Covers file removal, component simplification, export fixes, and index.html updates. Make sure to use this skill whenever setting up a new React project from a template. Not for adding features, styling, or configuring build tools."
---

# Organizando o Projeto React

> Ao iniciar um projeto React recem-criado, remova todo boilerplate antes de implementar qualquer funcionalidade.

## Prerequisites

- Projeto React criado com Vite (`npm create vite@latest`)
- Projeto executando com `npm run dev`

## Steps

### Step 1: Remover arquivos desnecessarios do src/

Apague arquivos de boilerplate que nao serao utilizados:

```bash
# Remover pasta de assets padrao
rm -rf src/assets

# Remover CSS especifico do App
rm src/App.css
```

### Step 2: Simplificar o componente App

Substitua todo o conteudo de `App.tsx` por um componente minimo:

```tsx
export function App() {
  return <h1>App</h1>
}
```

### Step 3: Limpar o CSS global

Mantenha `index.css` mas remova todo o conteudo padrao — deixe o arquivo vazio para receber estilos globais depois.

### Step 4: Ajustar imports no main.tsx

Remova imports de arquivos deletados e corrija o import do App:

```tsx
import { App } from './App'
import './index.css'
```

**Atencao ao tipo de export:** se o componente usa `export function App()` (named export), o import deve usar chaves `{ App }`. Se usasse `export default function App()`, o import seria sem chaves.

### Step 5: Limpar arquivos publicos

```bash
# Remover SVG padrao do Vite
rm public/vite.svg
```

### Step 6: Atualizar index.html

Altere o `<title>` para refletir o nome do projeto:

```html
<title>Nome do Projeto</title>
```

## Output format

Apos a limpeza, a estrutura deve ser:

```
src/
├── App.tsx          # Componente minimo com named export
├── index.css        # Vazio, pronto para estilos globais
├── main.tsx         # Import corrigido do App
└── vite-env.d.ts    # Mantido (tipos do Vite)
public/              # Vazio
index.html           # Title atualizado
```

## Error handling

- Se o App nao aparece na tela apos a limpeza, verifique o tipo de export — `export function App` requer `import { App }` com chaves no main.tsx
- Se houver erro de modulo nao encontrado, confirme que imports de arquivos deletados (App.css, assets) foram removidos

## Verification

- Tela exibe apenas o texto do h1 em fundo branco
- Console do navegador sem erros
- Nenhum import aponta para arquivo inexistente

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto recem-criado com template | Executar limpeza completa antes de qualquer feature |
| Quer manter CSS global | Manter index.css vazio, nao deletar |
| Named export vs default export | Preferir named export — mais explicito e refatoravel |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Comecar a codar sobre o boilerplate | Limpar tudo primeiro, depois implementar |
| Deletar index.css | Manter vazio para estilos globais futuros |
| Usar `export default` sem motivo | Usar `export function App` (named export) |
| Deixar imports de arquivos removidos | Remover todo import orfao imediatamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre named vs default exports e organizacao de projeto React
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo com variacoes de estrutura