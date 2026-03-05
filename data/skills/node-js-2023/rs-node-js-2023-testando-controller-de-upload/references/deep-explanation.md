# Deep Explanation: Testando Controller de Upload

## Por que nao mockar storage em testes e2e?

O Diego enfatiza fortemente esta posicao: se o teste e end-to-end, ele TEM que testar de ponta a ponta. Mockar o Cloudflare/S3 transforma o teste em algo que nao valida o fluxo real.

> "Eu vejo que muita gente viria aqui nesse momento agora num teste end-to-end e criaria um mock, uma implementacao ficticia pro Cloudflare. Só que eu nao concordo. Se e um teste end-to-end, ele tem que testar realmente a aplicacao como ela vai estar funcionando em producao."

A analogia do Diego sobre testes e2e:

> "Teste end-to-end e que nem amigo: poucos e bons. Voce tem que criar poucos testes end-to-end, mas eles têm que realmente testar a aplicacao."

Isso significa aceitar que testes e2e sao mais lentos. O tradeoff e intencional — menos testes, mas com confianca real.

## O problema do override de variaveis ambiente no NestJS

O ConfigModule do NestJS tem uma limitacao (issue aberta no repositorio): ele nao faz override de variaveis ambiente ja definidas. O Diego explica o mecanismo:

1. O `setup-e2e.ts` carrega as variaveis via dotenv antes do app iniciar
2. Quando o NestJS inicia, o ConfigModule le as variaveis que JA estao no `process.env`
3. Se uma variavel ja existe, o ConfigModule NAO sobrescreve — ele confia na que ja estava la

Por isso, a solucao e carregar o `.env.test` COM `override: true` no proprio `setup-e2e.ts`, que roda ANTES de qualquer modulo NestJS.

> "Ja bati a cabeca muito com isso aqui antes."

A ordem importa:
1. `config({ path: '.env', override: true })` — carrega tudo
2. `config({ path: '.env.test', override: true })` — sobrescreve apenas o que difere

## Bucket de teste com lifecycle

O Cloudflare R2 (e S3) suportam Object Lifecycle Rules. A estrategia:

1. Criar bucket com sufixo `-test`
2. Configurar rule: "Delete all files after 1 day"
3. Nao adicionar nenhuma condicao (aplica a todos os objetos)
4. Resultado: testes rodam normalmente, arquivos somem em 24h

Isso evita acumulo de "lixo" no storage sem precisar de cleanup manual.

## Erro comum: Access Denied no bucket novo

Ao criar um novo bucket, se a API key foi configurada com acesso apenas a buckets especificos, o novo bucket NAO tera acesso automatico. O Diego encontrou esse erro ao vivo:

> "Ah, claro, ne? Como a gente criou um novo bucket, la quando a gente configurou a nossa chave de API, a gente falou quais buckets ela tem acesso."

Solucao: editar a API key e adicionar o bucket de teste na lista de buckets permitidos.

## Wiring do repositorio no DatabaseModule

O controller precisa do `AttachmentsRepository`, que precisa ser:
1. Criado como `PrismaAttachmentsRepository`
2. Registrado no `DatabaseModule` (provide + exports)
3. Ter um mapper (`PrismaAttachmentMapper`) com pelo menos `toPrisma()`

O mapper converte a entidade de dominio para o formato do Prisma (id, title, url).

## Principio geral para testes e2e com servicos externos

> "Tudo que a gente for fazer que integra com sistema terceiro, e bom que a gente tenha, assim como no banco de dados a gente fez um banco isolado pra testes, a gente ter tambem um bucket pra testes, tudo isolado pra testes, mas nao criar mocks demais."

O padrao e: ambiente isolado para CADA servico externo usado nos testes, mas sem mocks.