# Deep Explanation: Testando Retorno dos Detalhes da Pergunta

## Por que testes passam mesmo com erro de tipo?

O instrutor destaca um comportamento importante: quando o `InMemoryQuestionsRepository` ganha novas dependências no constructor, os testes existentes continuam passando mesmo sem atualizar as instanciações. Isso acontece porque o Vitest (e Jest) não executam checagem de TypeScript antes de rodar os testes. O erro é puramente de tipagem — em runtime, o JavaScript simplesmente recebe `undefined` para os parâmetros não passados.

Isso é perigoso porque dá falsa confiança. O código está tecnicamente incorreto e pode quebrar silenciosamente se algum teste futuro tentar acessar a funcionalidade que depende dessas dependências.

## O padrão de propagação de dependências

Quando se trabalha com Clean Architecture e repositórios in-memory para testes, existe um padrão de propagação:

1. O repositório principal (`QuestionsRepository`) precisa resolver relações (autor, anexos)
2. Para resolver, ele precisa de outros repositórios (`StudentsRepository`, `AttachmentsRepository`)
3. Essas dependências são injetadas no constructor do in-memory
4. TODOS os testes que criam esse repositório precisam prover as dependências

O instrutor menciona que esse trabalho "dobrado" aconteceu porque numa aula anterior, ao criar a funcionalidade de trazer comentários com autor, esqueceram de atualizar todos os testes. É um débito técnico que se acumula.

## Dica do VSCode: Autocomplete por iniciais

O instrutor compartilha uma técnica prática: ao digitar variáveis longas como `InMemoryStudentsRepository`, ele digita apenas as iniciais de cada palavra — `inmstudent` — e o VSCode oferece o autocomplete correto. Isso funciona porque o algoritmo de fuzzy matching do VSCode reconhece as letras iniciais de cada segmento camelCase.

## Testando relações no detalhe

O teste não verifica apenas campos primitivos. Ele valida que:
- O `author` retorna o nome do estudante (não o ID)
- Os `attachments` retornam como array com os títulos corretos
- A estrutura usa `expect.objectContaining` para validação parcial

Isso garante que o Value Object ou DTO de detalhes está corretamente montado pelo use case, que por sua vez depende do repositório fazer os joins corretos entre as entidades.

## Ordem importa no constructor

O instrutor enfatiza que as dependências devem ser passadas na mesma ordem do constructor. No caso: `attachments` primeiro, `students` depois. Em TypeScript isso é enforçado pela tipagem, mas em JavaScript puro seria um bug silencioso se invertido.