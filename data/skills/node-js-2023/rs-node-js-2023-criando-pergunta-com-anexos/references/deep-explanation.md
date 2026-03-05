# Deep Explanation: Criando Pergunta com Anexos

## Por que separar upload de criacao?

O instrutor Diego explica que em aplicacoes modernas, **o upload de arquivos acontece no momento que o usuario seleciona o arquivo**, nao quando submete o formulario. Isso significa:

1. Usuario seleciona arquivo → front faz upload imediato → recebe ID do anexo
2. Usuario preenche formulario e submete → back recebe apenas IDs dos anexos

### O problema do MultipartFormData

MultipartFormData e o unico formato HTTP que permite enviar arquivos do front para o back. Porem:
- Nao e JSON — parsing e mais complexo
- Misturar dados textuais + binarios na mesma requisicao e "muito chato" (palavras do Diego)
- Tanto enviar (front) quanto receber (back) e mais trabalhoso

**Solucao:** Uma rota exclusiva para upload (MultipartFormData) e outra para criacao da entidade (JSON puro com IDs).

## Dependencia circular: pai precisa dos filhos, filhos precisam do pai

O problema classico ao criar entidades pai-filho:
- Para criar a `Question`, preciso dos `attachments` (propriedade da Question)
- Para criar cada `QuestionAttachment`, preciso do `questionId` (so existe apos criar a Question)

**Solucao do Diego:** Usar um setter.

1. Cria a Question SEM attachments (default `[]`)
2. Cria os QuestionAttachment usando `question.id`
3. Injeta via `question.attachments = questionAttachments`

Isso funciona porque o `id` da Question e gerado no momento da instanciacao (via `UniqueEntityId`), antes de persistir no banco.

## Aggregate Root e repositorio unico

Conceito central de DDD: o **aggregate root** (raiz do agregado) e responsavel por toda a persistencia do agregado.

- `Question` e o aggregate root
- `QuestionAttachment` e uma entidade dentro do agregado
- O `QuestionsRepository` deve salvar/editar/deletar tanto questions quanto seus attachments
- **NAO criar** um `AttachmentsRepository` separado para gerenciar anexos de perguntas

### Por que?

Porque o agregado e uma unidade de consistencia. Se eu salvo a question por um repositorio e os anexos por outro, perco a garantia transacional. O aggregate root controla o ciclo de vida de todas as entidades dentro dele.

### E o repositorio in-memory?

Diego observa que o repositorio in-memory nao sofre com isso porque salva a entidade como objeto completo — os anexos ja estao dentro. O desafio real aparece com banco de dados, onde sera necessario:
- Salvar na tabela `questions`
- Salvar na tabela `question_attachments`
- Tudo na mesma transacao

Isso sera abordado em aulas futuras.

## Teste: granularidade vs volatilidade

Diego faz uma observacao importante sobre testes:
- Quanto mais granular as expectations, mais seguro o teste
- Porem, mais propenso a quebrar com alteracoes
- Manter um "meio termo" — validar o essencial sem tornar o teste volatil

No exemplo, ele valida:
1. Que a question foi criada com sucesso
2. Que `attachments` tem length 2
3. Que os IDs dos attachments correspondem aos enviados

Isso e suficiente sem ser excessivamente fragil.