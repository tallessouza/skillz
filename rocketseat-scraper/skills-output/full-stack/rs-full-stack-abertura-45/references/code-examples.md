# Code Examples: Tailwind CSS — Introdução e Proposta de Valor

## Comparação: CSS tradicional vs Tailwind utility-first

### CSS Tradicional

```html
<!-- HTML -->
<div class="card">
  <h2 class="card-title">Título</h2>
  <p class="card-description">Descrição do card</p>
  <button class="card-button">Ação</button>
</div>
```

```css
/* styles.css */
.card {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.card-description {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 16px;
}

.card-button {
  background-color: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
```

### Com Tailwind (utility-first)

```html
<div class="bg-white rounded-lg p-6 shadow-md">
  <h2 class="text-xl font-bold text-gray-900 mb-2">Título</h2>
  <p class="text-sm text-gray-500 mb-4">Descrição do card</p>
  <button class="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">
    Ação
  </button>
</div>
```

Sem arquivo CSS separado. Todo o estilo está no markup.

## Customização do tema

### Exemplo de configuração personalizada

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cores do projeto
        brand: {
          100: '#e0f2fe',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
      },
      fontSize: {
        // Tamanhos customizados
        'heading': '2rem',
        'body': '1rem',
      },
      spacing: {
        // Espaçamentos do design system
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
```

### Usando cores customizadas

```html
<!-- Após configurar o tema, as classes ficam disponíveis -->
<div class="bg-brand-100 text-brand-900 p-6">
  <h1 class="text-heading font-bold">Título do projeto</h1>
  <p class="text-body mt-4">Conteúdo com cores e tamanhos do design system.</p>
</div>
```

O tema padrão do Tailwind é **estendido** (não substituído), então todas as classes originais continuam disponíveis junto com as customizadas.