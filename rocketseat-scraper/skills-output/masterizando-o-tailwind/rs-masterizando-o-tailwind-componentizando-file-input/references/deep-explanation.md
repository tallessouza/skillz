# Deep Explanation: Componentizando File Input

## Por que composition pattern para file inputs?

O instrutor explica que quando voce pensa no componente de upload como "uma coisa so", fica muito dificil reaproveitar partes dele. Por exemplo, o botao de trigger (a label clicavel) e identico entre o upload de avatar (com preview) e o upload de portfolio (sem preview, com lista de arquivos). Mas se o componente e monolitico, voce acaba duplicando codigo ou enchendo de props condicionais.

## Quando usar composition vs componente unico

O instrutor deixa claro: "quando e um componente pequeno, como o Input que so tem possibilidade de ter icone ou nao, da pra colocar tudo no mesmo arquivo." Mas quando o componente cresce e tem partes que podem ser incluidas ou omitidas dependendo do contexto, composition pattern e o caminho.

A regra e: **se voce quer utilizar partes diferentes do componente em varios lugares, use composicao.**

## O insight do htmlFor

Um ponto importante que o instrutor destaca: quando voce tem dois file inputs na mesma pagina, se ambos os Triggers usam o mesmo `htmlFor="photo"`, clicar em qualquer um vai abrir o mesmo input. Isso e um bug sutil do HTML que o composition pattern torna explicito — cada Control precisa de um `id` unico.

O instrutor menciona que "a gente vai ter que fazer de uma forma um pouquinho diferente" para resolver isso, indicando que em aulas futuras isso sera tratado (provavelmente com Context API ou useId).

## Analogia com o componente Input

O padrao e identico ao que foi feito com o Input (que usa composicao para ter ou nao ter icone). O file input segue a mesma filosofia mas com mais subcomponentes porque tem mais variacoes possiveis:
- Com/sem preview
- Single/multiple files
- Diferentes tipos de accept (imagem, PDF, etc.)

## Decisao de estrutura de pastas

O instrutor cria uma pasta `Form/` para agrupar componentes relacionados a formulario (Input, FileInput). Dentro de FileInput, cada subcomponente tem seu arquivo. O barrel file (index.ts) re-exporta tudo, permitindo o import com `* as FileInput`.

## Por que o Control e um componente separado

O instrutor explica que mesmo sendo "apenas um input", o Control precisa ser customizavel:
- No upload de avatar: `accept="image/*"` (apenas imagens)
- No upload de portfolio: aceita PDF e outros formatos
- Em cima: single file
- Embaixo: `multiple` files

Quando voce quer customizar alguma parte de um componente maior usando composition, voce separa aquela parte em um componente menor.