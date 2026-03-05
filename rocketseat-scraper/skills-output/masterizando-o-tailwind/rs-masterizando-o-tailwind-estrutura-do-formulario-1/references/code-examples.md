# Code Examples: Estrutura do Formulario

## Exemplo completo da aula (page.tsx)

```tsx
{/* Dentro do page.tsx, abaixo do SettingsTabs */}

<div className="mt-6 flex flex-col">
  {/* Cabecalho do formulario */}
  <div className="flex items-center justify-between border-b border-zinc-200 pb-5">
    {/* Lado esquerdo: titulo e descricao */}
    <div className="space-y-1">
      <h2 className="text-lg font-medium text-zinc-900">Personal info</h2>
      <span className="text-sm text-zinc-500">
        Update your photo and personal details here.
      </span>
    </div>

    {/* Lado direito: botoes */}
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="settings"
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
      >
        Save
      </button>
    </div>
  </div>

  {/* Formulario */}
  <form id="settings" className="mt-6 flex w-full flex-col">
    {/* Campos serao adicionados nas proximas aulas */}
  </form>
</div>
```

## Atributo `form` do HTML — variacao

O atributo `form` funciona com qualquer tipo de botao associado a formularios:

```html
<!-- Submit de qualquer lugar da pagina -->
<button type="submit" form="my-form">Enviar</button>

<!-- Reset de qualquer lugar da pagina -->
<button type="reset" form="my-form">Limpar</button>

<!-- Form pode estar em qualquer posicao no DOM -->
<form id="my-form" action="/api/submit" method="POST">
  <input name="email" type="email" />
</form>
```

## Padrao de botao: classes base vs variantes

```tsx
// Classes BASE (compartilhadas)
const baseClasses = "rounded-lg px-4 py-2 text-sm font-semibold shadow-sm"

// Variante: Ghost/Outline (Cancel)
const ghostClasses = "border border-zinc-300 text-zinc-700 hover:bg-zinc-50"

// Variante: Primary (Save)
const primaryClasses = "bg-violet-600 text-white hover:bg-violet-700"
```

## Layout padding ajustado

O instrutor corrige o padding do layout durante a aula:

```tsx
// layout.tsx — antes
<div className="px-4">

// layout.tsx — depois (mais espaco lateral)
<div className="px-8">
```

## Estrutura flex hierarquica

```
div.mt-6.flex.flex-col          ← wrapper (vertical)
├── div.flex.justify-between    ← cabecalho (horizontal)
│   ├── div.space-y-1           ← titulo + descricao (vertical via space)
│   └── div.flex.gap-2          ← botoes (horizontal com gap)
└── form.mt-6.flex.w-full       ← formulario (vertical, largura total)
```