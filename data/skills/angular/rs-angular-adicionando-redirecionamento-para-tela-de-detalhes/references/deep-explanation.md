# Deep Explanation: RouterLink com Redirecionamento Dinâmico

## Por que array syntax e não string interpolation?

O instrutor usa `[routerLink]="['/details', movie.id]"` com property binding e array. Isso é intencional:

1. **Concatenação automática** — O Angular pega cada item do array e junta com `/` para formar o path final. Então `['/details', 42]` vira `/details/42`.

2. **Type safety** — Ao passar `movie.id` como valor separado, o Angular garante que o valor é tratado como segmento de rota, não como string arbitrária. Interpolação com `{{}}` dentro de string pode gerar paths malformados.

3. **Consistência com `Router.navigate()`** — A mesma sintaxe de array é usada quando se navega programaticamente com `this.router.navigate(['/details', id])`. Manter o mesmo padrão reduz carga cognitiva.

## Relação com a definição de rotas

No `app.routes.ts`, a rota é definida como `details/:id`. O `:id` é um parâmetro dinâmico. Quando o routerLink passa `['/details', movie.id]`, o Angular faz o match com essa rota e o componente `MovieDetailsComponent` recebe o `id` via `ActivatedRoute`.

O instrutor demonstra clicando em diferentes filmes e mostrando que cada um redireciona para `/details/{id-do-filme}` — confirmando que o binding dinâmico funciona corretamente.

## Por que no button e não num wrapper?

O `routerLink` é colocado diretamente no `<button>` que representa cada filme na lista. Isso é importante porque:

- O elemento que recebe o clique do usuário é o button
- Colocar o routerLink num wrapper externo pode causar áreas clicáveis inesperadas
- Mantém a semântica HTML correta

## Próximos passos mencionados pelo instrutor

O instrutor menciona que o componente de detalhes ainda está "chumbado" (hardcoded) e que em aulas futuras será tornado dinâmico — ou seja, vai buscar os dados do filme baseado no ID da rota. Isso envolverá usar `ActivatedRoute` para extrair o parâmetro `:id`.