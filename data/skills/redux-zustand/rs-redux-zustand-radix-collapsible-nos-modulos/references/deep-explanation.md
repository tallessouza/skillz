# Deep Explanation: Radix Collapsible nos Módulos

## O que é o Radix

Radix é uma biblioteca de componentes que traz **funcionalidade sem estilização**. Diferente de bibliotecas como Material UI ou Chakra, o Radix fornece apenas o comportamento (acessibilidade, gerenciamento de estado, keyboard navigation) e deixa toda a estilização por conta do desenvolvedor.

O Collapsible é um dos primitivos mais simples do Radix — permite abrir e fechar um conteúdo.

## Anatomia do Collapsible

Três partes:
- **Root** — wrapper que gerencia o estado e injeta `data-state="open"` ou `data-state="closed"`
- **Trigger** — o botão que alterna o estado (renderiza como `<button>`)
- **Content** — o conteúdo que aparece/desaparece

## Data Attributes do Radix

O ponto-chave do Radix é que ele injeta `data-state` nos elementos automaticamente. Isso permite estilização puramente via CSS/Tailwind sem precisar de estado React.

Quando o módulo está aberto: `data-state="open"`
Quando fechado: `data-state="closed"`

No Tailwind, isso se traduz em: `data-[state=open]:alguma-classe`

## O problema do Group

O `data-state` só é injetado no **Root** e no **Trigger**, não em elementos filhos internos como ícones SVG. Se você tentar usar `data-[state=open]:rotate-180` diretamente no ícone ChevronDown, não vai funcionar porque o SVG não possui o atributo `data-state`.

A solução do Tailwind é o conceito de **group**:

1. Adicione `group` como classe no elemento pai que tem o data attribute (o Root)
2. Use `group-data-[state=open]:` nos filhos que precisam reagir ao estado do pai

Isso funciona porque o Tailwind gera seletores CSS que olham para o estado do ancestral com classe `group`.

## Decisão: Content por volta vs substituindo

O instrutor inicialmente tentou substituir o `<nav>` pelo `Collapsible.Content`, mas percebeu que o `<nav>` tinha estilização própria. A solução correta é **envolver** o `<nav>` com `Collapsible.Content`, mantendo a semântica e os estilos existentes.

## Independência dos módulos

Cada `Collapsible.Root` gerencia seu próprio estado independentemente. Não é um accordion (onde só um pode estar aberto) — múltiplos módulos podem estar abertos simultaneamente. Se precisar de comportamento accordion, use o primitivo `Accordion` do Radix.

## Transição suave

Adicionar `transition-transform` no ícone de chevron cria uma animação suave na rotação. Sem isso, a mudança é abrupta.