# Deep Explanation: Gerenciamento de Carrinho Multi-Loja

## Modelo mental do instrutor

O carrinho em um marketplace funciona diferente de um e-commerce single-store. Como cada loja e independente, o usuario so pode ter um pedido ativo por loja. O instrutor usa a analogia de apps de delivery: quando voce ja tem itens do restaurante A e tenta adicionar do restaurante B, aparece uma confirmacao — "voce vai perder o carrinho anterior".

## Tres cenarios fundamentais

### Cenario 1: Primeiro produto (sem carrinho)
Fluxo simples — criar carrinho + inserir item. Testado na Part. 2.

### Cenario 2: Mesmo produto ou mesma loja
O carrinho ja existe e pertence a mesma loja. Nao cria novo carrinho — apenas insere um `cart_item`. Se o produto ja esta no carrinho, usa `ON CONFLICT` para somar quantidade ao inves de falhar pela constraint unique no par `(cart_id, product_id)`.

O instrutor destaca: "Eles vao so sendo concatenados no carrinho" — o comportamento esperado quando o usuario adiciona feijao preto e depois arroz branco, ambos da mesma loja.

### Cenario 3: Loja diferente
O carrinho ativo e de outra loja. O sistema:
1. Desativa o carrinho anterior (`active = false`)
2. Cria novo carrinho com a nova loja
3. Insere o item no novo carrinho

O instrutor assume que a confirmacao do usuario ja aconteceu no frontend: "Vamos considerar que ele ja confirmou."

## Ordem das verificacoes

A sequencia importa:
1. Buscar produto (validar existencia)
2. Buscar carrinho ativo do usuario (sem filtrar por loja)
3. Se existe carrinho E mesma loja → adicionar item
4. Se existe carrinho E loja diferente → desativar + criar novo
5. Se nao existe carrinho → criar novo

O instrutor inicialmente quase filtrou por loja na busca do carrinho, mas corrigiu: "Eu vou verificar... ele sugeriu verificar ja com a loja, mas eu quero mesmo que nao tenha loja." Buscar sem filtro de loja permite detectar ambos os cenarios (mesma loja e loja diferente).

## Bug de duplicacao encontrado na aula

O instrutor cometeu um erro real durante a aula: colocou os inserts de `cart_items` tanto dentro do bloco condicional (loja diferente) quanto fora dele. Isso causava insercao dupla. A correcao foi remover os inserts duplicados que estavam fora do if.

Licao pratica: ao adicionar branches condicionais em codigo existente, verificar se o codigo que estava no fluxo principal nao ficou duplicado.

## Estrategia de testes

O instrutor usa `truncate` antes de cada teste para garantir estado limpo. Os testes verificam:
- Adicionar produto 1 → cria carrinho
- Adicionar produto 2 (mesma loja) → mesmo carrinho, 2 itens
- Adicionar produto 2 de novo → mesmo carrinho, quantidade somada (4 unidades)
- Adicionar produto de outra loja → novo carrinho, ID diferente
- GET cart retorna o carrinho novo (ativo), nao o antigo

## Constraint unique como safety net

O par `(cart_id, product_id)` como constraint unique e essencial. Sem ele, adicionar o mesmo produto duas vezes criaria registros duplicados. Com ele, o `ON CONFLICT` transforma o INSERT em UPDATE, somando quantidades. O instrutor chama isso de "conflito" — a estrategia de upsert.