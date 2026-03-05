# Deep Explanation: API de Pedidos para Restaurante

## Por que sessões e não flags?

O instrutor modela o sistema com uma tabela `table_sessions` separada em vez de usar um campo `is_occupied` na tabela `tables`. A razão é fundamental: ao longo de um dia, muitos clientes passam pela mesma mesa. Se usássemos apenas um boolean na mesa, perderíamos todo o histórico de consumo.

A sessão funciona como um "envelope" que agrupa todos os pedidos de um cliente durante uma visita. Quando o cliente encerra a conta, o envelope é fechado (recebe um `closed_at`), mas permanece no banco para consultas futuras — faturamento, relatórios, histórico.

## O ciclo explicado

O instrutor descreve o fluxo como um ciclo contínuo:

1. **Mesa disponível** — não existe sessão aberta para ela
2. **Cliente chega** — restaurante abre uma sessão (cria registro em `table_sessions` com `closed_at = null`)
3. **Cliente consome** — cada pedido (bebida, prato, porção) é registrado em `orders` vinculado à sessão
4. **Cliente encerra conta** — restaurante fecha a sessão, calcula o total somando todos os pedidos
5. **Mesa disponível novamente** — o ciclo recomeça

A chave é que a disponibilidade da mesa é **derivada**, não armazenada. Uma mesa está disponível se não tem sessão com `closed_at IS NULL`.

## Por que pedidos não se vinculam diretamente à mesa?

Se pedidos fossem vinculados à mesa (e não à sessão), seria impossível separar o consumo de diferentes clientes ao longo do dia. A sessão é a entidade intermediária que dá contexto temporal aos pedidos.

Analogia: a mesa é como um quarto de hotel. A sessão é a reserva. Os pedidos são os itens do frigobar. Você não cobra o frigobar "do quarto" — cobra da reserva que estava ativa quando o item foi consumido.

## Tabelas e relacionamentos detalhados

O instrutor define 4 tabelas:

- **products** — catálogo do restaurante (nome, preço). Independente de mesas ou sessões.
- **tables** — mesas físicas do restaurante, identificadas por número.
- **table_sessions** — cada "uso" de uma mesa por um cliente. Conecta mesa ao período de consumo.
- **orders** — cada item pedido, conectando sessão e produto.

Os relacionamentos são todos 1:N em cadeia:
- `tables` → `table_sessions` (uma mesa, muitas sessões)
- `table_sessions` → `orders` (uma sessão, muitos pedidos)
- `products` → `orders` (um produto aparece em muitos pedidos)

## Stack tecnológica

O projeto será construído com:
- **Express** para a API REST
- **Banco de dados relacional** com relacionamentos entre tabelas
- Conceitos já aprendidos no curso: relacionamentos, banco de dados, Express para APIs