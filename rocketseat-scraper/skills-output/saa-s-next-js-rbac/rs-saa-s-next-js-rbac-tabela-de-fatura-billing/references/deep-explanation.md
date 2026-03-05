# Deep Explanation: Tabela de Fatura (Billing)

## Por que server component para billing?

O instrutor opta por `async` no componente de billing porque os dados vem diretamente da API do backend. Nao ha interatividade no componente — ele apenas exibe dados. Isso evita waterfalls de client-side fetching e simplifica o codigo (sem useState, useEffect, loading states).

## O erro do thead sem tr

O instrutor comete o erro ao vivo e depois corrige: no HTML, `<thead>` deve conter `<tr>` que contem `<th>`. O shadcn/ui mapeia isso como `TableHeader > TableRow > TableHead`. Sem o `TableRow`, o browser renderiza mas emite warnings no console. O instrutor destaca que esse e um erro facil de esquecer e recomenda verificar todas as tabelas do app.

## Por que width via style e nao via CSS?

O instrutor explica que largura fixa em colunas de tabela HTML precisa ser definida via atributo `style` inline. Classes CSS como `w-[200px]` do Tailwind nao funcionam de forma confiavel para definir largura de colunas em `<th>`. A estrategia e: deixar uma coluna sem width (flexivel) e fixar as demais.

## Formatacao monetaria

O instrutor usa `toLocaleString` com locale `en-US` e currency `USD` para todos os valores de preco. Ele aplica a mesma formatacao em: price de cada item, unit price (custo unitario), e total. A escolha de USD e porque o SaaS do curso cobra em dolar.

## Padrao de separacao em componente

O billing e extraido para um componente separado (`billing.tsx` dentro de settings) e importado na page. Isso mantem a page limpa e permite que o billing seja um server component independente com seu proprio data fetching.

## Permissoes e visibilidade

O instrutor lembra que a secao de billing so aparece para usuarios com permissao adequada. Membros comuns nao veem nem a pagina de settings, entao o billing fica protegido por RBAC.