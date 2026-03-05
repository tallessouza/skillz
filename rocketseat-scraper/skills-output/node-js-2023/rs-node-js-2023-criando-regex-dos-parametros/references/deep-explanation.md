# Deep Explanation: Criando RegEx dos Parâmetros de Rota

## Por que construir isso manualmente?

O instrutor enfatiza que no dia a dia você usará Express, Fastify, Nest ou outro framework. Mas construir um servidor Node do zero é um exercício valioso para entender o que acontece "por baixo dos panos". É ao mesmo tempo diversão e aprendizado.

## A convenção dos dois pontos

Em Node.js (e na maioria dos frameworks web), parâmetros dinâmicos em rotas são identificados com `:` antes do nome. Exemplo: `/users/:id` significa que `id` é um valor dinâmico — pode ser qualquer coisa. Sem esse mecanismo, o usuário teria que acessar literalmente `/users/:id`, o que não faz sentido.

## Como a RegEx funciona passo a passo

```
/:([a-zA-Z]+)/g
```

1. `/` — barra literal (início do segmento de rota, mas dentro da regex é o delimitador)
2. `:` — dois pontos literal (identifica que é um parâmetro)
3. `(` — início do grupo de captura (subgrupo)
4. `[a-zA-Z]` — qualquer letra maiúscula ou minúscula
5. `+` — uma ou mais vezes (o nome precisa ter pelo menos uma letra)
6. `)` — fim do grupo de captura
7. `/g` — flag global (encontra TODOS os matches, não para no primeiro)

### O papel dos parênteses (grupos de captura)

O instrutor explica que parênteses criam "subgrupos" ou "subdivisões" dentro da regex. O match completo retorna `:id`, mas o grupo de captura retorna apenas `id` (sem os dois pontos). Sem parênteses, você perde acesso ao nome limpo do parâmetro.

Analogia: é como uma busca dentro de outra busca. Primeiro encontra `:id`, depois dentro desse resultado extrai só `id`.

### Por que a flag `g` é essencial

Sem `g`, a regex para no primeiro match. Se a rota é `/users/:userId/groups/:groupId`, sem `g` só capturaria `:userId`. Com `g`, captura ambos.

O instrutor demonstra isso ao vivo com a extensão "regex-previewer" do VS Code — ao adicionar `g`, o segundo parâmetro também fica destacado.

## O problema do Iterator

`String.prototype.matchAll()` retorna um `RegExpStringIterator`, não um array. Isso significa que:
- `console.log()` mostra `[object RegExp String Iterator]` — inútil para debug
- `JSON.stringify()` também não resolve
- A solução é `Array.from()` para converter o iterator em array navegável

O instrutor descobriu isso ao vivo tentando dar log e recebendo output ilegível, mostrando o processo real de debugging.

## Estrutura do resultado

Cada elemento do array retornado tem:
- `[0]` — match completo (`:id`)
- `[1]` — primeiro grupo de captura (`id`)
- `index` — posição no string original
- `input` — o string original completo

## Contexto no projeto

Esta função `buildRoutePath` é o primeiro passo de um sistema maior. Ela identifica QUAIS parâmetros existem na rota. Nas próximas aulas, essa informação será usada para:
1. Converter o path em uma RegEx que aceite valores dinâmicos
2. Extrair os valores reais quando uma requisição chega
3. Disponibilizar esses valores no `req.params`