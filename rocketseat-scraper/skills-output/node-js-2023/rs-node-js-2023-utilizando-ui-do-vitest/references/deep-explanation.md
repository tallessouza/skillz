# Deep Explanation: Utilizando UI do Vitest

## Por que usar Vitest UI

O instrutor apresenta o Vitest UI como uma alternativa visual para quem nao gosta de executar testes apenas pelo terminal. A motivacao principal e oferecer uma experiencia mais rica de navegacao e depuracao de testes.

## Module Graph — O recurso mais interessante

O Module Graph mostra visualmente como um arquivo de teste se conecta com os modulos da aplicacao. No exemplo do instrutor:

- `register.spec.ts` testa `register.ts`
- `register.ts` importa `UserAlreadyExistsError`
- `register.spec.ts` importa `InMemoryUsersRepository`

Esse grafico ajuda a entender o impacto de mudancas — se voce altera um modulo, consegue ver quais testes dependem dele.

## Live Reload na pratica

O instrutor demonstrou ao vivo: alterou o valor esperado de um teste (trocou o hash check por `1234567`), salvou o arquivo, e a UI automaticamente re-executou e mostrou a falha em tempo real. Nao precisou rodar nenhum comando manualmente.

A mensagem de erro mostrou:
- Qual teste falhou: `shouldHashUserPasswordUponRegistration`
- O que esperava: `expected false to be true`
- A linha exata do erro (clicavel para navegar ao codigo)

## Quando usar UI vs Terminal

- **Terminal (`vitest`)**: CI/CD, execucao rapida, scripts automatizados
- **UI (`vitest --ui`)**: Desenvolvimento local, depuracao visual, exploracao de dependencias entre testes

O instrutor sugere usar a UI durante o desenvolvimento ativo e o terminal para automacao.

## Contexto no curso

Esta aula acontece entre a implementacao dos casos de uso com SOLID. O instrutor pausa a implementacao de novos casos de uso para mostrar essa ferramenta, indicando que ela sera util durante o restante do desenvolvimento dos testes.