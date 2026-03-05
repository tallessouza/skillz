# Deep Explanation: Rotas HTTP e Metodos HTTP

## O que sao rotas

Rotas sao **caminhos de entrada** na aplicacao backend. Quando se desenvolve uma API para ser consumida por um frontend ou como API publica, cada operacao diferente (criar, listar, editar, remover) tem sua propria rota.

O instrutor enfatiza que rotas sao o meio pelo qual quem consome a API executa **diferentes operacoes** no backend. Nao e apenas um endereco — e uma porta para uma acao especifica.

## Anatomia de uma requisicao HTTP

Toda requisicao HTTP e composta de (pelo menos) dois recursos fundamentais:

1. **Metodo HTTP** (GET, POST, PUT, PATCH, DELETE)
2. **URL** (o caminho acessado: `/users`, `/products`, etc.)

No Node.js puro, esses dois valores vem do objeto `req`:
```javascript
const { method, url } = req
```

## Metodos HTTP: semanticos, nao funcionais

O instrutor faz uma distincao importante: os metodos HTTP sao **mais semanticos do que funcionais**. Tecnicamente, voce poderia usar qualquer metodo para qualquer operacao — mas o significado (semantica) e o que importa.

### Os 5 metodos principais

- **GET** — Buscar recurso. Frontend quer uma lista de usuarios? GET.
- **POST** — Criar recurso. Frontend envia dados para criar algo novo? POST.
- **PUT** — Atualizar recurso por completo. Formulario de edicao de perfil com nome, email, bio, avatar? PUT.
- **PATCH** — Atualizar informacao especifica. Toggle de "aceitar notificacoes"? PATCH.
- **DELETE** — Remover recurso. Autoexplicativo.

### PUT vs PATCH: a confusao classica

O instrutor destaca que PATCH e "facilmente confundivel" com PUT. A diferenca:

- **PUT**: atualizo a entidade "quase que por completo" — varios campos ao mesmo tempo
- **PATCH**: atualizo "uma informacao unica ou especifica" — um toggle, um campo isolado

Exemplo concreto do instrutor: aceitar ou nao notificacoes. E uma alteracao de um unico campo booleano dentro do cadastro do usuario. Isso e PATCH, nao PUT.

## Identidade da rota = metodo + URL

Este e o conceito central da aula: **a rota e identificada pela combinacao de metodo + URL**.

Isso significa que `GET /users` e `POST /users` sao rotas **completamente diferentes**:
- `GET /users` = estou buscando usuarios
- `POST /users` = estou criando um usuario

A mesma URL, metodos diferentes, operacoes diferentes.

## Early return pattern

O instrutor usa o padrao de early return nos ifs de roteamento. Ele explica: "sempre que eu tenho uma funcao, se o codigo bater no return, nada do que tem abaixo dele vai ser executado". Por isso nao precisa de else — cada if com return e independente.

Isso resulta em codigo mais limpo e legivel, sem nesting desnecessario.

## Rota de fallback

O codigo que nao cai em nenhum if de rota vai "cair no hello world" — a rota de escape. Toda aplicacao precisa de uma resposta padrao para requisicoes que nao foram capturadas por nenhuma rota definida.