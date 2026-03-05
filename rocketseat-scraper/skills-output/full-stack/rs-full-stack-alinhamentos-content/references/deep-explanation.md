# Deep Explanation: Alinhamentos de Content no CSS Grid

## Por que content alignment existe?

Quando voce define um grid com tamanhos fixos (ex: `repeat(3, 100px)`) dentro de um container maior (ex: `100vh`), sobra espaco. Esse espaco livre e onde o content alignment atua.

Se voce usar `1fr` para preencher todo o espaco, nao sobra nada — e align-content/justify-content nao tem efeito visivel.

## Os dois eixos

O instrutor enfatiza a distincao:

- **Eixo Y (vertical)** = `align-content` — controla a distribuicao das ROWS dentro do container
- **Eixo X (horizontal)** = `justify-content` — controla a distribuicao das COLUMNS dentro do container

Analogia visual: imagine o grid como uma caixa preta (o container) com blocos coloridos dentro. O align-content move os blocos pra cima/baixo, o justify-content move pra esquerda/direita.

## O conceito de "content"

"Content" aqui se refere ao GRID INTEIRO (todas as tracks juntas), nao a items individuais. E diferente de `align-items`/`justify-items` que alinham cada item DENTRO da sua celula.

## space-between vs space-around vs space-evenly

- **space-between**: espaco SOMENTE entre os elementos. Primeiro elemento gruda no inicio, ultimo no final.
- **space-around**: cada elemento recebe espaco igual ao seu REDOR. Isso faz com que o espaco entre dois elementos seja o DOBRO do espaco nas bordas.
- **space-evenly**: espaco IDENTICO em todos os lugares — entre elementos E nas bordas. O instrutor destaca que e "muito bonito" e provavelmente util, mesmo que ele nao use frequentemente.

## place-content como shorthand

`place-content` aceita um ou dois valores:
- `place-content: center` → aplica center para align-content E justify-content
- `place-content: end start` → align-content: end, justify-content: start

O instrutor demonstra que `place-content: end` joga o conteudo pro canto inferior direito, porque aplica end nos dois eixos. Ele nota que nao existe um valor unico para jogar pro canto superior direito, por exemplo — seria necessario usar valores separados.

## Quando cada propriedade importa

| Container tem espaco sobrando em... | Propriedade que atua |
|--------------------------------------|---------------------|
| Vertical (height > soma das rows) | `align-content` |
| Horizontal (width > soma das columns) | `justify-content` |
| Ambos | `place-content` |
| Nenhum (grid preenche tudo) | Nenhuma tem efeito |

## Setup minimo para testar

O instrutor usa um setup simples para demonstrar:
- Container com `height: 100vh` e `width: 100vw`
- `background: black` no container para visualizar o espaco sobrando
- Grid com tamanhos fixos (`100px`) que nao preenchem o container
- `gap: 8px` para separar visualmente os items
- Reset CSS com `margin: 0` e `box-sizing: border-box`