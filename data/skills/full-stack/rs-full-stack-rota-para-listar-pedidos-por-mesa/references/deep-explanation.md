# Deep Explanation: Rota Para Listar Pedidos Por Mesa

## Por que separar rotas de controllers?

O instrutor demonstra um padrao claro: o arquivo `orders-routes.ts` define apenas o verbo HTTP e o path, enquanto o `OrdersController` contem toda a logica. Isso segue o principio de responsabilidade unica — rotas sao mapeamento, controllers sao execucao.

Quando o instrutor "recolhe" o metodo `create` e adiciona o `index` logo abaixo, ele mostra que o controller agrupa todos os metodos relacionados a um recurso. Isso facilita encontrar toda a logica de orders em um unico lugar.

## O padrao async/try-catch/next

O instrutor segue um esqueleto consistente para cada metodo do controller:

```typescript
async metodo(request: Request, response: Response, next: NextFunction) {
  try {
    // logica
    return response.json(resultado)
  } catch (error) {
    next(error)
  }
}
```

Este padrao garante que:
1. Erros assincronos sao capturados (try/catch com async)
2. Erros sao repassados ao middleware de erro do Express (next)
3. O response sempre retorna JSON (padrao API REST)

## Convencao de nomeacao da rota

O instrutor escolheu `/table-session/:id` como sub-rota de `/orders`. A rota completa fica:

```
GET /orders/table-session/:id
```

Isso comunica claramente: "liste os pedidos filtrados por uma sessao de mesa especifica". O `:id` refere-se ao ID da sessao da mesa (table_session), nao ao ID do pedido.

## Fluxo de teste com Insomnia

O instrutor demonstra o fluxo completo de validacao:
1. Criar a rota no codigo
2. Retornar `response.json()` vazio para confirmar que a rota funciona (status 200)
3. Criar o request no Insomnia com nome descritivo ("ByTableSession")
4. Usar variaveis de ambiente (Base URL + Resource) para montar a URL
5. Acrescentar o path especifico (`/table-session/2`)
6. Enviar e verificar o status 200

Este approach incremental — primeiro confirmar que a rota responde, depois implementar a logica — evita debugar multiplos problemas simultaneamente.

## Organizacao no Insomnia

O instrutor renomeia o request para "ByTableSession" e organiza dentro da pasta de Orders. A convencao de nomes descritivos no cliente HTTP facilita encontrar e retestar endpoints durante o desenvolvimento.