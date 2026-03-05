# Deep Explanation: SQL SELECT com WHERE Igual

## Por que evitar o asterisco?

O instrutor destaca que `SELECT *` traz **todas as colunas** da tabela. Em tabelas pequenas de desenvolvimento, isso e aceitavel. Porem, em tabelas grandes com volume de dados significativo, o asterisco:

- Transfere dados desnecessarios pela rede
- Consome mais memoria no banco e na aplicacao
- Impede otimizacoes do query planner que dependem de saber quais colunas sao necessarias
- Quebra silenciosamente quando colunas sao adicionadas/removidas da tabela

A recomendacao e: **sempre especifique quais colunas voce quer exibir**.

## Ordem das colunas no SELECT

O instrutor demonstra que a ordem das colunas no SELECT define a ordem de exibicao dos resultados, nao a ordem da tabela. Se voce escreve `SELECT name, id`, o resultado mostra name primeiro. Isso e util para controlar a apresentacao dos dados sem alterar a estrutura.

## Case sensitivity: o detalhe critico

O instrutor mostra ao vivo que `WHERE name = 'mouse'` (minusculo) retorna zero resultados quando o valor armazenado e `'Mouse'` (com M maiusculo). Isso acontece porque:

- A **grande maioria dos bancos de dados sao case sensitive** para comparacoes de texto
- O operador `=` compara byte a byte — `'M'` != `'m'`
- Isso e uma fonte comum de bugs em aplicacoes web

### Estrategia do frontend

O instrutor sugere que o **frontend trate o parametro antes de enviar**, por exemplo, convertendo tudo para minusculo. Isso implica que o banco tambem armazene em minusculo, ou que se use funcoes como `LOWER()` no SQL:

```sql
-- Alternativa: normalizar no SQL
WHERE LOWER(name) = LOWER('mouse')
```

Porem, na aula o foco e no operador `=` puro, que exige match exato.

## Igualdade e exata — sem parciais

O operador `=` no SQL busca correspondencia **exatamente igual**. Se o valor no banco e `1200` e voce busca `1500`, retorna vazio. Nao ha correspondencia parcial, fuzzy, ou aproximada. Para buscas parciais, existem outros operadores (`LIKE`, `ILIKE`, `BETWEEN`), mas esses nao sao escopo desta aula.

## Tipos de dados e aspas

- **Texto:** sempre entre aspas simples — `'valor'`
- **Numeros:** sem aspas — `1200`
- Usar aspas em numeros pode funcionar em alguns bancos (cast implicito), mas e ma pratica e pode causar problemas de performance por impedir uso de indices numericos.