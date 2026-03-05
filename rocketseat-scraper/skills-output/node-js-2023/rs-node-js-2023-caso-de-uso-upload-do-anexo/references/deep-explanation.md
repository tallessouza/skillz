# Deep Explanation: Upload e Criacao de Attachment

## Por que validar tipo na camada de dominio se ja valido no controller?

O instrutor explica um principio fundamental de arquitetura limpa: a camada de dominio nao conhece a camada de infra. Se voce pudesse "arrancar" toda a infra e substituir por outra, o dominio deveria continuar funcionando. A validacao no controller (Multer fileFilter) e uma conveniencia da infra — nao e uma regra de negocio.

Alem disso, quando se faz upload para storage externo (S3, R2), voce e **obrigado** a especificar o `Content-Type` / mimetype do arquivo. Entao o fileType precisa estar disponivel e validado no caso de uso.

## Buffer vs Stream: a decisao de memoria

O instrutor usa uma analogia pratica: imagine uma maquina com 1GB de RAM. Se um usuario faz upload de 100MB e voce usa buffer, ja consumiu 10% da memoria so com um request. Com multiplos uploads simultaneos, a aplicacao cai.

**Buffer:** o conteudo inteiro do arquivo fica em memoria. O garbage collector do JS limpa apos o uso. Aceitavel para arquivos pequenos (ate ~2MB).

**Stream:** o arquivo e processado em chunks. Nunca esta inteiro em memoria. O Multer suporta isso nativamente. Necessario para arquivos grandes.

O instrutor escolheu buffer porque o limite e 2MB e a complexidade de streams nao se justifica.

## Stateless: por que nunca salvar em disco

O instrutor enfatiza: "a nossa aplicacao tem que ser stateless, nao pode armazenar nada em disco." Isso porque:

1. Deploys modernos (containers, serverless) nao garantem persistencia de filesystem
2. Escalabilidade horizontal — se voce tem 3 instancias, o arquivo salvo na instancia 1 nao existe na instancia 2
3. Storage especializado (S3, R2) oferece CDN, redundancia, e custo otimizado

## O padrao de contrato abstrato

Assim como repositorios abstraem o banco de dados e encrypters abstraem criptografia, o `Uploader` abstrai o storage. O instrutor destaca o padrao recorrente:

```
Camada de dominio:  contrato (classe abstrata / interface)
Camada de infra:    implementacao concreta
Testes:             implementacao fake (in-memory)
```

Exemplos ja existentes no projeto:
- `Encrypter` (contrato) → `JwtEncrypter` (infra)
- `HashGenerator` (contrato) → `BcryptHasher` (infra)
- `QuestionsRepository` (contrato) → `PrismaQuestionsRepository` (infra)
- `Uploader` (contrato) → futuro `R2Storage` ou `S3Storage` (infra)

## Attachment generico vs associado

O instrutor explica uma decisao de modelagem: o upload cria um `Attachment` que **ainda nao pertence** a nenhuma pergunta ou resposta. Ele e um anexo "orfao" que sera associado depois. Por isso existe:

- `AttachmentsRepository` — CRUD do attachment puro
- `QuestionAttachmentsRepository` — relacao attachment ↔ question
- `AnswerAttachmentsRepository` — relacao attachment ↔ answer

Isso permite upload independente, antes mesmo de criar a pergunta/resposta.

## URL provisoria

O instrutor usa `fileName` como URL temporaria no campo `url` do attachment. Isso porque a URL real so existe apos o upload para o storage externo. Apos implementar o `Uploader` concreto, o retorno do `upload()` fornece a URL definitiva.