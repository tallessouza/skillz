# Code Examples: Eventos em Elemento Específico

## Exemplo 1: Observar scroll e exibir informações do evento

```javascript
const ul = document.querySelector("ul")

ul.addEventListener("scroll", (event) => {
  console.log(event)
})
```

**O que acontece:** Cada rolagem na lista dispara o callback e exibe o objeto de evento completo no console. Rolar fora da lista não dispara nada.

## Exemplo 2: Exibir scrollTop do elemento

```javascript
const ul = document.querySelector("ul")

ul.addEventListener("scroll", () => {
  console.log(ul.scrollTop)
})
```

**O que acontece:** A cada rolagem, mostra a distância em pixels do topo. Começa em 0, aumenta conforme rola para baixo, volta a 0 quando retorna ao início.

**Nota:** O instrutor inicialmente tentou `event.scrollTop` (incorreto) e corrigiu para `ul.scrollTop` (correto). `scrollTop` é propriedade do elemento DOM, não do objeto event.

## Exemplo 3: Detectar fim da lista

```javascript
const ul = document.querySelector("ul")

ul.addEventListener("scroll", () => {
  if (ul.scrollTop > 300) {
    console.log("fim da lista")
  }
})
```

**O que acontece:** Quando o scroll ultrapassa 300px (valor específico dessa lista), exibe "fim da lista" no console.

**Como descobrir o valor:** Role até o final e observe o `scrollTop` máximo. No exemplo da aula, era ~300 e poucos pixels.

## Exemplo 4: Voltar ao topo (instantâneo)

```javascript
const ul = document.querySelector("ul")

ul.addEventListener("scroll", () => {
  if (ul.scrollTop > 300) {
    ul.scrollTo({ top: 0 })
  }
})
```

**O que acontece:** Ao chegar no final, pula instantaneamente para o topo. Sem animação.

## Exemplo 5: Voltar ao topo com animação suave

```javascript
const ul = document.querySelector("ul")

ul.addEventListener("scroll", () => {
  if (ul.scrollTop > 300) {
    ul.scrollTo({ top: 0, behavior: "smooth" })
  }
})
```

**O que acontece:** Ao chegar no final, retorna ao topo com animação suave. Essa é a mesma técnica usada em botões "voltar ao topo" em sites.

## Exemplo 6: Clique em botão específico com preventDefault

```javascript
const button = document.querySelector("button")

button.addEventListener("click", (event) => {
  event.preventDefault()
  console.log("clicou")
})
```

**O que acontece:** Apenas cliques no botão disparam o callback. Cliques em qualquer outro lugar da página são ignorados. O `preventDefault()` impede reload/submissão de formulário.

**Detalhe do DevTools:** Ao clicar múltiplas vezes, o browser não repete a mensagem — mostra um contador ao lado (ex: `×7`).

## Variação: Botão "voltar ao topo" flutuante (padrão real)

```javascript
const list = document.querySelector(".scrollable-list")
const backToTopButton = document.querySelector(".back-to-top")

// Mostrar botão quando rolou bastante
list.addEventListener("scroll", () => {
  if (list.scrollTop > 200) {
    backToTopButton.style.display = "block"
  } else {
    backToTopButton.style.display = "none"
  }
})

// Clicar no botão volta ao topo
backToTopButton.addEventListener("click", (event) => {
  event.preventDefault()
  list.scrollTo({ top: 0, behavior: "smooth" })
})
```

## Variação: Scroll infinito (detectar fim para carregar mais)

```javascript
const list = document.querySelector(".feed")

list.addEventListener("scroll", () => {
  const distanceFromBottom = list.scrollHeight - list.scrollTop - list.clientHeight

  if (distanceFromBottom < 50) {
    console.log("Carregar mais itens...")
    // loadMoreItems()
  }
})
```

**Nota:** `scrollHeight` é a altura total do conteúdo, `clientHeight` é a altura visível. A diferença entre `scrollHeight - scrollTop - clientHeight` indica a distância do fundo.