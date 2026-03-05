# Deep Explanation: Rota Convites Pendentes

## Por que essa rota existe

No frontend do SaaS, o cabecalho da aplicacao tera um icone de notificacoes (como um sininho) com uma bolinha indicando convites pendentes. Quando o usuario clica, ve todos os convites recebidos de todas as organizacoes, podendo aceitar ou rejeitar cada um.

Isso elimina a necessidade do usuario checar email ou acessar links individuais. Se 10 pessoas enviarem convites, todos aparecem em um unico lugar.

## Por que filtrar por email e nao por userId

O modelo de convite no banco usa `email` como campo de destino, nao `userId`. Isso porque convites podem ser enviados para pessoas que ainda nao tem conta na plataforma. O email e o unico identificador garantido no momento do envio.

Quando o usuario esta logado e acessa esta rota, precisamos:
1. Buscar o usuario pelo `userId` do token JWT
2. Pegar o `email` desse usuario
3. Buscar todos os invites com esse email

## Padrao de dois queries

Este e um padrao recorrente quando a entidade de busca usa um campo diferente do identificador do token:

```
Token → userId → User.email → Invites where email
```

Nao e possivel fazer em uma unica query porque o token so tem `userId`, e o invite so tem `email`.

## Reuso do schema do getInvite

O instrutor menciona copiar o schema do `getInvite` para esta rota. Isso garante consistencia na API — o formato de um invite e o mesmo independente de onde e retornado (individual ou lista).

## Rota sem parametros

Diferente de outras rotas de invite que recebem `orgSlug` e `inviteId`, esta rota nao recebe nenhum parametro de rota. E uma rota "global" do usuario, nao scoped a uma organizacao. Isso faz sentido porque o usuario quer ver TODOS os convites pendentes, de todas as orgs.

## Uso no frontend

O instrutor descreve o caso de uso: icone de notificacoes no header com badge de contagem. Ao clicar, lista de convites com botoes aceitar/rejeitar. Cada convite mostra a organizacao que convidou e quem enviou o convite (author).