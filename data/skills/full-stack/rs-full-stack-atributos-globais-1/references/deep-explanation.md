# Deep Explanation: Atributos Globais HTML

## O que sao atributos globais

Atributos globais sao um tipo especial de atributo HTML que pode ser aplicado a QUALQUER elemento, independente da tag. Enquanto atributos como `src`, `href`, `action` sao especificos de certas tags e definem o comportamento delas, atributos globais sao transversais — eles adicionam capacidades sem mudar a natureza do elemento.

## Categorias de atributos globais

### 1. Identificacao e agrupamento
- **`id`** — Identificador unico no documento. Nunca repetir na mesma pagina. Usado para ancoras (`#id`), JS (`getElementById`), e CSS (`#id`).
- **`class`** — Agrupamento para estilo e manipulacao. Pode ter multiplas classes separadas por espaco. Reutilizavel em multiplos elementos.

### 2. Dados customizados
- **`data-*`** — Armazena dados arbitrarios no elemento. Acessivel via JS com `element.dataset.nomeDaPropriedade`. Nao afeta renderizacao. Ideal para passar informacoes entre HTML e JS sem poluir a semantica.

### 3. Acessibilidade
- **`aria-*`** — Familia de atributos que comunicam informacoes para tecnologias assistivas (leitores de tela). Exemplos: `aria-label`, `aria-hidden`, `aria-describedby`, `aria-expanded`.
- **`tabindex`** — Controla se e em que ordem o elemento recebe foco via teclado. `tabindex="0"` coloca na ordem natural, `tabindex="-1"` permite foco programatico mas remove da navegacao por Tab.
- **`lang`** — Indica o idioma do conteudo do elemento. Leitores de tela usam isso para pronunciacao correta. Navegadores usam para hifenizacao e autocorrecao.
- **`role`** — Define o papel semantico do elemento para tecnologias assistivas.

### 4. Apresentacao e comportamento
- **`hidden`** — Esconde o elemento. Equivalente semantico de "nao relevante agora". Diferente de `display: none` do CSS porque carrega significado semantico.
- **`title`** — Texto de tooltip que aparece ao passar o mouse. Nao e acessivel de forma confiavel para leitores de tela — nao use como substituto de `aria-label`.
- **`style`** — Estilo inline. Usar como ultimo recurso — prefira classes CSS.
- **`contenteditable`** — Torna o conteudo do elemento editavel pelo usuario.

### 5. Eventos e interacao
- **`on*`** (onclick, onmouseover, etc.) — Handlers de eventos inline. Considere adicionar via JS para separacao de concerns.
- **`draggable`** — Permite arrastar o elemento.

## Filosofia de aprendizado do instrutor

O instrutor enfatiza fortemente que NAO se deve tentar memorizar todos os atributos globais de uma vez. A abordagem correta e:

1. Aprender os fundamentais (id, class, data-*, hidden, title, tabindex, lang, aria-*)
2. Entender O QUE e um atributo global (conceito)
3. Saber que a referencia MDN existe para consulta
4. Aprender os demais conforme a necessidade pratica surgir

Essa abordagem "sob demanda" e mais eficaz porque atributos como `accesskey`, `autocapitalize`, `enterkeyhint`, `inputmode`, `is`, `itemid`, `itemprop`, `nonce`, `spellcheck` sao de uso tao especifico que aprender sem contexto pratico nao agrega valor.

## Referencia MDN

A pagina oficial de referencia para todos os atributos globais:
https://developer.mozilla.org/pt-BR/docs/Web/HTML/Global_attributes