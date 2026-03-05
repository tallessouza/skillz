# Deep Explanation: Validacao de Dados com Zod

## Por que Zod substitui validacao manual

O instrutor demonstrou primeiro a abordagem manual — uma serie de `if` statements verificando cada campo individualmente. O ponto central: **cada campo requer ~4 linhas de codigo** (check de existencia + check de tipo + mensagem de erro + return). Para um objeto com 5 campos, sao ~20 linhas de codigo repetitivo.

Com Zod, o mesmo resultado e alcancado com **1 linha por campo** no schema + 1 linha de parse. A reducao nao e apenas estetica — e estrutural:

- **Validacao manual:** logica espalhada, facil de esquecer um campo
- **Zod schema:** declarativo, impossivel esquecer um campo definido

## Como o parse funciona

`bodySchema.parse(request.body)` faz duas coisas:

1. **Valida** — verifica se cada propriedade do objeto corresponde ao tipo declarado
2. **Retorna dados tipados** — o retorno tem inferencia TypeScript automatica

Se a validacao falha, Zod lanca um `ZodError` com detalhes precisos:
- Qual campo falhou
- Qual tipo era esperado
- Qual tipo foi recebido

Exemplo de mensagem automatica do Zod quando `price` recebe string:
```json
{
  "code": "invalid_type",
  "expected": "number",
  "received": "string",
  "path": ["price"],
  "message": "Expected number, received string"
}
```

## Excecoes e error handler global

O instrutor destacou que o Zod **lanca excecao** (nao retorna null ou false). Isso significa que, se voce ja tem um error handler global no servidor (como o `setErrorHandler` do Fastify), o ZodError e capturado automaticamente.

Nao e necessario fazer try/catch em cada rota — o error handler centralizado lida com isso. Na aula, o erro aparecia como "internal server error" porque ainda nao tinham customizado o handler para ZodError especificamente (isso e tratado na aula seguinte).

## Tipagem automatica — o beneficio oculto

O instrutor demonstrou que, ao fazer:
```typescript
const body = bodySchema.parse(request.body)
body. // autocomplete mostra: name (string), price (number)
```

O TypeScript infere os tipos diretamente do schema Zod. Isso elimina:
- Interfaces manuais para body
- Type assertions (`as`)
- Tipagem duplicada (schema + interface)

O schema Zod se torna a **unica fonte de verdade** tanto para validacao runtime quanto para tipagem estatica.

## Destructuring do resultado

Em vez de salvar em uma variavel intermediaria:
```typescript
const body = bodySchema.parse(request.body)
const name = body.name
const price = body.price
```

O instrutor mostrou que se pode destructurar diretamente:
```typescript
const { name, price } = bodySchema.parse(request.body)
```

Isso substitui o antigo `const { name, price } = request.body` — mesma sintaxe, mas agora com validacao garantida.

## Schema como contrato

O bodySchema funciona como um contrato: define exatamente o que a rota espera receber. Se o contrato nao e atendido, a requisicao e rejeitada antes de qualquer logica de negocio executar. Isso segue o principio de **fail fast** — quanto antes o erro e detectado, mais facil e diagnosticar.