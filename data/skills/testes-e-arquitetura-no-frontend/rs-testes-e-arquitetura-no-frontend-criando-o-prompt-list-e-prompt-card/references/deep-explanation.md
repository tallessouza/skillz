# Deep Explanation: PromptList e PromptCard

## Por que centralizar tipos no dominio?

O instrutor destaca um cenario real: o componente Sidebar ja tinha uma tipagem `{ id: string; title: string; content: string }` definida localmente. Ao criar o PromptList, seria necessario copiar essa mesma tipagem. O problema: se o campo `id` mudar de `string` para `number`, ou se um novo campo for adicionado, cada copia precisa ser atualizada manualmente. Nao existe fonte unica da verdade.

A solucao e criar uma pasta `src/core/domain/prompts/` com a entidade completa (`Prompt`) e tipos derivados (`PromptSummary`). Isso segue o principio de Clean Architecture onde o dominio e independente e centralizado.

## Pick vs Omit

O instrutor menciona que tanto `Pick` quanto `Omit` funcionam para criar `PromptSummary`. A escolha depende de quantos campos voce quer vs quantos quer excluir:
- **Pick** quando quer poucos campos de muitos
- **Omit** quando quer quase todos menos alguns

## Responsabilidade unica do PromptList

O instrutor enfatiza: "a unica responsabilidade dele vai ser renderizar. So isso." Quem busca os dados e a Sidebar, que repassa via props. Isso facilita testes (nao precisa mockar fetch) e reuso (qualquer pai pode usar o PromptList).

## O poder dos testes na refatoracao

Ao extrair o PromptList da Sidebar, o instrutor roda os testes da Sidebar e todos passam. Ele comenta: "Esse e o poder da refatoracao, ne? E o poder dos testes e como os testes ajudam a gente a refatorar o nosso projeto." A confianca para mover codigo vem diretamente da cobertura de testes existente.

## PromptCard como unidade de interacao

O Card nao e so visual — ele encapsula:
1. **Link** para pagina de detalhes (`/${prompt.id}`)
2. **Delete** via server action (implementado na proxima aula)
3. **Prefetch** do Next.js para navegacao rapida

Essa separacao List/Card permite testar cada funcionalidade isoladamente.

## Estrutura de pastas core/domain

```
src/
  core/
    domain/
      prompts/
        prompt-entity.ts    # Entidade + tipos derivados
  components/
    prompt/
      prompt-list.tsx
      prompt-card.tsx
      index.ts              # Barrel export
```

Essa estrutura separa o "o que e" (domain) do "como mostra" (components).