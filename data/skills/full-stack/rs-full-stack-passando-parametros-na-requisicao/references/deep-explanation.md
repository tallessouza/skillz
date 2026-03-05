# Deep Explanation: Passando Parâmetros na Requisição

## Por que parametrizar funções de fetch?

O instrutor parte de um cenário real: você já tem uma função que busca todos os produtos (`fetchProducts`). Agora precisa buscar um produto específico. A tentação seria copiar a função e trocar a URL manualmente — mas isso cria código duplicado e inflexível.

A solução é criar uma função que **recebe o ID como parâmetro** e usa **template literals** para interpolar esse valor na URL. Assim, uma única função serve para buscar qualquer produto.

## O fluxo mental do instrutor

1. **Comentar a função existente** — não deletar, porque ela ainda é útil. Apenas isolar para trabalhar na nova
2. **Criar função com nome descritivo** — `fetchProductById` comunica exatamente o que faz e o que espera receber
3. **Receber `id` como parâmetro** — torna a função genérica
4. **Usar template literal com crase** — `` `url/${id}` `` em vez de concatenação, porque:
   - É mais legível
   - Menos propenso a esquecer a barra `/`
   - Escala melhor com múltiplos parâmetros
5. **Demonstrar com IDs diferentes** — trocar de `1` para `3` na chamada mostra que a função é dinâmica

## Template literals vs concatenação

O instrutor menciona explicitamente a **crase** (backtick) e a **interpolação** com `${}`. Isso é fundamental porque:

- Concatenação: `"https://api.com/products/" + id` — fácil esquecer a barra
- Template literal: `` `https://api.com/products/${id}` `` — a barra é visível no contexto

## async/await como padrão

O instrutor menciona que **poderia usar `.then()`** mas escolhe `async/await`. As etapas são as mesmas de uma função de fetch normal:

1. `const response = await fetch(url)` — faz a requisição
2. `const data = await response.json()` — converte para JSON
3. Exibir ou retornar os dados

A única diferença em relação a buscar todos os produtos é a **URL dinâmica**.

## Insight pedagógico

O instrutor enfatiza que "as etapas em si são as mesmas" — o padrão de fetch não muda ao parametrizar. O que muda é apenas como a URL é construída. Isso reforça que fetch é um padrão composável: você aprende uma vez e adapta para diferentes cenários.

## Edge cases a considerar

- **ID inexistente:** a API pode retornar 404. Em produção, verificar `response.ok` antes de chamar `.json()`
- **ID como string vs número:** template literals convertem automaticamente, mas a API pode esperar formato específico
- **Múltiplos parâmetros:** o mesmo padrão escala — `fetchOrderByUserAndId(userId, orderId)` com `` `${baseUrl}/users/${userId}/orders/${orderId}` ``