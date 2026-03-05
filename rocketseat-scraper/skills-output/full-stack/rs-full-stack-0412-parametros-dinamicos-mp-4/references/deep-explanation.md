# Deep Explanation: Parâmetros Dinâmicos em Rotas Node.js

## O problema fundamental

Quando um servidor HTTP Node.js puro compara rotas usando igualdade estrita (`===`), qualquer adição à URL quebra o match:

- `/tickets` → OK
- `/tickets?status=closed` → 404 (a string inclui `?status=closed`)
- `/tickets/abc-123` → 404 (a string inclui `/abc-123`)

O navegador e ferramentas como Insomnia/Postman adicionam query params automaticamente à URL. O servidor recebe a URL completa, incluindo tudo após o `?`.

## Dois tipos de parâmetros

### Query params (parâmetros nomeados)
- Formato: `?key=value&key2=value2`
- Aparecem após `?` na URL
- São opcionais — a mesma rota funciona com ou sem eles
- Exemplo: `/tickets?status=closed`

### Route params (parâmetros não nomeados / de rota)
- Formato: `/resource/:id`
- Fazem parte do path da URL
- Representam um recurso específico
- Exemplo: `/tickets/abc-123`

O instrutor chama query params de "parâmetros nomeados" e route params de "parâmetros não nomeados" — a nomenclatura se refere ao fato de query params terem `key=value` (nome explícito) enquanto route params são posicionais.

## A solução com regex

### Passo 1: Detectar `:param` na definição da rota

A regex `/:([a-zA-Z]+)/g` encontra padrões como `:id`, `:userId`, `:slug` nas rotas definidas pelo desenvolvedor.

### Passo 2: Substituir por grupo de captura

Cada `:param` é substituído por `(?<param>[a-zA-Z0-9\-_]+)` — um grupo nomeado regex que:
- Captura o valor real da URL
- Nomeia o grupo com o nome do parâmetro
- Aceita letras, números, hífens e underscores

### Passo 3: Adicionar suporte a query params

No final da regex, `(?<query>\?(.*))?$` é adicionado:
- `\?` — escapa o `?` literal (senão seria quantificador regex)
- `(.*)` — captura qualquer coisa após o `?`
- `?$` — torna todo o grupo opcional (rota funciona com ou sem query)

### Passo 4: Trocar comparação por teste

Em vez de `route.path === url`, usa-se `route.path.test(url)` — o método `.test()` de RegExp retorna boolean.

## O bug do `undefined` — lição prática

O instrutor esqueceu o `return` na função `parseRoutePath`. Resultado: todas as rotas tinham `path: undefined`, e nenhuma requisição matchava. Isso é um erro silencioso comum em JavaScript — funções sem `return` retornam `undefined` implicitamente.

Dica de debugging usada: adicionar `console.log` temporário para inspecionar o conteúdo das rotas antes da comparação. Ao ver `undefined` no path, ficou claro que o utilitário não estava retornando.

## Por que separar em `utils/`

A lógica de parsing de rotas é:
1. Reutilizável — todas as rotas passam pelo mesmo processo
2. Testável isoladamente — pode testar regex sem subir servidor
3. Independente do handler — não mistura lógica de negócio com infraestrutura

## Limitações (próxima aula)

Nesta aula, a regex **valida** se a URL bate com a rota, mas ainda não **extrai** os valores dos parâmetros. A extração (usando `.match()` ou `.exec()` com os grupos nomeados) será implementada na próxima aula.