# Deep Explanation: DatePicker Dinamico com URL State

## Por que URL como estado global?

O instrutor enfatiza um insight fundamental: a URL funciona como um "estado global" usando apenas features nativas do browser. Quando o usuario seleciona uma data:

1. A URL e atualizada com o search param `date`
2. O Next.js detecta a mudanca na URL
3. O server component rebusca os dados do banco (Prisma) com a nova data
4. A interface atualiza automaticamente

Isso elimina a necessidade de estado global (Context, Redux, Zustand) para filtros. O beneficio principal: **compartilhabilidade**. Se alguem acessa `?date=2025-09-08`, os agendamentos daquele dia ja carregam instantaneamente no servidor.

## next/navigation vs next/router

O instrutor corrige um erro comum: o `useRouter` importado de `next/router` pertence ao roteamento antigo (pasta Pages). No App Router, todos os hooks de navegacao vem de `next/navigation`:
- `useRouter` — navegacao programatica
- `usePathname` — caminho atual sem query string
- `useSearchParams` — acesso aos parametros de busca

## Janeiro = mes 0 no JavaScript

Ao parsear `"2025-09-08"` com split e criar `new Date(year, month, day)`, setembro (9) seria interpretado como outubro. O construtor `Date` do JavaScript usa meses base-0 (janeiro = 0, dezembro = 11). Por isso: `new Date(year, month - 1, day)`.

## Por que useCallback no getInitialDate?

A funcao `getInitialDate` e usada como dependencia do useEffect que sincroniza a URL com o estado local. Sem useCallback, uma nova referencia da funcao seria criada a cada render, causando execucoes desnecessarias do useEffect. O useCallback garante que a funcao so muda quando `dateParam` muda.

## Fluxo completo de sincronizacao

```
URL muda → useSearchParams detecta → useEffect dispara
→ getInitialDate parseia → compara getTime() → setDate se diferente
→ Componente re-renderiza com data atualizada

Usuario clica seta → handleNavigateDay → addDays
→ setDate (estado local) + updateURLWithDate (URL)
→ router.push → server component rebusca dados
```

## Formato PPP do date-fns

O formato `PPP` do date-fns produz datas por extenso localizadas. Com `locale: ptBR`, "2025-09-08" vira "8 de setembro de 2025". O instrutor usa isso para exibicao amigavel, enquanto a URL mantem o formato tecnico `yyyy-MM-dd`.

## Pattern de navegacao entre dias

A funcao `handleNavigateDay` aceita um numero que pode ser positivo (avancar) ou negativo (retroceder). Usando `addDays` do date-fns com valores negativos, a mesma funcao serve para ambas as direcoes. Se nao houver data selecionada, usa a data atual como base.