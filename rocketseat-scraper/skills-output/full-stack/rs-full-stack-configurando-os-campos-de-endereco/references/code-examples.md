# Code Examples: Configurando Campos de Endereço

## HTML completo do fieldset address

```html
<fieldset class="address">
  <legend>Endereço residencial</legend>

  <!-- CEP sozinho na linha -->
  <div class="input-wrapper">
    <label for="cep">CEP</label>
    <input type="text" id="cep" name="cep" />
  </div>

  <!-- Rua (2/3) + Número (1/3) -->
  <div class="flex">
    <div class="input-wrapper flex2">
      <label for="street">Rua</label>
      <input type="text" id="street" name="street" value="Rosas e Flores" disabled />
    </div>
    <div class="input-wrapper flex1">
      <label for="number">Número</label>
      <input type="number" id="number" name="number" />
    </div>
  </div>

  <!-- Cidade (2/3) + Estado (1/3) -->
  <div class="flex">
    <div class="input-wrapper flex2">
      <label for="city">Cidade</label>
      <input type="text" id="city" name="city" value="São Paulo" disabled />
    </div>
    <div class="input-wrapper flex1">
      <label for="state">Estado</label>
      <input type="text" id="state" name="state" value="São Paulo" disabled />
    </div>
  </div>
</fieldset>
```

## CSS completo

### Variáveis CSS (adicionar ao :root se não existirem)

```css
:root {
  --surface-disabled: #E1E1E6;
  --stroke-default: #7C7C8A;
  --text-primary: #C4C4CC;
}
```

### Classes utilitárias globais

```css
.flex {
  display: flex;
}

.flex1 {
  flex: 1;
}

.flex2 {
  flex: 2;
}
```

### Estilos do fieldset address

```css
/* Espaçamento entre campos fieldset consecutivos */
fieldset + fieldset {
  margin-top: 2rem;
}

/* Gap nos containers flex dentro do address */
.address .flex {
  gap: 1.25rem;
}
```

### Estilos de campos disabled

```css
/* Wrapper inteiro fica com meia opacidade quando tem campo disabled */
.input-wrapper:has([disabled]) {
  opacity: 0.5;
}

/* Input disabled com cores do design system */
input:disabled {
  background-color: var(--surface-disabled);
  border: 1px solid var(--stroke-default);
  color: var(--text-primary);
}
```

## Variação: Endereço com complemento

```html
<div class="flex">
  <div class="input-wrapper flex2">
    <label for="street">Rua</label>
    <input type="text" id="street" name="street" disabled />
  </div>
  <div class="input-wrapper flex1">
    <label for="number">Número</label>
    <input type="number" id="number" name="number" />
  </div>
</div>

<!-- Linha extra para complemento -->
<div class="input-wrapper">
  <label for="complement">Complemento</label>
  <input type="text" id="complement" name="complement" placeholder="Apto, bloco, etc." />
</div>
```

## Variação: Proporção 1:1 (campos iguais)

```html
<div class="flex">
  <div class="input-wrapper flex1">
    <label for="city">Cidade</label>
    <input type="text" id="city" name="city" disabled />
  </div>
  <div class="input-wrapper flex1">
    <label for="state">Estado</label>
    <input type="text" id="state" name="state" disabled />
  </div>
</div>
```

## Variação: Campo disabled que será habilitado via JS

```html
<!-- Inicialmente disabled, habilitado após busca de CEP -->
<input
  type="text"
  id="street"
  name="street"
  disabled
/>
```

```javascript
// Após busca de CEP
function preencherEndereco(dados) {
  const street = document.getElementById('street');
  street.value = dados.logradouro;
  // Mantém disabled pois o valor veio da API
}
```

## Padrão completo: fieldset + fieldset spacing com CSS

```css
/* Quando um fieldset vem depois de outro, adiciona espaço */
fieldset + fieldset {
  margin-top: 2rem;
}

/* Leitura CSS: "fieldset que tem um fieldset anterior a ele" */
```