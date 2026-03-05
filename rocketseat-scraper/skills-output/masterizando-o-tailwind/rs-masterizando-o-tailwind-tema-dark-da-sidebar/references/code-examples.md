# Code Examples: Tema Dark com Tailwind CSS

## 1. Sidebar Root

```tsx
// Container principal da sidebar
// bg-white + border claro no light, zinc-900 + border mais escuro no dark
<aside className="border-r border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
```

## 2. Logo com dark variant

```tsx
// Logo SVG que muda cor no dark mode
<Logo className="text-zinc-900 dark:text-zinc-100" />
```

## 3. Input completo com twMerge

```tsx
import { twMerge } from 'tailwind-merge'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  return (
    <input
      className={twMerge(
        // Base styles
        'w-full border border-zinc-300 bg-transparent px-3 py-2 text-zinc-900 placeholder-zinc-600 rounded-lg shadow-sm',
        // Focus states
        'focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-100',
        // Dark theme
        'dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400',
        // Dark focus states
        'dark:focus-within:border-violet-500 dark:focus-within:ring-violet-500/10',
        // External overrides
        props.className,
      )}
      {...props}
    />
  )
}
```

## 4. Nav Item

```tsx
// Item de navegacao do menu lateral
<a className={twMerge(
  'flex items-center gap-3 rounded px-3 py-2',
  'text-zinc-700 hover:bg-zinc-100',
  'dark:text-zinc-100 dark:hover:bg-zinc-800',
)}>
  <Icon className="h-5 w-5 text-zinc-500 dark:text-zinc-600" />
  <span className="group-hover:text-violet-500 dark:group-hover:text-violet-300">
    {label}
  </span>
</a>
```

## 5. Used Space Widget

```tsx
// Widget de espaco utilizado
<div className="rounded-lg bg-violet-50 px-4 py-5 dark:bg-zinc-800">
  <h3 className="text-sm font-medium text-violet-700 dark:text-zinc-100">
    Used space
  </h3>
  <p className="mt-1 text-sm text-violet-500 dark:text-zinc-400">
    Your team has used 80% of your available space.
  </p>

  {/* Progress bar */}
  <div className="mt-3 h-2 rounded-full bg-violet-100 dark:bg-zinc-600">
    <div className="h-2 w-4/5 rounded-full bg-violet-600 dark:bg-violet-400" />
  </div>

  {/* Actions */}
  <div className="mt-3 flex items-center gap-3">
    <button className="text-sm font-medium text-violet-500 hover:text-violet-700 dark:text-violet-300">
      Dismiss
    </button>
    <button className="text-sm font-medium text-violet-700 hover:text-violet-900 dark:text-zinc-300">
      Upgrade plan
    </button>
  </div>
</div>
```

## 6. Profile Section

```tsx
// Secao de perfil do usuario
<div className="flex items-center gap-3">
  <img src={avatarUrl} className="h-10 w-10 rounded-full" />
  <div className="flex flex-col truncate">
    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-100">
      {userName}
    </span>
    <span className="truncate text-sm text-zinc-500 dark:text-zinc-400">
      {userEmail}
    </span>
  </div>
</div>
```

## 7. Ghost Button variant com dark

```tsx
// Variante ghost de botao — hover invertido no dark
<button className={twMerge(
  'rounded p-2 text-zinc-500 hover:bg-zinc-50',
  'dark:text-zinc-400 dark:hover:bg-zinc-800',
)}>
  <LogOut className="h-5 w-5" />
</button>
```

## 8. Padrao completo de hierarquia de cores

```
Light mode:
  bg-white → bg-zinc-50 (hover) → border-zinc-200 → text-zinc-900/700/500

Dark mode:
  bg-zinc-900 → bg-zinc-800 (hover/elevated) → border-zinc-700/800 → text-zinc-100/400/600
```