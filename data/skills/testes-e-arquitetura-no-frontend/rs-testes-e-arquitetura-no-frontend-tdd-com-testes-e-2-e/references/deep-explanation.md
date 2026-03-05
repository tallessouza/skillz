# Deep Explanation: TDD com Testes E2E

## Por que TDD com E2E funciona

O instrutor demonstra que TDD nao e exclusividade de testes unitarios. Com E2E, voce escreve o teste que simula o usuario final e deixa as falhas guiarem a implementacao. Cada erro do Playwright aponta exatamente o que falta construir.

## O ciclo revelado na aula

1. **Teste criado sem nenhuma infra existente** — nao tinha rota `/created/[id]`, nao tinha `findById`, nao tinha o form adaptado para edicao
2. **Primeira execucao falhou** — mas pelo motivo errado (servidor Next.js instavel, nao erro de teste). O instrutor destaca: "ele deu pau pelo motivo errado. Isso nao e falha do teste em si"
3. **Apos reiniciar o servidor**, o teste falhou corretamente (404 na rota)
4. **Implementacao incremental** — criar pagina → criar metodo no repository → adaptar formulario

## Insight sobre reutilizacao de formularios

O instrutor enfatiza: "a tela de edicao vai ser exatamente igual a tela de criacao. A unica diferenca e que, quando for edicao, eu preciso receber alguma coisa para ja deixar preenchido os campos."

Por isso o `PromptForm` recebe `prompt?: Prompt | null` — opcional porque criacao nao precisa, edicao sim.

## Tipagem de params no Next.js 15+

O instrutor destaca que params agora e uma Promise:

```typescript
type PromptPageProps = {
  params: Promise<{ id: string }>;
};
```

E o nome da propriedade dentro da Promise deve corresponder exatamente ao nome do segmento dinamico na pasta (`[id]` → `id`, `[slug]` → `slug`).

## Setup do teste: Prisma direto no banco

O teste cria dados diretamente via Prisma (nao via UI) para ter controle total do estado. Usa `Date.now()` para gerar nomes unicos e evitar colisoes entre execucoes. Faz `$disconnect()` antes de comecar a interacao com a UI.

## Verificacao pos-submit

O teste verifica multiplas coisas apos o submit:
- Toast de sucesso ("Prompt atualizado com sucesso")
- Heading atualizado com o novo titulo
- Input com o novo valor via `toHaveValue()` — uma alternativa ao `toBeVisible()` para campos de formulario