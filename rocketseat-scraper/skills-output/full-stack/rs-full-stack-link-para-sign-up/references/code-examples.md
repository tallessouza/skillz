# Code Examples: Link Estilizado com Tailwind CSS

## Exemplo da aula — Link para SignUp

```tsx
// Contexto: logo abaixo do botão de login
<button className="...">Entrar</button>

<a
  href="/signup"
  className="text-sm font-semibold text-gray-100 mt-10 mb-4 text-center hover:text-green-800 transition ease-linear"
>
  Criar conta
</a>
```

## Variação: Link para login (em tela de signup)

```tsx
<a
  href="/signin"
  className="text-sm font-semibold text-gray-100 mt-10 mb-4 text-center hover:text-green-800 transition ease-linear"
>
  Já tenho conta
</a>
```

## Variação: Link com React Router

```tsx
import { Link } from "react-router-dom"

<Link
  to="/signup"
  className="text-sm font-semibold text-gray-100 mt-10 mb-4 text-center hover:text-green-800 transition ease-linear"
>
  Criar conta
</Link>
```

## Variação: Link com Next.js

```tsx
import Link from "next/link"

<Link
  href="/signup"
  className="text-sm font-semibold text-gray-100 mt-10 mb-4 text-center hover:text-green-800 transition ease-linear"
>
  Criar conta
</Link>
```

## Variação: Diferentes esquemas de cor

### Fundo escuro com hover azul
```tsx
<a
  href="/signup"
  className="text-sm font-semibold text-gray-300 mt-8 mb-4 text-center hover:text-blue-400 transition ease-linear"
>
  Criar conta
</a>
```

### Fundo claro com hover escuro
```tsx
<a
  href="/signup"
  className="text-sm font-semibold text-gray-600 mt-8 mb-4 text-center hover:text-gray-900 transition ease-linear"
>
  Criar conta
</a>
```

## Variação: Com underline no hover

```tsx
<a
  href="/signup"
  className="text-sm font-semibold text-gray-100 mt-10 mb-4 text-center hover:text-green-800 hover:underline transition ease-linear"
>
  Criar conta
</a>
```

## Variação: Com ícone

```tsx
<a
  href="/signup"
  className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-100 mt-10 mb-4 hover:text-green-800 transition ease-linear"
>
  <ArrowRightIcon className="w-4 h-4" />
  Criar conta
</a>
```

## Composição completa: Formulário de login com link

```tsx
<form className="flex flex-col gap-4">
  <input
    type="email"
    placeholder="E-mail"
    className="bg-gray-900 text-gray-100 rounded px-4 py-3"
  />
  <input
    type="password"
    placeholder="Senha"
    className="bg-gray-900 text-gray-100 rounded px-4 py-3"
  />

  <button
    type="submit"
    className="bg-green-800 text-white font-bold py-3 rounded hover:bg-green-700 transition ease-linear"
  >
    Entrar
  </button>

  <a
    href="/signup"
    className="text-sm font-semibold text-gray-100 mt-10 mb-4 text-center hover:text-green-800 transition ease-linear"
  >
    Criar conta
  </a>
</form>
```