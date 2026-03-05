# Code Examples: Exibindo Elementos Dinamicamente com classList

## Exemplo completo da aula

### CSS (classe de controle)

```css
/* A classe que controla a visibilidade do footer */
.show-result {
  display: block;
}

/* O footer por padrao esta oculto */
footer {
  display: none;
}
```

### JavaScript (selecao + toggle)

```javascript
// Obtendo os elementos do formulario
const form = document.querySelector("form")
const amount = document.querySelector("#amount")
const currency = document.querySelector("#currency")
const footer = document.querySelector("main footer")

function convertCurrency(amount, price, symbol) {
  // Logica de conversao (sera implementada nas proximas aulas)
  console.log(amount, price, symbol)
}

form.onsubmit = (event) => {
  event.preventDefault()

  try {
    switch (currency.value) {
      case "USD":
        convertCurrency(amount.value, 5.27, "$")
        break
      case "EUR":
        convertCurrency(amount.value, 5.73, "€")
        break
      case "GBP":
        convertCurrency(amount.value, 6.65, "£")
        break
    }

    // Aplica a classe que exibe o footer com o resultado
    footer.classList.add("show-result")
  } catch (error) {
    // Remove a classe do footer, removendo ele da tela
    footer.classList.remove("show-result")
    alert("Nao foi possivel converter. Tente novamente mais tarde.")
    console.log(error)
  }
}
```

## Variacoes do padrao

### Variacao 1: Toggle (mostrar/ocultar alternado)

```javascript
// Se o footer esta visivel, oculta. Se esta oculto, mostra.
footer.classList.toggle("show-result")
```

### Variacao 2: Verificar se classe existe antes de agir

```javascript
if (footer.classList.contains("show-result")) {
  // Footer ja esta visivel, atualizar conteudo
  updateFooterContent(newValue)
} else {
  // Footer oculto, mostrar com conteudo novo
  updateFooterContent(newValue)
  footer.classList.add("show-result")
}
```

### Variacao 3: Multiplas classes para estados diferentes

```javascript
try {
  const result = await convertCurrency(value, rate, symbol)

  footer.classList.remove("show-error")
  footer.classList.add("show-result")
} catch (error) {
  footer.classList.remove("show-result")
  footer.classList.add("show-error")
}
```

Com CSS correspondente:

```css
.show-result {
  display: block;
  border-color: green;
}

.show-error {
  display: block;
  border-color: red;
}
```

### Variacao 4: Seletor hierarquico em diferentes contextos

```javascript
// Seletor simples (pode ser ambiguo)
document.querySelector("footer")

// Seletor com contexto (recomendado)
document.querySelector("main footer")

// Seletor com ID (mais especifico)
document.querySelector("#conversion-result")

// Seletor com classe
document.querySelector(".result-footer")
```

## Demonstracao no DevTools (como o instrutor fez)

O instrutor mostrou no navegador:

1. Botao direito → Inspecionar
2. Navegar ate o elemento `<main>` → `<footer>`
3. Clicar duas vezes no elemento para editar
4. Adicionar `class="show-result"` manualmente
5. Footer apareceu imediatamente
6. Remover a classe → footer desapareceu

Isso prova visualmente que a classe CSS controla a visibilidade, e o JavaScript so precisa adicionar/remover essa classe.