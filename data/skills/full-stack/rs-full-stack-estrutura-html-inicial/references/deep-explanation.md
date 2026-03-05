# Deep Explanation: Estrutura HTML a partir de Design

## Como o instrutor pensa ao olhar um design

O processo mental descrito pelo Mayk (instrutor) segue uma ordem especifica:

1. **Observar o macro** — "Eu olho, vejo uma imagem de fundo" — primeiro identifica o que e decorativo vs estrutural
2. **Identificar containers** — "Eu vejo uma caixa que esta centralizada bem ao meio, que esta contendo outros elementos" — reconhece agrupamentos visuais
3. **Decidir entre CSS e HTML** — para a imagem de fundo, pensa: "posso colocar com CSS, posso colocar com HTML" — cada elemento visual tem multiplas implementacoes possiveis
4. **Mapear para tags** — "um main, que pode ser essa caixa" — traduz blocos visuais em semantica HTML

## O Figma como guia de estrutura

O instrutor destaca que designers organizados nomeiam camadas no Figma de forma que ja sugere as tags HTML:

- Camada "container" → `<div>` container
- Camada "main" → `<main>`
- Camada "about" → `<section id="about">`
- Camada "ingredientes" → `<section id="ingredients">`

**Insight chave:** "Dependendo da maneira que voce pegar o figma, ja vem uma ajudinha aqui." Mas nem todo Figma sera assim — o desenvolvedor precisa saber pensar independentemente do nivel de organizacao do design.

## A questao do ingles tecnico

O instrutor faz uma defesa enfatica do uso de ingles no codigo:

> "Se nessas aulas voce se esforcar, se nessas aulas voce sofrer um pouquinho mais, e muito melhor do que voce ficar adiando esse sofrimento para la no futuro."

Ele conta que seu proprio ingles tecnico veio de estudar programacao em ingles, aprendendo "uma palavrinha nova" de cada vez. Nao e obrigatorio, mas e um investimento que se paga.

## Multicursor e produtividade

O instrutor mostra uma tecnica avancada para criar listas rapidamente:

1. Escrever todos os itens em linhas separadas
2. Alt + Click em cada inicio de linha (multicursor)
3. Ou Shift + Alt + arrastar para selecao em coluna
4. Digitar `<li>` no inicio de todas as linhas simultaneamente
5. Ir para o final de todas as linhas e fechar `</li>`

**Mensagem importante do instrutor:** "Voce acha que eu aprendi isso aqui na primeira aula? Nao." — ele normaliza a dificuldade e encoraja ir devagar, linha a linha se necessario.

## Decisao de separacao de conteudo

Ao analisar o layout, o instrutor percebe que a `<main>` deveria conter as sections, mas a imagem fica fora dela, ambas dentro de uma `div#page`. Essa decisao veio de observar que ha "uma separacao diferente entre os elementos" — a imagem tem tratamento visual distinto das sections de conteudo.

## Sobre `<br>` vs multiplos `<p>`

Para o modo de preparo, o instrutor opta por um unico `<p>` com `<br>` duplos entre etapas (massa, recheio, montagem), em vez de paragrafos separados. Isso porque visualmente sao instrucoes continuas com pausas, nao paragrafos independentes.

## Live Server como ferramenta essencial

O instrutor usa a extensao Live Server do VS Code para feedback visual imediato. Configuracao:

- Instalar extensao "Live Server"
- Clicar em "Go Live" no rodape
- Acessar `127.0.0.1:5500`
- O navegador atualiza automaticamente a cada mudanca salva

## Filosofia de commits

O primeiro commit e feito com a mensagem "Iniciando a estrutura HTML" — simples, descritivo, sem perfeccionismo. O esqueleto nao precisa estar completo para ser commitado.