# Deep Explanation: Implementando Gemini — Parte 2

## Por que embeddings nao sao intercambiaveis

O instrutor enfatiza que embeddings de modelos diferentes vivem em espacos vetoriais completamente distintos. Mesmo que ambos gerem vetores de 1536 dimensoes, os valores sao "completamente arbitrarios" quando comparados entre modelos. Uma busca por similaridade usando embeddings da OpenAI contra uma query do Gemini (ou vice-versa) retorna "relevancia nenhuma". Ao trocar de provider, e obrigatorio resetar o banco e re-gerar todos os embeddings.

## O problema do discriminated union no Gemini

O instrutor descobriu que o Gemini nao lida bem com discriminated unions no responseSchema. Quando o schema define que `action` pode ser `{ type: "sendMessage" }` ou `{ type: "suggestCards" }`, o Gemini retornava apenas uma string ("sendMessage" ou "suggestCards") ao inves do objeto completo. A solucao foi reforcar o formato esperado diretamente no prompt (systemInstruction), descrevendo explicitamente os dois formatos possiveis. Isso mostra que schema enforcement do Gemini e menos robusto que o da OpenAI para tipos complexos.

## Diferenca na arquitetura de embeddings: sincrono vs webhook

Na OpenAI, o batch de embeddings usa a Batch API que retorna resultados via webhook (assincrono). No Gemini, embedContent retorna sincronamente. Isso exigiu adaptacao: ao inves de esperar um webhook, o GeminiLlmService recebe o PostgreService diretamente e salva os embeddings no banco dentro do proprio metodo batchEmbedProducts. A assinatura da classe abstrata (retorno void) foi mantida, mas a implementacao interna e fundamentalmente diferente.

## Vantagem do embedContent com array

O instrutor destaca como "mais interessante" o fato de que a API do Gemini aceita um array de conteudos em uma unica chamada de embedContent, retornando um array de embeddings correspondente. Isso simplifica o codigo comparado a fazer chamadas individuais. Porem, a Batch API do Gemini "ainda nao suporta embeddings", entao para volumes grandes seria necessario processar em chunks.

## Resposta em markdown ao inves de JSON puro

Diferente da OpenAI que retorna JSON estruturado quando configurado, o Gemini tende a retornar o JSON dentro de blocos de markdown (```json ... ```). A funcao extractJsonFromResponse foi criada para lidar com isso, usando regex para extrair o conteudo relevante. Essa funcao e reutilizada tanto no answerMessage quanto no suggestCarts.

## Performance: Gemini vs OpenAI

O instrutor observou que o Gemini "demora um pouquinho mais" que a OpenAI para montar carrinhos — aproximadamente 15-20 segundos. Isso e relevante para UX e deve ser considerado ao escolher provider.

## Adaptacao de prompts entre providers

O instrutor reforça que "sempre vai ter que fazer alguma adaptacao" ao trocar providers, porque "as APIs nao sao exatamente iguais" e "os modelos nao vao ter as mesmas funcionalidades". Nao se trata apenas de trocar a chamada de API — o prompt, o parsing, e o tratamento de erros precisam ser ajustados por provider.