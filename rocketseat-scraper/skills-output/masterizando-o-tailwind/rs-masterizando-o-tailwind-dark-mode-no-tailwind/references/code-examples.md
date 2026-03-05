# Code Examples: Dark Mode no Tailwind

## Exemplo completo da aula

### Estrutura HTML com light + dark mode

```html
<div class="flex flex-col items-center text-center bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
  <div class="max-w-2xl">
    <h1 class="text-5xl">
      Unleash the power of your data
    </h1>

    <p class="mt-4 text-slate-600 dark:text-slate-400">
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </p>

    <button class="bg-sky-500 text-white dark:bg-sky-400 dark:text-sky-950">
      Sign In
    </button>
  </div>
</div>
```

## Pares de cores comuns para light/dark

### Fundos

```html
<!-- Fundo principal -->
<div class="bg-white dark:bg-slate-900">

<!-- Fundo secundario (cards, sidebars) -->
<div class="bg-slate-50 dark:bg-slate-800">

<!-- Fundo elevado (modals, dropdowns) -->
<div class="bg-white dark:bg-slate-700">
```

### Textos

```html
<!-- Texto primario -->
<h1 class="text-slate-900 dark:text-slate-100">

<!-- Texto secundario -->
<p class="text-slate-600 dark:text-slate-400">

<!-- Texto terciario (placeholders, hints) -->
<span class="text-slate-400 dark:text-slate-500">
```

### Bordas

```html
<!-- Borda padrao -->
<div class="border border-slate-200 dark:border-slate-700">

<!-- Borda de input -->
<input class="border border-slate-300 dark:border-slate-600">
```

## Variacao: Card component com dark mode

```html
<div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm
            dark:border-slate-700 dark:bg-slate-800">
  <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
    Card Title
  </h2>
  <p class="mt-2 text-slate-600 dark:text-slate-400">
    Card description text here.
  </p>
  <button class="mt-4 rounded bg-sky-500 px-4 py-2 text-white
                 dark:bg-sky-400 dark:text-sky-950">
    Action
  </button>
</div>
```

## Variacao: Input com dark mode

```html
<input
  type="email"
  placeholder="Enter your email"
  class="w-full rounded border border-slate-300 bg-white px-3 py-2
         text-slate-900 placeholder-slate-400
         dark:border-slate-600 dark:bg-slate-800
         dark:text-slate-100 dark:placeholder-slate-500"
/>
```

## Toggle manual (referencia da documentacao)

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
}
```

```html
<button onclick="document.documentElement.classList.toggle('dark')">
  Toggle Theme
</button>
```

```js
// Com persistencia em localStorage
if (localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
     window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
```