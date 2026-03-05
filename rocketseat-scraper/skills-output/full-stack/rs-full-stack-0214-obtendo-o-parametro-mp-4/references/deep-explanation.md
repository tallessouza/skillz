# Deep Explanation: Extração de Parâmetros de Rota no Node.js

## Por que regex e não comparação direta?

Quando uma rota é definida como `/products/:id`, o `:id` é um placeholder — nunca será igual ao texto real da URL (`/products/7`). A solução é converter o path em uma expressão regular que **aceite qualquer valor** na posição do parâmetro e **capture esse valor** em um grupo nomeado.

O fluxo completo:
1. `/products/:id` → regex `/products/(?<id>[a-zA-Z0-9\-_]+)/`
2. URL `/products/7` → `regex.test("/products/7")` → `true`
3. `"/products/7".match(regex).groups` → `{ id: "7" }`

## A regex explicada passo a passo

### Regex de identificação: `/:([a-zA-Z]+)/g`

- `:` — literal, identifica o início de um parâmetro (convenção de rotas)
- `([a-zA-Z]+)` — grupo de captura: pega o nome do parâmetro (ex: `id`, `slug`)
- `+` — uma ou mais letras em sequência (sem o `+`, pegaria só a primeira letra)
- `g` — flag global: encontra TODAS as ocorrências, não só a primeira

O instrutor demonstrou isso com a extensão **Regex Previewer** no VS Code:
- `/products` → nada destacado (sem `:`)
- `/products/:id` → `:id` destacado
- `/products/:id/reviews/:reviewId` → ambos destacados com flag `g`
- Sem flag `g` → só o primeiro `:id` seria encontrado

### Regex de substituição: `(?<$1>[a-zA-Z0-9\-_]+)`

- `(?<$1>...)` — grupo nomeado, onde `$1` é substituído pelo nome capturado (ex: `id`)
- `[a-zA-Z0-9\-_]+` — aceita letras, números, hífens e underscores
- Resultado: `:id` vira `(?<id>[a-zA-Z0-9\-_]+)`

## Por que `.map()` em vez de aplicar manualmente?

O instrutor mostrou duas abordagens:

**Manual (funciona, mas não escala):**
```javascript
{ method: 'DELETE', path: parseOutPath('/products/:id'), handler: ... }
// Precisa lembrar de adicionar para cada rota
```

**Com `.map()` (automático):**
```javascript
].map(route => {
  route.path = parseOutPath(route.path)
  return route
})
// Qualquer rota nova é convertida automaticamente
```

A vantagem é que o desenvolvedor escreve paths legíveis (`:id`) e a conversão acontece uma única vez na inicialização.

## O erro `.group` vs `.groups`

O instrutor cometeu esse erro ao vivo — escreveu `routeParams.group` (singular) e recebeu `undefined`. O método correto é `routeParams.groups` (plural). Esse é um erro comum porque:
- `.group` não existe no objeto de match
- Não gera erro — simplesmente retorna `undefined`
- É silencioso e difícil de debugar

## Injeção de params no request

A estratégia de adicionar `request.params` no middleware (antes de chamar o handler) segue o mesmo padrão que frameworks como Express usam internamente. Isso desacopla a extração de parâmetros da lógica de negócio:

```javascript
// Middleware extrai
request.params = routeParams.groups ?? {}

// Handler usa
const { id } = request.params
```

O handler nunca precisa saber como os parâmetros foram extraídos.

## Analogia do instrutor: "engrenagens nos bastidores"

O instrutor enfatiza que todo esse processo (regex, matching, extração) é o que frameworks fazem automaticamente. Construir do zero revela as "engrenagens" — o mecanismo real por trás de `req.params.id` no Express. Isso dá ao desenvolvedor compreensão profunda para debugar problemas de roteamento e entender limitações de frameworks.