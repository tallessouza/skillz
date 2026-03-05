# Deep Explanation: Similaridade de Embeddings

## Por que embeddings + similaridade do cosseno?

O instrutor apresenta um problema pratico: o usuario digita "feijoada" e o sistema precisa encontrar produtos relacionados (farofa, calabresa, feijao, carne de sol). A abordagem ingenua seria mandar todos os 50 produtos para o LLM e pedir para ele filtrar — mas isso e caro em tokens e lento.

A solucao e um pipeline de duas etapas:
1. **Pre-filtrar** com embeddings (barato, matematico, deterministico)
2. **Processar** so os top N com o LLM (caro, mas agora com poucos itens)

## Similaridade do Cosseno — O que e

E uma funcao matematica que compara dois vetores (embeddings) e retorna quao "proximos" eles estao no espaco vetorial. O valor vai de -1 a 1:
- **1** = vetores identicos (mesma direcao)
- **0** = completamente ortogonais (sem relacao)
- **-1** = opostos

Na pratica, embeddings de texto gerados por modelos como OpenAI tendem a ficar entre 0 e 1, onde valores acima de ~0.8 indicam alta similaridade semantica.

## Por que em memoria neste caso?

O instrutor usa um banco em memoria para simplificar. Isso tem uma consequencia pratica: quando o servidor reinicia, os embeddings pre-processados se perdem e precisam ser re-gerados. Em producao com banco persistido (PostgreSQL + pgvector), isso nao seria problema — os embeddings ficam salvos e podem ser comparados diretamente via SQL com o operador `<=>`.

## O pipeline filter → map → sort → slice

O instrutor constroi o pipeline incrementalmente:

1. **filter**: Remove produtos sem embedding (podem existir produtos novos que ainda nao foram processados)
2. **map**: Calcula a similaridade de cada produto com o input, adicionando o campo `similarity` ao objeto
3. **sort**: Ordena decrescente — o mais similar primeiro
4. **slice(0, 10)**: Pega so os top 10

Esse slice e estrategico. Com 50 produtos, 10 ja e suficiente. Com 10.000 produtos, voce poderia pegar 100 — o ponto e reduzir drasticamente o volume antes de mandar para o LLM.

## Resultados praticos observados pelo instrutor

- "feijoada" → farofa, calabresa, feijao, carne de sol, carne de cha, frango, presunto, peixe (peixe mais distante)
- "sushi" → wasabi, alga, atum, salmao, molho de soja
- "limpeza" → detergente, desinfetante (poucos produtos nessa categoria, entao apareceu laranja tambem)

O instrutor nota que "peixe" apareceu para feijoada mas com menor similaridade, e "laranja" apareceu para limpeza provavelmente por falta de mais produtos na categoria — demonstrando que o sistema funciona mas depende da qualidade e quantidade dos dados.

## Custo: embeddings vs LLM direto

O insight central: gerar um embedding e **muito mais barato** que enviar todos os produtos num prompt para o LLM. O embedding e um calculo vetorial rapido, enquanto o LLM precisa processar todos os tokens. O pipeline embedding-first reduz custo e latencia significativamente.