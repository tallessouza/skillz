# Deep Explanation: Parametros da API OpenAI

## Hierarquia de roles nas messages

O instrutor explica que o array `messages` representa um chat completo. Cada mensagem tem `content` (o texto) e `role` (quem enviou).

**Tres roles disponiveis:**

1. **user** — Mensagem do usuario final. E o input que a aplicacao recebe.
2. **developer** — Mensagem do desenvolvedor que faz a integracao. Tem peso maior que user para configuracoes e regras. Quando ha conflito entre uma instrucao do developer e do user, o developer prevalece. O instrutor demonstrou isso definindo "use emojis" no developer e "nao pode usar emoji" no user — o modelo seguiu a regra do developer.
3. **assistant** — Mensagem que foi previamente gerada pelo proprio GPT. Usada para reconstruir o historico de um chat multi-turno. Se o usuario ja conversou antes e voce quer continuar a conversa, as respostas anteriores do modelo entram como assistant.

## max_completion_tokens vs max_tokens

O parametro `max_tokens` foi depreciado recentemente. A versao atual e `max_completion_tokens`. Define o limite maximo de tokens na resposta gerada (nao no input).

**Ponto critico do instrutor:** tokens nao sao palavras. 2 tokens nao significam 2 palavras. A relacao e com tamanho mas nao e 1:1.

**Estrategia recomendada:** Combinar o limite hard de tokens com instrucoes no prompt. O prompt sozinho pode ser ignorado (o modelo pode "alucinar" e gerar mais do que pedido). O limite de tokens sozinho corta abruptamente. Juntos, o prompt guia o formato e o token limit garante o teto.

**Motivacao economica:** A cobranca da API e por milhao de tokens. Limitar tokens de saida controla diretamente o custo.

## Temperature e topP

Dois parametros que controlam determinismo vs criatividade:

**Temperature (0 a 2):**
- 0 = mais deterministico (mesma entrada tende a dar mesma saida)
- 2 = mais aleatorio/criativo
- Valores intermediarios como 0.7 sao bom ponto de partida

**topP (0 a 1) — Top Probability:**
- Filtra tokens por probabilidade acumulada
- topP: 0.1 = so tokens no top 10% de probabilidade sao considerados
- E uma alternativa a temperature, nao um complemento

**Recomendacao da OpenAI (enfatizada pelo instrutor):** Use um OU outro, normalmente nao os dois juntos.

## Estrutura do codigo

O instrutor organizou o codigo em uma funcao async para manter o padrao moderno:

```typescript
async function gerarTexto() {
  const completion = await openai.chat.completions.create({ ... })
  console.log(completion.choices[0].message.content)
}
gerarTexto()
```

A extracao da resposta sempre segue o caminho: `completion.choices[0].message.content`. O objeto completion tem muitos outros campos, mas o conteudo textual da resposta esta nesse path especifico.

## Referencia para mais parametros

O instrutor menciona que a lista completa de parametros esta na referencia da API da OpenAI, e que ha "muita configuracao" alem dos abordados. Os parametros cobertos (model, messages, max_completion_tokens, temperature, topP) sao os principais para comecar.