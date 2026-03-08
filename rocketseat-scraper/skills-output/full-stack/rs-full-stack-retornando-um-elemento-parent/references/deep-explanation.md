# Deep Explanation: Retornando um Elemento Parent

## Por que essa regra existe?

O React trabalha com uma árvore virtual (Virtual DOM) que precisa de uma raiz única. Quando você escreve JSX, o compilador (Babel/SWC) transforma cada elemento em uma chamada `React.createElement()`. Uma função JavaScript só pode retornar **um valor** — não pode retornar duas chamadas separadas sem empacotá-las.

Internamente:

```js
// JSX
<button>A</button>
<button>B</button>

// Compilado (INVÁLIDO — dois returns)
React.createElement("button", null, "A")
React.createElement("button", null, "B")
```

Com wrapper:

```js
// JSX
<div>
  <button>A</button>
  <button>B</button>
</div>

// Compilado (VÁLIDO — um return)
React.createElement("div", null,
  React.createElement("button", null, "A"),
  React.createElement("button", null, "B")
)
```

## O que é um Fragment?

Fragment é um componente especial do React que **não renderiza nenhum elemento no DOM**. Ele existe exclusivamente para satisfazer a regra do elemento pai único sem poluir o HTML final com `<div>` desnecessárias.

Duas formas de usar:

```tsx
// Shorthand (mais comum)
<>
  <button>A</button>
  <button>B</button>
</>

// Explícito (necessário quando precisa de key)
import { Fragment } from 'react'

<Fragment key={item.id}>
  <button>A</button>
  <button>B</button>
</Fragment>
```

## Analogia do instrutor: "empacotar"

O instrutor usa a analogia de "empacotar" — o Fragment é como um pacote transparente. Você precisa devolver uma caixa única, mas o Fragment é uma caixa invisível que não aparece no resultado final.

## Quando usar div vs Fragment?

A escolha depende de **impacto visual**:

- **`<div>`**: Gera um elemento real no DOM. Use quando precisar aplicar estilos, classes CSS, ou quando o wrapper faz parte do layout (flex container, grid, etc.)
- **Fragment**: Não gera nada no DOM. Use quando o wrapper é puramente sintático — não precisa de estilização.

### Detalhe sobre layout

O instrutor destaca que a **ordem no código não necessariamente define o layout visual**. Três botões um embaixo do outro no JSX podem aparecer lado a lado no browser (porque `<button>` é inline por padrão). O layout visual depende do CSS, não da ordem no JSX.

## Children (filhos)

Tudo que está dentro do elemento pai é chamado de **children**. Não há limite para a quantidade de filhos — a regra só exige que o nível raiz do return tenha um único elemento.

```tsx
// Um pai, três children — perfeitamente válido
<div>
  <Header />      {/* child 1 */}
  <Main />        {/* child 2 */}
  <Footer />      {/* child 3 */}
</div>
```

## Erro comum

O erro que o React exibe quando a regra é violada:

> "JSX expressions must have one parent element."

Este é um erro de **compilação**, não de runtime. O código nem chega a executar — o transpilador já rejeita.