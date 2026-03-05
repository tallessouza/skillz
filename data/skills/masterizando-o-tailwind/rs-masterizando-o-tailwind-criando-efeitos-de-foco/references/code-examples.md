# Code Examples: Efeitos de Foco no Tailwind

## 1. Input com wrapper — focus-within

### Componente Root (div wrapper)
```tsx
// Antes: sem estilo de foco
<div className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
  <input className="flex-1 border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-600" />
</div>

// Depois: focus-within com ring + border
<div className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-100">
  <input className="flex-1 border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-600 outline-none" />
</div>
```

**Pontos-chave:**
- `outline-none` vai no input (remove outline padrao)
- `focus-within:border-violet-300` vai na div (borda interna)
- `focus-within:ring-4 focus-within:ring-violet-100` vai na div (glow externo)

## 2. Select trigger — focus direto

```tsx
// O select trigger e o proprio elemento focavel, sem wrapper
<SelectTrigger className="outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100">
  <SelectValue />
</SelectTrigger>
```

**Diferenca:** nao precisa de `focus-within` porque o trigger E o elemento focavel.

## 3. Textarea — focus direto

```tsx
<textarea className="min-h-[120px] resize-y outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100" />
```

**Mesma logica:** textarea recebe foco diretamente, nao tem wrapper.

## 4. Tab trigger — group + focus-visible

```tsx
// O button recebe foco, mas o ring vai no span filho
<TabsTrigger className="group outline-none" value="tab1">
  <span className="rounded group-focus-visible:ring-2 group-focus-visible:ring-violet-400 group-focus-visible:ring-offset-4">
    Tab Text
  </span>
  {/* Motion div NAO recebe ring */}
  <motion.div className="absolute bottom-0 h-0.5 bg-violet-400" />
</TabsTrigger>
```

**Pontos-chave:**
- `group` no button (marca como ancestral de referencia)
- `group-focus-visible` no span (estiliza quando pai tem foco via teclado)
- `focus-visible` em vez de `focus` (evita ring ao clicar)
- `ring-offset-4` para espacamento entre texto e ring
- `rounded` para o ring acompanhar cantos arredondados

## 5. Comparacao focus vs focus-visible

```html
<!-- focus: ring aparece ao CLICAR e ao TAB -->
<button class="focus:ring-2 focus:ring-violet-400">
  Clicou? Ring. Tab? Ring.
</button>

<!-- focus-visible: ring aparece SOMENTE ao TAB -->
<button class="focus-visible:ring-2 focus-visible:ring-violet-400">
  Clicou? Nada. Tab? Ring.
</button>
```

## 6. Arvore de decisao em codigo

```tsx
// Pergunta 1: O elemento focavel E o que recebe o estilo?
//   SIM → use focus: ou focus-visible:
//   NAO → Pergunta 2

// Pergunta 2: O estilo vai no PAI ou no FILHO?
//   PAI → use focus-within: no pai
//   FILHO → use group no pai + group-focus-visible: no filho

// Pergunta 3: O elemento e clicavel (button, tab, link)?
//   SIM → use focus-visible (so teclado)
//   NAO (input, textarea) → use focus (sempre)
```