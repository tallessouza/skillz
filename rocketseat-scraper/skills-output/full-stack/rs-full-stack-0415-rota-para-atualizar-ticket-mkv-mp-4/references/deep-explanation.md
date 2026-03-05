# Deep Explanation: Rota PUT para Atualizar Recurso

## Por que PUT e nao POST para atualizacao?

O instrutor escolhe PUT porque segue a semantica HTTP: PUT e idempotente (chamar varias vezes produz o mesmo resultado) e indica substituicao/atualizacao de um recurso identificado pela URL. POST e para criacao de novos recursos.

## Route params com :id

O padrao `:id` na definicao da rota (`/tickets/:id`) e uma convencao que indica um segmento dinamico da URL. Quando o usuario envia `PUT /tickets/abc-123`, o valor `abc-123` e capturado e disponibilizado como parametro.

O instrutor demonstra isso copiando o ID real de um ticket existente (obtido via GET /tickets) e colando na URL do Insomnia. Importante: copiar apenas o ID, sem aspas.

## Separacao routes/controllers

O padrao seguido e:
```
routes/tickets.js          → Define QUAIS rotas existem
controllers/tickets/*.js   → Define O QUE cada rota faz
```

Cada operacao CRUD tem seu proprio arquivo de controller. Isso permite:
- Encontrar rapidamente a logica de cada operacao
- Testar controllers isoladamente
- Reaproveitar a estrutura de rotas copiando e ajustando

O instrutor literalmente copia o bloco de rota existente (GET) e ajusta para PUT — demonstrando que a estrutura e reutilizavel.

## Troubleshooting: servidor nao responde apos adicionar arquivos

O instrutor encontrou um problema real durante a aula: apos criar o novo arquivo `update.js` e registrar a rota, o servidor nao respondia. A solucao foi:

1. Parar o servidor com `Ctrl+C`
2. Executar novamente

Isso acontece porque o Node.js vanilla (sem ferramentas como nodemon) carrega os modulos uma vez na inicializacao. Novos arquivos adicionados ao filesystem nao sao detectados automaticamente. O instrutor destaca que isso e **comum** e esperado — especialmente quando se adiciona novos arquivos (nao apenas modifica existentes).

## Fluxo de teste incremental

O instrutor ensina a testar de forma incremental:
1. Primeiro, retorna apenas `response.end('OK')` — sem logica de negocio
2. Valida que a rota funciona (status 200, retorna "OK")
3. Depois, implementa a logica real de atualizacao

Essa abordagem evita debugar multiplas camadas ao mesmo tempo. Se a rota retorna 404, o problema e no registro da rota. Se retorna 200 mas com dados errados, o problema e no controller.

## Assinatura do controller

```javascript
export function update(request, response, database)
```

Os tres parametros seguem o padrao estabelecido no projeto:
- `request` — dados da requisicao (headers, body, params)
- `response` — objeto para enviar resposta ao cliente
- `database` — instancia do banco de dados injetada

Essa injecao de dependencia via parametro (em vez de import global) facilita testes e desacoplamento.

## Composicao da URL

A URL final e composta por:
```
http://localhost:3000 / tickets / {id-do-ticket}
        base           recurso    identificador
```

O instrutor mostra como obter o ID: faz um GET /tickets (sem filtros) para listar todos os tickets, copia o ID do ticket desejado, e cola na URL do PUT.