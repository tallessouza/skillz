# Deep Explanation: Customizando Inputs do Tipo Radio

## Por que organizar CSS em arquivos separados?

O instrutor destaca um problema real de cascata: se voce importa `droparea.css`, depois `radial.css`, e depois tem estilos genericos de input no arquivo principal, os estilos genericos sobrescrevem os especificos. A solucao e extrair TODOS os estilos de input para um `input.css` e importa-lo primeiro no `index.css`.

**Ordem de importacao importa:**
```css
/* index.css */
@import "input.css";      /* genericos primeiro */
@import "droparea.css";
@import "radial.css";      /* especificos depois */
```

Isso segue o principio da cascata CSS: estilos mais especificos devem vir depois dos genericos.

## A tecnica do `all: unset`

Quando o instrutor aplica `all: unset` nos estados do input (normal, `:focus`, `:hover`), ele remove TODAS as propriedades CSS aplicadas ao elemento, incluindo estilos do user-agent stylesheet do browser. Isso e mais completo que tentar sobrescrever propriedade por propriedade.

## Por que `position: absolute` + `inset: 0` no input?

Esta e a tecnica central da aula. O raciocinio:

1. O input radio nativo precisa existir no DOM para acessibilidade (Tab, setas, leitores de tela)
2. Mas visualmente queremos um design completamente customizado
3. Solucao: o input fica invisivel (`all: unset`) mas cobre toda a area do container
4. O container tem `position: relative` para servir de referencia
5. `inset: 0` e shorthand para `top: 0; right: 0; bottom: 0; left: 0` — o input ocupa 100% do container

**Resultado:** clicar em qualquer lugar da caixa (imagem, texto, borda) ativa o input. E a navegacao por teclado funciona nativamente:
- **Tab:** foca no grupo de radios
- **Setas:** navega entre opcoes
- **Espaco:** seleciona a opcao focada

## Auto-fit vs auto-fill no grid

O instrutor usa `auto-fit` no `repeat()`. A diferenca crucial:

- **`auto-fit`:** colunas vazias colapsam, elementos existentes expandem para preencher o espaco
- **`auto-fill`:** colunas vazias sao mantidas mesmo sem conteudo

Para radio groups, `auto-fit` e ideal porque queremos que 2 opcoes em uma tela larga se expandam para preencher o espaco, nao que fiquem pequenas com colunas vazias ao lado.

### A funcao `minmax(7.5rem, 1fr)`

- **Minimo (7.5rem):** calculado a partir da largura da imagem (120px / 16 = 7.5rem). Abaixo disso, a coluna "quebra" para a linha seguinte
- **Maximo (1fr):** a coluna pode crescer indefinidamente, dividindo o espaco igualmente com outras colunas

Isso cria um layout que automaticamente vai de 1 coluna (tela estreita) ate N colunas (tela larga) sem nenhuma media query.

## Tres estados visuais via SVG

O instrutor exporta 3 SVGs do design:

1. **radial-default.svg** — estado normal (bolinha vazia)
2. **radial-hover.svg** — hover/focus (bolinha com cor highlight)
3. **radial-checked.svg** — selecionado (bolinha preenchida)

A troca e feita via `background-image` no CSS, nao manipulando o DOM. Isso e mais performatico que trocar `src` de `<img>` e permite usar a mesma tecnica com pseudo-elements se necessario.

## Seletores de estado no container

- **`:hover`** — mouse sobre o container
- **`:focus-within`** — algum filho dentro do container tem foco (o input)
- **`:has(:checked)`** — o container contem um input que esta checked

O `:has()` e particularmente poderoso aqui porque permite estilizar o ANCESTRAL baseado no estado de um DESCENDENTE — algo que era impossivel em CSS puro antes dessa feature.

## Acessibilidade garantida nativamente

Como o input radio real existe no DOM (apenas invisivel visualmente), toda a acessibilidade vem de graca:
- Leitores de tela identificam como radio button
- Navegacao por Tab e setas funciona
- `aria-` attributes podem ser adicionados normalmente
- Formularios submetem o valor correto