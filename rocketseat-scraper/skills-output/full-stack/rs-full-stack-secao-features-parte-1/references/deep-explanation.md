# Deep Explanation: Secao Features — Grid Layout Responsivo

## Por que import condicional ao inves de media query?

O instrutor usa `@import url("features.css") (width >= 80rem)` ao inves de `@media` queries dentro do arquivo. A razao e arquitetural: o arquivo `features.css` **so e carregado quando a tela e desktop**. Isso significa:

1. No mobile, o browser nem baixa esse CSS (ou baixa com prioridade baixa)
2. O arquivo de features contem APENAS regras de desktop — zero confusao sobre contexto
3. Nao precisa usar `@media` dentro do arquivo porque o proprio import ja filtra

Essa tecnica elimina a necessidade de repetir media queries e mantem cada arquivo CSS focado em um unico contexto.

## Grid Lines — modelo mental

O instrutor faz uma recapitulacao importante sobre como grid lines funcionam:

```
Linha 1  |  Linha 2  |  Linha 3  |  Linha 4  |  Linha 5
   |         |            |            |            |
   | col 1   |   col 2    |   col 3    |   col 4   |
   |17.5rem  |    1fr     |    1fr     |  17.5rem  |
```

Cada "fatia" (track) fica ENTRE duas linhas. Quando voce diz `grid-column: 2 / 4`, o elemento comeca na linha 2 e termina na linha 4, ocupando as colunas 2 e 3 (os dois `1fr` centrais).

O instrutor enfatiza: **linhas nao sao colunas**. A linha 1 e o inicio, a coluna 1 fica entre linha 1 e linha 2.

## Por que 4 colunas e nao 3?

A pergunta que o instrutor antecipa: "Mike, por que voce criou duas colunas no meio e nao uma?"

A resposta vem do layout da segunda linha de cards (parte 2 da aula). Na segunda linha, havera cards que precisam de um espaco visual no centro — uma divisao entre dois cards. Se houvesse apenas uma coluna central (`1fr`), nao seria possivel criar esse gap visual. Com duas colunas centrais (`1fr 1fr`), cada card pode ocupar uma metade, e o `gap` do grid cria naturalmente o espaco entre eles.

Essa decisao e tomada **olhando o layout completo** antes de comecar a codar. O instrutor analisa o design e identifica:
- Colunas fixas de 17.5rem nas extremidades (280px no Figma)
- Espaco de 32px entre cards centrais → indica divisao de coluna
- Alturas de 400px por linha → `25rem`

## Imagens desktop-only

O segundo card tem uma estrutura diferente: texto + imagem grande. A imagem so aparece no desktop. A solucao:

1. Wrapper `div` para o conteudo textual (icone, h3, p)
2. `img` fora do wrapper, com classe `desktop-only`
3. No mobile: imagem escondida, card mostra so texto
4. No desktop: grid interno do card posiciona texto e imagem lado a lado

## Sobre acessibilidade de icones

O instrutor menciona que icones decorativos podem ter `alt=""` vazio, mas se voce quiser melhorar a acessibilidade, escreva algo como `alt="icone de varinha magica"`. Para leitores de tela, o alt vazio faz o leitor ignorar a imagem (comportamento correto para icones decorativos).

## Ferramenta de clipboard

O instrutor usa o Alfred (macOS) para manter historico de clipboard. Equivalentes:
- Windows: Ditto, ClipboardFusion, ou Win+V nativo
- Linux: CopyQ, GPaste