# Deep Explanation: Visualizando Arquivo no Frontend

## O problema que o instrutor resolve

Na aula, o front-end tinha uma URL de exemplo apontando para um endereco externo da Rocketseat. Isso funcionava como placeholder durante o desenvolvimento, mas nao serve para o sistema real. O instrutor mostra que precisamos substituir essa URL por uma que aponte para o nosso proprio servidor local.

## Por que interpolar e nao hardcodar

O instrutor demonstra que a URL tem duas partes:

1. **Parte fixa por ambiente:** `http://localhost:3333` — o protocolo, host e porta do servidor
2. **Parte dinamica por arquivo:** o `fileURL` — nome do arquivo com extensao (ex: `comprovante-abc123.pdf`)

Ao interpolar, voce mantem a estrutura da URL mas permite que o nome do arquivo mude conforme o registro que o usuario clicou. Se voce hardcodar a URL inteira, ela sempre apontara para o mesmo arquivo.

## O fluxo completo

1. O backend salva o arquivo em uma pasta (ex: `/uploads/`)
2. O backend retorna o nome do arquivo salvo (ex: `comprovante-12345.pdf`)
3. O frontend armazena esse nome em uma variavel (`fileURL`)
4. Quando o usuario clica em "Abrir comprovante", o frontend monta a URL: `http://localhost:3333/uploads/comprovante-12345.pdf`
5. O `window.open()` abre essa URL em uma nova aba
6. O backend serve o arquivo estatico dessa rota

## A importancia do teste manual

O instrutor mostra que antes de implementar no codigo, ele testa diretamente no navegador: digita `http://localhost:3333/uploads/nome-do-arquivo.ext` e verifica se o arquivo aparece. Isso confirma que:

- O servidor esta servindo arquivos estaticos corretamente
- O caminho `/uploads/` esta configurado
- O arquivo existe no disco

So depois dessa validacao manual ele implementa no codigo do frontend.

## Transicao para producao

Em desenvolvimento, a base e `http://localhost:3333`. Em producao, sera algo como `https://api.meusite.com.br`. Por isso a interpolacao e fundamental — voce muda apenas a variavel `baseURL` (idealmente via variavel de ambiente) e todo o restante continua funcionando.

## Edge cases

- **Arquivo nao encontrado:** Se o `fileURL` estiver incorreto ou o arquivo foi deletado, o navegador mostrara erro 404. O frontend deve tratar esse cenario.
- **Caracteres especiais no nome:** Nomes com espacos ou acentos devem ser encodados com `encodeURIComponent()` ou o backend deve normalizar os nomes ao salvar.
- **CORS:** Se o frontend e o backend estao em dominios diferentes, o backend precisa permitir CORS para a rota de uploads.