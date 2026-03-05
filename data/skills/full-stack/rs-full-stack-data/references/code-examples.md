# Code Examples: Atributos data-* no HTML

## Exemplo basico do instrutor

```html
<!-- O instrutor demonstra: data-{qualquer-nome}="{qualquer-valor}" -->
<div data-id="123">Elemento com ID customizado</div>
```

## Multiplos atributos no mesmo elemento

```html
<div 
  data-user-id="42" 
  data-user-role="admin" 
  data-user-status="active"
  data-created-at="2024-01-15"
>
  João Silva
</div>
```

## Uso em listas e repeticoes

```html
<ul>
  <li data-product-id="1" data-price="29.90">Camiseta</li>
  <li data-product-id="2" data-price="59.90">Calca</li>
  <li data-product-id="3" data-price="89.90">Jaqueta</li>
</ul>
```

## Acesso via CSS

```css
/* Selecionar por existencia do atributo */
[data-user-role] {
  font-weight: bold;
}

/* Selecionar por valor especifico */
[data-user-role="admin"] {
  color: red;
}

/* Selecionar por valor que comeca com */
[data-category^="tech"] {
  background: #e0f0ff;
}
```

## Acesso via JavaScript

```javascript
// Acessar um atributo especifico
const card = document.querySelector('[data-user-id="42"]');
const userId = card.dataset.userId; // "42"
const role = card.dataset.userRole; // "admin"

// Iterar sobre elementos com data attributes
document.querySelectorAll('[data-product-id]').forEach(item => {
  const productId = item.dataset.productId;
  const price = item.dataset.price;
  console.log(`Produto ${productId}: R$${price}`);
});

// Modificar data attributes via JavaScript
card.dataset.userStatus = "inactive";
// Resulta em: data-user-status="inactive" no HTML
```

## Conversao hifen → camelCase

```html
<div data-first-name="Maria" data-last-name="Silva" data-is-active="true"></div>
```

```javascript
const el = document.querySelector('div');
el.dataset.firstName;  // "Maria"   (data-first-name)
el.dataset.lastName;   // "Silva"   (data-last-name)
el.dataset.isActive;   // "true"    (data-is-active)
```

## Erros comuns vs correto

```html
<!-- ERRO: espaco no nome -->
<div data-user name="joao">  <!-- Cria data-user="" e name="joao" -->

<!-- CORRETO -->
<div data-user-name="joao">


<!-- ERRO: numero no inicio -->
<div data-1st-item="true">

<!-- CORRETO -->
<div data-first-item="true">


<!-- ERRO: caractere especial -->
<div data-item@type="book">

<!-- CORRETO -->
<div data-item-type="book">


<!-- ERRO: nome generico -->
<div data-x="42" data-y="admin">

<!-- CORRETO -->
<div data-user-id="42" data-user-role="admin">
```

## Uso pratico: componentes interativos

```html
<!-- Tabs com data attributes -->
<div class="tabs">
  <button data-tab-target="home" class="active">Home</button>
  <button data-tab-target="about">Sobre</button>
  <button data-tab-target="contact">Contato</button>
</div>

<div data-tab-content="home" class="visible">Conteudo Home</div>
<div data-tab-content="about">Conteudo Sobre</div>
<div data-tab-content="contact">Conteudo Contato</div>
```

```javascript
document.querySelectorAll('[data-tab-target]').forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.tabTarget;
    // Esconder todos
    document.querySelectorAll('[data-tab-content]').forEach(content => {
      content.classList.remove('visible');
    });
    // Mostrar o alvo
    document.querySelector(`[data-tab-content="${target}"]`).classList.add('visible');
  });
});
```