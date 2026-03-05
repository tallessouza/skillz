# Deep Explanation: Testes E2E para Criacao de Prompt

## Por que dados unicos sao criticos

O instrutor destaca um problema real: a regra de negocio impede titulos duplicados. Em testes E2E, que rodam contra o banco real, um titulo fixo como `"Meu Prompt"` vai funcionar na primeira execucao e falhar em todas as seguintes. A solucao e concatenar `Date.now()` ao titulo:

```typescript
const uniqueTitle = `e2e-prompt-${Date.now()}`
```

Isso garante unicidade por milissegundo. O instrutor menciona que validar o cenario de titulo duplicado (toast de erro) requer um prompt pre-existente com aquele nome — tema da aula seguinte.

## Sensibilidade dos testes E2E

O instrutor reforça o que foi discutido na aula sobre piramide de testes: testes E2E sao os mais sensiveis. Durante a aula, o teste falhou por "conexao resetada" — nao era bug no teste, era o servidor local instavel. Isso ilustra por que:

- E2E deve ser a camada mais fina da piramide
- Ambiente precisa estar estavel (Docker rodando, servidor na porta correta)
- Timeouts generosos (15s) sao necessarios para evitar falsos negativos

## O erro do `expect` nao importado

O instrutor cometeu o erro ao vivo: esqueceu de importar `expect` do `@playwright/test`. Consequencia:
1. O linter nao reclamou do `await` ausente (porque sem `expect`, a expressao nao retornava Promise)
2. O teste falhou em runtime com "expect is not defined"

Licao: sempre importe `{ test, expect }` juntos no inicio do arquivo.

## Navegacao direta vs. pela UI

O instrutor discute duas abordagens:
- **Pela UI:** acessar home → clicar "Novo Prompt" → preencher formulario
- **Direta:** `page.goto('/new')`

Ele escolhe a direta por simplicidade, mas reconhece que a abordagem pela UI testa mais da aplicacao. A escolha depende do objetivo do teste: se o foco e o formulario, va direto. Se o foco e o fluxo completo, navegue pela UI.

## Verificacao por toast

O feedback visual da aplicacao e um toast com a mensagem "prompt criado com sucesso". O instrutor usa `waitForSelector` com:
- `state: 'visible'` — garante que o toast esta visivel, nao apenas no DOM
- `timeout: 15_000` — 15 segundos de margem, embora localmente seja instantaneo

Essa abordagem e mais robusta que `expect(locator).toBeVisible()` para elementos transientes como toasts, porque `waitForSelector` espera ativamente o elemento aparecer.

## Confirmacao manual do resultado

Apos o teste passar, o instrutor faz um refresh manual na pagina e verifica que o prompt criado pelo teste aparece na lista. Isso demonstra que o teste E2E realmente criou dados no banco — nao e mock, nao e simulacao. E por isso que dados unicos importam.