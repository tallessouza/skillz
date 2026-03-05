# Deep Explanation: Controller Upload de Arquivo

## Por que separar upload em rota dedicada?

O instrutor Diego explica que REST APIs transicionam dados entre front-end e back-end usando JSON. JSON nao suporta arquivos binarios nativamente — a unica alternativa seria converter para base64, o que aumentaria significativamente o tamanho do arquivo. Por isso, a pratica recomendada e isolar requisicoes que envolvem upload de arquivos em rotas dedicadas que lidam **somente** com upload.

## O fluxo upload-then-reference

O padrao seguido nas aplicacoes do instrutor:

1. Existe uma rota dedicada para upload de arquivos
2. Essa rota devolve um **attachment ID**
3. Esse ID e utilizado posteriormente na criacao de outros recursos (perguntas, respostas)

No contexto do forum, tanto criacao de perguntas quanto respostas precisam de anexos. Todas essas rotas recebem **IDs de anexos que ja foram criados previamente**. Isso significa que o upload acontece antes da criacao do recurso.

## Multer e o ecossistema NestJS

O NestJS por baixo dos panos usa Express como micro framework padrao. O Multer e a biblioteca de upload de arquivos para Express. Ponto critico: **Multer nao funciona com Fastify**. Se voce trocou o adapter para Fastify, precisa de outra estrategia.

Para ter os tipos TypeScript do Multer, e necessario:
1. Instalar `@types/multer` como dependencia de desenvolvimento
2. Adicionar `"multer"` no array `types` do `tsconfig.json` para que `Express.Multer.File` seja reconhecido globalmente

## O objeto file recebido

Quando o Multer processa o upload, o objeto `file` contem:

- `fieldname` — nome do campo (ex: `'file'`)
- `originalname` — nome original do arquivo
- `encoding` — encoding do arquivo
- `mimetype` — tipo no formato type/subtype (ex: `image/png`)
- `buffer` — conteudo em memoria (Buffer e uma representacao de informacao transitando em memoria, conceito de Streams do Node)
- `size` — tamanho em bytes

## Validacao com ParseFilePipe

O NestJS oferece `ParseFilePipe` com validators encadeaveis:

- **MaxFileSizeValidator** — recebe `maxSize` em bytes. O instrutor calcula `1024 * 1024 * 2` e comenta `/* 2mb */` para legibilidade
- **FileTypeValidator** — aceita formato mimetype (`image/png`) ou regex de extensao (`.(jpg|png|jpeg|pdf)`). O instrutor prefere regex por ser mais facil de ler

## FileTypeValidator e mimetype

O formato mimetype segue o padrao `type/subtype`: `text/plain`, `text/json`, `image/jpeg`, `image/png`. Voce pode passar nesse formato ou usar extensao com regex, que o instrutor considera mais pratico.

## Debugging de versao do NestJS

O instrutor encontrou um erro com `ParseFilePipe` que era bug de versao do NestJS. Sua abordagem de debugging:

1. Procurar no GitHub do projeto pela issue
2. Jogar o nome da classe exata (`MaxFileSizeValidator`) como palavra-chave
3. Verificar se existe atualizacao
4. Ultimo recurso: deletar `node_modules` e reinstalar

Apos atualizar o NestJS, o erro foi resolvido. Porem, ao deletar `node_modules`, foi necessario rodar `prisma generate` novamente para regenerar os tipos TypeScript do Prisma.

## Filosofia de teste do instrutor

Diego menciona que depois que comeca a escrever testes e2e, praticamente nao testa mais rotas manualmente. Ele cria o teste e2e diretamente, usando um arquivo real colocado na pasta `test/e2e/`. Isso serve como exercicio para criar o habito de sempre testar via codigo.