# Code Examples: Continuando o Dashboard

## Exemplo base da aula

O instrutor constroi o dashboard passo a passo:

```tsx
// Estrutura basica do dashboard
function Dashboard() {
  return (
    <div className="min-w-[768px]">
      <h1 className="text-gray-100 font-bold text-xl flex-1">
        Solicitações
      </h1>
    </div>
  )
}
```

## Variacao: Dashboard com header completo

```tsx
function Dashboard() {
  return (
    <div className="min-w-[768px]">
      <div className="flex items-center mb-6">
        <h1 className="text-gray-100 font-bold text-xl flex-1">
          Solicitações
        </h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Nova solicitação
        </button>
      </div>

      {/* Conteudo do dashboard aqui */}
    </div>
  )
}
```

## Variacao: Diferentes tamanhos de titulo

```tsx
{/* Titulo principal da pagina */}
<h1 className="text-gray-100 font-bold text-xl flex-1">
  Solicitações
</h1>

{/* Subtitulo de secao */}
<h2 className="text-gray-300 font-semibold text-lg">
  Recentes
</h2>

{/* Titulo menor para cards */}
<h3 className="text-gray-400 font-medium text-base">
  Detalhes
</h3>
```

## Variacao: min-width com valores diferentes

```tsx
{/* Dashboard simples — menos colunas */}
<div className="min-w-[640px]">

{/* Dashboard padrao — tabela media */}
<div className="min-w-[768px]">

{/* Dashboard complexo — muitas colunas */}
<div className="min-w-[1024px]">

{/* Dashboard com tabela larga */}
<div className="min-w-[1280px]">
```

## Variacao: Container com scroll horizontal explicito

```tsx
{/* Wrapper que permite scroll horizontal */}
<div className="overflow-x-auto">
  <div className="min-w-[768px]">
    <h1 className="text-gray-100 font-bold text-xl flex-1">
      Solicitações
    </h1>
    {/* Tabela ou grid aqui */}
  </div>
</div>
```

## Composicao completa de utilitarios no titulo

```tsx
{/* Cada classe resolve uma dimensao independente */}
<h1
  className={[
    "text-gray-100",  // cor: cinza claro (tema escuro)
    "font-bold",       // peso: 700
    "text-xl",         // tamanho: 1.25rem
    "flex-1",          // layout: ocupa espaco restante
  ].join(" ")}
>
  Solicitações
</h1>
```