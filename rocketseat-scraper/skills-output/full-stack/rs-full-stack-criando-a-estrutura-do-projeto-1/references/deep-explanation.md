# Deep Explanation: Estrutura de Projeto Express

## Por que separar rotas de controllers?

O instrutor Rodrigo enfatiza que **rotas definem caminhos** e **controllers definem funcionalidades**. A rota diz "quando alguém acessar GET /products, execute isso". O controller diz "isso significa buscar produtos no banco e retornar JSON".

Essa separação permite:
- Adicionar novas funcionalidades sem modificar o arquivo do servidor
- Encontrar rapidamente onde está a lógica de um domínio específico
- Replicar a mesma estrutura para novos domínios (orders, users, tables, etc.)

O instrutor demonstra isso dizendo: "A gente só está criando a estrutura aqui do nosso projeto, para depois replicar a mesma estrutura para as outras funcionalidades."

## O padrão do index.ts agregador

O `routes/index.ts` funciona como um hub central. Cada arquivo de rota por domínio (`products-routes.ts`, `orders-routes.ts`) é registrado nele com um prefixo:

```typescript
routes.use("/products", productRoutes)
routes.use("/orders", orderRoutes)
```

O `server.ts` só precisa conhecer o `index.ts`. Isso significa que adicionar um domínio inteiro requer:
1. Criar o controller
2. Criar o arquivo de rotas
3. Registrar no index.ts

O server.ts nunca é tocado.

## Por que next(error) em métodos assíncronos?

O Express não captura automaticamente erros de funções assíncronas. Se um `await` falha dentro de um handler async sem try/catch com next, o Express não consegue lidar com o erro — a requisição simplesmente trava.

O padrão ensinado:
```typescript
async method(req, res, next) {
  try {
    // await operação de banco
    return res.json(resultado)
  } catch (error) {
    next(error) // repassa para o Express tratar
  }
}
```

O instrutor explica: "A gente está chamando a próxima da fila de execução, passando então o erro, porque a gente está lidando com erros que podem vir de um processo assíncrono e não síncrono."

## Controller como classe

O instrutor usa classes para controllers. Cada método público da classe corresponde a uma ação do CRUD:
- `index` — listar todos
- `create` — cadastrar
- `show` — detalhar um
- `update` — atualizar
- `remove` — excluir

A instanciação acontece no arquivo de rotas:
```typescript
const productController = new ProductsController()
productRoutes.get("/", productController.index)
```

## Erro comum: extensão de arquivo

O instrutor cometeu um erro ao vivo — criou `index.tsx` ao invés de `index.ts`. No backend não existe JSX, então a extensão correta é sempre `.ts`. Ele corrigiu durante a aula: "Eu tinha colocado errado, coloquei ali um x no nome do arquivo, viajei."

## Fluxo completo de uma requisição

```
Browser GET /products
  → server.ts (app.use(routes))
    → routes/index.ts (routes.use("/products", productRoutes))
      → routes/products-routes.ts (productRoutes.get("/", controller.index))
        → controllers/products-controller.ts (index method)
          → response.json({ message: "ok" })
```