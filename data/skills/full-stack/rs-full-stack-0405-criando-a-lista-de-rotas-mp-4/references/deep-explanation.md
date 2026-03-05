# Deep Explanation: Criando Lista de Rotas

## Por que separar rotas por arquivo de recurso?

O instrutor Rodrigo explica que, embora no momento a API so tenha rotas de tickets, ele ja cria a separacao por arquivo porque:

1. **Habito de organizacao** — "eu ja vou criando para voce ter esse habito". A ideia e que desde o inicio voce pense em organizacao, mesmo que pareca exagero para um unico recurso.

2. **Escalabilidade natural** — "No futuro, voce poderia ter, por exemplo, rotas especificas dos equipamentos". Quando um novo dominio surge, voce cria um arquivo novo e adiciona uma linha no index.js. Zero refatoracao.

3. **Manutencao isolada** — Cada arquivo contem apenas as rotas de seu dominio. Ao debugar um problema em tickets, voce abre apenas `tickets.js`.

## A estrutura de uma rota

Cada rota e um objeto com tres propriedades:

- **method** — O verbo HTTP (POST, GET, PUT, DELETE). Permite matching no servidor.
- **path** — A URL que essa rota atende. Ex: `/tickets`.
- **controller** — Uma funcao `(request, response) => {}` que executa a logica. O nome "controller" vem do padrao MVC — e a funcao que controla o que acontece quando aquela rota e acessada.

## O papel do index.js aggregador

O index.js dentro de `routes/` tem uma unica responsabilidade: importar todos os arquivos de rota e exportar um unico array. Isso cria um **ponto unico de entrada** para o servidor.

O uso de spread (`...tickets`) e importante porque cada arquivo exporta um array, e o aggregador precisa achatar tudo em um unico array. Sem spread, voce teria arrays aninhados e o matching no servidor quebraria.

## Fluxo mental

```
Requisicao chega → servidor consulta array de rotas
                 → encontra match por method + path
                 → executa controller
                 → retorna response
```

O servidor nao precisa saber quantos arquivos de rota existem ou como estao organizados. Ele so conhece o array final exportado pelo index.js.

## Quando esse padrao nao se aplica

- Se voce usa Express, Fastify ou outro framework, eles ja tem seu proprio sistema de router. Este padrao e especifico para Node.js vanilla com `http.createServer`.
- Para APIs muito grandes (centenas de rotas), considere um sistema de auto-discovery que le a pasta routes/ automaticamente.