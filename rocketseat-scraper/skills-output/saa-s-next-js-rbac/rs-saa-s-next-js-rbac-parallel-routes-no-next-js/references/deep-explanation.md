# Deep Explanation: Parallel Routes no Next.js

## O problema que motivou Parallel Routes

O instrutor demonstrou um problema fundamental do Next.js App Router: **layouts nao recarregam ao mudar de rota**. Quando ele colocou o `<Header />` dentro do `layout.tsx`, ao trocar de organização (ex: de admin para member), o header continuava mostrando os dados antigos. Isso acontece porque o layout do Next, uma vez carregado, persiste entre navegações — apenas o conteúdo de `page.tsx` (o `children`) é substituído.

A solução foi mover o header para dentro de cada `page.tsx`, garantindo que ele recarrega a cada navegação.

## Como Parallel Routes funcionam

Parallel Routes permitem que **duas (ou mais) "páginas" sejam exibidas simultaneamente na mesma URL**. O mecanismo é:

1. Crie uma pasta dentro de `app/` com prefixo `@` (ex: `@teste`)
2. Dentro dela, crie um `default.tsx` (fallback obrigatório)
3. No `layout.tsx` do mesmo nível, além de `children`, você recebe uma nova prop com o nome da pasta (sem o `@`)

Cada slot tem sua própria árvore de rotas. Se você criar `@teste/create-organization/page.tsx`, quando o usuário navegar para `/create-organization`, o slot `teste` vai renderizar o conteúdo dessa sub-rota, enquanto `children` renderiza o `page.tsx` normal de `create-organization`.

## Comportamento do `default.tsx`

O `default.tsx` é o fallback que o Next usa quando a rota atual não tem correspondência dentro do slot. Por exemplo, se o usuário está em `/` e existe `@teste/default.tsx` mas não `@teste/page.tsx`, o Next renderiza o `default.tsx`.

## Bugs conhecidos (versão RC)

O instrutor mencionou que durante o desenvolvimento com a versão Release Candidate do Next.js 15 com TurboPack, houve loops infinitos de renderização ao usar Parallel Routes. Um simples F5 resolveu. Isso é esperado em versões RC e provavelmente não ocorre na versão estável.

## Relação com Interception Routes

O instrutor enfatizou que Parallel Routes ganham poder real quando combinadas com **Interception Routes**. A combinação permite criar experiências como:
- Modal que abre sobre a página atual (Parallel Route exibe o modal)
- Se o usuário acessar a URL diretamente, vê a página completa em vez do modal
- Padrão usado pelo Instagram, onde clicar numa foto abre modal, mas a URL direta mostra a página da foto

O instrutor prometeu mostrar essa combinação na próxima aula.

## Por que o layout não recarrega

Esse é um design deliberado do Next.js App Router para performance. O layout é um "shell" persistente — ele mantém estado, não re-renderiza, e permite transições suaves. Apenas os segmentos de rota que mudam são re-renderizados. Isso é ótimo para sidebars, navbars estáticas, mas problemático quando o layout precisa reagir à mudança de URL (como mostrar o nome da organização atual no header).