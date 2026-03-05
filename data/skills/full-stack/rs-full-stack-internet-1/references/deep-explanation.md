# Deep Explanation: Internet e Web

## A analogia da teia de aranha (pelo instrutor Mayk)

O instrutor usa a imagem de uma teia de aranha para explicar a web. Cada ponto da teia e um computador. Os fios conectando os pontos sao as ligacoes de rede. Qualquer ponto pode alcancar qualquer outro ponto — essa e a essencia da web. O nome "web" foi escolhido exatamente para simular esse desenho de uma teia onde todos os computadores estao ligados uns aos outros.

## A analogia do CEP vs nome de rua

O IP e como um CEP — um numero dificil de memorizar que identifica exatamente onde algo esta. Ninguem memoriza CEPs no dia a dia; as pessoas memorizam nomes de ruas. Da mesma forma, ninguem memoriza IPs; as pessoas memorizam dominios (skillz.com.br). O DNS e o "servico de correios" que converte o nome legivel no numero real.

## Internet como espinha dorsal da web

O instrutor enfatiza que a internet e a "espinha dorsal" da web. Sem a infraestrutura fisica de computadores interligados (internet), nao seria possivel ter a troca de informacoes que a web proporciona. A web depende completamente da internet para existir, mas a internet existe independentemente da web.

## Intranet vs Internet — a etimologia

- **Intra** = dentro → Intranet = rede interna (seu smartphone conectado ao seu computador em casa)
- **Inter** = entre/para fora → Internet = rede externa (computador no Brasil conectado a computador nos EUA)
- **Net** = rede (do ingles)

Essa decomposicao etimologica ajuda a nunca confundir os conceitos.

## O "milagre" da distribuicao de arquivos

O instrutor usa a analogia de um disco de vinil: antigamente, so quem tinha o disco fisico podia ouvir a musica. Com a internet e a web, esse "disco" (arquivo) pode ser acessado por qualquer pessoa no mundo que tenha conexao com a internet. Essa e a revolucao fundamental — a distribuicao global de arquivos.

## Backbone — a infraestrutura invisivel

O instrutor menciona que a transferencia de dados entre paises nao acontece "apenas pelo ar". Existe uma infraestrutura fisica gigantesca de cabos submarinos e subterraneos chamada backbone. Isso e contraintuitivo para muitas pessoas que imaginam que tudo e wireless.

## O caminho completo de uma requisicao (expandido)

1. Voce digita `skillz.com.br` no navegador
2. O navegador consulta o DNS para converter o dominio em IP
3. A requisicao sai do seu computador para o roteador local
4. O roteador envia para o provedor de internet (Vivo, Oi, etc.)
5. O provedor encaminha para centrais maiores
6. As centrais passam de uma para outra (hops) ate encontrar o servidor
7. O servidor recebe a requisicao e devolve os arquivos (HTML, CSS, JS)
8. Os arquivos fazem o caminho de volta ate o navegador
9. O navegador renderiza os arquivos e exibe o site

O instrutor enfatiza: tudo isso acontece "por debaixo dos panos", de maneira quase magica para o usuario.

## Por que um programador web precisa saber isso

O instrutor e pragmatico: nao precisa memorizar cada detalhe, nao "cai em prova", e nao e isso que define um bom programador. Porem:
- Mais cedo ou mais tarde voce vai configurar um dominio
- Mais cedo ou mais tarde vai ter um problema de IP
- Mais cedo ou mais tarde esses termos vao aparecer e voce vai precisar saber o basico

O valor e ter o modelo mental correto para quando esses momentos chegarem.

## A grande sacada: programacao web = criar arquivos distribuidos pela internet

Todo o caminho pedagogico da aula converge para este insight: voce vai construir arquivos (HTML, CSS, JavaScript) usando linguagens de programacao, e vai disponibilizar esses arquivos para qualquer pessoa no mundo atraves da internet. Por isso se chama programacao WEB — porque voce programa para a web, para essa rede externa global.