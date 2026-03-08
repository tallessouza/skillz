# Deep Explanation: Entendendo as Informações do Arquivo

## Por que pasta temporaria antes da final?

O instrutor explica um padrao fundamental de upload: o Multer intercepta a requisicao **antes** de chegar na controller. Isso significa que quando seu codigo na controller executa, o arquivo ja esta salvo em disco.

O problema: se voce salvar direto na pasta final e depois descobrir que o arquivo e invalido (tipo errado, tamanho grande demais), voce ja "poluiu" a pasta de producao com lixo.

A solucao: usar duas pastas:
- `tmp/` — pasta temporaria onde o Multer deposita o arquivo
- `tmp/uploads/` — pasta final para onde o arquivo validado e movido

O fluxo completo:
1. Usuario faz POST com arquivo
2. Multer (middleware) intercepta antes da controller
3. Multer salva arquivo na `tmp/`
4. Controller executa e recebe `request.file` com metadados
5. Controller valida tipo e tamanho
6. Se invalido → deleta de `tmp/`
7. Se valido → move de `tmp/` para `tmp/uploads/`

## Anatomia do request.file

Quando o Multer processa um upload com `upload.single("file")`, ele injeta no `request` um objeto `file` com estas propriedades:

- **fieldname**: nome do campo no formulario (ex: `"file"`)
- **originalname**: nome original do arquivo no computador do usuario (ex: `"comprovante.jpg"`)
- **encoding**: codificacao do arquivo (ex: `"7bit"`)
- **mimetype**: formato MIME do arquivo (ex: `"image/jpeg"`)
- **destination**: pasta onde foi salvo (ex: caminho da `tmp/`)
- **filename**: nome gerado pelo Multer (ex: `"a1b2c3d4e5f6g7h8i9j0-comprovante.jpg"`)
- **path**: caminho completo do arquivo salvo
- **size**: tamanho em bytes

## MIME types e a estrategia do array

O instrutor destaca o padrao dos MIME types: `image/jpeg`, `image/png`, `image/jpg`. Ele cria um array constante com os tipos aceitos porque isso permite usar `includes()` — um metodo de array que retorna `true` ou `false`.

```javascript
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"]

// Limpo e extensivel
if (!ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
  // rejeitar
}
```

Isso e muito mais legivel do que:
```javascript
if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png" && ...) {
```

E tambem facilita adicionar novos tipos — basta adicionar ao array.

## Hash para nomes unicos

O problema: dois usuarios podem subir `foto.jpg`. Se o segundo sobrepoe o primeiro, dados sao perdidos silenciosamente.

A solucao do instrutor: `crypto.randomBytes(10).toString("hex")` gera 10 bytes aleatorios em hexadecimal (20 caracteres). Concatenado com tracinho e nome original:

```
a1b2c3d4e5f6g7h8i9j0-comprovante.jpg
```

Por que manter o nome original? Para que ao inspecionar a pasta, voce ainda consiga identificar o que o arquivo era originalmente. O hash garante unicidade, o nome original garante legibilidade.

## Calculo de tamanho em bytes

O instrutor faz questao de explicar a matematica:
- 1 KB = 1024 bytes (nao 1000 — sistema binario)
- 1 MB = 1024 × 1024 bytes = 1024² bytes = 1.048.576 bytes
- 3 MB = 1024 × 1024 × 3 = 3.145.728 bytes

A propriedade `size` do `request.file` vem em bytes. O `limits.fileSize` do Multer tambem espera bytes. Por isso a conta:

```javascript
const MAX_SIZE = 1024 * 1024 * 3 // 3 MB em bytes
```

O instrutor reforça: "voce nao precisa decorar a continha, mas precisa entender o porque". O ponto e que estamos convertendo para a mesma unidade de grandeza para a comparacao funcionar.

## __dirname para caminhos dinamicos

O instrutor usa `__dirname` (variavel do Node.js que retorna o diretorio do arquivo atual) combinado com `path.resolve()` para criar caminhos absolutos dinamicos:

```javascript
const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp")
```

Isso funciona independente de onde o projeto esta instalado no sistema de arquivos. Se voce hardcodar `/home/user/projeto/tmp`, o codigo quebra em outra maquina.

## Por que constantes centralizadas

O instrutor cria todas as configuracoes (pasta temporaria, pasta final, tamanho maximo, tipos aceitos) em um unico arquivo de configuracao. Ele explica: "fica mais organizado, fica mais obvio".

Vantagens:
- Um unico lugar para mudar quando precisar ajustar limites
- Nomes descritivos documentam a intencao (`MAX_FILE_SIZE_IN_MB` vs `3145728`)
- Reutilizavel em validacao, em rotas, em cleanup scripts