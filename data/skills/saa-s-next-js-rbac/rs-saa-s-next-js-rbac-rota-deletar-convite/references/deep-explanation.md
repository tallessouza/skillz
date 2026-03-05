# Deep Explanation: Rota Deletar (Revogar) Convite

## Revoke vs Reject — Por que sao rotas separadas

O instrutor enfatiza uma distincao fundamental: **revogar** e **rejeitar** sao operacoes semanticamente diferentes, mesmo que ambas resultem na exclusao do convite.

- **Revogar (revoke):** Feito pelo administrador da organizacao. "Se eu convidei alguem, mas convidei errado, quero remover o convite." O admin tem autoridade sobre os convites que a organizacao emitiu.
- **Rejeitar (reject):** Feito pelo usuario convidado. O convidado decide que nao quer participar.

Essa separacao importa porque as **permissoes sao completamente diferentes**. O revoke exige `ability.can('delete', 'Invite')` no contexto da organizacao, enquanto o reject exige apenas que o usuario seja o destinatario do convite.

## Escopo organizacional no delete — A vulnerabilidade sutil

O instrutor comeca sem usar `organizationId` no query, depois percebe o problema: "eu tenho que usar organizacao, porque senao eu poderia deletar um invite de outra organizacao, que nao faz sentido."

Essa e uma vulnerabilidade classica de **Insecure Direct Object Reference (IDOR)** em sistemas multi-tenant. Se o delete usa apenas o `inviteId`, um admin da Org A poderia deletar convites da Org B simplesmente conhecendo o UUID.

A correcao e simples mas critica: adicionar `organizationId` no `findUnique` garante que o convite pertence a organizacao do usuario autenticado.

## Fluxo da rota

1. Extrair `slug` e `inviteId` dos params da URL
2. Obter membership e organization do usuario autenticado via `getUserMembership(slug)`
3. Verificar permissao com CASL: `cannot('delete', 'Invite')`
4. Buscar o invite com escopo organizacional (`id` + `organizationId`)
5. Se nao encontrar, retornar erro
6. Deletar o invite
7. Retornar 204 No Content

## Por que 204 e nao 200

O HTTP 204 No Content e o status correto para operacoes de delete bem-sucedidas onde nao ha conteudo para retornar. O body da response e `null`. Isso segue a semantica REST corretamente — o recurso foi removido, nao ha nada para mostrar.

## Contexto no CRUD da aplicacao

O instrutor menciona que essa rota e parte do CRUD quase completo da aplicacao SaaS. As rotas de invite incluem: criar convite, aceitar convite, rejeitar convite, e agora revogar convite. Cada uma com suas proprias regras de permissao baseadas em RBAC via CASL.