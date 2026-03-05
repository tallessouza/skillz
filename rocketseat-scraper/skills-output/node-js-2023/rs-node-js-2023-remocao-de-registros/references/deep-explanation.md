# Deep Explanation: Remocao de Registros

## Por que spread nos groups da regex?

O instrutor destaca que `route.params.groups` retorna um objeto com prototype null (`Object.create(null)`). Isso pode causar comportamento inesperado em algumas operacoes. A solucao e usar spread (`{ ...groups }`) para criar um objeto limpo com prototype normal. O instrutor descobriu isso ao dar `console.log` e ver "object no prototype" — e resolveu copiando com spread.

## Por que injetar params no `req`?

Em vez de extrair params dentro de cada handler, o instrutor injeta `req.params` no server (antes de chamar o handler). Isso centraliza a extração e deixa os handlers limpos — mesmo padrao que Express/Fastify usam internamente. O instrutor enfatiza: "como o req esta sendo passado para frente e eu tenho acesso ao req aqui dentro das rotas, fica muito mais facil eu botar ele dentro do req".

## Por que findIndex + splice (e nao filter)?

O padrao `findIndex` + `splice` modifica o array in-place, que e o que queremos em banco in-memory. Usar `filter` criaria um novo array e exigiria reatribuicao. O splice tambem permite saber SE algo foi removido (via check do index), controlando quando persistir.

## HTTP 204 No Content

O instrutor explica: "204 e uma resposta de sucesso, porem sem nenhum conteudo. Quer dizer que deu certo, porem nao tem nenhum conteudo para ser retornado." Esse e o status padrao para DELETE bem-sucedido quando nao ha corpo de resposta.

## O bug silencioso do splice com -1

`Array.splice(-1, 1)` remove o ULTIMO elemento do array. Se `findIndex` retorna `-1` (nao encontrou) e voce passa direto para splice, voce remove um registro aleatorio. O `if (rowIndex > -1)` e essencial.

## Contexto pedagogico

O instrutor reforça que toda essa construcao manual (regex, banco in-memory, server puro) e "por pura ciencia e aprendizado de como as coisas funcionam por baixo dos panos". Em projetos reais, frameworks como Fastify/Express ja resolvem tudo isso. Mas entender o funcionamento interno torna o desenvolvedor mais preparado.