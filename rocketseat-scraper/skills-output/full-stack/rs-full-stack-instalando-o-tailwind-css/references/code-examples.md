# Code Examples: Instalando o Tailwind CSS com Vite

## Instalacao dos pacotes

```bash
npm install tailwindcss @tailwindcss/vite
```

## Configuracao do vite.config.ts

### Antes (sem Tailwind)

```typescript
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
})
```

### Depois (com Tailwind)

```typescript
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

## Configuracao do CSS

### index.css — com import do Tailwind

```css
@import "tailwindcss";

/* seus estilos customizados abaixo */
```

## Testando classes no JSX

### Tamanho de texto

```tsx
<h1 className="text-3xl">Texto grande</h1>
```

### Cor de texto — intensidades diferentes

```tsx
{/* Vermelho claro */}
<h1 className="text-red-300">Vermelho 300</h1>

{/* Vermelho escuro */}
<h1 className="text-red-700">Vermelho 700</h1>

{/* Azul medio */}
<h1 className="text-blue-500">Azul 500</h1>
```

### Combinando tamanho e cor

```tsx
<h1 className="text-3xl text-red-500">Grande e vermelho</h1>
```

## Variacao: projeto sem React (Vanilla)

```typescript
// vite.config.ts (sem plugin React)
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [tailwindcss()],
})
```

```html
<!-- index.html -->
<h1 class="text-3xl text-blue-500">Tailwind sem React</h1>
```

Note que em HTML puro, usa-se `class` normalmente. `className` e exclusivo do JSX.

## Escala completa de intensidades (exemplo com azul)

```tsx
<div className="space-y-2">
  <p className="text-blue-50">Blue 50 — quase branco</p>
  <p className="text-blue-100">Blue 100</p>
  <p className="text-blue-200">Blue 200</p>
  <p className="text-blue-300">Blue 300</p>
  <p className="text-blue-400">Blue 400</p>
  <p className="text-blue-500">Blue 500 — tom padrao</p>
  <p className="text-blue-600">Blue 600</p>
  <p className="text-blue-700">Blue 700</p>
  <p className="text-blue-800">Blue 800</p>
  <p className="text-blue-900">Blue 900</p>
  <p className="text-blue-950">Blue 950 — quase preto</p>
</div>
```