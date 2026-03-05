# Deep Explanation: Caso de Uso — Ler Notificação

## Por que encapsular a mutação em um método de domínio?

O instrutor destaca um ponto sutil mas importante: quando uma notificação é marcada como lida, a data é **sempre** `new Date()` — o usuário nunca vai selecionar uma data diferente da data atual. Por isso, não faz sentido criar um setter (`set readAt(date: Date)`) que aceitaria qualquer data. Em vez disso, cria-se um método `read()` que internamente faz `this.props.readAt = new Date()`.

Isso é um **acessor** — um método que permite modificar o valor de uma propriedade sem dar acesso direto à propriedade. Protege a invariante de negócio: "a data de leitura é sempre o momento em que o usuário lê".

## Padrão fetch-validate-mutate-save

O caso de uso segue uma sequência rigorosa:

1. **Fetch** — `findById` busca a entidade
2. **Validate existence** — se null, `ResourceNotFoundError`
3. **Validate authorization** — compara recipientId/authorId
4. **Mutate** — via método de domínio (`notification.read()`)
5. **Save** — persiste a entidade modificada

Esse padrão é idêntico ao usado em `DeleteAnswer`, `DeleteQuestion`, e qualquer caso de uso que modifica uma entidade existente. A ordem das validações importa: primeiro existência, depois autorização (não faz sentido checar permissão de algo que não existe).

## Movendo erros para @core

O instrutor percebe durante a aula que `ResourceNotFoundError` e `NotAllowedError` estavam dentro da pasta de erros do fórum (um subdomínio específico), mas são genéricos — qualquer subdomínio precisa deles. A solução é mover para `@core/errors/` e atualizar os imports usando find-and-replace no VSCode (`@domain/forum/...` → `@core/...`).

Essa decisão reflete o princípio de que o **core** contém tudo que é compartilhado entre subdomínios, enquanto cada subdomínio contém apenas o que é específico dele.

## Repository: findById + save vs create

O repositório precisa de três operações distintas:

- **create** — insere nova entidade (push no array in-memory)
- **findById** — busca por id, retorna `Entity | null`
- **save** — atualiza entidade existente (encontra pelo id e substitui no array)

O `save` é diferente do `create`: ele encontra o índice do item existente e substitui (`this.items[itemIndex] = entity`), enquanto `create` faz push.

## Sobre o await em testes

O instrutor menciona que no repositório in-memory, mesmo que os métodos retornem Promise (porque implementam a interface), o conteúdo é síncrono. Então `await` em `inMemory.create()` não faz diferença prática nos testes — mas é boa prática manter para consistência com a interface.

## Factory pattern nos testes

O `makeNotification` segue o mesmo padrão de `makeQuestion`: uma factory que cria entidades com valores padrão para testes. Isso evita repetir a criação manual de entidades em cada teste. A factory aceita overrides parciais para que cada teste customize apenas o que é relevante (ex: `recipientId` específico para testar autorização).