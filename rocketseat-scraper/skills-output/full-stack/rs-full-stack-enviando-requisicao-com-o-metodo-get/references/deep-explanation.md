# Deep Explanation: Rotas GET com Express

## Por que aprender Node puro antes do Express

O instrutor enfatiza um ponto pedagogico importante: quem aprende Express direto nao consegue enxergar o quanto ele simplifica. Tendo passado pela experiencia de criar rotas com Node puro — verificando `req.method`, parseando `req.url`, montando if/else para cada rota, tratando 404 manualmente — voce desenvolve uma apreciacao real pela abstração que o Express oferece.

A analogia implicita: e como aprender a dirigir com cambio manual antes do automatico. Voce entende o que acontece "por baixo" e consegue diagnosticar problemas melhor.

## O que o Express resolve automaticamente

### 1. Method matching
No Node puro, voce precisa:
```typescript
if (req.method === "GET") { ... }
else if (req.method === "POST") { ... }
```

No Express, o metodo HTTP e o proprio nome da funcao:
```typescript
app.get(...)   // GET
app.post(...)  // POST
app.put(...)   // PUT
app.delete(...)// DELETE
```

### 2. Path matching
No Node puro, voce precisa parsear a URL, separar query strings, comparar strings:
```typescript
if (req.url === "/" || req.url === "/home") { ... }
```

No Express, o path e o primeiro argumento:
```typescript
app.get("/", handler)
app.get("/home", handler)
```

### 3. Rotas inexistentes (404)
No Node puro, se nenhuma condicao bate, voce precisa de um else final:
```typescript
else {
  res.writeHead(404)
  res.end("Not Found")
}
```

No Express, ele automaticamente responde com `Cannot GET /path` e status 404. Zero codigo extra necessario.

### 4. Headers e Content-Type
No Node puro, voce seta headers manualmente com `writeHead`. No Express, `response.send()` detecta o tipo do conteudo e seta o Content-Type adequado.

## O fluxo de uma requisicao GET no Express

1. Navegador faz GET para `http://localhost:3333/`
2. Express recebe a requisicao
3. Express itera pelas rotas registradas
4. Encontra `app.get("/", handler)` — method e path batem
5. Executa o handler passando `(request, response)`
6. `response.send("Hello World Express")` envia resposta com status 200
7. Se nenhuma rota bater, Express retorna 404 automaticamente

## Testando no navegador

O navegador, por padrao, faz requisicoes GET quando voce digita uma URL na barra de enderecos. Isso torna o navegador a ferramenta mais simples para testar rotas GET — nao precisa de Postman ou curl para esse caso basico.

O instrutor demonstra:
- `localhost:3333/` → retorna "Hello World Express"
- `localhost:3333/x` → retorna "Cannot GET /x" (404 automatico)
- `localhost:3333/products` → retorna "Cannot GET /products" (rota nao definida)