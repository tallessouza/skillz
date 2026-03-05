# Code Examples: Valores Arbitrários no Tailwind

## Exemplo 1: Cor arbitrária (do transcript)

```html
<!-- Valor arbitrário com nome de cor CSS -->
<button class="bg-[blue]">Enviar</button>

<!-- Valor arbitrário com hexadecimal -->
<button class="bg-[#825760]">Enviar</button>

<!-- Correto: usando cor do tema -->
<button class="bg-sky-500 dark:bg-sky-400">Enviar</button>
```

## Exemplo 2: MaxWidth arbitrário (do transcript)

```html
<!-- Arbitrário -->
<div class="max-w-[700px]">
  Conteúdo principal
</div>

<!-- Correto: tema estendido -->
<div class="max-w-app">
  Conteúdo principal
</div>
```

### Configuração correspondente:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      maxWidth: {
        app: '700px',
      },
    },
  },
}
```

## Exemplo 3: Múltiplas extensões de tema

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      maxWidth: {
        app: '700px',
        content: '960px',
        narrow: '480px',
      },
      colors: {
        brand: {
          50: '#fdf2f4',
          500: '#825760',
          900: '#3d2830',
        },
      },
      spacing: {
        header: '72px',
        sidebar: '280px',
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
}
```

Uso:
```html
<div class="max-w-content">
  <aside class="w-sidebar">
    <div class="rounded-card bg-brand-50 p-4">
      Card com valores semânticos
    </div>
  </aside>
</div>
```

## Exemplo 4: Antes e depois completo

### Antes (cheio de valores arbitrários):
```html
<main class="max-w-[1200px] mx-auto px-[30px]">
  <header class="h-[72px] bg-[#1a1a2e] text-[#eee]">
    <h1 class="text-[24px] font-[600]">Dashboard</h1>
  </header>
  <section class="mt-[40px] grid grid-cols-[repeat(3,1fr)] gap-[24px]">
    <div class="rounded-[12px] bg-[#f5f5f5] p-[20px]">
      Card content
    </div>
  </section>
</main>
```

### Depois (tema estendido):
```html
<main class="max-w-content mx-auto px-8">
  <header class="h-header bg-surface-dark text-surface-light">
    <h1 class="text-2xl font-semibold">Dashboard</h1>
  </header>
  <section class="mt-10 grid grid-cols-3 gap-6">
    <div class="rounded-card bg-surface p-5">
      Card content
    </div>
  </section>
</main>
```