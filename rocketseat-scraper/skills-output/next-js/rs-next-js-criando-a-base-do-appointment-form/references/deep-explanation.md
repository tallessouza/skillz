# Deep Explanation: Criando a Base do Appointment Form

## Por que 'use client'?

No Next.js App Router, todos os componentes sao Server Components por padrao. O React Hook Form usa `useState`, `useEffect` e outras APIs que so existem no cliente. Sem a diretiva `"use client"`, o Next.js tentara renderizar o componente no servidor e falhara.

O instrutor enfatiza: "A gente vai precisar de algumas features que sao exclusivas do lado do cliente. O proprio React Hook Form, pra gente lidar com os nossos formularios, a gente precisa que ele seja executado no client."

Isso nao significa que toda a page precisa ser client — apenas o componente de formulario. A page que importa o `<AppointmentForm />` pode continuar sendo Server Component.

## Por que shadcn/ui Dialog?

O instrutor destaca a vantagem de usar o Dialog do shadcn/ui em vez de criar um modal do zero:

- **ESC fecha automaticamente** — acessibilidade built-in
- **Click fora fecha** — comportamento esperado pelo usuario
- **Gerenciamento de foco** — quando o dialog abre, o foco vai pra dentro; quando fecha, volta pro trigger
- **Espaco no botao de fechar** — apertar espaco no botao X ja fecha

"Por isso que e legal utilizar o shadcn/ui, ele traz todos esses componentes com toda essa parte de acessibilidade."

## Estrutura do Dialog

A hierarquia de componentes segue um padrao rigido:

```
Dialog (container, gerencia estado open/close)
├── DialogTrigger (botao que abre)
│   └── Button (com asChild, evita nested buttons)
└── DialogContent (o modal em si)
    ├── DialogHeader
    │   ├── DialogTitle (obrigatorio por acessibilidade)
    │   └── DialogDescription (contexto para screen readers)
    └── form (conteudo do formulario)
```

O `asChild` no DialogTrigger e crucial: sem ele, o Radix renderiza um `<button>` wrapper, e colocar um `<Button>` dentro resultaria em `<button><button>`, que e HTML invalido.

## Stack de dependencias escolhida

| Lib | Funcao | Por que essa? |
|-----|--------|---------------|
| react-hook-form | Gerenciamento de formulario | Performance (uncontrolled inputs), API declarativa |
| @hookform/resolvers | Bridge RHF ↔ Zod | Conecta schema de validacao ao form |
| zod | Schema de validacao | TypeScript-first, composavel, mensagens customizaveis |
| sonner | Toast notifications | Leve, bonito, facil de usar com Next.js |

## Variantes de Button

O instrutor menciona que ja tinha um componente Button com estilizacoes prontas e adicionou uma variante `brand`. No shadcn/ui, variantes sao definidas com `cva` (class-variance-authority) no arquivo `button.tsx`:

```tsx
const buttonVariants = cva("...", {
  variants: {
    variant: {
      default: "...",
      brand: "bg-brand-500 text-white hover:bg-brand-600",
      // outras variantes
    },
  },
})
```

O instrutor sugere consultar o commit da aula para ver as estilizacoes exatas, indicando que nao vale a pena gastar tempo digitando CSS quando o foco e a estrutura do componente.

## Abordagem incremental

O instrutor adota uma abordagem de esqueleto primeiro:
1. Cria o arquivo com estrutura minima
2. Instala dependencias
3. Monta o Dialog com trigger e content
4. Adiciona na page
5. Valida que abre/fecha corretamente
6. Nas proximas aulas: inputs, validacao com Zod, mascara de telefone, etc.

Isso e intencional — construir incrementalmente permite validar cada camada antes de adicionar complexidade.