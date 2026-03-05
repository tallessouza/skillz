# Deep Explanation: Adicionando o Calendar

## Por que Controlled Component?

O instrutor enfatiza que o Calendar deve ser um **Controlled Component** — ou seja, o estado da data selecionada é gerenciado externamente (via `useState`) e passado ao componente via props `selected` e `onSelect`. Isso é fundamental porque:

1. **A URL é a source of truth** — Em Next.js, filtros e estados de navegacao devem refletir na URL para que o usuario possa compartilhar links e usar o botao de voltar
2. **O Popover precisa fechar ao selecionar** — Sem controle externo do estado, nao ha como fechar o popover programaticamente apos a selecao
3. **Multiplos componentes dependem da mesma data** — O botao de trigger mostra a data formatada, os agendamentos filtram pela data, tudo precisa reagir a mesma fonte

## Padrao Popover + Calendar

O instrutor mostra a composicao:

```
Popover (controlado: open/onOpenChange)
├── PopoverTrigger (button com icone + data formatada)
└── PopoverContent (sem borda, padding zero)
    └── Calendar (mode single, controlled, locale ptBR)
```

Esse padrao e recorrente em aplicacoes Next.js com shadcn/ui. O Popover gerencia a visibilidade, o Calendar gerencia a selecao, e o handler conecta ambos.

## Sincronizacao com URL

O handler `handleDateSelect` faz duas coisas:
1. Atualiza a URL com a data selecionada (para que a pagina reaja)
2. Fecha o popover (UX: selecionar = confirmar)

Isso segue o padrao Next.js de usar searchParams para estado de UI que precisa ser compartilhavel/bookmarkavel.

## Ajustes visuais importantes

O instrutor destaca dois problemas visuais comuns:

1. **Borda indesejada** — O PopoverContent tem border padrao que conflita com o Calendar. Solucao: `border-0`
2. **Desalinhamento** — O padding padrao do PopoverContent empurra o Calendar. Solucao: `p-0` e `w-auto`

Esses ajustes parecem pequenos mas fazem diferenca significativa na qualidade visual.

## Motivacao para extrair sub-componente

No final da aula, o instrutor antecipa que o botao com as setas de navegacao sera reutilizado em outro lugar. Em vez de duplicar a estilizacao, ele propoe extrair um sub-componente do DatePicker. Isso sera feito na proxima aula — a decisao de quando extrair (quando ha repeticao real, nao hipotetica) e um bom exemplo de pragmatismo.

## Locale e formatacao

O instrutor usa `ptBR` como locale tanto no Calendar quanto na formatacao da data exibida no trigger. O formato escolhido foi `dd 'de' MMMM` (ex: "16 de Janeiro"), seguindo o design do Figma. Isso mostra a importancia de manter consistencia entre o design e a implementacao.