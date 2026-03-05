# Deep Explanation: Conversa entre Camadas (Mappers)

## Por que mappers existem

Na Clean Architecture, cada camada tem sua propria representacao de uma entidade. A `Question` do Prisma (tabela do banco) nao e a mesma `Question` do dominio (entidade). Mesmo que representem "a mesma coisa", os campos, tipos e estruturas podem diferir.

O mapper e a ponte entre essas representacoes. Ele converte de um formato para outro, garantindo que cada camada trabalhe com seu proprio tipo.

## A diferenca crucial: null vs undefined vs valor

O instrutor destaca um ponto sutil mas importante sobre campos opcionais como `updatedAt`:

- **`Date`** — campo preenchido, tem um valor
- **`null`** — a question ja existe no banco, mas esse campo esta vazio (nao foi atualizado ainda)
- **`undefined`** — estou criando uma question nova e nunca informei esse campo

Isso reflete a diferenca semantica no JavaScript:
- `undefined` = inexistente, nunca foi definido
- `null` = vazio, existe mas nao tem valor

Por isso a tipagem correta e `updatedAt?: Date | null` — aceita os tres estados.

## Por que metodos estaticos

O mapper nao tem estado. Ele nao precisa de dependencias injetadas. E uma funcao pura de conversao: entra um formato, sai outro. Por isso usa-se `static` — nao faz sentido instanciar a classe.

## create() vs createFromText() em ValueObjects

O `Slug` tem dois metodos de fabrica:
- `createFromText("Meu Titulo")` → converte para `meu-titulo` (processa o texto)
- `create("meu-titulo")` → aceita o slug como esta (ja processado)

Quando o dado vem do banco, ele ja foi processado na criacao original. Usar `createFromText` de novo seria redundante e potencialmente incorreto (dupla conversao).

## O segundo parametro do create: ID existente

`Question.create({...}, new UniqueEntityId(raw.id))` — o segundo parametro diz "esta entidade ja existe com este ID". Sem ele, um novo ID seria gerado, e perderiamos a referencia ao registro do banco.

## Convencao de nomenclatura

O padrao `Prisma{Entity}Mapper` deixa explicito:
- De onde vem o dado (Prisma)
- Qual entidade esta sendo mapeada (Question)
- Que e um mapper (Mapper)

Metodos como `toDomain()` e futuramente `toPrisma()` indicam a direcao da conversao.

## Tratamento de null antes do mapper

O repositorio deve verificar se o resultado do Prisma e null antes de chamar o mapper:

```typescript
if (!question) {
  return null
}
return PrismaQuestionMapper.toDomain(question)
```

Isso porque `findUnique` pode retornar `null` quando o registro nao existe, e o mapper espera um objeto valido.