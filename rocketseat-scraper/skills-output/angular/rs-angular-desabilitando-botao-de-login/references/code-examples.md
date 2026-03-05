# Code Examples: Desabilitando Botao de Login

## Exemplo completo do template

```html
<button
  type="submit"
  [disabled]="loginResource.isLoading() || loginForm.invalid"
  class="w-full bg-purple-800 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-800"
>
  Entrar
</button>
```

### Detalhamento das classes Tailwind

| Classe | Funcao | Quando aplica |
|--------|--------|---------------|
| `w-full` | Largura 100% | Sempre |
| `bg-purple-800` | Cor de fundo base | Sempre |
| `hover:bg-purple-700` | Cor no hover | Apenas quando habilitado |
| `text-white` | Texto branco | Sempre |
| `font-bold` | Negrito | Sempre |
| `py-3` | Padding vertical | Sempre |
| `rounded-lg` | Bordas arredondadas | Sempre |
| `transition duration-200` | Transicao suave | Sempre |
| `cursor-pointer` | Cursor de mao | Quando habilitado |
| `disabled:opacity-50` | Opacidade reduzida | Quando disabled |
| `disabled:cursor-not-allowed` | Cursor proibido | Quando disabled |
| `disabled:hover:bg-purple-800` | Neutraliza hover | Quando disabled + hover |

## Variacao: com texto dinamico de loading

```html
<button
  type="submit"
  [disabled]="loginResource.isLoading() || loginForm.invalid"
  class="w-full bg-purple-800 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-800"
>
  @if (loginResource.isLoading()) {
    Carregando...
  } @else {
    Entrar
  }
</button>
```

## Variacao: com spinner icon

```html
<button
  type="submit"
  [disabled]="loginResource.isLoading() || loginForm.invalid"
  class="w-full bg-purple-800 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-800 flex items-center justify-center gap-2"
>
  @if (loginResource.isLoading()) {
    <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
    Entrando...
  } @else {
    Entrar
  }
</button>
```

## Padrao aplicado a outros contextos

### Botao de cadastro

```html
<button
  type="submit"
  [disabled]="registerResource.isLoading() || registerForm.invalid"
  class="... disabled:opacity-50 disabled:cursor-not-allowed"
>
  Cadastrar
</button>
```

### Botao de salvar configuracoes

```html
<button
  type="submit"
  [disabled]="saveSettingsResource.isLoading() || settingsForm.invalid || !settingsForm.dirty"
  class="... disabled:opacity-50 disabled:cursor-not-allowed"
>
  Salvar
</button>
```

Note a terceira condicao: `!settingsForm.dirty` — so habilita se o usuario mudou algo no formulario.