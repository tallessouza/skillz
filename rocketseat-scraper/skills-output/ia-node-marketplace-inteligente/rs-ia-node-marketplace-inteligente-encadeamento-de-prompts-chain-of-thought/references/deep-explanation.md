# Deep Explanation: Chain of Thought (Encadeamento de Prompts)

## Por que o modelo pula etapas?

O instrutor explica que quando voce pede diretamente "retorne 5 produtos para essa receita", o modelo tenta resolver tudo de uma vez. Ele faz uma associacao direta entre o input (lasanha de frango com molho branco) e os produtos disponiveis, sem decompor o problema. Isso gera resultados como "creme dental" aparecendo na lista — o modelo nao tem um caminho de raciocinio que o force a pensar "o que compoe uma lasanha? qual ingrediente serve pra que parte?".

## A analogia da decomposicao

O insight central do instrutor e: **um prato e composto de componentes, e cada componente tem seus proprios ingredientes**. Uma lasanha nao e um bloco monolitico — ela tem massa, molho e recheio. O molho branco especificamente precisa de leite, cebola, alho. Quando voce forca o modelo a pensar nessa granularidade, ele nao pode mais "adivinhar" — ele precisa percorrer cada componente.

Isso e analogo a qualquer problema complexo em programacao: voce nao resolve tudo numa funcao so. Voce decompoe.

## Chain of Thought + Few-Shot = combinacao poderosa

O instrutor destaca que "essa tecnica se liga muito bem com exemplos". Ele nao apenas lista as etapas, mas fornece um exemplo completo (torta de limao) mostrando:
1. Os produtos disponiveis
2. A necessidade do usuario
3. Cada etapa preenchida com o resultado intermediario
4. O resultado final consolidado

Isso da ao modelo dois sinais: a estrutura (etapas numeradas) E o padrao concreto (exemplo preenchido). Os dois juntos produzem resultados significativamente melhores do que qualquer um sozinho.

## Chain of Thought + Chunking

O instrutor menciona que ja aplicou chunking (tecnica de dividir dados em pedacos menores) no mesmo prompt, com chunk size de 100. As tecnicas sao complementares:
- **Chunking** resolve o problema de volume de dados (muitos produtos para o contexto)
- **Chain of Thought** resolve o problema de qualidade de raciocinio (o modelo saber o que fazer com os dados)

## Resultado pratico observado

Sem chain of thought: frango, molho de soja, queijo, manteiga, creme dental (para lasanha de frango com molho branco — resultado ruim)

Com chain of thought: leite, cebola, alho, sal, pimenta, frango, mussarela (resultado com nivel de detalhe muito maior, especialmente nos ingredientes do molho branco que antes eram ignorados)

## Quando NAO usar

O instrutor diz: "Se ele consegue sozinho, ta show!" — ou seja, chain of thought nao e obrigatorio para tudo. Se o modelo ja entrega bons resultados com um prompt simples, nao ha necessidade de adicionar complexidade. Use quando perceber que o modelo "pula etapas, vai direto pro final e acaba perdendo algum detalhe importante".