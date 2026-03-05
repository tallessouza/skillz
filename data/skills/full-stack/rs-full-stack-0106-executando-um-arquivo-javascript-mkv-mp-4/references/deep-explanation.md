# Deep Explanation: Executando Arquivo JavaScript com Node.js

## Por que separar em `src/`?

O instrutor enfatiza a separacao entre **arquivos de configuracao** (package.json, .gitignore, tsconfig.json, etc.) e **arquivos de codigo** criados pelo desenvolvedor. A pasta `src/` (abreviacao de "source") e a convencao universal para isso.

Conforme o projeto cresce, a raiz acumula arquivos de configuracao: package.json, .env, .eslintrc, docker-compose.yml, etc. Se o codigo tambem estiver na raiz, fica impossivel distinguir rapidamente o que e configuracao do que e logica de negocio.

## O campo `main` no package.json

Quando voce roda `npm init`, o package.json vem com `"main": "index.js"` — um placeholder que nao corresponde a nenhum arquivo real. O instrutor mostra que esse campo deve apontar para o entry point real da aplicacao.

Duas formas validas:
- `"main": "./src/server.js"` (com ponto-barra, path relativo explicito)
- `"main": "src/server.js"` (sem ponto-barra, tambem funciona)

O instrutor menciona que ambas funcionam e opta pela versao sem `./`.

## Por que `server.js` e nao `index.js` ou `app.js`?

O instrutor diz que e "bem comum" em aplicacoes Node.js backend usar `server.js` como nome do entry point. Isso sinaliza que o arquivo inicia um servidor (HTTP, WebSocket, etc.), diferenciando de bibliotecas que usariam `index.js`.

## Armadilha: executar sem salvar

O instrutor demonstra ao vivo esse erro: faz uma alteracao no codigo, executa `node src/server.js` e o output mostra a versao anterior. Motivo: o VS Code mostra uma bolinha no tab do arquivo quando ha alteracoes nao salvas. Node.js le do disco, nao do buffer do editor.

## Terminal integrado do VS Code

O instrutor destaca que o terminal integrado do VS Code abre automaticamente na pasta do projeto (workspace root). Isso elimina a necessidade de `cd` para a pasta correta antes de executar comandos. Pode ser aberto via:
- Menu: View → Terminal
- Atalho de teclado (varia por OS)

## Fluxo mental de execucao

```
1. Escrever/editar codigo em src/server.js
2. Salvar (Ctrl+S / Cmd+S)
3. Abrir terminal integrado
4. node src/server.js
5. Verificar output
6. Repetir ciclo
```

Este e o loop basico de desenvolvimento com Node.js antes de introduzir ferramentas como nodemon que fazem auto-reload.