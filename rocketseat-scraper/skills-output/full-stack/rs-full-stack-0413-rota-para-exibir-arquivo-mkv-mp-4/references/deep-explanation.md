# Deep Explanation: Rota para Exibir Arquivo

## Por que `app.use` e nao `app.get`?

O instrutor enfatiza que nao se trata de um `app.get`. A diferenca e fundamental:

- `app.get("/upload", handler)` — responde apenas a `GET /upload` exatamente
- `app.use("/upload", express.static(dir))` — monta o middleware em `/upload` e serve QUALQUER arquivo dentro do diretorio, independente do nome ou extensao

Quando voce usa `app.use` com `express.static`, o Express automaticamente:
1. Recebe a requisicao (ex: `GET /upload/comprovante.jpg`)
2. Remove o prefixo `/upload`
3. Procura `comprovante.jpg` dentro do diretorio configurado
4. Retorna o arquivo com o Content-Type correto baseado na extensao
5. Retorna 404 se o arquivo nao existir

## Ordem de registro importa

O Express avalia middlewares na ordem em que sao registrados. Se voce registrar `express.static` depois das rotas dinamicas, uma rota dinamica pode capturar a requisicao antes.

O padrao correto e:
```
1. Middlewares de parsing (json, urlencoded)
2. Middlewares de arquivos estaticos (express.static)
3. Rotas dinamicas (routes)
4. Middleware de tratamento de erros
```

## Vantagem da configuracao centralizada

O instrutor destaca: "Veja como e bom ter separadinho as configuracoes, quanto a gente reaproveitou esses parametros."

O `uploadConfig` e importado de um arquivo de configuracao que define:
- O diretorio de destino dos uploads
- Possivelmente limites de tamanho, tipos permitidos, etc.

Ao centralizar, voce:
- Reutiliza o mesmo caminho no middleware de upload (Multer) e na rota estatica
- Muda o diretorio em um unico lugar se precisar
- Evita bugs por paths inconsistentes entre upload e servir

## Padrao de URL

A URL final para acessar um arquivo segue:
```
{BASE_URL}/{rota-estatica}/{nome-arquivo.extensao}
```

Exemplo concreto:
```
http://localhost:3333/upload/comprovante-abc123.jpg
```

Pontos importantes:
- O nome do arquivo deve ser exato, incluindo a extensao
- O nome normalmente vem da resposta do endpoint de upload (o campo `filename` retornado pelo Multer)
- O navegador renderiza imagens diretamente; outros tipos podem ser baixados

## Contexto no projeto

Esta rota complementa o fluxo de upload ja implementado:
1. Cliente envia arquivo via POST (Multer processa e salva)
2. API retorna o nome do arquivo salvo
3. Cliente monta a URL: `{BASE_URL}/upload/{filename}`
4. GET nessa URL retorna o arquivo estatico diretamente

No Insomnia, o instrutor cria uma requisicao GET chamada "show" (seguindo o padrao REST ja usado no projeto) para testar a visualizacao.