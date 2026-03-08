# Deep Explanation: Role-Based Conditional Routing

## Por que switch case e nao if/else?

O instrutor enfatiza que usar switch case torna a decisao "mais elegante e mais dinamica". A razao tecnica e que switch case:

1. **Escala linearmente** — adicionar um novo role e adicionar um `case`, sem reestruturar a logica
2. **Tem semantica de correspondencia** — o leitor entende imediatamente que esta avaliando UM valor contra multiplas opcoes
3. **Usa `return` ao inves de `break`** — quando dentro de uma funcao, cada case retorna diretamente o componente, eliminando a necessidade de `break` e variaveis intermediarias

## A funcao Route() com R maiusculo

O instrutor cria a funcao com R maiusculo (`Route`) porque ela retorna JSX — um componente React. Isso permite usar `<Route />` na renderizacao, seguindo a convencao React de que componentes comecam com maiuscula.

A funcao encapsula toda a logica de decisao de rota, mantendo o `App` limpo:

```tsx
// App nao sabe nada sobre roles — delega para Route
function App() {
  return <Route />
}
```

## Session handling e optional chaining

O instrutor demonstra um cenario importante: o que acontece quando a sessao nao existe?

1. Criou `const session = undefined` para simular ausencia de sessao
2. Adicionou `?` (optional chaining) em `session?.user?.role` porque a sessao pode nao existir
3. Quando `session` e `undefined`, `session?.user?.role` retorna `undefined`
4. `undefined` nao corresponde a nenhum `case`, entao cai no `default`
5. O `default` retorna `<AuthRoutes />` — redirecionando para login

Essa cadeia garante que **usuario sem sessao sempre ve a tela de login**, sem erro de runtime.

## O papel do `default` como safety net

O `default` no switch case tem dupla funcao:

1. **Role desconhecido** — se um novo role for adicionado no backend mas nao no frontend, o usuario cai no auth ao inves de ver uma tela em branco
2. **Sessao inexistente** — como demonstrado, `undefined` cai no default

O instrutor menciona que poderia haver "uma role padrao para alguma coisa, que o usuario tem quase nada de permissao", mas decide que a melhor logica padrao e redirecionar para autenticacao.

## Estrutura de rotas separadas

O padrao apresentado assume tres grupos de rotas:

- **AuthRoutes** — rotas de autenticacao (login, criar conta)
- **EmployeeRoutes** — rotas de quem solicita reembolso
- **ManagerRoutes** — rotas de quem visualiza/gerencia solicitacoes

Cada grupo e um componente independente que encapsula suas proprias rotas. A funcao `Route()` apenas decide QUAL grupo renderizar.

## Quando esse padrao e suficiente vs quando precisa de mais

Este padrao funciona bem para:
- Aplicacoes com 2-5 roles distintos
- Cada role tem um conjunto completamente diferente de telas
- A decisao e binaria: "qual dashboard mostrar"

Para cenarios mais complexos (permissoes granulares, features toggles por role dentro da mesma tela), seria necessario um sistema de permissoes mais robusto (RBAC com CASL, por exemplo).