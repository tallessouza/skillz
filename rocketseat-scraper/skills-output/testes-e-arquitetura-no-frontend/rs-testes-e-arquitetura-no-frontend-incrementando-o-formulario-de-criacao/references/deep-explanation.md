# Deep Explanation: Validacao de Formularios com Zod + React Hook Form

## Por que DTO primeiro?

O instrutor usa o termo **DTO (Data Transfer Object)** para o schema Zod. A ideia e que antes de construir qualquer UI, voce define o contrato de dados. Isso vem da arquitetura limpa — a camada de aplicacao define o que espera receber, e a UI apenas implementa esse contrato.

O DTO fica em `core/application/prompts/createPrompt.dto.ts`, nao no componente. Isso separa regras de negocio (validacao) da apresentacao (formulario).

## A cadeia de integracao

```
Zod Schema → z.infer (tipagem) → zodResolver (ponte) → useForm (estado) → FormField (binding) → FormControl (erro)
```

Cada elo tem uma responsabilidade:
- **Zod Schema**: define regras de validacao como dados
- **z.infer**: extrai o tipo TypeScript automaticamente (nao precisa definir interface separada)
- **zodResolver**: adapta o schema Zod para o formato que o React Hook Form entende
- **useForm**: gerencia estado do formulario (valores, erros, dirty, touched)
- **FormField**: conecta um campo especifico ao control do useForm via `name`
- **FormControl**: exibe mensagens de erro automaticamente quando a validacao falha

## Por que FormField e nao input direto?

O instrutor destaca que os componentes FormField, FormControl, FormItem do ShadCN/ui tem "integracao sensacional" com React Hook Form e Zod. Isso porque:

1. **FormField** recebe `control` e `name`, e via render props fornece o `field` object
2. **field** contem `onChange`, `onBlur`, `value`, `ref` — tudo que o input precisa
3. **FormControl** automaticamente renderiza a mensagem de erro do Zod quando a validacao falha
4. Voce nao precisa escrever nenhuma logica de exibicao de erro

## Server Component vs Client Component

O instrutor lembra que ao adicionar `useForm`, o componente precisa de `"use client"` no topo. React Hook Form usa hooks (`useState`, `useEffect` internamente), que so funcionam em client components no Next.js.

A estrategia e: o formulario e client component, mas a **action** de submit sera uma server action (abordada na proxima aula). Isso combina o melhor dos dois mundos — validacao rica no client, processamento seguro no server.

## Instalacao necessaria

```bash
npm install zod react-hook-form @hookform/resolvers
npx shadcn@latest add form
```

O `@hookform/resolvers` e o pacote que contem o `zodResolver`. O ShadCN `form` instala os componentes FormField, FormControl, FormItem, FormLabel, FormMessage.