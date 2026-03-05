# Deep Explanation: Validando ID de Parametros de Rota com Zod

## Por que transform + refine e nao z.coerce.number()?

O instrutor usa deliberadamente `z.string().transform().refine()` em vez de `z.coerce.number()`. Isso da controle total sobre:

1. **O passo de conversao** — voce ve exatamente o que acontece (`Number(value)`)
2. **A validacao pos-conversao** — o `refine` com `isNaN` captura conversoes silenciosas que resultam em NaN
3. **Mensagens customizadas** — cada etapa pode ter sua propria mensagem de erro

`z.coerce.number()` faz a conversao automaticamente, mas esconde o processo e pode ter comportamentos inesperados com strings vazias ou espacos.

## Fluxo da validacao

```
request.params.id (string)
    │
    ▼
z.string()           → Garante que e string
    │
    ▼
.transform(Number)   → Converte para number (pode ser NaN)
    │
    ▼
.refine(!isNaN)      → Rejeita NaN com mensagem clara
    │
    ▼
.parse(value)        → Executa pipeline, lanca ZodError se falhar
    │
    ▼
id (number validado) → Seguro para usar no banco
```

## Estrutura try-catch + next

O padrao do Express para tratamento centralizado de erros:

```typescript
async method(request: Request, response: Response, next: NextFunction) {
  try {
    // logica
  } catch (error) {
    next(error) // repassa para middleware de erro
  }
}
```

Quando o Zod lanca um `ZodError`, o `catch` captura e o `next(error)` repassa para o error handler global. Isso evita duplicar logica de resposta de erro em cada controller.

## Contexto da API de restaurante

A API gerencia mesas de restaurante com sessoes. O endpoint `PATCH /sessions/:id` encerra uma sessao (fecha a mesa). O ID chega como string na URL e precisa ser convertido para number para consultar o banco.

O instrutor demonstra o fluxo completo:
1. Cria o controller com `update`
2. Adiciona a rota `router.patch("/sessions/:id", controller.update)`
3. Testa no Insomnia — primeiro com texto (erro), depois com numero (sucesso 200)

## Nomenclatura das rotas REST

O instrutor renomeia as acoes para refletir o dominio:
- `create` → `open` (abrir mesa)
- nova acao → `close` (fechar mesa)
- `index` permanece para listar

Isso mostra que nomes de endpoints devem refletir a linguagem do dominio, nao apenas CRUD generico.