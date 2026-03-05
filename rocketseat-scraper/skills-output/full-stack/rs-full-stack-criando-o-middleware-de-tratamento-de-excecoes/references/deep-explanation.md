# Deep Explanation: Middleware de Tratamento de Exceções

## Por que uma classe AppError separada?

O instrutor explica que a grande sacada é **identificar se o erro foi lançado intencionalmente pela aplicação**. Quando você usa `throw new AppError(...)`, o middleware consegue verificar via `instanceof AppError` se é um erro controlado (com statusCode e mensagem definidos por você) ou um erro genérico/inesperado.

Isso é fundamental em arquiteturas de camadas (controller → service → repository): qualquer camada pode lançar um `AppError`, e o middleware centralizado captura e formata a resposta.

## O papel do `next()` no Express

O `next()` nos controllers não serve apenas para chamar o próximo middleware — ele é o mecanismo de **propagação de erros**. Quando você faz `next(error)` passando um argumento, o Express pula todos os middlewares normais e vai direto para o primeiro middleware de erro (aquele com 4 parâmetros).

O instrutor destaca: "a gente tá usando esse next pra chamar o próximo recurso que vai ser processado dentro da nossa API, que pode ser inclusive essa função pra tratar os erros."

## Por que 4 parâmetros no middleware de erro?

O Express identifica um middleware como **error handler** exclusivamente pela assinatura de 4 parâmetros `(err, req, res, next)`. Se você omitir qualquer um, o Express trata como middleware normal e não roteia erros para ele.

O instrutor usa `_next` (com underscore) porque não precisa chamar next — ele retorna a resposta diretamente. Mas o parâmetro precisa existir na assinatura para o Express reconhecer.

## Ordem de registro importa

O middleware de erro DEVE ser registrado **após todas as rotas e middlewares normais**, mas **antes do `app.listen()`**. Isso porque o Express processa middlewares na ordem de registro, e o error handler precisa ser o último da cadeia para capturar erros de qualquer rota.

## StatusCode padrão 400

O instrutor define 400 como padrão porque a maioria dos erros lançados manualmente são erros de validação ou regras de negócio (bad request). Para erros mais específicos, o desenvolvedor passa o código explicitamente: `new AppError("Not found", 404)`.

## Diferenciação: AppError vs erro genérico

- **AppError (instanceof true)**: retorna `error.statusCode` e `error.message` — o desenvolvedor tem controle total
- **Erro genérico (instanceof false)**: retorna 500 com `error.message` — erros inesperados que não foram previstos

Essa separação garante que erros de programação nunca retornem um status 200 ou 400 acidentalmente — eles sempre caem no 500.

## Path aliases com `@/`

O instrutor menciona a importação com `@/utils/appError` usando o alias `@/*` configurado no tsconfig, que mapeia para a pasta `src/`. Isso encurta importações e facilita mover arquivos sem quebrar caminhos relativos.

## Estrutura de pastas

```
src/
├── utils/
│   └── appError.ts        # Classe de erro customizado
├── middlewares/
│   └── error-handling.ts   # Middleware global de erro
├── controllers/
│   └── *.ts               # Controllers usam next(error)
└── server.ts              # Registra middleware após rotas
```