# Deep Explanation: Upload de Arquivo via FormData

## Por que FormData e nao JSON?

Quando o usuario seleciona um arquivo no input, o arquivo esta na maquina local. Diferente de dados textuais que podem ser serializados em JSON, um arquivo binario precisa ser transportado como `multipart/form-data`. O `FormData` e a API nativa do browser que serializa dados nesse formato.

O Axios automaticamente detecta quando o body e um `FormData` e configura o header `Content-Type: multipart/form-data` — nao precisa configurar manualmente.

## O estado do arquivo: File object vs nome

Um erro comum e armazenar apenas `file.name` (string) no estado. O problema: quando voce precisa enviar o arquivo, a string nao contem os bytes do arquivo. O estado deve armazenar o objeto `File` completo, que contem:

- `name` — nome original do arquivo
- `size` — tamanho em bytes
- `type` — MIME type (ex: `image/jpeg`)
- Os bytes do arquivo em si

Por isso o instrutor corrigiu de `fileName`/`setFileName` para `file`/`setFile` — o nome anterior sugeria que era apenas uma string, mas na verdade e o arquivo inteiro.

## Por que usar o filename retornado pela API?

A API pode renomear o arquivo por diversos motivos:

1. **Evitar colisoes** — dois usuarios podem enviar `comprovante.jpg` ao mesmo tempo
2. **Sanitizacao** — remover caracteres especiais do nome
3. **Prefixo unico** — adicionar timestamp ou UUID para unicidade

No exemplo da aula, a API adiciona um sufixo ao nome original. Se o frontend usasse o nome local (`comprovante.jpg`) para salvar no banco, nao corresponderia ao arquivo real armazenado (`comprovante-abc123.jpg`). Por isso sempre use `response.data.filename`.

## O campo do FormData deve corresponder a API

A API define qual campo ela espera receber o arquivo. No exemplo:

```javascript
// A API espera o campo "file" (configurado no multer/upload middleware)
upload.single("file")
```

Entao no frontend:

```javascript
formData.append("file", file) // "file" deve ser exatamente o mesmo
```

Se voce usar um nome diferente (ex: `"arquivo"`, `"comprovante"`), a API nao encontrara o arquivo na requisicao e retornara erro ou simplesmente ignorara.

## Dica do .gitkeep

Pastas vazias sao ignoradas pelo Git. Se voce tem uma pasta `uploads/` que precisa existir no repositorio mas comeca vazia, adicione um arquivo `.gitkeep` dentro dela. Esse arquivo nao tem funcionalidade especial — e apenas uma convencao para forcar o Git a rastrear a pasta.

## Fluxo completo do upload

```
1. Usuario seleciona arquivo no <input type="file">
2. onChange captura o File object → armazena no estado
3. Usuario clica em enviar
4. Validacao: arquivo existe? dados preenchidos?
5. Cria FormData, anexa arquivo com campo correto
6. POST /uploads com FormData → API recebe, valida, salva, retorna filename
7. Usa filename retornado para salvar referencia no banco
8. Arquivo acessivel via GET /uploads/{filename}
```

## Visualizando o arquivo armazenado

A API expoe uma rota estatica para servir arquivos da pasta de uploads:

```
GET http://localhost:3333/uploads/{filename}
```

Isso permite que o frontend exiba o comprovante depois, usando esse URL como `src` de uma tag `<img>` ou como link de download.