# Deep Explanation: Caso de Uso Deletar Resposta

## Por que esse caso de uso e identico ao de deletar pergunta

O instrutor enfatiza que deletar Answer e "muito parecido" com deletar Question. A estrutura do caso de uso em Clean Architecture e isomorfica entre entidades: buscar por ID, validar autorizacao, executar delecao. O que muda sao os nomes e as propriedades especificas da entidade.

Esse padrao de isomorfismo e uma consequencia direta do DDD: cada agregado tem seu proprio repositorio e seus proprios casos de uso, mas a mecanica de CRUD segue a mesma estrutura. Reconhecer isso permite produtividade sem sacrificar a separacao de dominios.

## Hack do VS Code: Preserve Case no Replace

O instrutor demonstra um truque produtivo: `Ctrl+Shift+P → Replace` com a opcao **Preserve Case** ativada. Ao substituir "Question" por "Answer", o VS Code respeita se a palavra original estava em PascalCase, camelCase ou UPPERCASE. Isso evita erros manuais ao replicar estruturas entre entidades.

Esse hack e aplicavel sempre que voce cria uma nova entidade com estrutura similar a uma existente. Funciona para:
- Casos de uso
- Repositorios in-memory
- Testes
- Factories

## Validacao de autoria como regra de dominio

A validacao `answer.authorId.toString() !== authorId` nao e um detalhe de implementacao — e uma regra de negocio. Apenas o autor da resposta pode deleta-la. Isso pertence ao caso de uso (camada de aplicacao), nao ao controller ou ao repositorio.

O `.toString()` e necessario porque `authorId` na entidade e um Value Object (`UniqueEntityID`), enquanto o parametro recebido e uma string. A comparacao direta falharia por referencia.

## InMemoryRepository como espelho do contrato

Quando o caso de uso exige `findById` e `delete` no repositorio, o InMemoryRepository de teste precisa implementar esses mesmos metodos. O instrutor copia do InMemoryQuestionsRepository e substitui os nomes — novamente usando Preserve Case.

O padrao para `delete` em repositorio in-memory:
```typescript
async delete(answer: Answer) {
  const index = this.items.findIndex(item => item.id === answer.id)
  this.items.splice(index, 1)
}
```

O padrao para `findById`:
```typescript
async findById(id: string) {
  const answer = this.items.find(item => item.id.toString() === id)
  return answer ?? null
}
```

## Factory e a exportacao de Props

O instrutor menciona que e necessario exportar `AnswerProps` da entidade para que a factory funcione. Sem o export, `Partial<AnswerProps>` nao compila no arquivo da factory.

Diferenca entre Answer e Question na factory: Answer nao tem `title` mas tem `questionId` obrigatorio (toda resposta pertence a uma pergunta). A factory deve refletir essas diferencas.

## Contexto pedagogico

O instrutor posiciona essa aula como parte dos "casos de uso mais simples" que servem para acostumar o aluno com a estrutura do projeto. As proximas aulas introduzirao regras de negocio mais complexas. Essa repeticao deliberada e intencional: construir fluencia na estrutura antes de adicionar complexidade.