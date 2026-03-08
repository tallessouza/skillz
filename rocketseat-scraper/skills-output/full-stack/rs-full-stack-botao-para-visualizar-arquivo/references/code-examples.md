# Code Examples: Botão para Visualizar Arquivo

## Exemplo 1: Condicional completo por parâmetro de rota

```tsx
import fileSvg from "../assets/file.svg"

// Dentro do componente da página
const { id } = params

// Renderização condicional baseada no parâmetro
{id ? (
  <a
    href="https://www.rocketseat.com.br"
    target="_blank"
    className="text-sm text-green-500 font-semibold flex items-center justify-center gap-2 my-6 hover:opacity-70 transition ease-linear"
  >
    <img src={fileSvg} alt="Ícone de arquivo" />
    Abrir comprovante
  </a>
) : (
  <UploadComponent />
)}
```

## Exemplo 2: Variação com URL dinâmica do comprovante

```tsx
// Em produção, o href aponta para o arquivo real
{params.id ? (
  <a
    href={`/api/receipts/${params.id}/file`}
    target="_blank"
    className="text-sm text-green-500 font-semibold flex items-center justify-center gap-2 my-6 hover:opacity-70 transition ease-linear"
  >
    <img src={fileSvg} alt="Ícone de arquivo" />
    Abrir comprovante
  </a>
) : (
  <button
    type="submit"
    className="bg-green-500 text-white rounded-lg py-3 px-6 font-semibold hover:bg-green-600 transition"
  >
    Enviar
  </button>
)}
```

## Exemplo 3: Página completa com modo dual

```tsx
import fileSvg from "../assets/file.svg"

interface PageProps {
  params: { id?: string }
}

export default function RefundPage({ params }: PageProps) {
  const isViewMode = !!params.id

  return (
    <form>
      {/* Campos do formulário */}
      <input
        type="text"
        name="description"
        readOnly={isViewMode}
        className={isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}
      />

      <input
        type="text"
        name="amount"
        readOnly={isViewMode}
        className={isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}
      />

      {/* Ação condicional */}
      {isViewMode ? (
        <a
          href={`/api/receipts/${params.id}/file`}
          target="_blank"
          className="text-sm text-green-500 font-semibold flex items-center justify-center gap-2 my-6 hover:opacity-70 transition ease-linear"
        >
          <img src={fileSvg} alt="Ícone de arquivo" />
          Abrir comprovante
        </a>
      ) : (
        <button
          type="submit"
          className="bg-green-500 text-white rounded-lg py-3 w-full font-semibold"
        >
          Enviar
        </button>
      )}

      {/* Botão de navegação também muda */}
      {isViewMode ? (
        <button
          type="button"
          onClick={() => history.back()}
          className="text-gray-400 text-sm mt-2"
        >
          Voltar
        </button>
      ) : null}
    </form>
  )
}
```

## Exemplo 4: Estilização progressiva do hover

```tsx
// Hover muito forte (descartado pelo instrutor)
className="hover:opacity-50"

// Hover sutil (escolha final)
className="hover:opacity-70 transition ease-linear"

// Alternativa com scale sutil
className="hover:opacity-80 hover:scale-105 transition ease-linear"
```

## Exemplo 5: Importação e uso de ícone SVG

```tsx
// Importação como asset (caminho relativo)
import fileSvg from "../assets/file.svg"

// Uso com img tag + alt text
<img src={fileSvg} alt="Ícone de arquivo" />

// Variação: SVG inline para controle de cor
<svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
  <path d="..." />
</svg>
```

## Exemplo 6: Configuração de rotas que afeta a condicional

```tsx
// router.tsx ou similar
const routes = [
  {
    path: "/manager/:id",  // Com id → modo visualização
    element: <RefundPage />
  },
  {
    path: "/employees",     // Sem id → modo criação/upload
    element: <RefundPage />
  }
]
```

## Exemplo 7: Classes Tailwind decompostas

```tsx
// Cada classe tem um propósito específico:
const linkClasses = [
  "text-sm",           // Tamanho do texto
  "text-green-500",    // Cor verde (ação positiva)
  "font-semibold",     // Peso da fonte
  "flex",              // Flexbox container
  "items-center",      // Alinhamento vertical
  "justify-center",    // Alinhamento horizontal
  "gap-2",             // Espaço entre ícone e texto
  "my-6",              // Margem vertical
  "hover:opacity-70",  // Feedback no hover
  "transition",        // Habilita transições CSS
  "ease-linear",       // Curva de animação linear
].join(" ")

<a href={url} target="_blank" className={linkClasses}>
  <img src={fileSvg} alt="Ícone de arquivo" />
  Abrir comprovante
</a>
```