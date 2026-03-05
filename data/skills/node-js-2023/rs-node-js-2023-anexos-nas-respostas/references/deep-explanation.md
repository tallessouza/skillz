# Deep Explanation: Anexos nas Respostas

## Por que replicar e não abstrair?

O instrutor deliberadamente copia a estrutura de `QuestionAttachment` para `AnswerAttachment` ao invés de criar uma abstração genérica. Em DDD, cada agregado é uma unidade de consistência independente. Question e Answer são agregados distintos — mesmo que compartilhem o conceito de "attachment", cada um gerencia seus próprios anexos de forma independente.

Criar um `GenericAttachmentList<T>` seria over-engineering neste contexto porque:
- Os ciclos de vida são diferentes (uma pergunta pode ser deletada independente das respostas)
- As regras de negócio podem divergir no futuro
- A WatchedList já é a abstração — cada entidade apenas a especializa

## O padrão WatchedList

A `WatchedList` é um padrão que rastreia itens adicionados e removidos de uma coleção. Quando o agregado é persistido, a WatchedList sabe exatamente quais attachments foram adicionados e quais foram removidos, permitindo operações de banco de dados precisas (INSERT e DELETE) ao invés de deletar tudo e reinserir.

## O papel do `touch()`

O instrutor menciona que esqueceu de adicionar `touch()` no setter de attachments da Question, e corrige isso na Answer. O `touch()` atualiza o `updatedAt`, o que é importante porque:
- Permite saber quando a entidade foi modificada pela última vez
- Triggers de cache invalidation dependem disso
- Auditoria precisa dessa informação

## O efeito cascata nos testes

A parte mais trabalhosa (e que o instrutor enfatiza) é atualizar TODOS os testes. Quando o `InMemoryAnswersRepository` passa a receber `InMemoryAnswerAttachmentsRepository` no construtor, TODO teste que instancia o answers repository precisa ser atualizado. O instrutor passa por cada arquivo de teste um por um, usando `npx tsc --noEmit` como guia para encontrar todos os pontos que precisam de ajuste.

Isso demonstra um princípio importante: mudanças em dependências de repositório têm efeito cascata significativo nos testes, e a checagem de tipos do TypeScript é sua melhor aliada para encontrar todos os pontos afetados.

## Processo de replicação do instrutor

1. Copiar arquivo da entidade irmã
2. Replace all com preserve case (Question → Answer)
3. Ajustar imports
4. Copiar use case e fazer o mesmo replace
5. Copiar testes e ajustar
6. Criar repositório e factory
7. Rodar `npx tsc --noEmit` para encontrar erros restantes
8. Corrigir cada erro até zero erros de TypeScript