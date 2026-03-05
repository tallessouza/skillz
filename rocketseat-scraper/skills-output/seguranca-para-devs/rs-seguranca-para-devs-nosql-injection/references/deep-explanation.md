# Deep Explanation: NoSQL Injection

## Por que NoSQL Injection existe

O instrutor comeca com uma perspectiva de 25+ anos: ele ensina SQL Injection desde 1999 (VB, Delphi, ASP). Hoje, SQL Injection nao e mais um problema relevante porque Prepared Queries resolvem completamente. Mas o ponto central e: **a mesma mentalidade de "validar entradas" que resolveu SQL Injection precisa ser aplicada a bancos NoSQL**.

A falsa sensacao de seguranca e o problema. Desenvolvedores assumem que, por nao estarem escrevendo SQL, estao imunes a injection. Nao estao.

## Mecanismo do ataque

MongoDB aceita operadores como `$regex`, `$gt`, `$ne`, `$in` dentro de queries. Quando uma API REST recebe JSON e faz parse automatico, um campo que deveria ser string pode chegar como objeto:

```json
// O que o dev espera:
{ "password": "alice" }

// O que o atacante envia:
{ "password": { "$regex": "." } }
```

O `.` em regex significa "qualquer caractere". Entao a query se torna: "encontre um usuario cuja senha contenha qualquer caractere" — ou seja, qualquer senha.

Outros operadores perigosos:
- `{ "$ne": "" }` — senha diferente de vazio (qualquer senha funciona)
- `{ "$gt": "" }` — senha maior que string vazia (qualquer senha funciona)
- `{ "$regex": "^a" }` — pode ser usado para brute-force caractere por caractere

## Analogia do instrutor: Seguranca em camadas

O instrutor enfatiza que seguranca e feita em camadas. Mesmo que voce valide na camada de API (verificando tipos do JSON recebido), voce tambem deve validar na camada de dados (antes da query). Se uma camada falhar, a outra protege.

Isso e o principio de **Defense in Depth** — nao confie em uma unica barreira.

## Equivalencia com SQL Injection

| SQL Injection | NoSQL Injection |
|---------------|-----------------|
| `' OR '1'='1` na string | `{ $regex: "." }` no objeto |
| Prepared Queries resolvem | Validacao de tipo resolve |
| Problema de concatenacao de strings | Problema de aceitacao de objetos |
| 25+ anos de conscientizacao | Ainda pouco conhecido |

## Por que TypeScript ajuda mas nao resolve sozinho

TypeScript tipa em compile-time, mas em runtime o JSON recebido de uma API pode ser qualquer coisa. Um `password: string` no tipo nao impede que o Express/Fastify receba um objeto no body. E necessario validacao runtime (Zod, Joi, ou `typeof` manual).

## Conselho final do instrutor

"E muito melhor validar as entradas do que ficar tentando adivinhar o que o hacker poderia passar em cada variavel." — Em vez de tentar prever cada vetor de ataque, valide que os dados sao do tipo esperado. Isso cobre ataques conhecidos e desconhecidos.