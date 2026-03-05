# Deep Explanation: Atualizando Produtos

## Por que validar params com Zod transform?

Params de URL (`request.params.id`) sempre chegam como `string` no Express. O padrão comum é fazer `Number(request.params.id)` inline, mas isso não valida — se o usuário passar "abc", `Number("abc")` retorna `NaN` e a query falha silenciosamente ou causa erro inesperado no banco.

A cadeia `z.string().transform(Number).refine(v => !isNaN(v))` resolve três problemas de uma vez:
1. **Documenta** que o param chega como string
2. **Converte** para number automaticamente
3. **Valida** que a conversão foi bem sucedida

O resultado do `.parse()` já é um `number` tipado — não precisa de cast adicional.

### Transform vs Coerce

O Zod oferece `z.coerce.number()` como alternativa. A diferença:
- `z.coerce.number()` — aceita qualquer input e tenta converter (menos controle)
- `z.string().transform(Number).refine()` — explicita que espera string, converte, e valida (mais controle e mensagem customizada)

O instrutor escolheu a segunda abordagem porque permite mensagem de erro customizada ("id must be a number") e deixa explícito o fluxo de transformação.

## Por que `knex.fn.now()` e não `new Date()`?

- `knex.fn.now()` usa a função `NOW()` do banco de dados — o timestamp é gerado pelo servidor de banco
- `new Date()` usa o relógio da aplicação Node.js — pode divergir do banco se estiverem em fusos ou com clocks dessincronizados

Em produção, consistência de timestamps importa. Usar a função do banco garante que `created_at` e `updated_at` usam a mesma fonte de tempo.

## Separação entre `created_at` e `updated_at`

O instrutor enfatiza que:
- `created_at` é **imutável** — registra o momento exato da criação, nunca muda
- `updated_at` muda a cada operação de update

Isso permite:
- Saber quando o registro foi criado originalmente
- Saber quando foi a última modificação
- Calcular "idade" do registro vs "frescor" dos dados

Quando cria um produto, ambos têm o mesmo valor. Após o primeiro update, divergem.

## Fluxo completo da requisição

```
Cliente envia PUT /products/2 com body { name: "...", price: 60.5 }
  → Express roteia para productsController.update
    → Zod valida params.id (string → number, refine isNaN)
    → Zod valida body (name string min 6, price number > 0)
    → Knex executa UPDATE products SET name=?, price=?, updated_at=NOW() WHERE id=?
    → Response 200 OK
```

Se qualquer validação falha, o erro cai no `catch` e é passado para `next(error)`, que o middleware de erro trata.

## Por que PUT e não PATCH?

O instrutor usa PUT porque o body schema exige **todos** os campos (name e price são obrigatórios). Em uma operação PATCH, os campos seriam opcionais (`.optional()` no Zod). A escolha de PUT indica que o cliente deve enviar o recurso completo, não apenas os campos que mudaram.

## Reutilização do body schema

O instrutor copia o schema do método `create` para o `update`. Em um projeto real, esse schema poderia ser extraído para um arquivo compartilhado:

```typescript
// schemas/product.ts
export const productBodySchema = z.object({
  name: z.string().trim().min(6),
  price: z.number().gt(0),
})
```

Mas no contexto da aula, copiar é aceitável para manter a simplicidade e não introduzir abstrações prematuras.