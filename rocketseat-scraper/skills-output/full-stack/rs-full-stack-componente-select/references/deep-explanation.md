# Deep Explanation: Componente Select

## Por que duplicar a partir do Input?

O instrutor demonstra uma técnica pragmática: quando dois componentes compartilham a maior parte da estrutura (fieldset, legend, classes CSS, comportamento de focus), duplicar e adaptar é mais eficiente do que abstrair prematuramente.

O Input e o Select compartilham:
- Estrutura de fieldset com legend
- Classes de estilização (background, text color, border radius, padding)
- Comportamento de focus (ring, mudança de cor)
- Padrão de props spread (`...rest`)

O que muda:
- `<input>` → `<select>`
- Remoção de `type` (não existe em select)
- Adição de `children` para as opções
- CSS adicional para a seta

## A técnica da opção padrão desabilitada e oculta

O instrutor implementa um pattern importante para UX de selects:

```html
<option value="" disabled hidden>Selecione</option>
```

Três atributos trabalham juntos:
- **`value=""`** — quando nenhuma categoria está selecionada, o valor do select é vazio, facilitando validação
- **`disabled`** — o usuário não consegue selecionar essa opção de volta depois de escolher outra
- **`hidden`** — a opção não aparece na lista dropdown, mas funciona como placeholder visual inicial

Sem `hidden`, o "Selecione" apareceria como item na lista. Sem `disabled`, o usuário poderia voltar a selecionar o placeholder. Sem `value=""`, a validação com `required` não funcionaria corretamente.

## Customização da seta nativa do select

O browser renderiza uma seta padrão para todo `<select>`. Essa seta varia entre browsers e não pode ser estilizada diretamente.

A solução do instrutor usa 4 propriedades CSS:

### 1. `appearance: none`
Remove completamente o visual padrão do browser. O select fica "nu" — sem seta, sem bordas padrão. Isso dá controle total ao desenvolvedor.

### 2. `background-image: url("./assets/chevron-down.svg")`
Insere um ícone SVG como imagem de fundo. A vantagem sobre pseudo-elementos (`::after`) é que funciona diretamente no `<select>`, que não aceita pseudo-elementos em todos os browsers.

### 3. `background-repeat: no-repeat`
Sem isso, o SVG se repete para preencher todo o espaço disponível do select (o instrutor mostra isso acontecendo na aula).

### 4. `background-position: right 0.7rem top 50%`
Posiciona a seta:
- `right 0.7rem` — 0.7rem a partir da borda direita
- `top 50%` — centralizada verticalmente

### 5. `background-size: 1.25rem auto`
Define largura fixa de 1.25rem e altura proporcional automática, garantindo que o ícone tenha tamanho consistente independente do tamanho do select.

## Onde colocar o CSS customizado

O instrutor demonstra que o `index.css` (onde o Tailwind é importado via `@tailwind`) aceita regras CSS normais além das diretivas do Tailwind. Isso é útil para customizações globais que afetam elementos nativos como `<select>`, que não são facilmente estilizáveis apenas com classes utilitárias.

## Children como pattern de composição

Usar `children` para as opções ao invés de uma prop como `options={[...]}` segue o padrão de composição do React. Vantagens:
- Cada `<option>` pode ter atributos individuais
- O componente Select não precisa conhecer a estrutura dos dados
- Permite agrupar opções com `<optgroup>` sem mudança no componente
- Familiar para quem conhece HTML nativo