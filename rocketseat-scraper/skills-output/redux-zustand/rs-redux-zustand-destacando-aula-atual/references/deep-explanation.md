# Deep Explanation: Destacando Aula Atual

## Por que data attributes ao inves de ternarios no className?

O instrutor menciona que "uma das coisas que eu mais gosto de fazer" e usar data attributes para styling condicional com Tailwind. A razao e pratica:

1. **Legibilidade** — `data-[active=true]:text-emerald-400` e declarativo. Voce le a classe e entende a condicao. Com ternarios, o className vira uma sopa de template literals.

2. **Composicao** — se voce tem 3 estados visuais diferentes (active, loading, error), com ternarios voce tem combinacoes exponenciais. Com data attributes, cada um e independente: `data-[active=true]:`, `data-[loading=true]:`, `data-[error=true]:`.

3. **CSS nativo** — data attributes funcionam com CSS puro tambem. Se amanha voce migrar de Tailwind, o padrao sobrevive.

## Selector derivado vs multiplos selectors

O instrutor comeca pegando `currentLesson` e percebe que precisa tambem do `currentModule` (para o titulo no header). Em vez de criar dois hooks separados, ele reestrutura o selector para retornar ambos:

```typescript
return { currentModule, currentLesson }
```

Isso e importante porque:
- **Um unico subscribe** no store — menos re-renders
- **Logica colocada** — se o calculo de "aula ativa" muda, muda em um lugar so
- **Desestruturacao limpa** no componente consumidor

## disabled + enabled:hover — o detalhe que importa

O instrutor para pra pensar: "se e aula ativa, nao faz sentido o usuario clicar de novo". Entao:

1. Adiciona `disabled={isCurrent}` — previne o click
2. Troca `hover:` por `enabled:hover:` — o hover so aparece em botoes habilitados

Esse par (`disabled` + `enabled:hover`) e um padrao reutilizavel em qualquer lista onde o item selecionado nao deve ser re-clicavel.

## Fluxo de dados: onde calcular isCurrent

O instrutor nota que o componente `Lesson` nao tem acesso ao `moduleIndex` (so recebe dados da lesson individual). Entao a decisao e:

- Calcular `isCurrent` no componente `Module` (que tem `moduleIndex`)
- Passar como prop para `Lesson`

Isso respeita o principio de que **o componente que tem o contexto faz o calculo**, e o componente filho so recebe o resultado booleano.

## Icone como indicador visual

Alem da cor, o instrutor troca o icone: `Video` para aulas normais, `PlayCircle` para a aula ativa. Isso e acessibilidade basica — nao depender apenas de cor para comunicar estado. O `PlayCircle` tambem recebe `text-emerald-400` para manter consistencia visual.