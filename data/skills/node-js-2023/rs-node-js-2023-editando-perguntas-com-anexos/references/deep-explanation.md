# Deep Explanation: Editando Perguntas com Anexos

## Por que o WatchedList importa aqui

O WatchedList foi criado nas aulas anteriores exatamente para esse cenário. Quando o usuário edita uma pergunta, ele pode:
- Manter anexos existentes (1 e 2 → continua 1)
- Remover anexos (2 é removido)
- Adicionar novos anexos (3 é adicionado)

O WatchedList rastreia automaticamente quais itens são novos (`getNewItems()`) e quais foram removidos (`getRemovedItems()`), comparando a lista atual com a lista original. Isso evita lógica manual de diff que seria propensa a erros.

## O fluxo completo do usuário

O instrutor explica o fluxo real:
1. Usuário faz upload de arquivos (cria attachments no banco, recebe IDs)
2. Usuário preenche dados da pergunta (título, conteúdo)
3. Usuário clica em "Criar/Editar pergunta"
4. Backend recebe os IDs dos attachments junto com os dados da pergunta
5. Backend relaciona os attachments com a pergunta

Na edição, o frontend envia a lista **completa** de IDs desejados. O backend compara com os existentes via WatchedList e executa as operações necessárias.

## Por que a factory de relacionamento usa UPDATE e não CREATE

O attachment já existe no banco de dados (foi criado no upload). O relacionamento com a pergunta é feito atualizando o campo `questionId` do attachment existente. Isso é um padrão importante: **relacionar não é criar, é atualizar**.

```typescript
// CORRETO: Update o attachment existente
await this.prisma.attachment.update({
  where: { id: questionAttachment.attachmentId.toString() },
  data: { questionId: questionAttachment.questionId.toString() },
})
```

## A importância de verificar IDs específicos no teste

O instrutor não se contenta em verificar apenas que existem 2 attachments após a edição. Ele verifica que são **exatamente** o attachment 1 e o attachment 3 — não o 1 e o 2 (estado anterior). Isso garante que:
- O attachment 2 foi realmente removido (não apenas desconectado)
- O attachment 3 foi realmente conectado
- O attachment 1 permaneceu intacto

O instrutor inclusive usa `console.log` para confirmar visualmente os IDs gerados aleatoriamente, mostrando que os valores no banco correspondem aos esperados.

## Conexão com o WatchedList

O instrutor fecha a aula reforçando: "Por que a gente criou o WatchedList lá no começo? Então, a gente consegue fazer essas inserções e remoções de listas de agregados aqui pela nossa aplicação."

O WatchedList é o padrão de Domain-Driven Design para listas de agregados que precisam ser rastreadas. Sem ele, seria necessário implementar lógica de diff manual em cada caso de uso que envolve edição de listas relacionadas.

## Registrando factories nos providers do teste

As factories (`AttachmentFactory` e `QuestionAttachmentFactory`) precisam ser registradas nos `providers` do módulo de teste E2E. O instrutor mostra que esqueceu inicialmente de criar a `QuestionAttachmentFactory` e precisou criá-la seguindo o mesmo padrão das outras factories.