# Deep Explanation: Query Selector

## Por que querySelector unifica o acesso ao DOM

O instrutor apresenta o querySelector como uma evolucao natural dos metodos antigos (`getElementById`, `getElementsByClassName`, `getElementsByTagName`). A ideia central e: **voce ja sabe CSS? Entao ja sabe usar querySelector.**

A sintaxe e identica ao CSS:
- `#` identifica ID (assim como no CSS)
- `.` identifica classe (assim como no CSS)
- Tag names sao escritos diretamente (assim como no CSS)

Isso elimina a necessidade de decorar multiplos metodos com nomes longos como `getElementsByClassName`.

## querySelector vs querySelectorAll — A diferenca fundamental

O instrutor enfatiza um ponto que causa bugs frequentes em iniciantes:

- **`querySelector`** retorna **sempre o primeiro** elemento que corresponde ao seletor. Mesmo que existam 10 elementos com a mesma classe, voce recebe apenas o primeiro.
- **`querySelectorAll`** retorna **todos** os elementos que correspondem, em formato de NodeList.

O instrutor demonstra isso ao vivo: ao usar `querySelector('.guest')`, so aparece o primeiro convidado. Ao trocar para `querySelectorAll('.guest')`, ambos aparecem na lista.

## Comparacao com getElementById

O instrutor faz uma comparacao direta:

```javascript
// Com getElementById — o metodo ja diz que e por ID
document.getElementById('guest1')

// Com querySelector — voce sinaliza que e ID com #
document.querySelector('#guest1')
```

A diferenca e que no `getElementById` o nome do metodo ja indica a busca por ID, entao voce passa apenas o nome. No `querySelector`, como ele aceita qualquer seletor CSS, voce precisa do prefixo `#` para indicar que e um ID.

## Analogia com CSS

O instrutor usa a palavra "combinacao" — referindo-se ao fato de que dentro do querySelector voce pode usar qualquer combinacao de seletores CSS validos. Isso abre possibilidades como:

- `document.querySelector('.container .item')` — descendente
- `document.querySelector('ul > li:first-child')` — filho direto
- `document.querySelector('[data-role="admin"]')` — atributo

## Edge cases

### querySelector com seletor que nao existe
Retorna `null`. Sempre verifique antes de acessar propriedades.

### querySelectorAll com seletor que nao existe
Retorna um NodeList vazio (length === 0), nao null.

### NodeList nao e Array
O retorno de `querySelectorAll` e um NodeList, nao um Array. Para usar metodos de array como `.map()`, converta com `Array.from()` ou spread `[...nodeList]`.