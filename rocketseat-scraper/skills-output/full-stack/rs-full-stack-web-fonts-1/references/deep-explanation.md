# Deep Explanation: Web Fonts

## Por que importar fontes?

O CSS tem familias de fontes genericas por padrao. O instrutor enfatiza que essas fontes sao "genericas" — funcionam, mas nao diferenciam o projeto. Importar fontes permite expandir essa familia, trazendo tipografia personalizada de servicos online ou da maquina local.

## Os tres niveis de Web Fonts

O instrutor apresenta uma progressao clara do mais simples ao mais avancado:

1. **Nivel 1: Fontes padrao do navegador** — genericas, sem importacao
2. **Nivel 2: Google Fonts (gratuito)** — o que voce vai usar 99% do tempo enquanto aprende
3. **Nivel 3: @font-face com fonte local/paga** — cenario avancado para quando o cliente comprou uma fonte especifica que nao existe no Google Fonts

Insight do instrutor: "E o momento de voce fazer isso agora, enquanto voce esta aprendendo? Claro que nao. Saber que isso existe e uma coisa, pra que no futuro voce possa usar."

## Por que link e mais rapido que @import

O navegador le o HTML linha a linha. Quando encontra `<link rel="preconnect">` no inicio do head, ele imediatamente inicia uma conexao com o servidor de fontes. Quando chega no link da fonte mais abaixo, a conexao ja esta estabelecida e o download e mais rapido.

Com `@import` no CSS, o navegador precisa:
1. Baixar o HTML
2. Encontrar o link do CSS
3. Baixar o CSS
4. Encontrar o @import
5. So entao iniciar a conexao com o servidor de fontes

Sao passos adicionais que atrasam o carregamento.

## Como funciona o preconnect

As duas primeiras tags link fazem pre-conexao:
- `fonts.googleapis.com` — servidor que retorna o CSS com as regras @font-face
- `fonts.gstatic.com` — servidor que hospeda os arquivos das fontes (com `crossorigin` porque e um dominio diferente)

Analogia do instrutor: "Imagina que o seu navegador esta lendo linha a linha do seu HTML. Quando ele chega aqui, ele ja inicia uma pre-conexao, entao isso da uma velocidade legal."

## O que o Google Fonts faz por baixo dos panos

Quando voce acessa a URL do Google Fonts no navegador, voce ve CSS puro com regras `@font-face`. Cada regra define:
- `font-family` — nome da fonte
- `font-style` — estilo (normal, italic)
- `font-weight` — peso (300, 700, etc)
- `font-display: swap` — carrega a fonte generica primeiro, troca quando a custom estiver pronta
- `src: url(...)` — localizacao do arquivo da fonte no servidor do Google
- `unicode-range` — subconjuntos de caracteres para otimizacao

O Google ja faz toda a otimizacao por voce: formatos corretos, subsets de unicode, CDN global.

## font-display: swap

O `swap` significa que o navegador:
1. Renderiza o texto com a fonte generica imediatamente
2. Quando a fonte custom termina de carregar, faz a troca automatica
3. O usuario nunca ve texto invisivel enquanto espera a fonte

## Fontes locais e @font-face

Para fontes pagas/compradas que nao estao em servicos online:
- Precisa converter para formatos web (.woff2, .woff)
- Usar ferramentas como WebFont Generator
- Hospedar os arquivos no servidor do projeto
- Definir manualmente as regras @font-face

O instrutor recomenda a documentacao MDN sobre Web Fonts para quando esse cenario surgir no futuro.

## Armadilha: fonte instalada localmente

O instrutor alerta: "A Roboto esta instalada no meu computador, entao ela vai aplicar aqui. Se estiver instalada no seu computador, vai aplicar. So que a gente nao pode contar que todas as pessoas tem a fonte Roboto instalada."

Isso e um erro comum — o desenvolvedor acha que a fonte esta funcionando porque ela esta na maquina dele, mas os usuarios nao a tem instalada.

## Interface do Google Fonts

A interface do Google Fonts muda com frequencia (e um servico gratuito). O instrutor nota que os passos exatos podem ser diferentes no momento em que voce assiste. O fluxo geral:
1. Buscar a fonte desejada
2. Clicar em "Get Font"
3. "Get Embed Code"
4. Selecionar os pesos desejados
5. Copiar o codigo link ou @import

Para remover uma fonte ja selecionada, use a pagina "Selection" e o icone de lixeira.