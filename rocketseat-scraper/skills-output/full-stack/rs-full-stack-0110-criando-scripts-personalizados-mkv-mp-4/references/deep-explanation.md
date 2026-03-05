# Deep Explanation: Scripts Personalizados no package.json

## Por que scripts no package.json?

O instrutor comeca mostrando o problema: toda vez que voce quer executar o projeto, precisa digitar o comando completo no terminal:

```bash
node --watch src/server.js
```

Isso e repetitivo e propenso a erros. A solucao e criar um "atalho" — um script nomeado no `package.json` que encapsula esse comando.

## Scripts padrao vs customizados

O npm tem uma lista de scripts **padrao** (lifecycle scripts) que podem ser executados diretamente sem `run`:

- `npm start`
- `npm test`
- `npm stop`
- `npm restart`

Qualquer outro nome e considerado **customizado** e precisa do prefixo `run`:

- `npm run dev`
- `npm run build`
- `npm run lint`

O instrutor demonstra isso ao vivo: muda o nome do script de `dev` para `start`, executa `npm start` e funciona. Depois volta para `dev` e tenta `npm dev` — falha. Isso porque `dev` nao e um script padrao do npm.

## Convencao start vs dev

O instrutor explica uma convencao importante da industria:

- **`start`** = producao. Quando voce faz deploy do seu backend (Heroku, Railway, Render, etc.), a plataforma executa `npm start` automaticamente. Por isso esse script deve iniciar o projeto de forma limpa, sem flags de desenvolvimento.

- **`dev`** = desenvolvimento. Usa flags como `--watch` para hot-reload. So e usado localmente pelo desenvolvedor.

Essa separacao e fundamental porque em producao voce NAO quer `--watch` — ele consome recursos desnecessarios e pode causar comportamento inesperado em ambientes de producao.

## O que acontece por baixo

Quando voce executa `npm run dev`, o npm:

1. Le o `package.json`
2. Procura a chave `"dev"` dentro de `"scripts"`
3. Executa o valor dessa chave como comando shell
4. Mostra no terminal o que esta sendo executado

O instrutor mostra isso no terminal: apos `npm run dev`, o npm imprime o comando real que esta executando (`node --watch src/server.js`).

## Analogia do instrutor

O instrutor usa a analogia de "atalho" — assim como atalhos no desktop do computador apontam para programas, scripts no package.json apontam para comandos. Voce cria uma vez e usa varias vezes.