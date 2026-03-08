---
name: rs-full-stack-0403-upload-do-arquivo-mp-4
description: "Enforces file upload best practices when sending files from frontend to a backend API using FormData and Axios. Use when user asks to 'upload a file', 'send image to API', 'submit form with file', 'use FormData', or 'handle file input'. Applies rules: always use FormData for file transport, match field name to API expectation, use API response filename instead of local name. Make sure to use this skill whenever implementing file upload flows between client and server. Not for drag-and-drop libraries, cloud storage (S3), or streaming uploads."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [upload, formdata, axios, file-input, frontend]
---

# Upload de Arquivo via FormData

> Ao enviar arquivos do frontend para a API, use FormData com o campo correto e sempre utilize o nome do arquivo retornado pela API.

## Rules

1. **Use FormData para transportar arquivos** — `new FormData()` com `.append()`, porque o arquivo esta na maquina do usuario e precisa ser serializado para envio HTTP
2. **O nome do campo no FormData deve corresponder ao que a API espera** — se a API espera `file`, use `file` no `.append()`, porque campo errado resulta em upload ignorado silenciosamente
3. **Use o filename retornado pela API, nao o nome local** — a API pode renomear o arquivo para evitar colisoes, entao o nome local pode nao corresponder ao arquivo armazenado
4. **Valide a existencia do arquivo antes do upload** — verifique se o usuario selecionou um arquivo antes de tentar enviar, porque enviar FormData vazio causa erros confusos
5. **Mantenha o estado do arquivo como o objeto File completo** — nao armazene apenas o nome, porque voce precisa do objeto inteiro para o FormData

## Prerequisites

- Axios ou fetch configurado para requisicoes HTTP
- API com rota de upload configurada (ex: `POST /uploads`)
- Input de arquivo no frontend capturando o File object via `onChange`

## Steps

### Step 1: Capturar o arquivo no estado

```typescript
const [file, setFile] = useState<File | null>(null)

// No onChange do input type="file"
function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
  const selectedFile = event.target.files?.[0]
  if (selectedFile) {
    setFile(selectedFile)
  }
}
```

### Step 2: Validar antes do envio

```typescript
if (!file) {
  alert("Selecione um arquivo de comprovante.")
  return
}
```

### Step 3: Criar FormData e anexar o arquivo

```typescript
const fileUploadForm = new FormData()
fileUploadForm.append("file", file)
```

### Step 4: Enviar para a API e usar o nome retornado

```typescript
const response = await api.post("/uploads", fileUploadForm)
const uploadedFilename = response.data.filename
```

### Step 5: Usar o filename da API nas operacoes seguintes

```typescript
// Use uploadedFilename para salvar no banco junto com outros dados
await api.post("/refunds", {
  description,
  amount,
  filename: uploadedFilename,
})
```

## Output format

O fluxo completo produz:
1. Arquivo armazenado no servidor (pasta de uploads)
2. Nome do arquivo retornado pela API (possivelmente renomeado)
3. Referencia ao arquivo salva no banco de dados

## Error handling

- Se o usuario nao selecionou arquivo → exibir alerta antes de tentar upload
- Se a API rejeitar o arquivo (tipo/tamanho invalido) → tratar erro do response
- Se o nome do campo no FormData estiver errado → o arquivo nao sera recebido pela API (verificar documentacao da rota)

## Verification

- Verificar no banco de dados (Prisma Studio) se o `filename` foi salvo corretamente
- Verificar na pasta de uploads do servidor se o arquivo existe
- Acessar o arquivo via rota estatica: `GET /uploads/{filename}`

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `formData.append("arquivo", file)` sem verificar nome do campo na API | Conferir o nome exato do campo que a API espera |
| Usar o nome local do arquivo para referenciar no banco | Usar `response.data.filename` retornado pela API |
| Enviar apenas o caminho/nome do arquivo como string | Enviar o objeto File completo via FormData |
| Ignorar validacao de arquivo antes do submit | Verificar `if (!file)` antes de criar FormData |
| Nomear estado como `fileName` quando armazena o File inteiro | Nomear como `file` e usar `setFile` para clareza |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Upload silenciosamente vazio | Nome do campo no FormData não corresponde ao esperado pela API | Verifique o nome exato do campo com a documentação da rota |
| `Network Error` no Axios | API não está rodando ou URL incorreta | Confirme que a API está acessível com `curl` |
| Arquivo não aparece no servidor | Estado `file` é null no momento do envio | Adicione validação `if (!file)` antes de criar o FormData |
| Nome do arquivo diferente do enviado | API renomeia arquivos para evitar colisões | Use `response.data.filename` retornado pela API |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre FormData, renomeacao de arquivos e integracao front-back
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes