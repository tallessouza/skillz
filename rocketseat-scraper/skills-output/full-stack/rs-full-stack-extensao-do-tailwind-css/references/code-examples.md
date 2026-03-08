# Code Examples: Extensão do Tailwind CSS — IntelliSense

## Exemplo 1: Autocomplete de cores

Cenário: mudar a cor de um texto.

```html
<!-- Digitar text- e pressionar Ctrl+Space -->
<p class="text-">
```

Sugestões que aparecem:
```
text-red-50      🟥 (muito claro)
text-red-100     🟥
text-red-200     🟥
...
text-red-800     🟥 (escuro)
text-red-900     🟥 (muito escuro)
text-blue-50     🟦
text-blue-100    🟦
...
text-green-500   🟩
```

Resultado após selecionar `text-red-800`:
```html
<p class="text-red-800">Hello World</p>
```

## Exemplo 2: Autocomplete de font-weight

```html
<!-- Digitar font- e ver sugestões -->
<p class="font-">
```

Sugestões:
```
font-thin        → font-weight: 100
font-light       → font-weight: 300
font-normal      → font-weight: 400
font-medium      → font-weight: 500
font-semibold    → font-weight: 600
font-bold        → font-weight: 700
font-extrabold   → font-weight: 800
font-black       → font-weight: 900
```

Resultado:
```html
<p class="text-red-800 font-bold">Hello World</p>
```

## Exemplo 3: Autocomplete de tamanhos de texto com informação rem/px

```html
<!-- Digitar text- e filtrar por tamanhos -->
<p class="text-">
```

Sugestões com informação de unidade:
```
text-xs    → font-size: 0.75rem  (12px)
text-sm    → font-size: 0.875rem (14px)
text-base  → font-size: 1rem     (16px)
text-lg    → font-size: 1.125rem (18px)
text-xl    → font-size: 1.25rem  (20px)
text-2xl   → font-size: 1.5rem   (24px)
text-3xl   → font-size: 1.875rem (30px)
```

Resultado com `text-sm`:
```html
<p class="text-red-800 font-bold text-sm">Hello World</p>
<!-- Texto fica menor: 14px -->
```

Resultado com `text-2xl`:
```html
<p class="text-red-800 font-bold text-2xl">Hello World</p>
<!-- Texto fica maior: 24px (1.5rem) -->
```

## Exemplo 4: Fluxo completo de estilização com IntelliSense

Antes (sem extensão — precisa consultar docs):
```html
<!-- Quais classes usar? Preciso ir na documentação... -->
<p class="">Hello World</p>
```

Depois (com extensão — autocomplete guia):
```html
<!-- 1. Digitar text- → escolher cor -->
<!-- 2. Digitar font- → escolher peso -->
<!-- 3. Digitar text- → escolher tamanho -->
<p class="text-red-800 font-bold text-2xl">Hello World</p>
```

## Exemplo 5: Múltiplas classes (o "className grande")

O padrão real de uso do Tailwind com muitas classes utilitárias:

```html
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
  <h2 class="text-xl font-semibold text-gray-800">Título</h2>
  <p class="text-sm text-gray-500 mt-1">Descrição do item</p>
  <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm">
    Ação
  </button>
</div>
```

Pode parecer "grande" no início, mas cada classe é descoberta rapidamente via IntelliSense, e o resultado é previsível sem sair do editor.