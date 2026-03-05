# Deep Explanation: Persistencia de Estado com localStorage em Angular

## Por que o estado some no reload?

Signals em Angular vivem em memoria. Quando a pagina recarrega, todo o estado JavaScript e destruido e recriado do zero. O signal volta ao valor inicial (`undefined`), e qualquer dado que o usuario tinha (como seu nome) desaparece.

O localStorage e uma API do browser que persiste dados entre reloads — diferente da memoria, ele sobrevive ao refresh da pagina.

## A estrategia do computed com fallback

O instrutor criou um pattern especifico: um `computed()` que funciona como uma "camada inteligente" entre o template e os dados. A logica e:

1. **Primeiro, verifica o signal em memoria** — se o usuario acabou de logar, o signal tem o valor fresco
2. **Se o signal esta vazio (undefined)** — provavelmente a pagina foi recarregada, entao busca no localStorage
3. **Se o localStorage tambem esta vazio** — alguem removeu manualmente, retorna string vazia

Essa abordagem e mais reativa do que simplesmente ler o localStorage no `constructor` ou `ngOnInit`, porque o computed reage automaticamente a qualquer mudanca no signal `user`.

## Por que externalizar a chave?

O instrutor inicialmente pensou em nao externalizar a chave `'user-name'`, mas mudou de ideia. A razao: a mesma chave e usada no `setItem`, `getItem` e `removeItem`. Um typo em qualquer um desses locais causaria um bug silencioso — o dado seria salvo com uma chave e buscado com outra.

## A importancia do removeUser no logout

Sem limpar o localStorage no logout, o nome do usuario ficaria "preso" no storage. Na proxima vez que a aplicacao carregasse, o computed encontraria o nome antigo no localStorage e exibiria como se o usuario estivesse logado — mesmo sem sessao ativa.

## Resiliencia contra remocao manual

O instrutor demonstrou um cenario onde alguem abre o DevTools e deleta manualmente o item do localStorage. A aplicacao nao quebra porque o computed tem o fallback para string vazia. Isso e defensive programming — nunca assuma que dados externos (localStorage, APIs) estarao la.

## Por que manter o signal `user` original?

Mesmo apos criar o computed `username`, o instrutor manteve o signal `user` com o objeto completo. A razao: outros locais da aplicacao podem precisar de mais dados do usuario (email, etc). O `username` computed e uma "view" especifica para o header.