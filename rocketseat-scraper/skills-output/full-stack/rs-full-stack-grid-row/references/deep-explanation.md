# Deep Explanation: Grid Row

## Linhas Virtuais de Row vs Column

O instrutor faz questão de diferenciar claramente: quando falamos de `grid-row`, estamos nos referindo às **linhas virtuais horizontais** que dividem o grid em faixas verticais (rows). Não confundir com as linhas virtuais de coluna.

Num grid com 3 rows definidas, existem **4 linhas virtuais de row**: 1, 2, 3, 4. A linha 1 é o topo, a linha 4 é a base.

O instrutor reforça: "linha virtual eu estou me referindo a esse começo e a esse fim do grid" — são os limites, não as faixas em si.

## Grid Implícito — Linhas Criadas Automaticamente

Conceito crucial demonstrado na aula: quando um item ocupa rows 1-4 (todo o grid explícito), mas existem outros items sem configuração de row, o grid **extrapola** e cria linhas adicionais automaticamente.

O instrutor mostra isso no DevTools: "existe um dois três entretanto tem mais outras duas que ele criou automaticamente porque não há configurações para esses carinhas".

Isso significa que o grid definido com `grid-template-columns: 1fr 1fr 1fr` (3 colunas, criando implicitamente 3 rows) pode acabar tendo 5+ rows se items não configurados precisarem de espaço.

## Auto-placement é Inteligente

Insight importante do instrutor: após configurar apenas o header (grid-row: 1/4) e o main (grid-column: 2/4, grid-row: 1/3), o aside e o footer **se posicionaram sozinhos** nos espaços corretos.

Citação: "por que eu não precisei mexer neles? porque automaticamente o grid sabe que está faltando dois espaços aqui e está colocando os dois elementos aqui"

## Não Faça Engenharia Demais

Filosofia do instrutor aplicada ao grid: "às vezes a gente não precisa fazer uma engenharia demais assim para as coisas, às vezes foram duas coisinhas que eu mexi e o resto ele já se ordenou".

Na prática: configure explicitamente apenas os items que precisam cruzar múltiplas rows/columns. Os demais se encaixam pelo algoritmo de auto-placement.

## Shorthand vs Longhand

`grid-row: 1 / 4` é shorthand para:
```css
grid-row-start: 1;
grid-row-end: 4;
```

O instrutor demonstra primeiro a versão longa para fins didáticos, depois troca pela curta. Na prática, sempre use a shorthand.

## Relação com grid-column

A aula conecta com a aula anterior (grid-column). O posicionamento completo de um item no grid requer potencialmente as duas propriedades:

```css
.main {
  grid-column: 2 / 4;  /* eixo horizontal */
  grid-row: 1 / 3;     /* eixo vertical */
}
```

O instrutor antecipa que existe outra forma de posicionar (grid-template-areas), que será vista na próxima aula.