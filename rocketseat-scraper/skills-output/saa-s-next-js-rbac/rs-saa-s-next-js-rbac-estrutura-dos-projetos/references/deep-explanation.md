# Deep Explanation: Estrutura de Projetos Next.js

## Por que route groups em vez de pastas normais?

O instrutor explica que quando uma feature tem varios componentes (listagem, formulario, cards), colocar tudo no `page.tsx` fica desorganizado. A solucao do Next.js App Router sao os **route groups** — pastas com parenteses `(nome)` que agrupam arquivos sem criar segmentos na URL.

Exemplo concreto: a pagina de projetos e a home de uma organizacao (`/org/[slug]`). O `page.tsx` ja existe ali. Ao criar `(projects)/page.tsx` e mover o conteudo, a URL continua igual mas agora existe uma pasta para co-locar componentes como `project-list.tsx`.

## Por que nao fazer redirect quando sem permissao?

O instrutor levanta um ponto sutil: se um usuario com role `billing` nao pode ver projetos, o instinto seria fazer redirect para `/billing`. Mas e se no futuro existir uma role que nao pode ver nem projetos NEM billing? O redirect criaria um loop ou enviaria para uma pagina sem permissao.

A solucao mais segura e mostrar uma mensagem inline ("You are not allowed to see organization projects") e deixar o usuario navegar manualmente. Isso evita assumptions sobre quais rotas cada role pode acessar.

## Botao como Link com asChild

O padrao `<Button asChild>` do shadcn/ui permite que o `Button` delegue sua renderizacao para o filho. Combinado com `<Link>` do Next.js, o botao se comporta como link (navegacao client-side) mas mantem toda a estilizacao do Button component.

## Criando variant xs no Button

O shadcn/ui vem com sizes `default`, `sm`, `lg`, `icon`. Para cards compactos, o instrutor cria um size `xs` customizado:

```typescript
xs: "h-6 px-2 text-xs"
```

Isso produz um botao bem pequeno, ideal para acoes secundarias dentro de cards.

## Line-clamp para consistencia visual

Descricoes de projetos podem ter tamanhos muito variados. Sem `line-clamp`, cards ficam com alturas diferentes, quebrando o grid visual. O instrutor usa `line-clamp-2` com `leading-relaxed` para manter 2 linhas visiveis com boa legibilidade.

## Avatar em contexto compacto

O Avatar padrao do shadcn e `size-8` ou `size-10`, que e grande demais para um card footer. O instrutor reduz para `size-4` (16px) que fica proporcional ao texto `text-xs` ao redor.

## Interceptacao de rotas para modais

O botao "Create Project" navega para `/org/[slug]/create-project`, mas essa rota e interceptada pelo Next.js (usando a convencao `(.)create-project` ou similar) para abrir como modal/sheet. Isso significa que a rota funciona tanto como pagina standalone quanto como modal quando acessada via navegacao interna.