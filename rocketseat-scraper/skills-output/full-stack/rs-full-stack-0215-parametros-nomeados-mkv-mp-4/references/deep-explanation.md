# Deep Explanation: Parâmetros Nomeados

## Por que "nomeados"?

O instrutor faz a distinção clara: parâmetros de rota (route params) como `/products/15` são **não nomeados** — não está explícito na URL o que o `15` representa. Já query params como `?category=computer` são **nomeados** porque o nome do parâmetro (`category`) está explícito na URL junto com seu valor.

Essa distinção é fundamental para entender quando usar cada tipo.

## Anatomia da URL com query string

```
https://api.example.com/products/15?category=computer&price=5000
│                       │        │ │        │                   │
│         base URL      │ route  │ │  query string             │
│                       │ param  │ │                            │
│                       │        │ ?  inicia query params       │
│                       │        │    &  separa params          │
```

- `?` (interrogação): marca o início dos parâmetros nomeados — "daqui pra frente são query params"
- `&` (E comercial): separa um parâmetro do próximo
- Formato sempre: `nome=valor`

## Casos de uso corretos

### Filtros
Parâmetros nomeados são ideais para filtros porque filtros são **opcionais**. Uma listagem de produtos funciona sem filtros (retorna todos) e funciona com filtros (retorna subset).

### Paginação
`?page=2&limit=20` — paginação é por natureza opcional. Sem esses params, a API retorna a primeira página com limite padrão.

### Ordenação
`?sort=price&order=desc` — mesma lógica de opcionalidade.

## Por que não dados sensíveis?

O instrutor enfatiza: **nunca passe senhas, cartões ou dados sensíveis em query params**. Razões técnicas:

1. **URL visível no navegador** — qualquer pessoa olhando a tela vê os dados
2. **Logs de servidor** — a URL completa (com query string) é logada por padrão em access logs
3. **Histórico do navegador** — a URL com params fica salva no histórico
4. **Referrer header** — se o usuário navega para outro site, a URL anterior (com params) pode ser enviada no header Referer
5. **Cache de proxy** — proxies intermediários podem cachear URLs com dados sensíveis

## Insomnia como ferramenta

O instrutor demonstra que o Insomnia permite adicionar query params de duas formas:
1. **Manualmente na URL**: digitar `?category=computer&price=5000` direto
2. **Via interface de "Query Parameters"**: preencher nome/valor em campos separados — mais organizado, permite reordenar arrastando, e o Insomnia monta a URL automaticamente

A URL Preview do Insomnia mostra como a requisição final será enviada, incluindo todos os params montados.

## Route param vs Query param — regra prática

| Pergunta | Se sim → | Se não → |
|----------|----------|----------|
| O dado identifica UM recurso específico? | Route param (`/users/15`) | Query param |
| A requisição faz sentido sem esse dado? | Query param (`?page=2`) | Route param |
| O dado é sensível? | Body (POST/PUT) | Pode ser param |