# Deep Explanation: Testando Use Cases de Update

## Por que testar os dois caminhos e obrigatorio

O instrutor mostra que o use case de update tem uma estrutura condicional: primeiro faz `findById`, e se nao encontrar, lanca erro. Se encontrar, executa o `update`. Isso cria dois branches de codigo que precisam de cobertura.

Ao rodar o coverage antes de criar os testes, o `UpdatePrompt` estava em zero. Apos criar os dois testes (sucesso e erro), a cobertura subiu cobrindo todas as possibilidades do use case.

## O padrao de factory com overrides

O instrutor reutiliza um padrao ja estabelecido nos testes anteriores (como no `CreatePromptUseCase`): uma funcao `makeRepository` que retorna um objeto com mocks padrao, mas aceita overrides para cada teste customizar o comportamento.

No teste de sucesso, o `findById` retorna um prompt existente com dados "old" e o `update` retorna com dados "new". No teste de erro, o `findById` retorna `null`, simulando prompt nao encontrado.

Isso e poderoso porque:
- Cada teste declara apenas o que e diferente do padrao
- O setup compartilhado nao esconde comportamento relevante
- Novos testes podem ser adicionados com minimo boilerplate

## Validacao de falso positivo

O instrutor demonstra uma tecnica importante: apos o teste de erro passar, ele propositalmente altera a mensagem de erro esperada para confirmar que o teste realmente falha. Isso valida que o teste nao e um falso positivo — ele esta de fato verificando a mensagem correta.

## Relacao com TDD e coverage

O fluxo do instrutor:
1. Roda coverage → identifica lacunas (UpdatePrompt em zero)
2. Escreve testes para cobrir os cenarios
3. Roda coverage novamente → confirma cobertura

Isso nao e TDD puro (onde se escreve o teste antes do codigo), mas e uma abordagem pragmatica de fechar lacunas de cobertura guiada pelo relatorio de coverage.

## Arrange-Act-Assert explicito

O instrutor menciona explicitamente o padrao AAA durante a implementacao, comentando "arrange" (setup), "act" (execucao) e "expectations" (assertions). Isso mostra que a organizacao visual do teste importa para legibilidade.