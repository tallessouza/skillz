# Deep Explanation: Regras de Negócio do Pedido

## Por que validar sequencialmente e não tudo de uma vez?

O instrutor demonstra um padrão deliberado: cada validação é um bloco isolado. Isso não é acidente — quando você junta validações (`if (!session || session.closed_at)`), o cliente recebe uma mensagem ambígua. Separando, o consumidor da API sabe exatamente o que corrigir.

## Sessão e mesa são "a mesma coisa"

O instrutor explica: "quando eu falo sessão ou mesa, eu estou meio que dizendo a mesma coisa". No modelo de dados, uma **mesa** é a entidade física e uma **sessão** (`table_session`) é o período em que a mesa está ocupada. Mas do ponto de vista da regra de negócio de pedido, o que importa é: **existe uma sessão aberta para aquela mesa?**

Isso significa que:
- Mesa sem sessão aberta = não aceita pedido
- Sessão com `closed_at` preenchido = mesa encerrada = não aceita pedido
- Sessão sem `closed_at` = mesa aberta = aceita pedido

## O padrão de "coluna de data como estado"

Em vez de ter um campo `status: "open" | "closed"`, o sistema usa `closed_at: Date | null`. Isso é um padrão comum porque:
1. Guarda QUANDO fechou (auditoria grátis)
2. `null` = aberto, preenchido = fechado (binário, sem ambiguidade)
3. Não precisa de enum ou tabela auxiliar

A verificação fica simples: `if (session.closed_at)` — se tem data de fechamento, está fechada.

## Por que buscar o produto se o cliente já mandou o ID?

O instrutor enfatiza: "eu preciso pegar o preço do produto". O cliente manda `product_id`, mas o **preço** deve vir do banco, não do cliente. Isso é uma regra de segurança fundamental — nunca confie no preço que o frontend envia. Buscar o produto serve dois propósitos:
1. Validar que o produto existe
2. Obter o preço autoritativo do banco de dados

## Ordem de validações como pipeline

A ordem não é arbitrária:
1. **Sessão existe?** — sem sessão, nada mais importa
2. **Sessão aberta?** — sessão fechada invalida tudo
3. **Produto existe?** — precisamos do preço para persistir

Cada validação é um "gate" — se falha, para imediatamente com mensagem clara. Isso evita processamento desnecessário e retorna feedback rápido.

## AppError vs Error nativo

O instrutor usa `AppError` importado de `@/utils/app-error`. Isso é uma classe customizada que o error handler da aplicação sabe tratar, retornando status HTTP adequado (provavelmente 400 ou 404) em vez do genérico 500 que um `Error` nativo causaria.