# Deep Explanation: Node --watch

## Por que --watch existe

Historicamente, o Node.js nao observava mudancas em arquivos. Quando voce executava `node server.js`, o codigo era lido uma unica vez e o servidor ficava rodando aquele snapshot para sempre. Para ver mudancas, era necessario:

1. Parar o servidor com Ctrl+C
2. Executar novamente

Isso gerou a necessidade de bibliotecas externas como `nodemon`, que faziam exatamente isso de forma automatizada. A partir do Node.js v18+, a flag `--watch` foi introduzida como feature nativa, eliminando a dependencia externa.

## Status experimental

O instrutor menciona que a flag aparece como "experimental" no terminal, mas enfatiza que isso nao e um problema — a API dificilmente vai mudar. Na pratica, `--watch` e estavel o suficiente para uso em desenvolvimento.

## O conceito de npm scripts como aliases

O instrutor usa a analogia de "atalhos" — npm scripts sao aliases que reduzem comandos longos a uma unica palavra. O beneficio nao e apenas conveniencia:

- **Padronizacao:** Todo dev no time executa `npm run dev`, independente do que esta por tras
- **Documentacao implicita:** O `package.json` documenta como rodar o projeto
- **Encapsulamento:** Se o comando mudar (ex: adicionar flags), so muda em um lugar

## Fluxo demonstrado na aula

1. Servidor rodando com `node src/server.js` — mudanca no codigo nao reflete
2. Ctrl+C para parar, re-executar — mudanca aparece (processo manual)
3. `node --watch src/server.js` — mudancas refletem automaticamente
4. Criar script `dev` no `package.json` — encapsular o comando
5. `npm run dev` — execucao simplificada

## Por que nao usar nodemon mais

O nodemon ainda e valido para casos avancados (ignorar patterns, watch de extensoes especificas, restart condicional), mas para o caso comum de "observar mudancas e reiniciar", `--watch` nativo e suficiente e elimina uma dependencia do projeto.