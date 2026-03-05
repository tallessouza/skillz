# Code Examples: Seletores e Estados no Tailwind

## Exemplo 1: Tracinho decorativo com before

### Evolucao passo a passo (como demonstrado na aula)

```html
<!-- Passo 1: Apenas before com width — nada aparece -->
<h1>
  <span class="before:w-1">Hello World</span>
</h1>

<!-- Passo 2: Adicionando height — ainda nada (display inline) -->
<h1>
  <span class="before:w-1 before:h-4">Hello World</span>
</h1>

<!-- Passo 3: Adicionando background — aparece no DOM mas invisivel -->
<h1>
  <span class="before:w-1 before:h-4 before:bg-sky-500">Hello World</span>
</h1>

<!-- Passo 4: Adicionando display flex — APARECE! Mas layout errado -->
<h1>
  <span class="before:flex before:w-1 before:h-4 before:bg-sky-500">Hello World</span>
</h1>

<!-- Passo 5: Flex no h1 + items-center + gap — layout correto -->
<h1 class="flex items-center gap-3 before:block before:w-0.5 before:h-8 before:bg-sky-500">
  Hello World
</h1>
```

### CSS equivalente gerado

```css
h1::before {
  content: "";
  display: block;
  width: 2px;      /* w-0.5 */
  height: 32px;    /* h-8 */
  background-color: rgb(14 165 233); /* bg-sky-500 */
}

h1 {
  display: flex;
  align-items: center;
  gap: 12px;       /* gap-3 */
}
```

## Exemplo 2: Botao com estados

### Construcao incremental

```html
<!-- Passo 1: Cor de fundo -->
<button class="bg-sky-500">Sign in</button>

<!-- Passo 2: Padding uniforme -->
<button class="bg-sky-500 p-2">Sign in</button>

<!-- Passo 3: Padding diferenciado por eixo -->
<button class="bg-sky-500 px-4 py-2">Sign in</button>

<!-- Passo 4: Bordas arredondadas -->
<button class="bg-sky-500 px-4 py-2 rounded-md">Sign in</button>

<!-- Passo 5: Peso da fonte (testando bold → semibold → medium) -->
<button class="bg-sky-500 px-4 py-2 rounded-md font-medium">Sign in</button>

<!-- Passo 6: Margin-top para espaçamento -->
<button class="bg-sky-500 px-4 py-2 rounded-md font-medium mt-4">Sign in</button>

<!-- Passo 7: Hover (primeira versao — sem guard) -->
<button class="bg-sky-500 px-4 py-2 rounded-md font-medium mt-4
               hover:bg-sky-600">
  Sign in
</button>

<!-- Passo 8: Disabled state -->
<button class="bg-sky-500 px-4 py-2 rounded-md font-medium mt-4
               hover:bg-sky-600
               disabled:opacity-60"
        disabled>
  Sign in
</button>
<!-- BUG: hover ainda funciona quando disabled! -->

<!-- Passo 9: enabled:hover guard -->
<button class="bg-sky-500 px-4 py-2 rounded-md font-medium mt-4
               enabled:hover:bg-sky-600
               disabled:opacity-60"
        disabled>
  Sign in
</button>

<!-- Passo 10: Cursor not-allowed (versao final) -->
<button class="bg-sky-500 px-4 py-2 rounded-md font-medium mt-4
               enabled:hover:bg-sky-600
               disabled:opacity-60 disabled:cursor-not-allowed"
        disabled>
  Sign in
</button>
```

## Exemplo 3: Variacoes de rounded

```html
<!-- Comparacao visual dos valores -->
<button class="rounded-sm ...">2px</button>   <!-- rounded-sm -->
<button class="rounded ...">4px</button>       <!-- rounded (padrao) -->
<button class="rounded-md ...">6px</button>    <!-- rounded-md -->
<button class="rounded-lg ...">8px</button>    <!-- rounded-lg -->
<button class="rounded-xl ...">12px</button>   <!-- rounded-xl -->
<button class="rounded-2xl ...">16px</button>  <!-- rounded-2xl -->
<button class="rounded-3xl ...">24px</button>  <!-- rounded-3xl -->
<button class="rounded-full ...">9999px</button> <!-- rounded-full -->
```

## Exemplo 4: Outros pseudo-seletores (referencia)

```html
<!-- Placeholder estilizado -->
<input class="placeholder:text-gray-400 placeholder:italic"
       placeholder="Digite seu email" />

<!-- Primeiro e ultimo item -->
<ul>
  <li class="first:pt-0 last:pb-0 py-2">Item</li>
</ul>

<!-- Texto selecionado -->
<p class="selection:bg-sky-200 selection:text-sky-900">
  Selecione este texto para ver o efeito
</p>

<!-- First letter e first line -->
<p class="first-letter:text-4xl first-letter:font-bold first-line:text-sky-500">
  Paragrafo com primeira letra estilizada e primeira linha colorida.
</p>
```