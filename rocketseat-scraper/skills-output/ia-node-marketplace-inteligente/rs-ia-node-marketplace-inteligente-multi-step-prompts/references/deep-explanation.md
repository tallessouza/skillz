# Deep Explanation: Multi-Step Prompts

## Contraste com Chain of Thought

O instrutor faz uma distincao clara entre multi-step prompts e chain of thought:

- **Chain of Thought:** divide a tarefa em etapas DENTRO de um mesmo prompt. O modelo recebe tudo de uma vez e deve seguir os passos internamente.
- **Multi-Step Prompts:** divide a tarefa em prompts SEPARADOS. Cada chamada ao modelo e uma etapa independente, com seu proprio input e instrucoes.

A vantagem do multi-step e que cada prompt pode focar exclusivamente em uma responsabilidade, sem "distracao" de outras etapas.

## Filosofia do isolamento de contexto

O instrutor enfatiza um ponto sutil mas importante: no primeiro step, ele deliberadamente NAO menciona produtos disponiveis. Ele usa o termo "ingredientes" para que o modelo foque puramente em decompor a receita, sem tentar fazer match com produtos que existem ou nao.

Isso e uma tecnica de isolamento cognitivo — ao remover informacao desnecessaria, o modelo performa melhor na tarefa especifica.

## Granularidade adaptativa

O instrutor demonstra um pensamento iterativo sobre granularidade:

1. **Versao inicial:** 2 steps (ingredientes → produtos)
2. **Se qualidade cair:** 3 steps (componentes → ingredientes → produtos)

Ele observou que na versao com 2 steps, a qualidade caiu em comparacao com a estrategia anterior (chain of thought). A solucao proposta: adicionar um step intermediario para "componentes da receita" antes de "ingredientes".

A mensagem central: **nao existe numero magico de steps**. O numero certo depende do caso e deve ser descoberto empiricamente.

## Observacao sobre queda de qualidade

O instrutor notou que o multi-step retornou resultados piores que o chain of thought no exemplo testado (lasanha retornando "creme dental"). Isso e uma observacao honesta e importante: multi-step NAO e universalmente melhor. Cada tecnica tem cenarios onde brilha e cenarios onde falha.

A recomendacao e sempre testar, comparar e adaptar. Nao existe bala de prata em prompt engineering.

## Quando multi-step brilha

Multi-step tende a ser superior quando:
- A tarefa tem fases claramente distintas (descoberta vs vinculacao vs formatacao)
- O output de uma fase e input estruturado da proxima
- Um unico prompt nao consegue manter foco em todas as subtarefas
- Voce precisa de schemas diferentes para cada fase

## Quando multi-step pode ser pior

- Tarefas simples onde o overhead de multiplas chamadas nao compensa
- Quando o contexto global e necessario em todas as etapas
- Quando a latencia acumulada de N chamadas e inaceitavel