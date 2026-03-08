---
name: rs-testes-e-criando-a-pagina-de-novo-prompt
description: "Applies Next.js page creation pattern with form components when building new routes with forms. Use when user asks to 'create a page', 'add a new route', 'build a form page', 'create prompt form', or 'add a new page with form' in Next.js App Router. Follows component extraction, ShadCN-style UI composition, and incremental form building. Make sure to use this skill whenever creating new Next.js pages with forms. Not for API routes, server actions, form validation, or styling-only tasks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: geral
  tags: [testing, next-js, react, server-actions, forms]
---

# Criando Pagina com Formulario no Next.js App Router

> Ao criar uma nova pagina com formulario, extraia o formulario para um componente proprio e construa incrementalmente: rota → componente → campos → estilizacao.

## Rules

1. **Crie a rota primeiro, valide o 404 sumiu** — `app/nova-rota/page.tsx` com conteudo minimo, porque confirmar navegacao antes de construir evita debugging de roteamento depois
2. **Extraia o formulario para componente dedicado** — `components/{dominio}/{dominio}-form.tsx`, porque paginas devem ser finas e formularios sao reutilizaveis
3. **Use composicao de componentes UI** — Input, Textarea, Button do sistema de design, porque consistencia visual e comportamental vem de componentes compartilhados
4. **Construa incrementalmente** — estrutura → campos → estilizacao → validacao, porque cada camada pode ser testada isoladamente
5. **Header do form contem acoes** — botoes de acao (salvar, copiar) ficam no header do formulario com justify-end, porque segue o padrao de toolbar de formulario

## Steps

### Step 1: Criar a rota

```typescript
// src/app/nova-rota/page.tsx
export default function NovaRotaPage() {
  return <PromptForm />
}
```

### Step 2: Criar o componente de formulario

```typescript
// src/components/prompts/prompt-form.tsx
export const PromptForm = () => {
  return (
    <form className="space-y-4">
      <header className="flex flex-wrap gap-2 items-center mb-6 justify-end">
        <Button type="submit" size="small">Salvar</Button>
      </header>

      <Input
        placeholder="Titulo do prompt"
        variant="transparent"
        size="large"
        autoFocus
      />

      <Textarea
        placeholder="Digite o conteudo do prompt"
        variant="transparent"
        size="large"
      />
    </form>
  )
}
```

### Step 3: Validar navegacao

Acessar a rota no browser e confirmar que o formulario renderiza sem 404.

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo de texto curto (titulo, nome) | Use `Input` com `autoFocus` no primeiro campo |
| Campo de texto longo (conteudo, descricao) | Use `Textarea` |
| Botoes de acao do formulario | Coloque no `header` do form, nao no footer |
| Variante sem borda/fundo | Use `variant="transparent"` |
| Pagina so exibe um formulario | Extraia para componente, pagina so importa |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Escrever form inteiro dentro de `page.tsx` | Extrair para `components/{dominio}/{dominio}-form.tsx` |
| Adicionar validacao e estilizacao juntos | Construir incrementalmente: estrutura → campos → estilo → validacao |
| Criar rota e campos sem testar navegacao | Criar rota minima, testar, depois adicionar campos |
| Colocar botao submit solto no final do form | Colocar em `header` com layout flex |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
