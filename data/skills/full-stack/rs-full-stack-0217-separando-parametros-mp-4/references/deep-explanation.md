# Deep Explanation: Separando Parâmetros de Query String

## Por que slice(1) e não split('?')

O instrutor demonstra visualmente a diferença:
- `query.slice(0)` → `?categoria=computador&preco=500` (mantém o `?`)
- `query.slice(1)` → `categoria=computador&preco=500` (remove o `?`)

Usar `split('?')[1]` funcionaria, mas é menos eficiente — cria um array intermediário desnecessário apenas para descartar o primeiro elemento. `slice(1)` é uma operação de string direta que "recorta pulando uma casa".

## O pipeline de transformação: string → array → objeto

A transformação segue 3 estágios claros:

1. **String → String (sem `?`)**: `slice(1)` — limpeza
2. **String → Array**: `split('&')` — cada item é `chave=valor`
3. **Array → Object**: `reduce` — monta `{ chave: valor }`

O instrutor mostrou cada estágio com `console.log` para visualizar a transformação progressiva. Isso é uma técnica pedagógica importante: nunca tente fazer tudo de uma vez, vá conferindo cada passo.

## Por que reduce e não forEach

O `reduce` é o padrão funcional para "transformar uma coleção em um único valor". Neste caso, transformamos um array de strings em um objeto. O acumulador começa como `{}` (objeto vazio) e a cada iteração adiciona uma propriedade.

```javascript
// O reduce recebe:
// 1. Função com (acumulador, itemAtual)
// 2. Valor inicial do acumulador
.reduce((queryParams, param) => {
  const [key, value] = param.split('=')
  queryParams[key] = value
  return queryParams  // IMPORTANTE: sempre retornar o acumulador
}, {})  // {} é o valor inicial
```

## Query params são opcionais

O instrutor enfatiza que parâmetros nomeados (query params) são **opcionais** por natureza. Diferente de route params (como `/user/:id`), query params podem ou não estar presentes. Por isso:

1. Não é necessário declarar query params na definição da rota
2. Sempre verificar se a query existe antes de fazer parsing
3. O fallback `{}` garante que `request.query` sempre seja um objeto válido

```javascript
// Verificação com ternário:
request.query = query ? extractQueryParams(query) : {}
```

## Injeção de propriedade no request

O padrão de adicionar `request.query` é fundamental em servidores HTTP Node.js. Frameworks como Express fazem isso automaticamente, mas ao construir do zero, o instrutor mostra que basta atribuir:

```javascript
request.query = parsedQuery
```

Isso permite que qualquer handler de rota acesse os query params de forma uniforme, sem precisar re-parsear a URL.

## Analogia: recortar e separar

O instrutor usa a analogia de "recortar" (slice) e "dividir" (split). A query string é como um texto com separadores conhecidos:
- `?` separa o path da query
- `&` separa parâmetros entre si  
- `=` separa chave de valor

Cada operação "corta" em um separador diferente, progressivamente decompondo a string até chegar nas partes atômicas (chave e valor).