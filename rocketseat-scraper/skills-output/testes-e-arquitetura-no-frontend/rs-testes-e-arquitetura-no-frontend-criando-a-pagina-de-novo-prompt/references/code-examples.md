# Code Examples: Criando Pagina de Novo Prompt

## Exemplo 1: Estrutura da rota

```typescript
// src/app/nu/page.tsx (ou /new, /novo — depende da convencao do projeto)
export default function PromptNewPage() {
  return <PromptForm />
}
```

O nome da funcao exportada nao importa para o App Router — o que importa e o arquivo ser `page.tsx` dentro do diretorio correto.

## Exemplo 2: Componente PromptForm completo da aula

```typescript
// src/components/prompts/prompt-form.tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export const PromptForm = () => {
  return (
    <form className="space-y-4">
      <header className="flex flex-wrap gap-2 items-center mb-6 justify-end">
        <Button type="submit" size="small">
          Salvar
        </Button>
      </header>

      <Input
        placeholder="Titulo do prompt"
        variant="transparent"
        size="large"
        autoFocus
      />

      <Textarea
        placeholder="Digite o conteudo do prompt"
        variant="transparent"
        size="large"
      />
    </form>
  )
}
```

## Exemplo 3: Versao minima para validar rota

```typescript
// Primeiro passo — so para confirmar que o 404 sumiu
export default function PromptNewPage() {
  return (
    <div>
      <h2>Novo Prompt</h2>
    </div>
  )
}
```

## Exemplo 4: Padrao de header com multiplas acoes (futuro)

```typescript
<header className="flex flex-wrap gap-2 items-center mb-6 justify-end">
  <Button type="button" variant="outline" size="small">
    Copiar
  </Button>
  <Button type="submit" size="small">
    Salvar
  </Button>
</header>
```

O instrutor menciona que o header tera botao de copiar e salvar. Nesta aula so o salvar foi implementado.

## Estrutura de pastas resultante

```
src/
├── app/
│   └── nu/
│       └── page.tsx          # Rota /nu — importa PromptForm
└── components/
    └── prompts/
        └── prompt-form.tsx   # Formulario extraido
```