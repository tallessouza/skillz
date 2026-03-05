# Deep Explanation: Customizar Mensagens de Validação com Zod

## Por que customizar mensagens?

O Zod, por padrao, emite mensagens genericas como `"Required"` quando um campo obrigatorio nao e enviado. Isso e suficiente para desenvolvimento, mas em producao o usuario final (ou o desenvolvedor consumindo a API) precisa saber exatamente qual campo faltou e o que fazer.

## Como funciona internamente

Quando voce define `z.string()`, o Zod registra internamente que o campo e obrigatorio. Se o valor nao for enviado, ele gera um `ZodError` com `code: "invalid_type"` e `message: "Required"`.

Ao passar o objeto `{ required_error: "price is required" }`, voce sobrescreve essa mensagem padrao apenas para o caso de campo ausente. Outras validacoes (tipo errado, formato invalido) continuam com suas proprias mensagens.

## Anatomia do objeto de configuracao

```typescript
z.string({
  required_error: "mensagem quando campo ausente",
  invalid_type_error: "mensagem quando tipo errado"
})
```

- `required_error`: Disparado quando o campo nao existe no input (undefined)
- `invalid_type_error`: Disparado quando o campo existe mas tem tipo errado (ex: numero onde deveria ser string)

## Fluxo demonstrado na aula

1. Instructor fez request no Insomnia sem o campo `price`
2. Zod retornou erro padrao: campo requerido (mensagem generica)
3. Adicionou `{ required_error: "price is required" }` no schema
4. Nova request: mensagem customizada aparece no response
5. Repetiu o processo para o campo `name`
6. Com ambos os campos presentes, validacao passa normalmente

## Insight do instrutor

A customizacao e feita diretamente dentro do metodo de tipo (`z.string()`, `z.number()`), nao em um middleware separado. Isso mantem a mensagem co-localizada com a definicao do campo, facilitando manutencao.

## Quando usar

- APIs REST onde o response de erro e consumido por frontends
- Formularios com validacao server-side
- Qualquer ponto onde o erro sera exibido para um usuario humano

## Quando NAO usar

- Scripts internos onde ninguem le as mensagens
- Validacoes de configuracao que so rodam em startup (mensagem padrao basta)