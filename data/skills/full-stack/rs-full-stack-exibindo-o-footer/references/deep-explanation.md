# Deep Explanation: Exibindo Elementos Dinamicamente com classList

## Por que classList e nao style.display?

O instrutor demonstra visualmente no DevTools o que acontece: ao adicionar a classe `show-result` no footer, o elemento aparece. Ao remover, desaparece. Isso acontece porque no CSS existe:

```css
.show-result {
  display: block;
}
```

E o footer por padrao tem `display: none`. A separacao e clara: **CSS define COMO mostrar/ocultar, JavaScript decide QUANDO**.

Se voce usar `footer.style.display = "block"` diretamente, voce esta misturando responsabilidades. Se amanha o designer quiser que o footer apareca com `display: flex` ou com uma animacao, voce teria que mudar o JavaScript. Com classList, voce so muda o CSS.

## O padrao try-catch para UI

O instrutor introduz o try-catch nao como tratamento de erro generico, mas como **mecanismo de controle visual**:

- **try**: tenta fazer a conversao E mostra o resultado (classList.add)
- **catch**: se algo falhar, OCULTA o resultado (classList.remove) e avisa o usuario

Isso evita um estado inconsistente onde o footer mostra dados parciais ou incorretos. E um padrao defensivo: se nao conseguiu processar, nao mostra nada.

O alert no catch serve como feedback imediato ao usuario: "Nao foi possivel converter. Tente novamente mais tarde."

## Seletor hierarquico: "main footer"

O instrutor usa `document.querySelector("main footer")` — com espaco entre `main` e `footer`. Isso significa: "dentro do elemento main, encontre o footer". E mais especifico que apenas `"footer"`, porque:

1. Pode existir um footer fora do main (footer da pagina inteira)
2. Garante que voce esta manipulando exatamente o footer do contexto de conversao
3. Segue o principio de selecao por contexto, nao por tipo generico

## Organizacao do codigo

O instrutor enfatiza colocar todos os `querySelector` juntos em um bloco no topo, com comentarios:

```javascript
// Obtendo os elementos do formulario
const form = document.querySelector("form")
const amount = document.querySelector("#amount")
const currency = document.querySelector("#currency")
const footer = document.querySelector("main footer")
```

A razao e pratica: quando voce precisa adicionar ou remover um elemento, sabe exatamente onde procurar. Nao fica espalhado pelo codigo.

## classList.add vs classList.remove vs className

- `classList.add("show-result")` — adiciona a classe SEM remover as existentes
- `classList.remove("show-result")` — remove so essa classe, preserva as outras
- `className = "show-result"` — SUBSTITUI todas as classes (perigoso!)

O instrutor usa explicitamente `.classList.add()` e `.classList.remove()` porque sao operacoes seguras e atomicas.

## Fluxo completo demonstrado

1. Usuario digita um valor (ex: 500)
2. Seleciona uma moeda
3. Clica em "Converter"
4. O `onsubmit` captura o evento
5. Verifica a moeda selecionada via `currency.value`
6. Chama `convertCurrency(valor, cotacao, simbolo)`
7. Dentro do try: `footer.classList.add("show-result")` — footer aparece
8. Se erro: `footer.classList.remove("show-result")` — footer desaparece + alert

O footer contem dois elementos importantes:
- Uma `<span>` com a descricao da cotacao (ex: "1 USD = 5.27 BRL")
- Um `<h1>` com o valor total convertido

Nesta aula, os valores ainda sao estaticos. A proxima etapa e atualiza-los dinamicamente.