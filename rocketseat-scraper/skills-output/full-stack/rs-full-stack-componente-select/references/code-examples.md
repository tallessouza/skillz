# Code Examples: Componente Select

## Exemplo 1: Componente Input original (ponto de partida)

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  legend: string
}

function Input({ legend, type = "text", ...rest }: InputProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm text-gray-300">{legend}</legend>
      <input
        type={type}
        className="bg-gray-800 text-gray-100 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
        {...rest}
      />
    </fieldset>
  )
}
```

## Exemplo 2: Componente Select (resultado da duplicação)

```tsx
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  legend: string
  children: React.ReactNode
}

function Select({ legend, children, ...rest }: SelectProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm text-gray-300">{legend}</legend>
      <select
        className="bg-gray-800 text-gray-100 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
        {...rest}
      >
        <option value="" disabled hidden>
          Selecione
        </option>
        {children}
      </select>
    </fieldset>
  )
}
```

## Exemplo 3: Uso na página de Refund

```tsx
import { Input } from "./components/Input"
import { Select } from "./components/Select"

function Refund() {
  return (
    <form>
      <Input legend="Nome da solicitação" required />

      <Select legend="Categoria" required>
        <option value="food">Alimentação</option>
        <option value="transport">Transporte</option>
        <option value="accommodation">Hospedagem</option>
      </Select>
    </form>
  )
}
```

## Exemplo 4: CSS global para customizar o select (index.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Customização do tema (já existente) */
:root {
  --color-primary: #00b37e;
}

/* Customização do select */
select {
  appearance: none;
  background-image: url("./assets/chevron-down.svg");
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 1.25rem auto;
}
```

## Exemplo 5: Evolução — sem `hidden` vs com `hidden`

```tsx
{/* SEM hidden — "Selecione" aparece na lista dropdown */}
<option value="" disabled>Selecione</option>

{/* COM hidden — "Selecione" NÃO aparece na lista, mas funciona como placeholder */}
<option value="" disabled hidden>Selecione</option>
```

## Exemplo 6: Variação com opções dinâmicas

```tsx
const categories = [
  { value: "food", label: "Alimentação" },
  { value: "transport", label: "Transporte" },
  { value: "accommodation", label: "Hospedagem" },
]

<Select legend="Categoria" required>
  {categories.map((cat) => (
    <option key={cat.value} value={cat.value}>
      {cat.label}
    </option>
  ))}
</Select>
```

## Exemplo 7: Variação com optgroup

```tsx
<Select legend="Categoria" required>
  <optgroup label="Pessoal">
    <option value="food">Alimentação</option>
    <option value="transport">Transporte</option>
  </optgroup>
  <optgroup label="Trabalho">
    <option value="equipment">Equipamento</option>
    <option value="travel">Viagem</option>
  </optgroup>
</Select>
```

## Exemplo 8: Propriedades CSS da seta — passo a passo

```css
/* Passo 1: Remove aparência nativa (perde a seta) */
select {
  appearance: none;
}

/* Passo 2: Adiciona ícone SVG (repete por todo o fundo) */
select {
  appearance: none;
  background-image: url("./assets/chevron-down.svg");
}

/* Passo 3: Impede repetição (uma única seta) */
select {
  appearance: none;
  background-image: url("./assets/chevron-down.svg");
  background-repeat: no-repeat;
}

/* Passo 4: Posiciona à direita, centralizada verticalmente */
select {
  appearance: none;
  background-image: url("./assets/chevron-down.svg");
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
}

/* Passo 5: Define tamanho do ícone */
select {
  appearance: none;
  background-image: url("./assets/chevron-down.svg");
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 1.25rem auto;
}
```