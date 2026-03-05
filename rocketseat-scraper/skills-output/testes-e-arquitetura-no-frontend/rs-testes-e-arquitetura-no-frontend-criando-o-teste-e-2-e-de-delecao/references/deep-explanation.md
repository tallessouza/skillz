# Deep Explanation: Teste E2E de Deleção com Playwright

## Por que seed direto no banco?

O instrutor enfatiza que o teste precisa ser **repetível** (repeatable). Se o teste depende de dados pré-existentes no banco, ele falha na segunda execução ou em ambientes limpos. A solução é criar o dado necessário via Prisma diretamente no banco antes de cada teste, e usar um título único com timestamp para evitar colisões.

O padrão é:
1. Conectar ao banco via PrismaPg adapter
2. Criar o registro necessário
3. Desconectar imediatamente
4. Só então iniciar a interação com a UI

## A armadilha do `getByRole('listItem')`

O instrutor encontrou um bug ao vivo: buscou por `getByRole('listItem')` com o nome do título, mas o Playwright não encontrou. O motivo: o título está dentro de um `<h3>` (heading) dentro de um `<li>`. O `listItem` não expõe diretamente o texto do heading como seu nome acessível.

A solução em dois passos:
1. **Para verificar visibilidade:** use `getByRole('heading', { name: uniqueTitle })` — busca semântica direta
2. **Para interagir com botões dentro do card:** use `getByRole('listItem').filter({ hasText: uniqueTitle })` — filtra o list item pelo texto contido, depois navega dentro dele com `.getByRole('button', ...)`

## Pirâmide de testes aplicada

O instrutor faz uma reflexão importante sobre a pirâmide de testes ao final:

- **Base (unit tests):** muitos cenários, cobrem lógica isolada de deleção
- **Meio (integration tests):** testam a comunicação entre componentes e API
- **Topo (E2E):** apenas o cenário de sucesso, porque os edge cases já estão cobertos abaixo

A decisão de cobrir **apenas sucesso** no E2E não é preguiça — é estratégia. Testes E2E são lentos e frágeis. Se a lógica de erro já está testada em unit e integration, duplicar no E2E é desperdício.

## O fluxo de confirmação em modal

O padrão de deleção com modal segue:
1. Clicar no botão "remover prompt" dentro do card
2. Modal de confirmação aparece
3. Clicar em "confirmar remoção" no modal
4. Verificar toast "prompt removido com sucesso"
5. Verificar que o item não existe mais na lista

O instrutor usa `toHaveCount(0)` ao invés de `not.toBeVisible()` para a verificação final — isso é mais determinístico porque `toBeVisible` pode ter race conditions com animações de saída.

## Timeout customizado

O instrutor mostra que é possível definir um timeout customizado no `toBeVisible()`:
```typescript
await expect(heading).toBeVisible({ timeout: 15000 });
```

Isso não significa que o teste vai esperar 15 segundos — é o **máximo**. Se o elemento aparecer em 1 segundo, o teste continua imediatamente. É uma proteção contra ambientes lentos (CI, cold starts do Next.js).