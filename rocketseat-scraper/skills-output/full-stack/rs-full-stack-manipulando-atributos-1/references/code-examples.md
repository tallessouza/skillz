# Code Examples: Manipulando Atributos do DOM

## Exemplo 1: Selecionar e desabilitar input

Direto da aula — selecionar o input e bloqueá-lo:

```javascript
const input = document.querySelector('input')
input.setAttribute('disabled', true)
```

Resultado: o usuario clica no input mas nao consegue digitar. No inspector, o elemento mostra o atributo `disabled`.

## Exemplo 2: Mudar tipo do input

Trocar de texto para upload de arquivo:

```javascript
const input = document.querySelector('input')
input.setAttribute('type', 'file')
```

Resultado: o input que era um campo de texto vira um botao "Escolher arquivo".

## Exemplo 3: Remover atributo

Remover o ID de um elemento:

```javascript
const input = document.querySelector('input')
input.removeAttribute('id')
```

Resultado: no inspector, o atributo `id` desaparece completamente do elemento.

## Variacoes praticas

### Formulario com termos de concordancia

```javascript
const emailInput = document.querySelector('#email')
const termsCheckbox = document.querySelector('#terms')

// Comeca desabilitado
emailInput.setAttribute('disabled', true)

// Habilita quando usuario concorda
termsCheckbox.addEventListener('change', function () {
  if (termsCheckbox.checked) {
    emailInput.removeAttribute('disabled')
  } else {
    emailInput.setAttribute('disabled', true)
  }
})
```

### Adicionar atributo que nao existia

```javascript
const input = document.querySelector('input')
// Se o input nao tinha placeholder, setAttribute cria o atributo
input.setAttribute('placeholder', 'Digite seu nome')
```

### Atualizar atributo existente

```javascript
const link = document.querySelector('a')
// Se o link ja tinha href, setAttribute atualiza o valor
link.setAttribute('href', 'https://novo-destino.com')
```

### Manipular multiplos atributos

```javascript
const input = document.querySelector('input')
input.setAttribute('type', 'email')
input.setAttribute('placeholder', 'seu@email.com')
input.setAttribute('required', true)
```

### Remover multiplos atributos

```javascript
const input = document.querySelector('input')
input.removeAttribute('disabled')
input.removeAttribute('readonly')
input.removeAttribute('placeholder')
```