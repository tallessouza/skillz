# Deep Explanation: Estrutura do Board

## Por que dvh ao inves de vh/screen?

O instrutor explica que `h-dvh` (Dynamic Viewport Height) é superior ao `h-screen` (que usa apenas `vh`) porque o DVH é uma altura adaptativa. Em mobile e outros navegadores, ele exclui do calculo de altura elementos como a toolbar e a barra de endereco. Isso resolve o problema classico de layouts que "quebram" em mobile porque o `100vh` inclui a area da barra de navegacao.

## A tecnica do border de 0.5px

Uma tecnica visual que "poucas pessoas fazem" segundo o instrutor: ao inves de usar `border` que adiciona 1px de borda (pesado visualmente), usar `border-[0.5px]` cria uma linha tao fina que parece mais uma sombra do que uma borda. Combinado com uma cor intermediaria da paleta (navy-500), cria profundidade visual sem peso.

## Paleta Navy — cinza puxado para azul

O instrutor escolheu deliberadamente uma paleta de cinzas com leve tom azulado (chamada "navy") ao inves de cinzas puros. Isso da uma sensacao mais sofisticada e menos "flat" ao design. A escala vai de navy-50 (quase branco) ate navy-950 (quase preto), com tons intermediarios para bordas, backgrounds de colunas, e texto secundario.

## Por que subsets: ["latin"] apenas?

Fontes Google como Inter suportam dezenas de subsets (latin, cyrillic, greek, vietnamese, etc). Cada subset adiciona peso ao download. Como a aplicacao so usa caracteres latinos, carregar outros subsets seria desperdicio de banda. O instrutor enfatiza: "não tem que carregar todos os subsets da fonte, vai deixar muito pesada."

## Grid 4 colunas — mapeamento direto com status

As 4 colunas do grid mapeiam diretamente para os 4 status de um board Kanban:
1. **Backlog** — tarefas no backlog
2. **To Do** — tarefas a fazer
3. **In Progress** — em andamento
4. **Done** — finalizadas

Usar `grid-cols-4` garante colunas de largura igual, e `items-stretch` faz todas terem a mesma altura independente do numero de cards.

## Estrutura hierarquica do layout

```
Container (max-w-[1620px], centralizado, h-dvh)
├── Header (placeholder por enquanto)
└── Main/Board (grid 4 colunas, flex-1)
    └── Coluna (bg, rounded, border sutil)
        ├── Header da coluna (titulo + icone + contador)
        └── Content (cards com scroll)
            └── Cards (divs por enquanto)
```

O `flex-1` no main é crucial: faz o board ocupar todo o espaco restante que o header nao usa, preenchendo a tela inteira.

## Decisao de nao ser responsivo

O instrutor explicitamente diz que nao vai focar em responsividade: "essa aplicação eu não vou me concentrar em criar ela com o layout responsivo". Isso é pragmatico para o escopo da aula — o foco é na logica do board, nao no CSS responsivo. Em producao, seria necessario adaptar o grid para menos colunas em telas menores.

## Comentarios como substitutos temporarios de componentes

O instrutor usa comentarios `{/* Header */}` e `{/* Content */}` como marcadores antes de extrair componentes. Ele mesmo admite que "não criar componentes às vezes confunde a gente" — reforçando que a extração em componentes é o próximo passo natural apos a estrutura visual estar definida.