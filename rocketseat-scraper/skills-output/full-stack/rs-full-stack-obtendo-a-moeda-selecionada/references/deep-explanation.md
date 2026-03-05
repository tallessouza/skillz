# Deep Explanation: Obtendo a Moeda Selecionada

## Por que usar submit e não click?

Quando um `<button>` está dentro de um `<form>`, ele automaticamente tem `type="submit"`. Isso significa que:
- Clicar no botão dispara o evento `submit` do formulário
- Pressionar Enter dentro de um input também dispara `submit`

Usar o evento `submit` no formulário cobre ambos os cenários com um único handler. Se você colocar um `click` no botão, perde a captura do Enter.

## O comportamento padrão do submit

O comportamento padrão de um formulário HTML ao ser submetido é recarregar a página (fazendo uma requisição GET ou POST para o servidor). Em aplicações JavaScript modernas onde processamos dados no client-side, esse reload:
- Perde todo o estado da aplicação
- Causa um "flash" visual na tela (a "piscadinha" que o instrutor menciona)
- Reseta todos os valores dos inputs

Por isso `event.preventDefault()` é essencial — ele cancela esse comportamento padrão sem impedir que o evento seja processado pelo nosso código.

## getElementById vs querySelector

O instrutor usa ambos propositalmente:
- `document.getElementById("currency")` — seleciona diretamente pelo id, mais performático
- `document.querySelector("form")` — seleciona pelo seletor CSS, mais flexível

Ambos retornam o elemento DOM. querySelector aceita qualquer seletor CSS válido (classes, atributos, pseudo-seletores), enquanto getElementById é específico para ids.

## O .value de um select

Quando você tem:
```html
<select id="currency">
  <option value="USD">Dólar Americano</option>
  <option value="GBP">Libra Esterlina</option>
  <option value="EUR">Euro</option>
</select>
```

`currency.value` retorna o atributo `value` da `<option>` atualmente selecionada — não o texto visível. Então retorna `"USD"`, não `"Dólar Americano"`.

## Códigos de moeda (ISO 4217)

As moedas são identificadas por códigos de 3 letras seguindo o padrão ISO 4217:
- **USD** — United States Dollar (Dólar Americano)
- **GBP** — Great Britain Pound (Libra Esterlina)
- **EUR** — Euro
- **BRL** — Brazilian Real

Esses códigos são usados universalmente em APIs de câmbio, bancos e sistemas financeiros.

## onSubmit vs addEventListener("submit")

Duas formas equivalentes de escutar o evento:

```javascript
// Forma 1: propriedade do elemento
form.onSubmit = (event) => { ... }

// Forma 2: addEventListener
form.addEventListener("submit", (event) => { ... })
```

A diferença principal: `onSubmit` aceita apenas um handler (sobrescreve o anterior), enquanto `addEventListener` permite múltiplos handlers no mesmo evento.

## Função anônima vs arrow function

O instrutor mostra ambas as notações:

```javascript
// Função anônima tradicional
form.onSubmit = function(event) {
  event.preventDefault()
}

// Arrow function
form.onSubmit = (event) => {
  event.preventDefault()
}
```

Ambas funcionam neste contexto. A arrow function é mais concisa e não cria seu próprio `this`, o que geralmente é o comportamento desejado em handlers de eventos modernos.