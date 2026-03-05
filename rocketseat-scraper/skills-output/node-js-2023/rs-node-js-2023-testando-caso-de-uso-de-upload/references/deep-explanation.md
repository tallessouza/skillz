# Deep Explanation: Testando Caso de Uso de Upload

## Por que criar um FakeUploader?

O instrutor segue o padrao ja estabelecido no curso de criar fakes para dependencias externas. Assim como foi criado um `FakeEncryptor` e um `FakeHasher` para criptografia, o `FakeUploader` simula o armazenamento de arquivos sem depender de infraestrutura real.

A analogia do instrutor: o array `uploads` interno funciona "como se fosse uma pasta onde eu tivesse jogando os arquivos". Essa metafora e util — o fake replica o comportamento essencial (receber arquivo, gerar URL, armazenar referencia) sem a complexidade do storage real.

## Estrutura do FakeUploader

O instrutor deliberadamente ignora o `body` (Buffer) no fake:

> "Eu vou acabar nem utilizando o body, porque eu vou estar so fingindo que estou fazendo upload"

Isso revela um principio importante: **o teste de caso de uso valida a logica de orquestracao, nao o mecanismo de upload**. O body seria relevante apenas na camada de infraestrutura (ex: enviar bytes para S3).

A URL gerada e um UUID aleatorio — nao precisa parecer com uma URL real porque o teste so verifica que alguma URL foi produzida e retornada.

## Padrao de organizacao dos fakes

O instrutor organiza fakes espelhando a estrutura do dominio:

```
test/
├── cryptography/
│   ├── fake-encryptor.ts
│   └── fake-hasher.ts
├── repositories/
│   ├── in-memory-students-repository.ts
│   └── in-memory-attachments-repository.ts
└── storage/
    └── fake-uploader.ts
```

Cada fake fica na pasta correspondente ao tipo de dependencia que substitui. O `InMemoryAttachmentsRepository` foi criado copiando o de students e adaptando (replace student por attachment, remover metodos desnecessarios como `findByEmail`).

## Os dois testes e o que cada um valida

### Teste 1: Caminho feliz
Valida tres coisas:
1. O resultado e `Right` (sucesso) contendo o attachment salvo
2. O attachment foi persistido no repositorio in-memory
3. O upload foi registrado no fake uploader com o filename correto

### Teste 2: Tipo invalido
Valida que:
1. Enviar `audio/mpeg` resulta em `Left` (erro)
2. O erro e especificamente `InvalidAttachmentType`

O instrutor usa o padrao Either (Left/Right) do functional programming para tratamento de erros, consistente com todo o curso.

## Conexao com o fluxo geral

O instrutor encerra explicando que os testes e o caso de uso estao prontos, e o proximo passo e "integrar com a camada de infra" — criar o controller real e o storage real (provavelmente Cloudflare R2 ou S3). Os testes de caso de uso existem independentemente dessa integracao.