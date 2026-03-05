# Deep Explanation: Alinhamentos Self no CSS Grid

## A hierarquia Content → Items → Self

O instrutor fecha a sequencia de alinhamentos CSS Grid explicando a hierarquia completa:

1. **Content** (`align-content`, `justify-content`, `place-content`) — aplicado no **container**, move **todo o conteudo** do grid como um bloco dentro do espaco disponivel
2. **Items** (`align-items`, `justify-items`, `place-items`) — aplicado no **container**, define o alinhamento **padrao** para todos os filhos
3. **Self** (`align-self`, `justify-self`, `place-self`) — aplicado no **item filho**, sobrescreve o padrao para aquele item especifico

## O significado de "self"

O instrutor usa uma analogia linguistica: "self" vem do ingles, como em "myself" (eu mesmo). Entao `align-self` significa "o alinhamento dele mesmo" — e o proprio item que decide onde fica, independente dos irmaos.

## Modelo mental dos eixos

O padrao CSS Grid e consistente:
- **align** = eixo de bloco (vertical em escrita horizontal) = eixo Y
- **justify** = eixo inline (horizontal em escrita horizontal) = eixo X
- **place** = shorthand que aplica ambos, sempre na ordem `<bloco> <inline>` (Y primeiro, X depois)

Isso vale para content, items e self — a unica diferenca e o escopo de aplicacao.

## Pensando no posicionamento

O instrutor sugere "brincar mentalmente" para preencher as lacunas. O grid cria celulas, e cada celula tem espaco. O item por padrao ocupa toda a celula, mas com self voce pode posiciona-lo em qualquer ponto dentro dessa celula:

```
start/start  |  start/center  |  start/end
-------------|----------------|------------
center/start | center/center  | center/end
-------------|----------------|------------
end/start    |  end/center    |  end/end
```

Cada combinacao de `align-self` (linhas) e `justify-self` (colunas) coloca o item em um dos 9 pontos da celula.

## Quando usar self vs items

- Se **todos** os items devem ter o mesmo alinhamento → use `align-items`/`justify-items` no container
- Se **um item** precisa ser diferente → use `align-self`/`justify-self` naquele item
- Self **sobrescreve** items — entao voce pode definir um padrao com items e excepcoes com self