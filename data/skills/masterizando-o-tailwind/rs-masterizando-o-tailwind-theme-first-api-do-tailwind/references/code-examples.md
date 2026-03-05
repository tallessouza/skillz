# Code Examples: Theme First API do Tailwind

## Tabela de conversao de espacamento

### Regra: valor × 4 = pixels

```
Classe    | Pixels  | Rem
----------|---------|--------
p-0.5     | 2px     | 0.125rem
p-1       | 4px     | 0.25rem
p-1.5     | 6px     | 0.375rem
p-2       | 8px     | 0.5rem
p-3       | 12px    | 0.75rem
p-4       | 16px    | 1rem
p-5       | 20px    | 1.25rem
p-6       | 24px    | 1.5rem
p-8       | 32px    | 2rem
p-10      | 40px    | 2.5rem
p-12      | 48px    | 3rem
p-16      | 64px    | 4rem
p-20      | 80px    | 5rem
p-24      | 96px    | 6rem
```

## Escala de cores — uso pratico

```html
<!-- Feedback de estado -->
<span class="text-red-500">Erro ao salvar</span>
<span class="text-emerald-500">Salvo com sucesso</span>
<span class="text-amber-500">Atencao: campo obrigatorio</span>

<!-- Botoes com hover -->
<button class="bg-blue-500 hover:bg-blue-600 text-white">Confirmar</button>
<button class="bg-red-500 hover:bg-red-600 text-white">Deletar</button>
<button class="bg-zinc-200 hover:bg-zinc-300 text-zinc-800">Cancelar</button>

<!-- Background escuro com texto claro -->
<div class="bg-zinc-900 text-zinc-100">
  <h1 class="text-zinc-50">Titulo</h1>
  <p class="text-zinc-400">Texto secundario</p>
</div>
```

## Escala de tipografia — uso pratico

```html
<!-- Hierarquia de titulos -->
<h1 class="text-4xl font-bold">Pagina principal</h1>
<h2 class="text-2xl font-semibold">Secao</h2>
<h3 class="text-xl font-medium">Subsecao</h3>
<p class="text-base">Corpo do texto</p>
<small class="text-sm text-zinc-500">Nota de rodape</small>
<span class="text-xs text-zinc-400">Label pequeno</span>
```

## Conversao Figma → Tailwind (exemplos reais)

```
Figma diz     | Calculo        | Classe Tailwind
--------------|----------------|------------------
padding: 8px  | 8 ÷ 4 = 2     | p-2
margin: 12px  | 12 ÷ 4 = 3    | m-3
gap: 16px     | 16 ÷ 4 = 4    | gap-4
width: 40px   | 40 ÷ 4 = 10   | w-10
height: 48px  | 48 ÷ 4 = 12   | h-12
padding: 24px | 24 ÷ 4 = 6    | p-6
margin: 32px  | 32 ÷ 4 = 8    | m-8
```

## Font families padrao

```html
<!-- Sans (padrao para UI) -->
<p class="font-sans">Texto com fonte sem serifa</p>

<!-- Serif (conteudo editorial) -->
<p class="font-serif">Texto com fonte serifada</p>

<!-- Mono (codigo) -->
<code class="font-mono">const x = 42</code>
```

## Aplicando a escala de espacamento (multiplos de 2/4/8)

```html
<!-- Lista com espacamento consistente -->
<ul class="space-y-2">
  <li class="p-4 bg-zinc-100 rounded">Item 1</li>
  <li class="p-4 bg-zinc-100 rounded">Item 2</li>
  <li class="p-4 bg-zinc-100 rounded">Item 3</li>
</ul>

<!-- Card com espacamentos na escala -->
<div class="p-6 m-4 space-y-4 bg-white rounded-lg shadow">
  <h2 class="text-xl font-semibold">Titulo do card</h2>
  <p class="text-base text-zinc-600">Descricao do card</p>
  <button class="px-4 py-2 bg-blue-500 text-white rounded">Acao</button>
</div>
```

## Customizando o tema (quando tem designer)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Adicione cores do seu design system
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        // Adicione fontes customizadas
        heading: ['Inter', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
    },
  },
}
```

```html
<!-- Usando cores e fontes customizadas -->
<h1 class="font-heading text-brand-900">Minha App</h1>
<p class="font-body text-brand-600">Subtitulo com cor da marca</p>
```