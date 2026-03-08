# Code Examples: Inputs Um Do Lado Do Outro

## Exemplo da aula — Formulário de solicitação

### Estrutura completa do formulário

```html
<form>
  <!-- Linha 1: campo sozinho (largura total) -->
  <fieldset>
    <label>Nome da solicitação</label>
    <input type="text" required />
  </fieldset>

  <!-- Linha 2: dois campos lado a lado -->
  <div class="flex gap-4">
    <fieldset>
      <label>Categoria</label>
      <select required>
        <option value="">Selecione</option>
        <option value="alimentacao">Alimentação</option>
        <option value="transporte">Transporte</option>
      </select>
    </fieldset>

    <fieldset>
      <label>Valor</label>
      <input type="number" required />
    </fieldset>
  </div>
</form>
```

## Variação 1 — Campos com larguras proporcionais

```html
<div class="flex gap-4">
  <!-- Categoria ocupa mais espaço -->
  <div class="flex-1">
    <label>Categoria</label>
    <select class="w-full" required>
      <option>Alimentação</option>
    </select>
  </div>

  <!-- Valor com largura fixa -->
  <div class="w-32">
    <label>Valor</label>
    <input type="number" class="w-full" required />
  </div>
</div>
```

## Variação 2 — Três campos na mesma linha

```html
<div class="flex gap-4">
  <div class="flex-1">
    <label>Cidade</label>
    <input type="text" class="w-full" />
  </div>

  <div class="flex-1">
    <label>Estado</label>
    <select class="w-full">
      <option>SP</option>
      <option>RJ</option>
    </select>
  </div>

  <div class="w-24">
    <label>CEP</label>
    <input type="text" class="w-full" />
  </div>
</div>
```

## Variação 3 — Responsivo (empilha em mobile)

```html
<!-- Em mobile: empilhado. Em desktop: lado a lado -->
<div class="flex flex-col md:flex-row gap-4">
  <div class="flex-1">
    <label>Categoria</label>
    <select class="w-full" required>
      <option>Alimentação</option>
    </select>
  </div>

  <div class="flex-1">
    <label>Valor</label>
    <input type="number" class="w-full" required />
  </div>
</div>
```

## Variação 4 — Com estilização completa dos inputs

```html
<div class="flex gap-4">
  <div class="flex-1">
    <label class="block text-sm font-medium text-gray-700 mb-1">
      Categoria
    </label>
    <select
      class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      required
    >
      <option value="">Selecione uma categoria</option>
      <option value="alimentacao">Alimentação</option>
      <option value="transporte">Transporte</option>
      <option value="hospedagem">Hospedagem</option>
    </select>
  </div>

  <div class="flex-1">
    <label class="block text-sm font-medium text-gray-700 mb-1">
      Valor
    </label>
    <input
      type="number"
      placeholder="0,00"
      class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      required
    />
  </div>
</div>
```

## Anti-pattern vs. Padrão correto

### Errado: margin manual

```html
<!-- Não faça isso -->
<div class="flex">
  <select class="mr-4">...</select>
  <input />
</div>
```

### Correto: gap no container

```html
<!-- Faça isso -->
<div class="flex gap-4">
  <select>...</select>
  <input />
</div>
```