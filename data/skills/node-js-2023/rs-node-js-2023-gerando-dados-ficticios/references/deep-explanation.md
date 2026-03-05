# Deep Explanation: Gerando Dados Fictícios

## Por que não usar dados fixos?

O instrutor destaca um problema prático: quando todas as entidades de teste têm `title: 'example'` e `content: 'example content'`, fica impossível diferenciar uma pergunta da outra durante debugging. Se um teste falha e você tem 5 questions no estado, todas com o mesmo título, qual é qual?

Dados aleatórios resolvem isso — cada instância é única, facilitando identificar qual entidade causou a falha.

## A biblioteca Faker

O `@faker-js/faker` gera dados fictícios de diversos tipos. O instrutor explora a API e nota a riqueza de geradores disponíveis:

- **`faker.lorem.sentence()`** — gera uma sentença de até 10 palavras em texto lorem ipsum. Ideal para títulos.
- **`faker.lorem.text()`** — gera um texto maior, com múltiplas frases e até quebras de linha. Ideal para conteúdos.

O instrutor menciona que o texto gerado é em latim (lorem ipsum), o mesmo padrão usado em HTML para placeholder text.

## Padrão da factory com dois parâmetros

A factory aceita:

1. **`override: Partial<QuestionProps>`** — permite que o teste sobrescreva apenas os campos relevantes. Por exemplo, se o teste é sobre slug, passa apenas `{ slug: 'minha-slug' }` e o resto é faker.

2. **`id?: UniqueEntityId`** — opcional. Quando passado, é repassado como segundo argumento para `Entity.create()`. Quando `undefined`, a classe `Entity` base cria um `UniqueEntityId` automaticamente.

O instrutor explica que isso é possível porque a classe `Entity` já trata `undefined` como sinal para criar um id novo. Não quebra nada — é o comportamento padrão.

## Quando usar id fixo?

O instrutor antecipa a necessidade: em testes que verificam busca por id, ou que precisam de referências cruzadas entre entidades (ex: uma Answer que referencia uma Question por id), é essencial poder controlar o id.