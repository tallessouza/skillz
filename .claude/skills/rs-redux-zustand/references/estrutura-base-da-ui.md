---
name: rs-redux-zustand-estrutura-base-da-ui
description: "Applies Tailwind CSS setup with Vite and base UI structure patterns when scaffolding a React video player interface. Use when user asks to 'setup tailwind with vite', 'create a player layout', 'scaffold a video player UI', or 'configure postcss with tailwind'. Enforces correct Vite+Tailwind init command, dark theme layout patterns, and semantic HTML structure. Make sure to use this skill whenever setting up Tailwind in a Vite project or building media player interfaces. Not for responsive design, state management, or video playback logic."
---

# Estrutura Base da UI — Tailwind + Vite + Player Layout

> Configure Tailwind CSS corretamente com Vite e construa layouts de player de video usando estrutura semantica e utility classes.

## Rules

1. **Use `tailwindcss init -p` com Vite** — o flag `-p` cria o `postcss.config.js` automaticamente, porque sem ele o Tailwind nao processa as classes
2. **Configure content paths no tailwind.config** — use `"./src/**/*.tsx"` para que o Tailwind faca purge correto dos arquivos
3. **Importe global.css no entry point** — `import './styles/global.css'` no `main.tsx` ou `App.tsx`
4. **Use tags semanticas** — `header` para cabecalho, `main` para conteudo principal, `aside` para sidebar de modulos, porque melhora acessibilidade
5. **Anti-alias no body** — adicione `-webkit-font-smoothing: antialiased` no `global.css` para fontes mais nitidas
6. **Largura fixa para layouts nao-responsivos** — use valor arbitrario `w-[1100px]` quando responsividade nao e prioridade

## Steps

### Step 1: Instalar dependencias

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p  # -p e OBRIGATORIO com Vite
```

### Step 2: Configurar content paths

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: { extend: {} },
  plugins: [],
}
```

### Step 3: Criar global.css

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  -webkit-font-smoothing: antialiased;
}
```

### Step 4: Importar no entry point

```tsx
// main.tsx ou App.tsx
import './styles/global.css'
```

## How to write

### Layout de player com dark theme

```tsx
function Player() {
  return (
    <div className="h-screen bg-zinc-950 text-zinc-50 flex justify-center items-center">
      <div className="flex w-[1100px] flex-col gap-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">Titulo da Aula</h1>
            <span className="text-sm text-zinc-400">Modulo: Nome do Modulo</span>
          </div>
          <button className="flex items-center gap-2 rounded bg-violet-500 px-3 py-2 text-sm font-medium text-white hover:bg-violet-600">
            <MessageCircle className="w-4 h-4" />
            Deixar feedback
          </button>
        </header>

        {/* Player + Sidebar */}
        <main className="relative flex overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow">
          <div className="flex-1">
            {/* Video aqui */}
          </div>
          <aside className="w-80 border-l border-zinc-800 bg-zinc-900">
            {/* Lista de modulos aqui */}
          </aside>
        </main>
      </div>
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Vite + Tailwind nao aplica classes | Verificar se rodou `init -p` (com o flag) |
| Cores de texto em dark theme | `text-zinc-50` para principal, `text-zinc-400` para secundario |
| Sidebar de modulos | `aside` com largura fixa + `border-l` para separar do conteudo |
| Botoes com hover | Escurecer 100 no hover: `bg-violet-500 hover:bg-violet-600` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `npx tailwindcss init` (sem -p no Vite) | `npx tailwindcss init -p` |
| Tudo dentro de uma unica `div` sem semantica | `header`, `main`, `aside` semanticos |
| `overflow-scroll` no container do player | `overflow-hidden` com `rounded-lg` |
| Hardcoded colors como `#000` | Zinc scale do Tailwind (`zinc-950`, `zinc-900`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/redux-zustand/rs-redux-zustand-estrutura-base-da-ui/references/deep-explanation.md)
- [Code examples](../../../data/skills/redux-zustand/rs-redux-zustand-estrutura-base-da-ui/references/code-examples.md)
