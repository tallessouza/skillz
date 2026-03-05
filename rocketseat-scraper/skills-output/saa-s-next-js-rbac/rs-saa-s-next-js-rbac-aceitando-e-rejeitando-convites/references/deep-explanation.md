# Deep Explanation: Aceitando e Rejeitando Convites

## Por que fetch client-side e nao server component?

O instrutor explica uma decisao arquitetural importante: se o usuario nunca abrir a aba de invites, nao ha razao para buscar esses dados. Usar server component faria a requisicao em toda renderizacao da pagina, desperdicando recursos. Com `useQuery` e `enabled: isOpen`, o fetch so acontece quando o popover e aberto.

## Diferenca entre revoke e reject

O instrutor faz uma distincao semantica importante:
- **Revoke**: quando o dono da organizacao cancela um invite que ele mesmo enviou
- **Reject**: quando o usuario convidado recusa o invite

Cada um tem sua propria rota na API (`/invites/:id/revoke` vs `/invites/:id/reject`).

## O bug do 'use server' esquecido

Durante a aula, o instrutor encontrou o erro `Static Generation Store is missing in revalidateTag`. A causa era a ausencia da diretiva `'use server'` no arquivo de actions. Sem essa diretiva, o Next.js tenta executar o `revalidateTag` no contexto do cliente, onde nao existe o store de geracao estatica. Esse e um erro comum e silencioso — a funcao pode parecer funcionar (o invite e aceito na API), mas o revalidateTag falha.

## Sincronizacao de cache em duas camadas

Apos aceitar um invite, dois caches precisam ser atualizados:
1. **Server cache** (Next.js): `revalidateTag('organizations')` — porque a lista de organizacoes do usuario mudou
2. **Client cache** (React Query): `queryClient.invalidateQueries({ queryKey: ['pending-invites'] })` — para remover o invite aceito da lista

Essa dupla invalidacao garante que tanto a UI de invites quanto a lista de organizacoes reflitam o estado atualizado.

## Controlled popover com estado

O instrutor usa `useState` para controlar o popover ao inves de deixar o componente gerenciar internamente. Isso permite usar o estado `isOpen` como flag para o `enabled` do `useQuery`, criando uma conexao elegante entre UI e data fetching.