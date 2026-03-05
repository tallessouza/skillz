# Code Examples: Cores e Estilos Globais — Electron + Tailwind

## Exemplo completo: tailwind.config.js com paleta Rotion

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        // fontes ja configuradas anteriormente
      },
      colors: {
        rotion: {
          50: '#f0f0f5',
          100: '#d9dae6',
          200: '#b3b5cc',
          300: '#8d90b3',
          400: '#676b99',
          500: '#414680',
          600: '#363a6b',
          700: '#2b2e56',
          800: '#202241',
          900: '#171823',
        },
      },
    },
  },
  plugins: [],
}
```

## Exemplo completo: App.tsx com wrapper

```tsx
export function App() {
  return (
    <div className="h-screen w-screen bg-rotion-900 text-rotion-100">
      {/* Todo o conteudo da aplicacao fica aqui dentro */}
      {/* O fundo escuro e o texto claro sao herdados */}
    </div>
  )
}
```

## Exemplo completo: main/index.ts com backgroundColor

```typescript
import { app, BrowserWindow } from 'electron'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#171823', // hex identico ao bg-rotion-900
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
    },
  })

  mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
}

app.whenReady().then(createWindow)
```

## Variacao: Tema claro

Se a aplicacao tivesse tema claro, o mesmo principio se aplica — sincronize as cores:

```typescript
// main
const mainWindow = new BrowserWindow({
  backgroundColor: '#f0f0f5', // bg-rotion-50
})
```

```tsx
// renderer
<div className="h-screen w-screen bg-rotion-50 text-rotion-900">
  {/* conteudo */}
</div>
```

## Foundation Color Generator — Fluxo no Figma

1. Instalar plugin "Foundation Color Generator" no Figma
2. Abrir o plugin em qualquer arquivo
3. Inserir cor base em RGB ou HEX
4. Selecionar perfil de nomenclatura (escolher o mais proximo do Tailwind)
5. Gerar → copiar valores hex para cada tom (50-900)
6. Colar no `tailwind.config.js` dentro de `theme.extend.colors`