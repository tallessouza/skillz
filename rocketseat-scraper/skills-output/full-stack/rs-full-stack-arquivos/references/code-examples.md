# Code Examples: Arquivos — Do Físico ao Virtual

## Extensoes comuns em projetos web

### Estrutura tipica de um projeto web

```
meu-projeto/
├── index.html          # .html — estrutura da pagina
├── styles.css          # .css — estilos visuais
├── app.js              # .js — logica e comportamento
├── package.json        # .json — configuracao do projeto
├── .env                # sem extensao visivel — variaveis de ambiente
├── README.md           # .md — documentacao em Markdown
├── assets/
│   ├── logo.png        # .png — imagem com transparencia
│   ├── hero.jpg        # .jpg — fotografia comprimida
│   ├── icon.svg        # .svg — imagem vetorial
│   └── intro.mp4       # .mp4 — video
└── .gitignore          # arquivo que lista o que o Git deve ignorar
```

### Categorias de extensoes por funcao

```
DOCUMENTOS:
  .pdf    → Portable Document Format (somente leitura)
  .docx   → Microsoft Word (editavel)
  .txt    → Texto puro (sem formatacao)

IMAGENS:
  .jpg    → Fotos (compressao com perda)
  .png    → Imagens com transparencia (compressao sem perda)
  .svg    → Vetores (escalaveis, baseados em XML)
  .webp   → Formato moderno para web (menor tamanho)
  .gif    → Animacoes simples

VIDEOS:
  .mp4    → Video comprimido (mais compativel)
  .webm   → Video otimizado para web

AUDIOS:
  .mp3    → Audio comprimido (mais compativel)
  .ogg    → Audio open-source
  .wav    → Audio sem compressao (alta qualidade)

CODIGO:
  .html   → Estrutura de paginas web
  .css    → Estilos visuais
  .js     → JavaScript (logica)
  .ts     → TypeScript (JavaScript com tipos)
  .jsx    → React components
  .json   → Dados estruturados

CONFIGURACAO:
  .env    → Variaveis de ambiente
  .yaml   → Configuracao legivel
  .toml   → Configuracao estruturada
  .lock   → Versoes travadas de dependencias
```

### Input de upload com filtro por extensao

```html
<!-- Aceitar apenas imagens -->
<input type="file" accept=".jpg,.jpeg,.png,.webp,.gif">

<!-- Aceitar apenas PDFs -->
<input type="file" accept=".pdf">

<!-- Aceitar apenas videos -->
<input type="file" accept=".mp4,.webm">

<!-- Aceitar qualquer imagem (via MIME type) -->
<input type="file" accept="image/*">
```

### Verificando extensao de arquivo em JavaScript

```javascript
// Extrair extensao de um nome de arquivo
const fileName = "relatorio-anual.pdf"
const extension = fileName.split('.').pop() // "pdf"

// Validar extensao antes de processar
const allowedExtensions = ["jpg", "jpeg", "png", "webp"]
const fileExtension = uploadedFile.name.split('.').pop().toLowerCase()

if (!allowedExtensions.includes(fileExtension)) {
  throw new Error(`Formato .${fileExtension} nao permitido. Use: ${allowedExtensions.join(', ')}`)
}
```

### MIME types correspondentes (servidor)

```javascript
// Mapeamento extensao → MIME type
const mimeTypes = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.pdf':  'application/pdf',
  '.jpg':  'image/jpeg',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.mp4':  'video/mp4',
  '.mp3':  'audio/mpeg',
}
```

### O ciclo arquivo-aplicativo em codigo

```javascript
// 1. Voce ESCREVE codigo em arquivos (.js)
// 2. Node.js INTERPRETA esses arquivos
// 3. O resultado e um SERVIDOR (aplicativo)
// 4. Esse servidor SERVE outros arquivos (imagens, PDFs, etc.)

import express from 'express'

const app = express()

// O servidor (criado por arquivos .js) serve outros arquivos
app.use('/assets', express.static('public'))

// Interpretar um arquivo PDF enviado pelo usuario
app.post('/upload', (request, response) => {
  const file = request.file
  // file.originalname → "contrato.pdf"
  // file.mimetype → "application/pdf"
  // file.size → 245760 (bytes)
})
```