# Deep Explanation: PostGridCard — Grid Responsivo

## Por que separar o grid em componente?

O instrutor destaca que "a gente poderia fazer diretamente na página, mas vamos criar um componente à parte". A razao e separacao de responsabilidades: a pagina decide QUAIS posts mostrar, o grid decide COMO organizar visualmente. Isso permite reusar o grid em outras listagens (produtos, autores, etc.) sem duplicar logica de layout.

## Mobile first na pratica

O instrutor reforça: "lembra que a gente está fazendo mobile first". Isso significa:
- O valor DEFAULT das classes Tailwind e o mobile (sem prefixo)
- Breakpoints maiores (`sm:`, `md:`, `lg:`) ADICIONAM complexidade
- `grid-cols-1` e o baseline, nao uma excecao

### Progressao de breakpoints escolhida:
1. **Mobile** (default): 1 coluna — `grid-cols-1`
2. **Tablet** (`sm:`): 2 colunas — `sm:grid-cols-2`
3. **Desktop** (`lg:`): 3 colunas — `lg:grid-cols-3`

O instrutor usa `sm` para tablet e `lg` para desktop, pulando `md`. Isso simplifica e evita breakpoints desnecessarios.

## Children como ReactNode

O instrutor tipou `children` como `React.ReactNode` em uma interface separada (`PostGridCardProps`). Nao exportou a interface porque ela so e relevante internamente ao componente. Isso e um padrao comum: interfaces de props ficam no mesmo arquivo e nao sao exportadas a menos que outro componente precise referenciar o tipo.

## Gap de 24px

O gap de 24px (equivalente a `gap-6` no Tailwind) foi escolhido como espacamento entre cards. E um valor que funciona bem tanto em mobile (onde os cards empilham) quanto em desktop (onde ficam lado a lado).

## Espacamento header-grid

O instrutor adicionou `pb-14` (~56px) no header para criar separacao visual entre a zona de navegacao/busca e o grid de conteudo. Esse espacamento generoso evita que o grid "grude" no header e melhora a hierarquia visual da pagina.