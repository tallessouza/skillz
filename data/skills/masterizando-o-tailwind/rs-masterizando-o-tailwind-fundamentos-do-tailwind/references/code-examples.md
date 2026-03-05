# Code Examples: Fundamentos do Tailwind CSS

## Exemplo 1: Evolucao de classes CSS tradicionais (o problema)

O instrutor mostra progressivamente como classes CSS explodem:

### Passo 1 — Card basico
```html
<div class="card">
  <!-- conteudo -->
</div>
```
```css
.card {
  width: 200px;
  background: white;
  border: 1px solid grey;
}
```

### Passo 2 — Card precisa de sombra
```html
<div class="card card-shadow">
  <!-- conteudo -->
</div>
```
```css
.card-shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

### Passo 3 — Card precisa de borda arredondada
```html
<div class="card card-shadow card-rounded">
  <!-- conteudo -->
</div>
```
```css
.card-rounded {
  border-radius: 8px;
}
```

### Passo 4 — Card com arredondamento menor
```html
<div class="card card-rounded card-rounded-sm">
  <!-- conteudo -->
</div>
```
```css
.card-rounded-sm {
  border-radius: 4px;
}
```

**Problema:** cada variacao = nova classe, novo nome, verificar duplicatas, navegar entre arquivos.

## Exemplo 2: Abordagem utility-first (a solucao)

O instrutor mostra a mesma ideia com utilities (representacao simplificada pré-Tailwind para explicar o conceito):

```html
<!-- Card basico -->
<div class="width-200 border-grey background-white">
  <!-- conteudo -->
</div>

<!-- Card com sombra — apenas adiciona classe -->
<div class="width-200 border-grey background-white shadow">
  <!-- conteudo -->
</div>

<!-- Card com sombra e borda arredondada -->
<div class="width-200 border-grey background-white shadow rounded">
  <!-- conteudo -->
</div>

<!-- Card com arredondamento menor -->
<div class="width-200 border-grey background-white shadow rounded-small">
  <!-- conteudo -->
</div>
```

**Vantagem:** zero atrito para variacoes. Nao precisa pensar nome, nao precisa navegar ao CSS, nao precisa verificar se ja existe.

## Exemplo 3: Tailwind real (da documentacao mostrada na aula)

O card mostrado na documentacao do Tailwind usa multiplas classes utilitarias:

```html
<div class="flex items-center space-x-4 p-6 bg-white rounded-xl shadow-lg">
  <img class="h-12 w-12 rounded-full" src="avatar.jpg" alt="">
  <div>
    <div class="text-xl font-medium text-black">Nome</div>
    <p class="text-slate-500">Descricao</p>
  </div>
</div>
```

Cada classe = uma propriedade CSS:
- `flex` → `display: flex`
- `items-center` → `align-items: center`
- `space-x-4` → gap horizontal entre filhos
- `p-6` → `padding: 1.5rem`
- `bg-white` → `background-color: white`
- `rounded-xl` → `border-radius: 0.75rem`
- `shadow-lg` → box-shadow grande

## Variacoes praticas

### Mesmo componente, contextos diferentes

```html
<!-- Listagem: card simples -->
<div class="bg-white border border-gray-200 rounded-lg p-4">
  <h3 class="font-semibold">Produto</h3>
</div>

<!-- Destaque: mesmo card + sombra + borda colorida -->
<div class="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg">
  <h3 class="font-semibold">Produto em Destaque</h3>
</div>

<!-- Desabilitado: mesmo card + opacidade -->
<div class="bg-white border border-gray-200 rounded-lg p-4 opacity-50 pointer-events-none">
  <h3 class="font-semibold">Produto Indisponivel</h3>
</div>
```

Nenhuma classe nova foi inventada. Apenas composicao de utilities existentes.