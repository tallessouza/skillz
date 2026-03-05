# Deep Explanation: Criando o Navigation Button

## Por que extrair o componente

O instrutor identifica que dentro do DatePicker existem botoes de navegacao (dia anterior/proximo dia) que compartilham a mesma estrutura: um Button com estilizacao especifica envolvido por um Tooltip. Em vez de duplicar esse markup, ele extrai um `NavigationButton` reutilizavel.

A decisao de criar o componente **dentro da pasta do DatePicker** e intencional — o NavigationButton so faz sentido nesse contexto. Nao precisa ir para `components/ui/` porque nao e um componente generico do design system.

## A estrutura do Tooltip no shadcn/ui

O Tooltip do shadcn/ui (baseado no Radix UI) tem uma hierarquia obrigatoria:

```
TooltipProvider (contexto global do delay/comportamento)
  └── Tooltip (instancia individual)
       ├── TooltipTrigger (elemento que ativa o tooltip no hover)
       │    └── [seu elemento clicavel]
       └── TooltipContent (o conteudo exibido)
```

O `asChild` no `TooltipTrigger` e essencial: sem ele, o Radix renderiza um `<button>` extra envolvendo seu Button, quebrando a semantica e o estilo. Com `asChild`, o trigger "herda" o elemento filho diretamente.

## Decisoes de estilizacao

O instrutor usa `variant="outline"` e `size="icon"` como base do shadcn Button, depois sobrescreve com classes Tailwind para:

- **Dimensoes**: `h-9 w-9` (36px) para manter consistencia com o trigger do Popover do calendario
- **Cores**: `bg-transparent`, `border-primary`, `text-primary` para estado default
- **Hover**: `hover:bg-background/80` para feedback visual sutil
- **Focus**: `focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-brand` para acessibilidade

A ideia e que o NavigationButton tenha visual consistente com o botao trigger do Popover do calendario, mantendo a mesma linguagem visual.

## O tooltip como ferramenta de usabilidade

O instrutor enfatiza que o tooltip serve para "aumentar a usabilidade" — quando o usuario passa o mouse sobre as setas de navegacao, ele ve "Dia anterior" ou "Proximo dia". Isso e especialmente importante em botoes que contem apenas icones, sem texto visivel.

## Sobre o TooltipContent

O instrutor menciona que o `TooltipContent` tem um "arrow" (setinha) por padrao. Ele mostra que pode ser estilizado ou removido. No caso dele, preferiu remover/simplificar. A customizacao do `TooltipContent` com `className` permite ajustar background, cor e outros estilos.

## Instalacao do componente shadcn

Antes de usar o Tooltip, o instrutor roda a instalacao via CLI do shadcn: isso gera os arquivos do componente em `components/ui/tooltip.tsx` com os exports necessarios (Tooltip, TooltipContent, TooltipProvider, TooltipTrigger).