# Deep Explanation: Introdução a Function Calling

## O problema que Function Calling resolve

Em prompts tradicionais, todo dado que o modelo precisa deve estar no contexto. Isso significa que se o usuário pergunta sobre produtos em estoque, você teria que injetar TODOS os produtos no prompt — mesmo que o modelo precise de apenas 3. Function Calling inverte essa lógica: o modelo pede apenas o que precisa, quando precisa.

## Analogia do fluxograma (da documentação OpenAI)

O instrutor destaca uma imagem da documentação da OpenAI que ilustra o fluxo completo:

1. **Desenvolvedor** envia `createCompletion` com mensagens + definição de ferramentas disponíveis
2. **Modelo** analisa a pergunta ("Qual a temperatura em Paris?") e verifica se alguma tool responde
3. **Modelo** identifica que `getWeather` resolve e chama automaticamente com `location: "Paris"`
4. **SDK** executa a função no código do desenvolvedor
5. **Resultado** (14°C) retorna ao modelo
6. **Modelo** gera resposta final: "It's currently 14°C in Paris"

O ponto chave: o modelo NÃO executa a função. O SDK executa no seu código. O modelo apenas decide QUANDO chamar e com QUAIS parâmetros.

## Três casos de uso principais

O instrutor menciona três motivações para usar Function Calling:

### 1. Recuperação dinâmica de dados
O modelo busca dados conforme precisa — não precisa ter tudo no contexto. Exemplo: buscar produtos em estoque por categoria.

### 2. Side effects (ações no sistema)
O modelo pode disparar ações como gravar no banco de dados ou enviar notificações. Exemplo: "sempre que alguém perguntar X, dispare Y".

### 3. Decisão automatizada
O modelo decide SE e QUANDO usar uma ferramenta. Não é o desenvolvedor que decide — o modelo avalia a necessidade com base na pergunta do usuário.

## Por que não injetar tudo no prompt?

O instrutor enfatiza: "para não injetar tudo diretamente no prompt, você gera de forma dinâmica e ele só pede conforme for precisando". Isso resolve:

- **Custo de tokens**: menos dados no prompt = menos tokens = menor custo
- **Dados desatualizados**: dados injetados no prompt podem ficar stale entre chamadas
- **Relevância**: o modelo busca APENAS o que é relevante para a pergunta

## Requisitos do exemplo prático

O cenário proposto pelo instrutor:
- Usuário digita: "Eu quero fazer um café da manhã"
- Sistema retorna: lista de produtos (aveia, iogurte, etc.)
- Restrição: **apenas produtos em estoque**

A restrição "apenas em estoque" é o que justifica o Function Calling — o modelo chama uma função que consulta o banco e retorna apenas itens disponíveis, em vez de receber uma lista completa e filtrar por conta própria.

## Decisão automática do modelo

O instrutor destaca que o modelo "vai decidir quando ele deve utilizar ela de forma automatizada ou não". Isso significa que:
- Se a pergunta NÃO precisa da tool, o modelo responde direto
- Se a pergunta PRECISA da tool, o modelo chama automaticamente
- O desenvolvedor NÃO precisa programar essa lógica de decisão