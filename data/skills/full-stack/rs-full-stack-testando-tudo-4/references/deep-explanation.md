# Deep Explanation: Teste Manual de Aplicacao Frontend

## Por que testar manualmente antes de entregar

O instrutor enfatiza que antes de considerar qualquer projeto concluido, voce deve testar sistematicamente. Nao basta o codigo "parecer correto" — voce precisa verificar fisicamente cada funcionalidade.

## Estrategia de teste demonstrada na aula

### 1. Estado limpo primeiro

O instrutor começa recarregando a aplicacao: "vou recarregar a aplicação para a gente ter tudo desde o início". Isso elimina qualquer estado residual que poderia mascarar bugs.

### 2. Input invalido antes de valido

A primeira coisa que o instrutor testa e digitar uma letra: "vou tentar digitar a letra não vai acontecer nada porque ele não deixa". Isso confirma que a validacao de input esta funcionando antes de testar o fluxo principal.

### 3. Teste completo de cada moeda

O instrutor nao testa apenas uma moeda — ele testa sistematicamente dolar, euro e libra:
- **Dolar:** 700 dolares → verificou simbolo, cotacao (4.87), total (3.409 reais)
- **Dolar (valor menor):** 350 dolares → verificou que atualizou o total mas manteve simbolo
- **Euro:** mesmos 350 → verificou que mudou moeda, cotacao E total
- **Libra:** verificou mudanca completa
- **Libra (valor diferente):** 425 → verificou atualizacao

### 4. Verificacao de formatacao

O instrutor observa detalhes visuais:
- Simbolo do dolar aparecendo corretamente
- Valor formatado com separador de milhar (3.409)
- Prefixo "R$" no resultado final
- Cada campo atualizando independentemente

### 5. Troca sem recarregar

Um ponto sutil: o instrutor troca moedas e valores SEM recarregar a pagina entre testes. Isso verifica que o estado da aplicacao e atualizado corretamente, sem dados residuais da conversao anterior.

## Insight do instrutor

A frase chave e: "dessa forma a gente terminou o nosso projeto". O projeto so esta "terminado" DEPOIS de todos os testes passarem. O teste manual nao e um passo opcional — e o criterio de conclusao.

## Aplicacao geral

Este padrao de teste se aplica a qualquer formulario interativo:
1. Comece com estado limpo
2. Teste inputs invalidos
3. Teste cada variacao de selecao
4. Verifique formatacao do output
5. Teste transicoes entre estados (trocar opcoes sem recarregar)
6. Teste com valores variados (pequenos, grandes, quebrados)