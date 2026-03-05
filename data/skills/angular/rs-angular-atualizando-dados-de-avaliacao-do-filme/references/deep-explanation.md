# Deep Explanation: Atualizando Dados via TAP apos Avaliacao

## Por que TAP e nao outra abordagem?

O instrutor explica que existem duas formas de resolver o problema de atualizar os dados de avaliacao (media e quantidade de votos) apos o usuario avaliar um filme:

1. **Adicionar logica dentro do linkedSignal** — possivel, mas o instrutor descarta porque "fica um pouquinho mais chato de ler, um pouquinho mais complicado"
2. **Usar o operador `tap` do RxJS** — escolhido porque e direto, declarativo e resolve o problema de forma simples

A decisao e baseada em **legibilidade**: o `tap` fica exatamente onde a mutacao acontece, tornando obvio o que acontece apos a avaliacao ser enviada.

## O insight da estrutura identica de response

O ponto-chave da aula e que o endpoint de `rate` retorna **exatamente a mesma estrutura** do endpoint de detalhes do filme. Isso significa que nao e necessario nenhuma transformacao — o response pode ser usado diretamente com `.set()`.

O instrutor destaca: "São as mesmas propriedades, olha só que legal. Claro, aqui as informações de quantidade de votos e média de votos vão estar atualizadas, mas é a mesma estrutura, isso vai facilitar pra gente."

Essa e uma pratica comum em APIs bem desenhadas: endpoints de mutacao retornam o recurso completo atualizado, permitindo que o frontend simplesmente substitua o estado local.

## Como o TAP funciona neste contexto

O `tap` e um operador do RxJS que:
- **So executa quando o Observable emite sucesso** — se o endpoint retornar erro, o tap nao dispara
- **Nao modifica o valor emitido** — diferente do `map`, ele e puramente para side-effects
- **Mantem a cadeia do Observable intacta** — quem se inscrever depois ainda recebe o valor original

No contexto Angular com signals, isso cria um padrao elegante: a mutacao HTTP acontece, o tap atualiza o signal, e a UI reage automaticamente porque signals sao reativos.

## O efeito pratico no arredondamento

O instrutor demonstra que ao clicar para avaliar, a quantidade de votos atualiza imediatamente (197 → 198 → 199), mas a media pode nao mudar visivelmente porque "ele está aumentando aos pouquinhos, ele faz um arredondamento". Com filmes que tem menos avaliacoes (como Matrix no exemplo), a mudanca na media e mais perceptivel.

Isso demonstra que o `.set()` esta funcionando corretamente — os dados sao atualizados, a diferenca visual e puramente matematica.