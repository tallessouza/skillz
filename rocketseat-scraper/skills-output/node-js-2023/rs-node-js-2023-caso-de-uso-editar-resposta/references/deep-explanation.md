# Deep Explanation: Caso de Uso Editar Resposta

## Raciocinio do instrutor

### Por que copiar e adaptar?

O instrutor demonstra explicitamente o padrao de produtividade DDD: quando voce ja tem `EditQuestion` funcionando, o `EditAnswer` segue a mesma estrutura. A tecnica e:

1. Copiar o arquivo do caso de uso similar
2. Usar find-replace para trocar o nome da entidade (Question → Answer)
3. Ajustar os campos especificos (Answer nao tem titulo, entao remove)

Isso nao e preguica — e consistencia arquitetural. Todos os use cases de edicao seguem o mesmo contrato: receber authorId + entityId + campos editaveis, validar autoria, mutar, salvar, retornar.

### Campos editaveis vs imutaveis

O instrutor enfatiza que Answer nao tem titulo, entao o request do EditAnswer so recebe `content`. Isso mostra um principio importante: **cada entidade define seus campos mutaveis**. Nao e porque Question tem titulo que Answer tambem tera. O caso de uso deve refletir exatamente o que a entidade permite editar.

### O metodo save() no repositorio

O instrutor percebe durante a implementacao que o repositorio nao tinha `save()` ainda. Isso e comum em DDD: voce comeca com `create` e `findById`, e so adiciona `save` quando precisa de update. O metodo save faz update por index — encontra o item no array e substitui.

O padrao no InMemoryRepository:
```typescript
async save(answer: Answer): Promise<void> {
  const itemIndex = this.items.findIndex((item) => item.id === answer.id)
  this.items[itemIndex] = answer
}
```

Este e o mesmo padrao tanto para QuestionsRepository quanto para AnswersRepository. O instrutor copia de um para o outro e faz replace.

### Retornando a entidade editada

O instrutor lembra no final da aula que esqueceu de retornar a entidade nos casos de uso de edicao (tanto EditQuestion quanto EditAnswer). Isso e uma correcao importante: **todo caso de uso de edicao deve retornar a entidade atualizada**, porque o chamador pode precisar do estado pos-edicao sem fazer uma query extra.

### Validacao de autoria

O padrao de autorizacao e simples mas fundamental:
1. Busca a entidade pelo ID
2. Compara o `authorId` do request com o `authorId` da entidade
3. Se diferente, lanca erro "Not allowed"

Isso garante que somente o autor original pode editar. E uma regra de negocio, nao de infraestrutura.

### Teste unitario

O teste segue o mesmo padrao do EditQuestion:
1. Cria uma entidade no repositorio in-memory
2. Executa o caso de uso com novos dados
3. Verifica que os campos foram atualizados
4. Testa tambem que um autor diferente recebe erro

### Contexto no CRUD do DDD

O instrutor menciona que com esse caso de uso, o CRUD basico esta finalizado. Os 4 casos de uso de cada entidade sao:
- **Create**: CreateQuestion, CreateAnswer
- **Read**: GetQuestionBySlug, FetchRecentQuestions
- **Update**: EditQuestion, EditAnswer
- **Delete**: DeleteQuestion, DeleteAnswer

A partir daqui, o curso segue para casos de uso mais complexos fora do padrao CRUD.