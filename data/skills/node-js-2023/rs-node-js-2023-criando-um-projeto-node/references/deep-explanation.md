# Deep Explanation: Criando um Projeto Node.js

## Por que comecar sem framework?

O instrutor enfatiza que o primeiro projeto deve usar o minimo possivel de codigo terceiro — desenvolver do zero, apenas com recursos nativos do Node. O objetivo e entender os fundamentos da plataforma antes de adicionar camadas de abstracao. O projeto completo tera persistencia de dados, testes automatizados e streaming (uma das features que tornou o Node famoso entre tecnologias backend).

## CommonJS vs ES Modules

O JavaScript teve varios padroes de importacao/exportacao ao longo do tempo. O CommonJS (`require`/`module.exports`) foi o padrao original do Node. Hoje, o padrao moderno sao os ES Modules (`import`/`export`).

Por padrao, o Node **nao suporta** ES Modules. Para habilitar, adicione `"type": "module"` no `package.json`. As duas opcoes para o campo `type` sao:
- `"commonjs"` — padrao, usa `require()`
- `"module"` — moderno, usa `import/export`

## O prefixo `node:` nas importacoes

Nas versoes mais recentes do Node, e recomendado usar o prefixo `node:` ao importar modulos internos. Isso resolve um problema pratico: como diferenciar um modulo interno (como `http`) de um pacote terceiro instalado via npm (como `fastify`)?

```javascript
// Modulo interno — com prefixo
import http from "node:http"
import crypto from "node:crypto"
import path from "node:path"

// Modulo terceiro — sem prefixo
import fastify from "fastify"
```

## Por que `server.js` e nao `index.js`?

O instrutor explica que `index` e uma convencao que vem do mundo web/browser (como `index.html`). Em Node, o arquivo principal geralmente representa um servidor, entao `server.js` e mais semantico. O nome do arquivo deve refletir seu proposito.

## O servidor HTTP nativo

`http.createServer()` recebe uma funcao com dois parametros:
- **`req` (request)** — contem todas as informacoes da requisicao (dados enviados pelo cliente, como nome, email, etc.)
- **`res` (response)** — usado para devolver uma resposta ao cliente

O servidor fica executando continuamente apos `server.listen(porta)` ate ser encerrado manualmente, porque esta "ouvindo" conexoes na porta especificada.

## APIs do browser NAO existem no Node

Como o Node roda em ambiente server-side, APIs especificas do browser nao estao disponiveis:
- `document` — nao existe
- `window` — nao existe
- `document.querySelector()` — nao existe

O Node tem seus proprios modulos internos voltados para operacoes de servidor (HTTP, filesystem, crypto, etc.).

## NPM — Node Package Manager

O `package.json` e o arquivo principal de qualquer aplicacao JavaScript. Ele armazena:
- Nome, versao, descricao do projeto
- Scripts para automatizar tarefas
- **Dependencias** — nao o codigo em si, mas o nome e versao dos pacotes terceiros utilizados

O NPM e o gerenciador de pacotes que permite instalar e gerenciar essas dependencias.