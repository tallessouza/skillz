# Deep Explanation: Redirecionamento com RouterLink

## Por que RouterLink e nao href?

No Angular, usar `href` para rotas internas causa um full page reload — o browser descarta toda a aplicacao SPA e recarrega do zero. RouterLink intercepta o clique, atualiza a URL via History API e renderiza apenas o componente da nova rota. Isso preserva o estado da aplicacao e e muito mais rapido.

## Por que importar no array de imports?

Angular standalone components precisam declarar explicitamente todas as diretivas que usam no template. RouterLink e uma diretiva do `@angular/router`, entao deve estar no array `imports` do decorator `@Component`. Sem isso, o Angular ignora o atributo `routerLink` no template silenciosamente — o botao simplesmente nao faz nada ao ser clicado, sem erro no console.

## Fluxo do instrutor

O instrutor mostrou um padrao direto:

1. Abriu o componente TypeScript (`explore-movies.component.ts`)
2. Adicionou `RouterLink` ao array de imports
3. Foi ao template HTML
4. Adicionou `routerLink="/create"` no botao "Adicionar Filme"
5. Salvou e testou — clicou no botao e a tela de criacao apareceu

O ponto importante e que o instrutor enfatizou: "o redirecionamento vai ser la no template, entao tem que colocar aqui nos imports o router link" — a conexao entre usar algo no template e precisar importar no componente.

## RouterLink vs Router.navigate()

- **RouterLink**: declarativo, no template, para navegacao estatica (links, botoes que sempre vao para o mesmo lugar)
- **Router.navigate()**: programatico, no TypeScript, para navegacao condicional (apos form submit, apos validacao, com parametros dinamicos)

Nesta aula, como o botao sempre leva para `/create`, RouterLink e a escolha correta.

## Contexto no projeto

O projeto e um gerenciador de filmes. A tela de exploracao (`ExploreMoviesComponent`) lista filmes e tem um botao "Adicionar Filme". Esse botao precisa levar o usuario para a tela de criacao, que ja esta configurada na rota `/create`. A unica coisa necessaria era conectar o botao a rota via RouterLink.