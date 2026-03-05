# Deep Explanation: Permissoes Condicionais com CASL

## Por que modelos de entidade minimos?

O instrutor enfatiza um ponto crucial: o modelo de entidade para permissionamento **nao e o modelo do banco de dados**. Ele deve conter apenas os campos necessarios para as condicionais de permissao. Se o projeto tem 20 colunas no banco mas so `ownerId` e usado para determinar permissao, o modelo deve ter apenas `id` e `ownerId`.

Isso mantém o sistema de permissoes desacoplado do schema do banco — mudancas no banco nao quebram permissoes, e o modelo de permissao e autodocumentado: "estes sao os campos que importam para autorizacao".

## O problema do `__typename`

O CASL precisa saber qual subject um objeto representa. Quando voce passa um literal como `'Project'`, e obvio. Mas quando voce passa um objeto real (instancia de projeto), o CASL precisa de uma forma de identificar que aquele objeto e um "Project".

A solucao e o campo `__typename` — um discriminador que o CASL usa via `detectSubjectType`. O uso de `z.literal('Project').default('Project')` e elegante porque:
1. O tipo e fixo em tempo de compilacao (literal type)
2. O `.default()` preenche automaticamente ao criar com Zod, evitando que o dev precise passar manualmente

## Sintaxe MongoDB nos condicionais

O instrutor destaca que os operadores de condicional do CASL sao identicos aos do MongoDB: `$eq`, `$ne`, `$in`, `$not`, `$all`, etc. Para quem ja usou MongoDB, a curva de aprendizado e zero. Para quem nao usou, e como escrever SQL em formato de objeto.

Exemplo: `{ ownerId: { $eq: userId } }` equivale a `WHERE ownerId = userId`.

## Union type: por que `'Project' | Project`?

Quando o subject e apenas um literal (`'Project'`), voce nao tem autocompletion nos campos. O TypeScript nao sabe que Project tem `ownerId`. Ao fazer union com o schema Zod inferido, o CASL ganha tipagem completa:
- Ctrl+Space mostra todos os campos disponiveis
- Erros de campo inexistente sao pegos em tempo de compilacao
- Impossivel criar condicionais com campos que nao existem

O instrutor enfatiza: "a gente nao consegue criar permissoes erradas aqui" — o sistema de tipos garante corretude.

## Flexibilidade e semantica

O resultado final e um sistema onde:
- Permissoes se leem como ingles: `can(['update', 'delete'], 'Project', { ownerId: { $eq: userId } })`
- Tipagem impede erros em tempo de compilacao
- Adicionar novas condicionais e so adicionar campos ao modelo
- O codigo e autodocumentado e facil de manter