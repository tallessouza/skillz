# Code Examples: Configurando o Tailwind CSS

## Exemplo 1: Estrutura base do index.css

```css
@import "tailwindcss";

@theme {
  /* Fonte padrão */
  --default-font-family: "Open Sans", serif;

  /* Paleta de cinzas */
  --color-gray-100: #1f2523;
  --color-gray-200: #4d5c57;
  --color-gray-300: #cdd5d2;
  --color-gray-400: #e4ece9;
  --color-gray-500: #f9fbfa;

  /* Paleta de verdes */
  --color-green-100: #1f8459;
  --color-green-200: #2cb178;

  /* Tamanho customizado */
  --text-xxs: 0.625rem;
}
```

## Exemplo 2: Usando as cores customizadas no HTML

```html
<!-- Texto com cor green-200 (tom mais claro) -->
<h1 class="text-green-200">Título Verde Claro</h1>

<!-- Texto com cor green-100 (tom mais escuro) -->
<h1 class="text-green-100">Título Verde Escuro</h1>

<!-- Texto com cor gray-200 (tom esverdeado) -->
<p class="text-gray-200">Parágrafo cinza esverdeado</p>

<!-- Background com cor do tema -->
<div class="bg-gray-100 text-gray-500">
  Fundo escuro com texto claro
</div>
```

## Exemplo 3: Sobrescrevendo uma cor padrão do Tailwind

```css
@theme {
  /* Sobrescreve o red-800 padrão do Tailwind */
  --color-red-800: blue;
}
```

```html
<!-- Agora text-red-800 renderiza azul, não vermelho -->
<h1 class="text-red-800">Isso aparece azul!</h1>
```

Este exemplo demonstra que o `@theme` sempre prevalece. Na prática, evitar sobrescrever cores padrão com valores inesperados — usar nomes customizados.

## Exemplo 4: Usando o tamanho customizado xxs

```html
<!-- Texto menor que xs (12px), agora com 10px -->
<span class="text-xxs text-gray-200">Texto bem pequeno</span>

<!-- Comparação de tamanhos -->
<p class="text-xxs">10px (customizado)</p>
<p class="text-xs">12px (padrão Tailwind)</p>
<p class="text-sm">14px (padrão Tailwind)</p>
<p class="text-base">16px (padrão Tailwind)</p>
```

## Exemplo 5: Calculando outros tamanhos customizados em rem

```css
@theme {
  --text-xxs: 0.625rem;   /* 10 / 16 = 0.625 */
  --text-xxxs: 0.5rem;    /* 8 / 16 = 0.5 */
  --text-huge: 3.5rem;    /* 56 / 16 = 3.5 */
}
```

## Exemplo 6: Variações de font-family

```css
@theme {
  /* Fonte do Google Fonts com fallback serif */
  --default-font-family: "Open Sans", serif;
}
```

```css
/* Alternativa: fonte sans-serif com fallback */
@theme {
  --default-font-family: "Inter", sans-serif;
}
```

```css
/* Alternativa: fonte monospace para projetos de código */
@theme {
  --default-font-family: "JetBrains Mono", monospace;
}
```

## Exemplo 7: Paleta completa para um projeto real

```css
@theme {
  --default-font-family: "Open Sans", serif;

  /* Background e superfícies */
  --color-gray-100: #1f2523;
  --color-gray-200: #4d5c57;
  --color-gray-300: #cdd5d2;
  --color-gray-400: #e4ece9;
  --color-gray-500: #f9fbfa;

  /* Ações e destaques */
  --color-green-100: #1f8459;
  --color-green-200: #2cb178;

  /* Tamanhos customizados */
  --text-xxs: 0.625rem;
}
```

Uso no HTML:
```html
<body class="bg-gray-100 text-gray-500 font-sans">
  <header class="bg-gray-200">
    <h1 class="text-green-200 text-2xl">Meu App</h1>
  </header>
  <main>
    <p class="text-gray-300">Conteúdo principal</p>
    <small class="text-xxs text-gray-200">Nota de rodapé</small>
    <button class="bg-green-100 text-gray-500">Ação</button>
  </main>
</body>
```