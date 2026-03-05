# Deep Explanation: Componentizacao Angular

## Estrutura do componente

Um componente Angular e composto de tres partes fundamentais:

1. **Template (HTML)** — define a forma visual. E HTML normal com as tags do componente. Um botao sera uma `<button>`, uma lista sera `<div>` com filhas, etc.

2. **Classe (TypeScript)** — contem a logica. Propriedades guardam o estado, metodos executam acoes. Quando o usuario clica num botao, o metodo que responde esta aqui. Chamadas HTTP, manipulacao de dados — tudo na classe.

3. **Estilos (CSS/SCSS)** — aparencia visual especifica daquele componente. Por padrao, SCSS precisa ser configurado na aplicacao; CSS vem como padrao.

## Por que usamos componentes

O instrutor destaca quatro pilares:

### Reutilizacao
Um componente pode ser referenciado dentro de outros componentes. O `comp1` pode aparecer dentro do `comp2`, do `comp3` e do `app.component`. Ao criar um componente, sempre pergunte: "ele e facil de reutilizar ou esta muito acoplado?" Mesmo que alguns componentes nao sejam reutilizados, pensar em reutilizacao faz voce escrever codigo mais facil de manter.

### Organizacao e modularidade
O `app.component` e o componente base carregado primeiro. Voce *poderia* colocar todo HTML, CSS e TypeScript nele — mas imagine 1.000, 2.000, 4.000 linhas de HTML. Seria uma bagunca. Dividir em componentes menores facilita entendimento e manutencao.

### Encapsulamento
Na configuracao padrao, classes CSS de um componente sao especificas dele. Uma classe `.teste` no `comp1` e outra `.teste` no `comp2` nao conflitam. O instrutor enfatiza: **99,9% das vezes, mantenha o encapsulamento padrao.** Mudar isso causa bugs de estilo "muito, muito, muito chatos."

### Gerenciamento de estado
Cada componente tem seu proprio estado via propriedades da classe. O valor persiste enquanto o componente esta vivo na aplicacao.

## Comunicacao entre componentes (spoiler do instrutor)

- **Pai → Filho:** via `@Input()`
- **Filho → Pai:** via `@Output()`
- **Componentes desconectados:** via Services

## A analogia do meio termo (insight do instrutor)

O instrutor enfatiza que encontrar a granularidade certa e uma habilidade que **so vem com o tempo**. Ele proprio continua melhorando suas componentizacoes com experiencia. O segredo e evitar dois extremos:

1. **Monolito** — tudo num componente so (dificil manter)
2. **Micro-componentizacao** — componente para cada tag (muitos arquivos, dificil manter)

O exercicio pratico sugerido: pegar layouts do Figma da Rocketseat e praticar a divisao em componentes antes de codar.

## Quando separar em componentes filhos

O instrutor usa exemplos concretos de layouts:

**Tela de login simples** — formulario + imagem + botao. Poucas responsabilidades, nao precisa de filhos. Um unico componente basta.

**Tela de registro com upload** — o upload de imagem tem tratativa propria (capturar, redimensionar, validar). Merece componente proprio.

**Home com header + calendario + cartao + lancamentos** — muitas responsabilidades distintas. Separar em filhos: HeaderComponent, CalendarComponent, CardComponent, TransactionsListComponent + TransactionItemComponent.

## O padrao lista + item

O instrutor destaca especialmente esse padrao: quando ha uma lista de itens, criar dois componentes — um que faz o loop e outro que representa o item individual. Razoes:

1. O item geralmente tem logica propria
2. Responsabilidades ficam bem definidas
3. Facilita encontrar bugs ("bug no item? vou no componente do item")