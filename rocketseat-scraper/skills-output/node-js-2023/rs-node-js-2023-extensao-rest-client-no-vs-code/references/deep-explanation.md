# Deep Explanation: REST Client no VS Code

## Por que REST Client ao inves de Postman/Insomnia?

O instrutor (Diego Fernandes, Rocketseat) destaca um beneficio fundamental: **o arquivo `.http` fica armazenado no projeto**. Isso significa que quando voce compartilha o projeto com outras pessoas, todo mundo sabe quais requisicoes existem. E uma forma de documentacao viva das rotas da API.

Ferramentas como Postman, Insomnia, Hopscotch e HTTPie funcionam, mas suas collections ficam fora do repositorio (ou exigem export/import manual). O REST Client resolve isso nativamente.

## Variaveis globais

A sintaxe `@baseURL = http://localhost:3333` no topo do arquivo permite referenciar com `{{baseURL}}` em qualquer request abaixo. Funciona de forma similar as environment variables do Insomnia — "com as duas chaves por volta", como o Diego descreve.

No VS Code, ao digitar `Ctrl+Space` dentro de uma URL, o autocomplete sugere as variaveis definidas no arquivo.

## Separador `###`

Este e um detalhe critico que pode causar confusao: **sem as tres cerquilhas (`###`), o REST Client interpreta tudo como uma unica requisicao**. O Diego enfatiza isso: "se eu nao boto essa cerquilha, ele nao entende que sao duas requisicoes separadas."

## Nomeando requests com `# @name`

A diretiva `# @name create_account` antes do metodo HTTP serve para:
1. Organizacao visual no arquivo
2. Referencia entre requests (ex: usar o token retornado por `authenticate` em requests autenticadas)

## Fluxo pratico demonstrado

1. Criar arquivo `client.http` no root
2. Definir `@baseURL`
3. Escrever request POST para `/accounts` com body JSON
4. Separar com `###`
5. Escrever request POST para `/sessions` (mesmo que a rota ainda nao exista — retorna 404 ate ser implementada)
6. Clicar em "Send Request" que aparece acima de cada request

O instrutor ja deixa requests preparadas para rotas futuras (como `/sessions`), mostrando que o arquivo `.http` tambem serve como planejamento das rotas que serao implementadas.