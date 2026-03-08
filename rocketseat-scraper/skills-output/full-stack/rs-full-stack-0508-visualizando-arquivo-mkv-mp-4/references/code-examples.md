# Code Examples: Visualizando Arquivo no Frontend

## Exemplo basico da aula

O instrutor substituiu a URL de exemplo por uma interpolada:

```javascript
// ANTES: URL de exemplo hardcoded
const url = "https://exemplo.rocketseat.com.br/uploads/arquivo.pdf"

// DEPOIS: URL interpolada com base local
const baseURL = "http://localhost:3333"
const fileViewURL = `${baseURL}/uploads/${fileURL}`
window.open(fileViewURL)
```

## Variacao: Com variavel de ambiente

```javascript
// Em um projeto real, a base URL vem de config
const baseURL = process.env.API_URL || "http://localhost:3333"

function openFile(fileURL) {
  const fullURL = `${baseURL}/uploads/${fileURL}`
  window.open(fullURL, "_blank")
}
```

## Variacao: Em um botao HTML + JS vanilla

```html
<button id="btn-open-file" data-file="comprovante-123.pdf">
  Abrir comprovante
</button>

<script>
  const baseURL = "http://localhost:3333"

  document.getElementById("btn-open-file").addEventListener("click", (event) => {
    const fileURL = event.currentTarget.dataset.file
    const fullURL = `${baseURL}/uploads/${fileURL}`
    window.open(fullURL, "_blank")
  })
</script>
```

## Variacao: Em React

```jsx
function RefundItem({ refund }) {
  const baseURL = "http://localhost:3333"

  function handleOpenFile() {
    const fileViewURL = `${baseURL}/uploads/${refund.fileURL}`
    window.open(fileViewURL, "_blank")
  }

  return (
    <div>
      <span>{refund.description}</span>
      <button onClick={handleOpenFile}>Abrir comprovante</button>
    </div>
  )
}
```

## Variacao: Com tratamento de erro

```javascript
async function openFile(fileURL) {
  const baseURL = "http://localhost:3333"
  const fullURL = `${baseURL}/uploads/${fileURL}`

  try {
    const response = await fetch(fullURL, { method: "HEAD" })

    if (response.ok) {
      window.open(fullURL, "_blank")
    } else {
      alert("Arquivo não encontrado.")
    }
  } catch (error) {
    alert("Erro ao acessar o arquivo.")
  }
}
```

## Variacao: Com link em vez de window.open

```html
<a
  href="http://localhost:3333/uploads/comprovante-123.pdf"
  target="_blank"
  rel="noopener noreferrer"
>
  Abrir comprovante
</a>
```

Com interpolacao dinamica em JavaScript:

```javascript
const link = document.createElement("a")
link.href = `${baseURL}/uploads/${fileURL}`
link.target = "_blank"
link.rel = "noopener noreferrer"
link.click()
```

## Teste manual no navegador

Antes de implementar, valide no navegador:

```
http://localhost:3333/uploads/comprovante-12345.pdf
```

Se o arquivo aparecer, a rota de arquivos estaticos esta funcionando. Se der 404, verifique:
1. O middleware de arquivos estaticos esta configurado no Express (`app.use("/uploads", express.static("uploads"))`)
2. O arquivo existe na pasta `uploads/`
3. O nome do arquivo esta correto (case-sensitive em Linux)