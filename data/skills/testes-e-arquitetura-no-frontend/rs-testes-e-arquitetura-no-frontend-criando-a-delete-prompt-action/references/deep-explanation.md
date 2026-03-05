# Deep Explanation: Criando a Delete Prompt Action

## Por que testar antes de implementar?

O instrutor demonstra um insight poderoso: o teste do componente `PromptCard` valida o comportamento de deletar **antes mesmo do use case existir**. Isso é possível porque o mock substitui a action real, isolando completamente o componente da infraestrutura.

A frase-chave do instrutor: *"Olha que interessante, esse comportamento tá sendo validado no componente de prompt card antes da gente fazer e terminar, de fato, a nossa action. Nossa action ainda tá pela metade ainda, a gente nem tem o nosso use case. Isso aqui é muito poderoso nos testes."*

Esse approach garante que:
1. O contrato entre componente e action está definido (FormState)
2. O componente reage corretamente a sucesso e erro
3. Quando a action for completada, se o contrato for mantido, nada quebra
4. Refatorações na action não quebram testes do componente

## O padrão FormState como contrato

A action nunca lança exceções para o componente. Ela sempre retorna `{ success: boolean, message: string }`. Isso cria um contrato estável:

- O componente não precisa de try/catch para lidar com a action
- A action encapsula toda a complexidade de erro
- Mensagens de erro específicas (not found) vs genéricas (falha ao remover) são decididas na action, não no componente

## Soft validation vs throw

O instrutor inicialmente pensa em usar `throw` para validação do ID, mas imediatamente corrige: *"Não, não preciso dar um throw, né? Vamos só um soft aqui."* O soft return mantém o contrato FormState consistente — o componente sempre recebe o mesmo formato, independente do tipo de erro.

## Organização de actions no arquivo

O instrutor menciona que coloca search actions no final do arquivo: *"Deixar o search sempre no final. Aqui são as actions prioritárias."* É uma convenção pessoal, mas o princípio é: CRUD operations (create, update, delete) são mais frequentemente editadas, então ficam no topo.

## O papel do jest.fn() externo ao mock

O `deleteMock` é declarado fora do `jest.mock` para poder ser referenciado nos testes individuais. Isso permite usar `mockResolvedValue` em cada teste com valores diferentes, controlando exatamente o que a action "retorna" em cada cenário.

## Verificação de falso positivo

O instrutor demonstra trocar a message no mock para confirmar que o teste realmente quebra: *"Se eu trocar a mensagem aqui, o que será que acontece? Ele quebra, tá? Então tá certinho, não é um falso positivo."* Essa é uma prática essencial — todo teste verde deve ser verificado com uma mudança que o torne vermelho.

## Evolução incremental

A action é criada "pela metade" — com o try/catch e FormState structure, mas sem o use case real. O instrutor avança para testar o componente e só depois vai implementar o use case. Isso demonstra desenvolvimento incremental guiado por testes: define o contrato → testa o consumidor → implementa o produtor.