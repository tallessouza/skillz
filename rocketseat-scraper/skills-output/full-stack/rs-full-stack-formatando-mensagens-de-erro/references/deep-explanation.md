# Deep Explanation: Formatando Mensagens de Erro do Zod

## Por que o ZodError cai no handler genérico

Quando o Zod falha na validação (via `.parse()`), ele **lança uma exceção** — um `throw`. Essa exceção é uma instância de `ZodError`, que é uma classe própria do Zod. Como `ZodError` NÃO herda de `AppError` (a classe customizada da aplicação), o `instanceof AppError` retorna `false`, e o erro "escorrega" para o handler genérico de 500.

O instrutor destaca que isso é um problema real: o cliente recebe um status 500 (erro de servidor) quando na verdade o problema é dele (dados inválidos). A correção é adicionar um check de `instanceof ZodError` ANTES do handler genérico.

## A cadeia de instanceof

A ordem importa:

```
error entra
  → é AppError? → trata como erro de negócio (status customizado)
  → é ZodError? → trata como erro de validação (400)
  → senão → erro interno desconhecido (500)
```

Cada `instanceof` é uma "peneira" que filtra erros mais específicos primeiro. Se inverter a ordem, erros podem ser capturados pelo handler errado.

## O método format() do ZodError

O instrutor enfatiza o uso de `error.format()` ao invés de `error.message` ou `error.errors`. O `format()` é um método do próprio ZodError que:

1. **Agrupa erros por campo** — cada propriedade do objeto retornado corresponde a um campo do schema
2. **Usa `_errors` como array** — porque um campo pode ter múltiplos erros (tipo errado + tamanho mínimo, por exemplo)
3. **Produz estrutura navegável** — o front-end pode acessar `issues.price._errors[0]` diretamente

Exemplo de output do `format()`:
```json
{
  "_errors": [],
  "price": {
    "_errors": ["Expected number, received string"]
  },
  "name": {
    "_errors": ["String must contain at least 1 character(s)"]
  }
}
```

## Por que status 400 e não 422

O instrutor usa 400 (Bad Request) como status padrão para erros de validação. Embora 422 (Unprocessable Entity) seja tecnicamente mais preciso para "entendi o formato mas os dados são inválidos", 400 é mais amplamente usado e compreendido. Ambos são aceitáveis — o importante é ser consistente na API inteira.

## A importância de padronizar `message`

O instrutor destaca que ter uma propriedade `message` padronizada em TODOS os erros da API é valioso porque:

- O front-end pode sempre ler `response.data.message` independente do tipo de erro
- Facilita logging e monitoramento
- `"Validation error"` como message fixa para erros do Zod permite que o front-end saiba que deve olhar `issues` para detalhes

## O return é importante

Sem `return` antes do `response.status(400).json(...)`, o código continua executando e pode tentar enviar uma segunda resposta (o handler de 500 abaixo), causando erro de "headers already sent". O instrutor adiciona `return` explicitamente para evitar isso.