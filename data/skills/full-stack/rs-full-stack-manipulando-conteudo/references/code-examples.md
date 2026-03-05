# Code Examples: Manipulando Conteudo no DOM

## Setup HTML usado na aula

```html
<ul>
  <li id="guest" class="guest-name">
    <span>Rodrigo</span>
  </li>
  <li class="guest-name">
    <span>Ana</span>
  </li>
</ul>
```

## Exemplo 1: Selecionar e ler conteudo

```javascript
const guest = document.querySelector('#guest')

// Retorna o elemento completo: <li id="guest" class="guest-name"><span>Rodrigo</span></li>
console.log(guest)

// Retorna apenas o texto: "Rodrigo"
console.log(guest.textContent)
```

## Exemplo 2: Atribuir novo conteudo (substituicao destrutiva)

```javascript
const guest = document.querySelector('#guest')

// CUIDADO: remove a span interna
guest.textContent = 'João da Silva'

// Resultado no DOM:
// <li id="guest" class="guest-name">João da Silva</li>
// A <span> foi removida!
```

## Exemplo 3: Atribuir conteudo preservando estrutura

```javascript
// Seleciona a span DENTRO do #guest
const guest = document.querySelector('#guest span')

guest.textContent = 'Novo Nome'

// Resultado no DOM:
// <li id="guest" class="guest-name"><span>Novo Nome</span></li>
// Estrutura preservada!
```

## Exemplo 4: Diferenca entre textContent, innerText e innerHTML

### HTML com elemento oculto

```html
<li id="guest" class="guest-name">
  <span>Rodrigo</span>
  <span class="hide">0 novas mensagens</span>
</li>
```

```css
.hide {
  display: none;
}
```

### Comparando as tres propriedades

```javascript
const guest = document.querySelector('#guest')

// textContent — retorna TUDO (visivel + oculto)
console.log(guest.textContent)
// Output: "Rodrigo0 novas mensagens"

// innerText — retorna apenas o VISIVEL
console.log(guest.innerText)
// Output: "Rodrigo"

// innerHTML — retorna o HTML interno como string
console.log(guest.innerHTML)
// Output: "<span>Rodrigo</span><span class=\"hide\">0 novas mensagens</span>"
```

## Variacoes praticas

### Variacao A: Limpar conteudo de um container

```javascript
// Remove todos os filhos e texto
document.querySelector('#guest').textContent = ''
```

### Variacao B: Verificar se elemento tem conteudo

```javascript
const guest = document.querySelector('#guest')

if (guest.textContent.trim() === '') {
  console.log('Elemento vazio')
}
```

### Variacao C: Ler texto para comparacao logica

```javascript
const guest = document.querySelector('#guest span')

if (guest.textContent === 'Rodrigo') {
  guest.textContent = 'Nome atualizado'
}
```

### Variacao D: innerHTML para inserir HTML dinamico

```javascript
const guest = document.querySelector('#guest')

// Insere HTML — a string e interpretada como markup
guest.innerHTML = '<span>João</span><span class="badge">VIP</span>'
```

### Variacao E: Texto seguro vs HTML inseguro

```javascript
const userInput = '<script>alert("XSS")</script>'

// SEGURO — trata como texto puro
element.textContent = userInput
// Renderiza: <script>alert("XSS")</script> (texto visivel)

// INSEGURO — interpreta como HTML
element.innerHTML = userInput
// Potencialmente executa o script!
```

### Variacao F: Contar notificacoes ocultas

```javascript
const guest = document.querySelector('#guest')

// textContent captura o texto oculto
const fullText = guest.textContent
// "Rodrigo0 novas mensagens"

// innerText ignora o oculto
const visibleText = guest.innerText
// "Rodrigo"

// Diferenca indica conteudo oculto existente
const hasHiddenContent = fullText.length > visibleText.length
```