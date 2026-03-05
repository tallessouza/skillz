# Deep Explanation: Criando Projeto Angular

## Por que usar npx ao inves de instalacao global

O instrutor enfatiza que npx baixa a biblioteca de forma temporaria. Isso traz dinamismo: voce pode criar projetos em versoes diferentes (`@20`, `@16`, `@15`) sem conflito. A desvantagem e que demora um pouco mais na primeira execucao, porque precisa baixar do registro npm.

Quando voce usa `npm install -g @angular/cli`, a versao fica fixa na maquina. Se voce tem um projeto na v16 e outro na v19, vai ter problemas. Com npx, cada projeto usa exatamente a versao especificada.

## Versionamento semantico no Angular

A versao `19.2.9` se decompoe em:
- **19** = major (breaking changes possiveis)
- **2** = minor (features novas, retrocompativeis)
- **9** = patch (bugfixes)

O instrutor menciona que poderia usar apenas `@19` porque todas as versoes minor/patch dentro da major 19 sao compativeis. Mas opta por ser explicito com `@19.2.9` para garantir reprodutibilidade exata.

## Como verificar a versao mais recente

Duas fontes:
1. **npm:** pesquisar `@angular/cli` no site do npm — mostra a ultima versao publicada
2. **Documentacao Angular:** o numero da versao aparece no canto esquerdo (ex: "V19")

## ng serve vs npm run start

O `package.json` gerado tem um script `start` que executa `ng serve`. A diferenca e que `npm run start` usa o Angular CLI **local** do projeto (instalado em `node_modules`), enquanto `ng serve` direto no terminal usaria a versao global (se existir). Usar `npm run start` garante consistencia.

## Compatibilidade futura

O instrutor garante que o conhecimento da v19 sera reutilizavel nas versoes 20, 21 etc., a menos que a equipe do Angular reestruture totalmente o framework — o que ele afirma nao estar previsto.