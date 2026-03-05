# Code Examples: Responsividade e Breakpoints no Tailwind

## Exemplo da aula: texto responsivo progressivo

O instrutor demonstrou um titulo que cresce conforme a tela aumenta:

### Passo 1: Definir o tamanho mobile

```html
<!-- Comeca com tamanho para mobile -->
<h1 class="text-3xl">
  Hello Tailwind
</h1>
```

O instrutor inicialmente tentou `text-2xl` mas achou pequeno demais, ajustando para `text-3xl`.

### Passo 2: Adicionar breakpoint small (640px+)

```html
<h1 class="text-3xl sm:text-5xl">
  Hello Tailwind
</h1>
```

Ao passar de 640px de largura, o texto cresce automaticamente para `5xl`.

### Passo 3: Adicionar breakpoint large (1024px+)

```html
<h1 class="text-3xl sm:text-5xl lg:text-6xl">
  Hello Tailwind
</h1>
```

Ao passar de 1024px, cresce para `6xl`. O instrutor demonstrou isso usando o modo responsivo do DevTools, aumentando a largura gradualmente.

## Commit de referencia

[Responsividade e Breakpoints](https://github.com/rocketseat-education/ignite-tailwind/commit/edd330250fbd7713f1530301cf0004b2a1d7d5fc)

## Variacoes do mesmo padrao

### Espacamento responsivo

```html
<div class="p-4 md:p-8 lg:p-12">
  Conteudo com padding que cresce
</div>
```

### Flex direction responsiva

```html
<!-- Mobile: empilhado / Desktop: lado a lado -->
<div class="flex flex-col md:flex-row gap-4">
  <div>Coluna 1</div>
  <div>Coluna 2</div>
</div>
```

### Imagem responsiva (mencionado na documentacao)

```html
<!-- Referencia do instrutor ao exemplo da docs: w-16 no mobile -->
<img class="w-16 md:w-32 lg:w-48" src="avatar.jpg" />
```

O instrutor mencionou o exemplo da documentacao onde `w-16` e o tamanho da imagem no mobile, e breakpoints modificam esse tamanho para telas maiores.