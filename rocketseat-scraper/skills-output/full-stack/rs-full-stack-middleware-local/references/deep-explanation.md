# Deep Explanation: Middleware Local

## O modelo mental de cadeia

O instrutor explica middleware como uma **fila de funcoes** entre a rota e o handler. Quando uma requisicao chega em `app.post('/products', mw1, mw2, handler)`:

1. Express/Fastify identifica a rota `/products` com metodo POST
2. Executa `mw1` — que pode inspecionar, modificar ou rejeitar a requisicao
3. `mw1` chama `next()` — isso diz "passe para o proximo da fila"
4. Executa `mw2` — mesma logica
5. `mw2` chama `next()` — avanca para o handler
6. Handler executa e envia a resposta

**Insight do instrutor:** "Esse next, ele vai fazer exatamente isso. Ele sabe quem é a próxima função e vai chamar ela." O `next()` nao e magico — ele simplesmente avanca o ponteiro na lista de argumentos da rota.

## Global vs Local vs Posicional: tres estrategias

### Estrategia 1: Global
```typescript
app.use(middleware)
```
Aplica para **todas** as rotas definidas **abaixo** dele. O instrutor destaca que a posicao importa — rotas definidas antes do `app.use()` nao sao afetadas.

### Estrategia 2: Local (por rota)
```typescript
app.post('/products', middleware, handler)
```
Aplica **apenas** naquela rota. O instrutor demonstra que ao fazer GET em outra rota, o middleware nao executa. Apenas o POST em `/products` dispara o middleware.

### Estrategia 3: Posicional (grupo)
O instrutor menciona um cenario com 10 rotas: "quero aplicar da terceira para baixo". Nesse caso, voce posiciona o `app.use(middleware)` entre a segunda e a terceira rota. Tudo abaixo recebe o middleware, tudo acima nao.

## Quando usar cada estrategia

O instrutor resume de forma direta:
- **Global:** "quando voce tem algum middleware que voce quer aplicar para todas as rotas"
- **Local:** "quando voce quer aplicar para uma rota especifica"
- **Posicional:** "aplicar para varias rotas de uma vez, nao necessariamente todas"

## next() pode apontar para outro middleware

O instrutor destaca: "A proxima funcao pode ser, inclusive, um outro middleware." Isso significa que voce pode construir pipelines de processamento:

```
Rota → Auth → Validate → RateLimit → Handler
```

Cada `next()` avanca um passo. Se qualquer middleware nao chamar `next()` (por exemplo, retornando um erro 401), a cadeia para ali.

## Duplicacao como estrategia valida

O instrutor menciona que voce pode "copiar e aplicar em outra rota, duplicar conforme preferir." Para 2-3 rotas nao consecutivas, duplicar o middleware inline e mais claro do que tentar truques de posicionamento.