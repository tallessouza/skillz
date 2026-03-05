# Deep Explanation: Tratando Requisicao

## Por que diferenciar erros de aplicacao de erros de servidor?

O instrutor enfatiza uma separacao fundamental no middleware de erro:

```typescript
if (error instanceof AppError) {
  // Erro NOSSO — tratado, com mensagem especifica
  // Retorna o status code que definimos (400, 401, 404...)
} else {
  // Erro do SERVIDOR — generico, nao tratado
  // Retorna 500 (Internal Server Error)
}
```

**A logica:** quando o erro e `instanceof AppError`, significa que foi **voce** (desenvolvedor) que lancou intencionalmente. Voce sabe o que aconteceu, tem uma mensagem clara e um status code apropriado. Quando NAO e `AppError`, e algo inesperado — um bug, falha de conexao, erro de runtime — e o cliente nao deve ver detalhes internos, apenas "erro interno do servidor".

Isso protege contra vazamento de informacoes sensíveis em producao enquanto mantem mensagens uteis para erros previsiveis.

## O poder dos valores padrao em parametros

O instrutor destaca que definir `statusCode = 400` como padrao na classe AppError e uma estrategia de economia de codigo:

- **400 (Bad Request)** e o erro mais comum em validacao de input
- Na maioria das vezes voce esta rejeitando uma requisicao mal formada
- Ao definir 400 como padrao, voce so precisa especificar o status quando e diferente

**Analogia do instrutor:** "É bem legal você utilizar valores padrões para parâmetros em cenários que você tem valores que são utilizados de forma mais comum. E aí, você pode, então, economizar no código."

Isso se aplica a qualquer classe ou funcao onde um argumento tem um valor predominante.

## Validacao agrupada vs individual

O instrutor mostra a evolucao do codigo:

**Primeiro:** um if so para `name`
**Depois:** percebe que `price` tambem precisa de validacao
**Solucao:** agrupa os dois com `||` — "para economizar"

A decisao de agrupar depende de:
- Se a mensagem de erro pode ser generica ("Nome e preço são obrigatórios") → agrupe
- Se cada campo precisa de mensagem especifica ("Nome não pode ter menos de 3 caracteres") → separe

## O fluxo completo da requisicao

1. Cliente envia POST /product com body `{ name, price }`
2. Controller extrai `name` e `price` do `request.body`
3. Validacao: se falta campo obrigatorio → `throw new AppError()`
4. Middleware de erro captura → verifica `instanceof AppError`
5. Se AppError → retorna status e mensagem especificos
6. Se outro erro → retorna 500 generico
7. Se tudo OK → retorna 201 com o produto criado

## Quando usar cada status code

O instrutor demonstra trocando entre 400 e 401:

- **400 Bad Request:** "o usuário fez uma requisição ruim. Não atendeu todos os critérios e requisitos da própria requisição"
- **401 Unauthorized:** "quando estou tentando acessar uma rota que não tenho acesso, que não sou autorizado"
- **500 Internal Server Error:** erros nao tratados, bugs, falhas inesperadas