# Deep Explanation: Schema de Formulario com Zod + React Hook Form

## Por que schema-first?

O instrutor segue um padrao claro: definir o schema Zod ANTES de qualquer JSX. Isso porque o schema e a single source of truth — o tipo TypeScript e inferido dele, o react-hook-form valida com ele, e os defaultValues sao tipados por ele. Qualquer mudanca no schema propaga automaticamente.

## Decisao de separar campos complexos

O instrutor explicitamente deixou `date` e `time` fora do schema inicial: "só esses aqui eu não estou mexendo com de data ainda. De data a gente vai trabalhar um pouquinho depois, porque aqui vai envolver mais algumas coisinhas, alguns detalhes que vão ser importantes."

Isso reflete um padrao de desenvolvimento incremental — comece com campos string simples, valide que o fluxo funciona end-to-end, depois adicione complexidade. Campos de data/hora geralmente precisam de date pickers, formatacao, timezone handling — misturar tudo de uma vez aumenta a superficie de bugs.

## O papel do zodResolver

O `zodResolver` do pacote `@hookform/resolvers/zod` e a ponte entre dois ecossistemas:
- **Zod**: define a forma e restricoes dos dados
- **react-hook-form**: gerencia estado, re-renders, e UX do formulario

Sem o resolver, voce teria que validar manualmente no `onSubmit` e mapear erros para cada campo. O resolver faz isso automaticamente — cada campo recebe seu erro especifico.

## Pacotes necessarios

O instrutor instalou: `react-hook-form`, `@hookform/resolvers` (zod ja estava instalado). Alem disso, usou o componente `Form` do shadcn/ui (`npx shadcn-ui@latest add form`).

Atencao: o shadcn/ui pode sobrescrever componentes existentes (como `button`). O instrutor alertou: "ele basicamente voltou o button do jeito que tava o default... em vez de dar yes, coloca no." Sempre revise o que o CLI do shadcn modifica.

## Padrao de estilizacao do botao (contexto)

Antes do schema, o instrutor estilizou o botao de "Novo Agendamento" com comportamento responsivo:
- **Mobile**: fixo no bottom, centralizado, com background colorido e padding
- **Desktop (md+)**: posicionado com auto margins, background transparente, sem padding extra

Usou classes Tailwind com breakpoint `md:` para a transicao.

## Customizacao do Dialog (shadcn/ui)

O instrutor sobrescreveu estilos do Dialog do shadcn/ui para seguir o Figma:
- `variant="appointment"` no DialogContent
- `overlay="blurred"` para blur no fundo
- `showCloseButton={true}`
- `size="modal"` no DialogTitle e DialogDescription

Essas sao propriedades customizadas adicionadas ao componente — nao sao padrao do shadcn.

## Fluxo completo: Schema → Tipo → useForm → JSX

```
1. z.object({ ... })           → Define restricoes
2. z.infer<typeof schema>      → Gera tipo TypeScript
3. useForm<Type>({ resolver }) → Conecta validacao
4. form.handleSubmit(onSubmit) → Executa com dados validados
5. form.register("field")     → Conecta input ao estado
```