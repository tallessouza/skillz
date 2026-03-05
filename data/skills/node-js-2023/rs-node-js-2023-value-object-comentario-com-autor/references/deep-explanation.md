# Deep Explanation: Value Object para Dados Compostos

## Por que nao usar entidades para dados compostos?

O instrutor faz uma distincao fundamental: **entidade = tudo que tem ID unico e e identificavel individualmente**. Um attachment e uma entidade porque cada attachment tem seu proprio ID. Uma question e uma entidade.

Mas "comentario com autor" nao e uma coisa. E um **aglomerado de dados de transicao** — informacoes que vem de comentarios, do autor, e potencialmente de anexos, reunidas para atender uma necessidade do front-end.

A analogia e: se voce nao salvaria isso como uma tabela unica no banco de dados, provavelmente nao deveria ser uma entidade.

## A diferenca entre Entity e Value Object

- **Entity**: identidade vem do ID. Dois usuarios com o mesmo nome sao diferentes se tem IDs diferentes.
- **Value Object**: identidade vem das propriedades. Dois slugs com o mesmo valor sao iguais — nao tem ID pra diferenciar.

O Slug ja era um Value Object no projeto. Agora o conceito e expandido para representar dados compostos multi-entidade.

## Por que JSON.stringify no equals()?

O operador `===` em JavaScript faz comparacao **referencial** — verifica se dois objetos ocupam a mesma posicao na memoria. Entao:

```typescript
const a = { nome: 'diego' }
const b = { nome: 'diego' }
a === b // false! Posicoes diferentes na memoria
```

Para comparar por valor, o instrutor converte as props em string com `JSON.stringify` e compara os textos. E uma comparacao "mais literal" — compara o conteudo, nao a referencia.

## Por que nomear IDs explicitamente?

O instrutor enfatiza: dentro de um Value Object composto, voce nao pode simplesmente usar `id`. Se voce tem dados de comentario e de autor, `id` e de quem? Por isso:
- `commentId` — claro que e o ID do comentario
- `author.id` ou `authorId` — claro que e o ID do autor

## Principio do minimalismo (menor fatia possivel)

O instrutor usa o conceito de "evitar overfetching mais do que underfetching". Um comentario pode ter: autor, likes, sub-comentarios, anexos. Mas se agora voce so precisa do autor, crie `CommentWithAuthor` — nao `CommentWithEverything`.

Aumente no futuro se necessario. Comece pequeno.

## A deficiencia do padrao REST

O instrutor menciona que essa necessidade surge por causa do padrao REST. Em REST, voce precisa decidir que dados enviar para o front-end, e frequentemente precisa combinar dados de varias entidades numa unica resposta. O Value Object e a forma limpa de representar isso na camada de dominio.

## Factory method create() vs construtor

O construtor e `protected` na classe base. O metodo `create()`:
1. Permite validacoes antes de instanciar
2. Permite preencher propriedades opcionais com defaults
3. Segue o mesmo padrao usado nas entidades do projeto
4. Mantem consistencia arquitetural

## Getters obrigatorios para serializacao

Sem getter, ao converter a instancia em JSON ou objeto, a propriedade nao aparece. Isso e porque as props estao em `protected props` — sem acesso publico, o serializador nao consegue ler. Cada propriedade que deve aparecer na resposta precisa de um getter explicito.