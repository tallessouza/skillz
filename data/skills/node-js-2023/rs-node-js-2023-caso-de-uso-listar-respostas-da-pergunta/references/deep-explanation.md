# Deep Explanation: Caso de Uso — Listar Respostas da Pergunta

## Por que separar foreign key do objeto de configuracao

O instrutor explica uma convencao importante de design de API de repositorio: o primeiro parametro do metodo `findManyByQuestionId` e o `questionId` (string), e o segundo parametro e um objeto com metadata como paginacao.

A razao: o `questionId` ja esta no proprio nome do metodo (`findManyBy**QuestionId**`). O primeiro parametro e redundante com o nome — voce ja sabe que e o questionId. Entao nao precisa nomea-lo dentro de um objeto. O objeto e reservado para **configuracao**: paginacao, filtros, ordenacao — coisas que sao metadata da query, nao identificadores.

```typescript
// O nome do metodo ja diz qual e o primeiro param
findManyByQuestionId(questionId, { page })
//                    ^^^^^^^^^   ^^^^^^
//                    obvio pelo  metadata/config
//                    nome do     da query
//                    metodo
```

## Reuso entre casos de uso semelhantes

O instrutor demonstra uma pratica pragmatica: ao criar `FetchQuestionAnswers`, ele copia o `FetchRecentQuestions` e adapta. Isso nao e preguica — e reconhecimento de que casos de uso de listagem seguem o mesmo padrao estrutural:

1. Recebem parametros de filtro + paginacao
2. Chamam um metodo do repositorio
3. Retornam a lista

A unica coisa que muda: o repositorio usado, a entidade retornada, e o filtro aplicado.

## Convencao de nomes: consistencia importa

O instrutor cometeu um erro ao vivo — chamou o campo de `topicId` quando deveria ser `questionId`. Isso mostra como inconsistencia de nomenclatura causa bugs reais. O nome do metodo deve refletir exatamente o campo do dominio.

Outro erro: esqueceu o `By` em `findManyByQuestionId`, escrevendo `findManyQuestionId`. Pequenas inconsistencias no nome quebram a interface do repositorio.

## Estrategia de testes para listagem

O instrutor cria dois testes distintos:

1. **Listagem basica (pagina 1):** Cria 3 answers com o mesmo `questionId`, busca pagina 1, espera 3 resultados
2. **Paginacao (pagina 2):** Cria 22 answers, busca pagina 2, espera 2 resultados (20 por pagina, sobram 2)

Detalhes importantes:
- Nao precisa passar `createdAt` nas factories porque este caso de uso nao ordena por data
- Usa `new UniqueEntityId('question-1')` para ter um ID fixo e previsivel nos testes
- Usa `.skip` no Jest para pular testes temporariamente sem comentar codigo

## O padrao de PaginationParams compartilhado

O `PaginationParams` e uma interface/tipo compartilhado entre todos os casos de uso que fazem paginacao. Isso garante que o slice `(page - 1) * 20, page * 20` seja consistente em todos os repositorios in-memory.