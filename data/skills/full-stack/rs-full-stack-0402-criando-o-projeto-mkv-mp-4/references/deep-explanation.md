# Deep Explanation: Criando Projeto Node.js

## Por que src/?

O instrutor Rodrigo Goncalves cria a pasta `src/` como convencao desde o inicio. A separacao entre configuracao (raiz) e codigo (src/) permite que o projeto escale sem poluir a raiz com arquivos de aplicacao. Na raiz ficam apenas arquivos de configuracao: package.json, .env, .gitignore, etc.

## Por que ESModules (`"type": "module"`)?

O instrutor configura `"type": "module"` para usar `import` e `export` em vez de `require()` e `module.exports`. Isso e o padrao moderno do JavaScript e alinha o backend com a sintaxe que o aluno ja conhece do frontend.

Sem essa configuracao, o Node.js trata arquivos `.js` como CommonJS por padrao, o que impede o uso de `import`.

## Por que `node --watch` em vez de nodemon?

A partir do Node.js 18, o flag `--watch` e nativo. O instrutor usa `node --watch src/server.js` no script dev. Isso elimina a dependencia de pacotes externos como `nodemon` para o ciclo basico de desenvolvimento.

Na transcricao, o instrutor menciona "node-watch" referindo-se ao flag nativo `--watch` do Node, nao ao pacote npm `node-watch`.

## Contexto pedagogico

Esta aula faz parte de uma transicao: o aluno ja aprendeu fundamentos do Node.js (criou uma primeira API) e agora vai construir uma aplicacao mais completa (support-tickets). O instrutor enfatiza: "agora a gente vai focar muito mais em desenvolver mesmo a nossa aplicacao utilizando todo esse conhecimento que voce ja aprendeu".

A mensagem e clara: a fase de explicar cada conceito isoladamente acabou. Agora e hora de juntar as pecas do quebra-cabeca.

## Decisao sobre `main`

O campo `main` aponta para `src/server.js` porque e o ponto de entrada da aplicacao. Mesmo que o `main` seja mais relevante para pacotes npm publicados, manter ele apontando para o entry point correto e uma boa pratica de documentacao do projeto.

## Remocao de campos inuteis

O instrutor remove `keywords` (array vazio) e personaliza `author` e `description`. Campos vazios no package.json sao ruido — melhor remover do que deixar placeholders.