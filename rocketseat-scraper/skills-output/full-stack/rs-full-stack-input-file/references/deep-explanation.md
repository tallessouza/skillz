# Deep Explanation: Input File

## Por que `enctype="multipart/form-data"` é obrigatório?

Quando um formulário HTML envia dados, o navegador precisa saber COMO codificar o corpo da requisição. O padrão é `application/x-www-form-urlencoded`, que transforma tudo em pares `chave=valor` — funciona para texto, mas arquivos binários não podem ser representados assim.

O `multipart/form-data` divide o corpo da requisição em "partes", cada uma com seus próprios headers. Cada arquivo vira uma parte separada com seu tipo MIME, nome original e conteúdo binário intacto.

**Sem o enctype correto:** o navegador envia apenas o NOME do arquivo como string. O backend recebe `fotoPerfil=minhafoto.jpg` — uma string inútil, sem o conteúdo do arquivo.

## GET vs POST para arquivos

O método GET coloca todos os dados na URL como query parameters. Arquivos binários não cabem em URLs (limite de ~2048 caracteres, sem suporte a binário). O que acontece na prática: o navegador envia apenas o nome do arquivo na URL.

O POST envia os dados no corpo da requisição HTTP, sem limite prático de tamanho (o servidor pode impor limites). Com `enctype="multipart/form-data"`, cada arquivo é transmitido em binário no corpo.

## Como o backend recebe

No backend (qualquer linguagem), o arquivo chega de forma diferente dos campos de texto:

- **Campos de texto:** acessíveis como `request.body.campo` ou equivalente
- **Arquivo único:** acessível via `request.file` ou `request.body.campo` dependendo do framework
- **Múltiplos arquivos:** o primeiro arquivo aparece como `value` do campo, mas existe uma propriedade `files` que contém TODOS os arquivos enviados

Isso é responsabilidade do backend/framework — no frontend HTML, basta garantir o enctype e method corretos.

## O atributo `accept` — filtragem no cliente

O `accept` não é validação de segurança — é UX. Ele configura o diálogo de seleção de arquivos do sistema operacional para mostrar apenas os tipos permitidos.

### Três formas de especificar:

1. **Tipo MIME genérico:** `image/*`, `video/*`, `audio/*` — aceita qualquer subtipo
2. **Tipo MIME específico:** `audio/mp3`, `image/png` — apenas aquele formato
3. **Extensão:** `.mkv`, `.pdf`, `.html` — filtra pela extensão do arquivo

### Combinações

Pode combinar múltiplos valores separados por vírgula:

```html
<input type="file" accept="image/*,.pdf,video/mp4" />
```

O navegador mostra qualquer imagem, PDFs e vídeos MP4.

**Importante:** o `accept` é apenas uma sugestão ao navegador. O usuário pode contornar selecionando "Todos os arquivos". Validação real deve acontecer no backend.

## O atributo `multiple`

Sem `multiple`, o input aceita exatamente um arquivo. O botão do navegador mostra "Choose file" (singular).

Com `multiple`, o usuário pode selecionar vários arquivos de uma vez (Ctrl+click ou Shift+click no diálogo). O botão mostra "Choose files" (plural) e indica quantos foram selecionados (ex: "3 files").