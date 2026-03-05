# Deep Explanation: Cobrindo Cenarios no Prompt Card

## A estrategia do instrutor para 100% de coverage

O instrutor demonstra um ciclo pragmatico: **rodar coverage → identificar linhas faltando → decidir se testa ou refatora → validar**. Nao e sobre atingir 100% por vaidade — e sobre entender cada branch do codigo.

## Tres abordagens para o mesmo problema

O insight mais valioso da aula e que existem **multiplas formas validas** de resolver coverage incompleto:

### Abordagem 1: Manter try/catch + testar com mockRejectedValue
- O componente tem try/catch/finally
- Para cobrir o catch, o teste usa `mockRejectedValueOnce(new Error(...))`
- Isso forca a execucao do bloco catch
- **Vantagem:** protege contra excecoes inesperadas (ex: use case que nao existe ainda)
- **Desvantagem:** mais branches para testar

### Abordagem 2: Remover try/catch, simplificar para if/else
- A action ja trata erros internamente e retorna `{ success: false, message }`
- Se a action nunca lanca throw, o try/catch no componente e redundante
- Remover reduz branches e simplifica testes
- **Vantagem:** menos codigo, menos testes, mesma cobertura
- **Desvantagem:** se a action mudar e comecar a lancar throws, o componente quebra silenciosamente

### Abordagem 3: Usar finally sem catch
- Remover o catch mas manter o finally (para cleanup como `setIsDeleting(false)`)
- **Vantagem:** cleanup garantido sem branch extra
- O instrutor mostra que isso tambem atinge 100%

## Por que o instrutor prefere a Abordagem 1

O instrutor diz "prefiro deixar assim e a gente tem esse teste a mais aqui, mais como uma ressalva mesmo". A razao: o `deletePromptUseCase` ainda nao existia no momento da aula. Se no futuro ele lancar um erro inesperado, o try/catch protege o componente. E programacao defensiva pragmatica.

## O padrao mockResolvedValue vs mockRejectedValue

- `mockResolvedValue({ success: false, message })` — simula retorno normal da action com erro de negocio
- `mockRejectedValueOnce(new Error(message))` — simula excecao nao tratada na action

Sao cenarios diferentes e ambos precisam de testes separados quando o componente tem try/catch.

## Coverage como ferramenta de descoberta

O instrutor usa coverage nao como metrica de qualidade final, mas como **ferramenta de descoberta**: "linhas 40 e 41 nao cobertas" → olha o codigo → decide se testa ou refatora. O coverage guia a decisao, nao a impoe.

## Conexao com a action

A `deletePromptAction` internamente faz try/catch e retorna `{ success: false, message }`. Isso significa que o componente recebe SEMPRE um objeto — nunca uma excecao — a menos que algo muito inesperado aconteca (bug no framework, use case inexistente, etc). Essa analise da action e o que justifica a decisao de manter ou remover o try/catch no componente.