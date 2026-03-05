# Deep Explanation: Listagem e Revogacao de Convites

## Padrao de Construcao Incremental

O Diego segue um padrao consistente ao construir features de listagem no Next.js App Router:

1. **API helper primeiro** — Copia um helper existente (`getProjects`) e adapta para o novo recurso (`getInvites`). Isso garante consistencia na forma como a API e chamada.

2. **Tipagem do retorno** — Define a interface de retorno inline, adaptando os tipos (ex: `role` como Role enum, `createdAt` como string porque vem serializado do backend).

3. **Pagina server component** — Busca dados no server component, desestrutura, e renderiza. Usa `getCurrentOrg()` para pegar a org do cookie/URL.

4. **Reutilizacao de estrutura** — Copia a estrutura da `MemberList` como ponto de partida, depois adapta. Nao reinventa a roda.

## Decisao: POST vs DELETE para Revogar

O Diego encontrou um bug em tempo real: o backend estava usando POST para revogar convites. Ele decidiu mudar para DELETE no backend porque semanticamente faz mais sentido — revogar um convite e efetivamente deletar o recurso. Isso mostra a importancia de respeitar semantica HTTP mesmo quando "funciona" com POST.

## Separacao do Botao de Revoke

O botao de revoke foi extraido para um componente separado (`RevokeInviteButton`) por razoes praticas:
- Precisa de interatividade (form + action)
- Pode eventualmente precisar de estado (loading, confirmacao)
- Mantem o componente de pagina limpo e focado em layout

## Server Actions com `.bind()`

Padrao recorrente: usar `.bind(null, inviteId)` para passar parametros para server actions sem precisar de hidden inputs ou state management. O `null` e o `this` context, e o `inviteId` vira o primeiro argumento da action.

## Revalidacao por Tag

O sistema usa `next: { tags: ['org/invites'] }` no fetch e `revalidateTag('org/invites')` apos mutacao. Isso permite invalidar apenas o cache de invites sem afetar outros dados da organizacao.

## Estado Vazio

Ao invez de simplesmente nao renderizar nada quando a lista esta vazia, o Diego adiciona uma TableRow com mensagem "No invites found" usando `text-center text-muted-foreground`. Detalhes de UX como esse fazem diferenca na experiencia do usuario.

## Organizacao de Server Actions

O Diego menciona que reune todas as server actions em um arquivo `actions.ts`, mas ressalta que tambem seria possivel definir a server action inline no componente usando `'use server'` dentro da funcao. A escolha de centralizar e por organizacao, nao por necessidade tecnica.