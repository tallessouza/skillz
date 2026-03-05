# Deep Explanation: Funções CSS de Referência

## O que significa "referência" em CSS

Funções de referência são funções que **apontam para um valor definido em outro lugar** — seja uma custom property, uma URL externa, ou um atributo HTML. O valor não está inline na regra CSS: ele é buscado de outra fonte.

Existem três funções principais nesta categoria:

### 1. `var()` — Referência a Custom Properties

A função `var()` busca o valor de uma custom property (variável CSS). A variável é definida com prefixo `--` em qualquer seletor (comumente `:root` para globais).

**Por que usar:** Centraliza valores. Se `--size` muda de `50px` para `80px`, todas as referências atualizam automaticamente. Isso é especialmente poderoso porque custom properties participam da cascata CSS — podem ser sobrescritas por especificidade ou por media queries.

**Onde funciona:** Em qualquer propriedade CSS que aceita o tipo de valor da variável. `var()` é a mais versátil das três funções de referência.

### 2. `url()` — Referência a Recursos Externos

A função `url()` aponta para um recurso externo — geralmente uma imagem, mas pode ser fonte, cursor, etc.

**Uso mais comum:** `background` ou `background-image`. O instrutor demonstrou trazendo uma imagem do Unsplash e combinando com shorthand:

```css
background: url("...") center no-repeat;
background-size: contain;
```

Ou na forma shorthand completa:
```css
background: url("...") center/contain no-repeat;
```

A barra `/` separa `background-position` de `background-size` no shorthand.

**Insight do instrutor:** O `center`, `no-repeat` e `contain` são propriedades complementares para que a imagem fique "contida ali dentro" — sem repetição e centralizada.

### 3. `attr()` — Referência a Atributos HTML

Esta é a mais restrita das três. `attr()` lê o valor de um atributo HTML do elemento e o utiliza no CSS.

**Limitação crítica:** Na spec CSS atual, `attr()` **só funciona dentro da propriedade `content`**, que por sua vez só é válida em pseudo-elementos `::before` e `::after`.

**Qualquer atributo funciona:** Não precisa ser `data-*`. O instrutor demonstrou com:
- `data-content` (atributo customizado)
- `aria-label` (atributo de acessibilidade)

A escolha do atributo depende da semântica. Usar `aria-label` com `attr()` pode ser útil para debug visual de acessibilidade, mas em produção o conteúdo do `aria-label` é para leitores de tela, não para exibição visual.

### Analogia do instrutor

O instrutor usou a metáfora de "referência" de forma direta: cada função **aponta para algo que existe em outro lugar**. A variável aponta para uma custom property, a URL aponta para um arquivo externo, e o attr aponta para um atributo do HTML. Nenhuma delas contém o valor diretamente — todas buscam de uma fonte externa.

## Ordem dos pseudo-elementos

- `::before` — conteúdo aparece **antes** do conteúdo do elemento
- `::after` — conteúdo aparece **depois** do conteúdo do elemento

O instrutor demonstrou trocando entre `::before` e `::after` para mostrar a diferença de posição do texto gerado por `attr()`.

## Limitações atuais de `attr()`

A spec CSS Values Level 5 propõe expandir `attr()` para aceitar tipos (`attr(data-width length)`) e ser usada em qualquer propriedade. Porém, em 2024-2025, nenhum browser implementa isso — `attr()` continua limitada a `content` retornando string.