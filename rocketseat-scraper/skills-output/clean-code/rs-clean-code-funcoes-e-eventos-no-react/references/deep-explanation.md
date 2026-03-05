# Deep Explanation: Funcoes e Eventos no React

## Por que dois prefixos?

O instrutor Diego Fernandes explica que a separacao entre `handle` e `on` resolve um problema fundamental de legibilidade: **diferenciar funcoes que reagem a eventos do usuario de funcoes auxiliares** (calculos, chamadas API, formatacao).

Sem essa convencao, ao ler um componente com 10 funcoes, voce nao consegue identificar rapidamente quais sao disparadas por interacoes do usuario e quais sao utilitarias.

## A analogia com HTML nativo

O padrao `on` para props segue deliberadamente a convencao do proprio HTML/React:
- `onClick`
- `onMouseOver`
- `onFocus`
- `onBlur`

Quando voce cria `onCreateNewTodo`, esta dizendo: "este componente emite um evento chamado CreateNewTodo, assim como um botao emite Click". O componente filho **avisa** o pai que algo aconteceu.

## Handle como reacao local

O `handle` marca que aquela funcao e a **reacao** do componente a um evento. Quando o componente pai recebe a prop `onCreateNewTodo` e define `handleCreateNewTodo`, ele esta dizendo: "quando o evento CreateNewTodo acontecer, eu lido com ele assim".

## Fluxo completo de um evento

```
Usuario clica no botao
  → onClick={handleSubmit}           // handle: reacao local no filho
    → handleSubmit chama onCreateTodo  // on: propaga evento pro pai
      → pai executa handleCreateTodo   // handle: reacao local no pai
```

Cada camada tem seu `handle` (reacao local) e `on` (propagacao).

## Funcoes que NAO sao handle nem on

O instrutor enfatiza que funcoes auxiliares — calculos, formatacao, chamadas API — nao devem usar nenhum dos dois prefixos. Isso preserva a semantica:

- `formatDate()` — utilitaria
- `fetchUsers()` — chamada API
- `calculateTotal()` — calculo

Se voce prefixar essas com `handle`, perde a capacidade de distinguir evento de logica auxiliar.

## Flexibilidade do padrao

O instrutor explicita: "se voce quer criar o proprio padrao, nao tem problema nenhum, desde que voce mantenha o mesmo padrao dentro do time". O valor nao esta nos prefixos especificos `handle`/`on`, mas na **consistencia**. Porem, `handle`/`on` tem a vantagem de alinhar com as convencoes nativas do React e do ecossistema.