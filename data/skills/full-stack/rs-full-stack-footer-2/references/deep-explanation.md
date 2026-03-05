# Deep Explanation: Footer Layout com Grid e Flexbox

## Raciocínio do instrutor: Grid vs Flex no footer

O instrutor analisa o layout visualmente antes de codar. Sua abordagem:

1. **Observa o design e identifica caixas** — "Imagino que isso aqui é uma div... esse pode ser uma grid, esse fica de um lado, esse aqui fica no restante"
2. **Decide Grid para layout bidimensional** — quando tem colunas com conteúdo de tamanhos diferentes (logo de um lado, nav do outro)
3. **Decide Flex para alinhamento simples** — bottom section com ícones sociais e copyright lado a lado

### Por que `grid-template-columns: auto 1fr`?

- `auto` — a logo ocupa apenas o espaço que precisa
- `1fr` — a navegação ocupa todo o restante
- Isso elimina a necessidade de definir larguras fixas para a logo

### Por que `margin-left: auto` na nav?

Mesmo dentro de um grid, o `margin-left: auto` empurra a navegação para a direita, consumindo todo o espaço disponível no `1fr`. É o mesmo truque usado com Flexbox, mas aplicado dentro de uma célula grid.

### Por que `width: 14rem` nas ULs?

O instrutor observa que com `auto` no grid, as colunas de navegação ficam "grandes demais" com "pouco espaço". Definir uma largura fixa de 14rem garante que cada coluna de links tenha um tamanho consistente e previsível.

### Por que `align-content: start`?

Sem isso, o Grid distribui espaço vertical igualmente entre os itens da lista. Como cada coluna tem número diferente de itens (Produto: 3, Empresa: 3, Legal: 2), o comportamento padrão cria gaps visuais estranhos. `align-content: start` faz todos os itens colarem no topo.

## Divisão top/bottom

O instrutor divide o footer em duas seções semânticas:

- **Top**: conteúdo principal (logo + navegação) — usa Grid
- **Bottom**: informações secundárias (redes sociais + copyright) — usa Flex

Essa divisão facilita a responsividade porque cada seção pode ter breakpoints independentes.

## Padrão even-columns

A classe `even-columns` é reutilizável: no mobile empilha verticalmente, no desktop alinha horizontalmente. O gap de 4rem entre as colunas é maior que o gap interno de 1.5rem, criando hierarquia visual.

## scroll-behavior: smooth

O instrutor adiciona isso no final como um "toque fino". Observações:

- Aplica no elemento `html`, não no `body`
- Funciona automaticamente com âncoras `#id`
- Comportamento varia entre browsers: Safari é "bem mais rápido" que Edge/Chrome
- Não requer JavaScript
- O instrutor testa em múltiplos browsers (Chrome, Edge, Safari) para validar

## Padding inline responsivo

O footer usa padding-inline maior no mobile (3rem) e remove no desktop (0). Isso é o inverso do que muitos esperam. A razão: no mobile, o conteúdo precisa de mais respiro das bordas. No desktop, o container já limita a largura.

## Padrão de títulos de categoria

Os títulos das colunas (Produto, Empresa, Legal) são `<li>` com classe `title`, não `<h3>` ou `<h4>`. Isso mantém a estrutura semântica da lista limpa. O estilo é:
- Fonte muito pequena (0.75rem)
- Letter-spacing expandido (0.08em)
- Uppercase
- Cor primária da marca

Esse padrão é comum em footers profissionais e cria hierarquia sem usar headings dentro de listas.