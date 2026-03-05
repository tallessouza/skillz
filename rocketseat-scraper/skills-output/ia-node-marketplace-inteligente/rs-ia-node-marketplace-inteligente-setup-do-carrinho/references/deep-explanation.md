# Deep Explanation: Setup do Carrinho

## Por que isolar carrinho por loja?

O instrutor destaca que em um marketplace com multiplas lojas, misturar produtos de lojas diferentes no mesmo carrinho cria problemas logisticos. A solucao e vincular um `store_id` diretamente na tabela de carrinhos. Quando o usuario tenta adicionar um produto de uma loja diferente, o sistema substitui o carrinho ativo por um novo.

Isso e diferente de marketplaces como Amazon onde um unico carrinho pode ter produtos de multiplos sellers — neste modelo, cada loja tem seu proprio fluxo de checkout.

## O campo `active` e a integracao com IA

Uma decisao de design interessante: o campo `active` boolean no carrinho nao serve apenas para soft-delete. Ele foi pensado especificamente para o cenario onde uma IA (agent) gera multiplas sugestoes de carrinho para o usuario.

O fluxo e:
1. IA gera 3 sugestoes de carrinho (todos com `active = false` inicialmente)
2. Usuario visualiza as opcoes no chat
3. Usuario seleciona um — esse vira `active = true`
4. Os outros ficam no historico para o usuario poder voltar e escolher

Isso permite que a interface de chat mostre o historico de sugestoes sem perder dados.

## Constraint UNIQUE vs Primary Key composta

O instrutor optou por usar uma constraint `UNIQUE(cart_id, product_id)` ao inves de fazer uma primary key composta. A razao e manter um `id` serial independente em `cart_items`, o que facilita referencia direta ao item (ex: "remova o item 42") sem precisar passar a combinacao de cart_id + product_id.

## CASCADE no DROP TABLE

Durante o desenvolvimento, o instrutor encontrou problemas ao dropar tabelas fora de ordem (tabelas com foreign keys sendo dropadas antes das dependentes). A solucao pragmatica foi adicionar `CASCADE` em todos os drops, eliminando a necessidade de ordenar manualmente.

Isso e seguro em ambiente de desenvolvimento onde o seed recria tudo. Em producao, migrations devem ser usadas com ordem explicita.

## Estrutura de 3 tabelas

A separacao em `users`, `carts`, e `cart_items` segue o padrao classico:
- **users**: dados de autenticacao e perfil
- **carts**: metadata do carrinho (quem, qual loja, status)
- **cart_items**: itens individuais com quantidade

Esta e a base para depois adicionar a funcionalidade de criacao de carrinho via agent/IA, que sera construida sobre esta mesma estrutura.