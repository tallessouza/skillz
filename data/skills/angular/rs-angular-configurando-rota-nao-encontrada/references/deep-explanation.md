# Deep Explanation: Configurando Rota Nao Encontrada

## Por que o wildcard deve ser o ultimo

O Angular Router avalia as rotas de cima para baixo. A primeira rota que faz match e usada. O `path: '**'` faz match com qualquer URL, entao se estiver antes de outras rotas, nenhuma rota abaixo dele sera alcancada.

## Fluxo completo de redirecionamento

O instrutor demonstrou um cenario interessante: ao digitar `/teste`, o fluxo foi:

1. `/teste` nao existe → wildcard captura
2. Wildcard redireciona para `/login`
3. Guard de login verifica que usuario ja esta autenticado
4. Guard redireciona para `/explore` (area autenticada)

Isso mostra que o wildcard trabalha em conjunto com guards existentes. O redirect nao "pula" os guards — ele faz um redirect normal e o destino passa por toda a pipeline de navegacao do Angular (guards, resolvers, etc).

## Sobre o pathMatch

- `pathMatch: 'full'` — o path inteiro da URL deve corresponder ao pattern
- `pathMatch: 'prefix'` — apenas o inicio da URL precisa corresponder

Para wildcard routes com `redirectTo`, o `pathMatch: 'full'` e necessario para evitar comportamentos inesperados de matching parcial.

## Wildcard vs pagina 404

Duas abordagens validas:

1. **Redirect (usado na aula):** `{ path: '**', redirectTo: '/login' }` — simples, usuario volta para fluxo conhecido
2. **Componente 404:** `{ path: '**', component: NotFoundComponent }` — mostra pagina de erro customizada com link para voltar

A escolha depende da UX desejada. Para apps com autenticacao, redirect para login e comum. Para apps publicas, uma pagina 404 informativa pode ser melhor.