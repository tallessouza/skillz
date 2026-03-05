# Deep Explanation: Frontend e Correções no Backend

## Por que erros de integracao sao os mais comuns

O instrutor demonstra ao vivo como a maioria dos bugs em integracao frontend-backend nao sao logicos — sao de **nomenclatura e ausencia**. Em uma unica sessao de debug, ele encontrou:

1. **Rota inexistente (404)** — esqueceu de criar a rota `getChatSessions` no backend. O frontend chamava uma rota que simplesmente nao existia.

2. **Propriedade errada no payload (400)** — o frontend mandava `message` mas o backend esperava `content`. Um erro silencioso que retorna 400 sem explicacao util.

3. **Chave errada na resposta** — o backend mandava `carts` mas o componente React esperava `suggestedCarts`. Resultado: UI vazia sem erro no console.

4. **ID ausente no payload** — ao escolher um carrinho, o ID nao estava sendo enviado porque nao foi incluido na resposta original. Erro de "Not Found" ao tentar aplicar.

5. **Rota no controller errado** — a rota de escolher carrinho estava registrada em `/cart` quando deveria estar em `/chat`.

## A importancia do total calculado no SQL

O instrutor percebe que o total do carrinho nao estava aparecendo porque ele nao fazia join com a tabela de produtos. Sem o join:
- `cart_items` tem `quantity` mas nao tem `price`
- `products` tem `price` mas nao esta conectado
- O total precisa de `SUM(price * quantity)` que exige o join

A solucao foi adicionar join com `cart_items` e depois com `products`, usar aggregate para computar, e retornar o total ja calculado.

## COALESCE como operador de fallback no SQL

O instrutor compara o `COALESCE` do SQL com o operador `??` do JavaScript — se o valor for null, usa o fallback. No caso, `COALESCE(title, '')` garante que sessoes sem titulo nao quebrem a UI.

## Search params vs setState para navegacao

O instrutor usa search params (URL) para controlar qual chat esta selecionado ao inves de useState. Isso porque:
- Permite deep linking (compartilhar URL de um chat especifico)
- O `pushState` atualiza a URL sem reload
- SWR pode usar o chatId da URL como key do cache

## Dados remanescentes de testes

O instrutor encontra dados "sujos" do teste automatizado que ficaram no banco. O `beforeAll` do teste faz truncate apenas no inicio, entao a ultima execucao deixa dados pendurados. Ele decide ignorar para o desenvolvimento, mas isso e um lembrete de que testes devem limpar no `afterAll` tambem.

## Relevancia dos carrinhos sugeridos

A IA gera multiplos carrinhos com scores de relevancia (50%, 70%, 100%). O instrutor nota que a ordenacao por relevancia ainda nao foi implementada — o frontend mostra na ordem que veio do banco. Ele menciona que "com certeza vale calibrar bastante" a logica de relevancia.