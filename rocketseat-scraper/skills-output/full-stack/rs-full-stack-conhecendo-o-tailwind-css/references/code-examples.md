# Code Examples: Conhecendo o Tailwind CSS

## Comparação: CSS Tradicional vs Tailwind

Esta aula é conceitual e não contém código executado pelo instrutor, mas os conceitos podem ser ilustrados com exemplos comparativos baseados no que foi explicado.

### Abordagem tradicional (como nos projetos anteriores do curso)

**Arquivo HTML:**
```html
<div class="card">
  <h2 class="card-title">Título</h2>
  <p class="card-text">Conteúdo do card</p>
  <button class="card-button">Ação</button>
</div>
```

**Arquivo CSS separado (criado do zero):**
```css
.card {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1a1a1a;
}

.card-text {
  font-size: 0.875rem;
  color: #666;
  margin-top: 8px;
}

.card-button {
  background-color: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
```

### Mesma interface com Tailwind (classes utilitárias prontas)

```html
<div class="bg-white rounded-lg p-4 shadow">
  <h2 class="text-xl font-bold text-gray-900">Título</h2>
  <p class="text-sm text-gray-500 mt-2">Conteúdo do card</p>
  <button class="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Ação</button>
</div>
```

**Nenhum arquivo CSS separado necessário** — este é o ponto central que o instrutor enfatiza.

### Mapeamento de classes utilitárias

Cada classe Tailwind mapeia para uma propriedade CSS:

| Classe Tailwind | Propriedade CSS equivalente |
|----------------|---------------------------|
| `bg-white` | `background-color: white` |
| `rounded-lg` | `border-radius: 0.5rem` |
| `p-4` | `padding: 1rem` |
| `shadow` | `box-shadow: 0 1px 3px...` |
| `text-xl` | `font-size: 1.25rem` |
| `font-bold` | `font-weight: 700` |
| `text-gray-900` | `color: #111827` |
| `text-sm` | `font-size: 0.875rem` |
| `mt-2` | `margin-top: 0.5rem` |
| `bg-blue-500` | `background-color: #3b82f6` |
| `px-4` | `padding-left/right: 1rem` |
| `py-2` | `padding-top/bottom: 0.5rem` |

### Recursos mencionados pelo instrutor na documentação

**Cores (paleta pré-definida):**
```html
<!-- Tailwind oferece escalas de cores com variações -->
<div class="bg-blue-100">Azul claro</div>
<div class="bg-blue-500">Azul médio</div>
<div class="bg-blue-900">Azul escuro</div>

<div class="text-red-500">Texto vermelho</div>
<div class="text-green-700">Texto verde escuro</div>
```

**Font sizes (tamanhos de fonte padronizados):**
```html
<p class="text-xs">Extra small (0.75rem)</p>
<p class="text-sm">Small (0.875rem)</p>
<p class="text-base">Base (1rem)</p>
<p class="text-lg">Large (1.125rem)</p>
<p class="text-xl">Extra large (1.25rem)</p>
<p class="text-2xl">2XL (1.5rem)</p>
```

**Flexbox (layout):**
```html
<div class="flex items-center justify-between gap-4">
  <span>Item 1</span>
  <span>Item 2</span>
  <span>Item 3</span>
</div>
```

**Responsividade (breakpoints prontos):**
```html
<!-- Coluna em mobile, linha em desktop -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/2">Coluna 1</div>
  <div class="w-full md:w-1/2">Coluna 2</div>
</div>
```