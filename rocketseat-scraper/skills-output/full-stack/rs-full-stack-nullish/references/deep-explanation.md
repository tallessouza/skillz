# Deep Explanation: Zod Nullish

## Por que campos sao obrigatorios por padrao no Zod?

O Zod segue o principio de **seguranca por padrao**. Quando voce define um schema, cada campo declarado DEVE estar presente na entrada. Isso e uma decisao de design consciente: e mais seguro exigir tudo e relaxar seletivamente do que permitir tudo e restringir depois.

O instrutor demonstrou isso na pratica: ao remover o campo `price` do body da requisicao no Insomnia, o Zod retornou um erro de validacao indicando que `price` e "required". Isso acontece automaticamente — nao precisa adicionar `.required()` ou qualquer modificador.

## A hierarquia de opcionalidade no Zod

O Zod oferece tres modificadores para relaxar a obrigatoriedade:

| Modificador | Tipo resultante | Aceita `undefined`? | Aceita `null`? |
|-------------|----------------|---------------------|----------------|
| (nenhum) | `T` | Nao | Nao |
| `.optional()` | `T \| undefined` | Sim | Nao |
| `.nullable()` | `T \| null` | Nao | Sim |
| `.nullish()` | `T \| null \| undefined` | Sim | Sim |

### Por que `.nullish()` e o mais pratico para APIs?

Em APIs REST, existem duas situacoes comuns para "campo ausente":

1. **O cliente nao enviou o campo** → o valor chega como `undefined`
2. **O cliente enviou explicitamente `null`** → o valor chega como `null` (comum em JSON: `{"price": null}`)

O `.optional()` so cobre o caso 1. O `.nullable()` so cobre o caso 2. O `.nullish()` cobre ambos, sendo a escolha mais robusta para campos opcionais em APIs.

## Analogia do instrutor

O instrutor usou uma abordagem pratica: mostrou primeiro o erro (campo obrigatorio sem ser enviado), depois adicionou `.nullish()` e mostrou que passou. Depois removeu o `.nullish()` para manter o campo obrigatorio. Isso reforça que a decisao de tornar algo opcional deve ser consciente e deliberada.

## Quando NAO usar nullish

- Campos que sao a identidade da entidade (name, email, id) — devem ser obrigatorios
- Campos que o sistema precisa para funcionar — obrigatorios
- Nullish nao e um "atalho" para evitar lidar com validacao — e uma decisao de modelagem

## Relacao com o banco de dados

Se a coluna no banco e `NOT NULL`, o campo no schema deve ser obrigatorio. Se a coluna aceita `NULL`, use `.nullish()` no schema. Manter essa correspondencia evita erros em runtime.