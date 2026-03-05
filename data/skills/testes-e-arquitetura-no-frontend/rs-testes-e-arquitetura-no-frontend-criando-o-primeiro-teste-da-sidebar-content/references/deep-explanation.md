# Deep Explanation: Primeiro Teste de Componente com Mock do Next.js

## Por que mockar o useRouter?

O instrutor explica que quando o teste executa, o ambiente Jest nao tem o runtime do Next.js. O `useRouter` e um hook que depende do App Router estar montado. Sem o mock, o teste falha com o erro "expected app-router to be mounted".

O conceito chave aqui e o de **test double** (duble de teste). O instrutor usa essa analogia: "Pense num duble de teste — ele e um objeto que se comporta e se parece com a sua contraparte real, que e a parte de producao." Ou seja, o mock substitui uma dependencia externa por uma versao simplificada que permite o teste rodar isoladamente.

No caso especifico, o componente `SidebarContent` importa `useRouter` de `next/navigation` e usa a funcao `push` dele. Entao o mock precisa retornar apenas isso — um objeto com `push` sendo uma `jest.fn()`.

## O caminho exato do mock

O instrutor enfatiza: "Ele tem que ser exatamente assim" — o path do `jest.mock` deve ser identico ao path do import no codigo de producao. Se o componente faz `import { useRouter } from 'next/navigation'`, o mock deve ser `jest.mock('next/navigation', ...)`. Copiar e colar e recomendado para evitar erros de digitacao.

## Roles implicitas do HTML semantico

Uma insight importante do instrutor: ao usar HTML semantico (como `<aside>`), voce ganha roles de acessibilidade implicitas de graca. Ele mostra como descobrir a role implicita consultando o MDN Web Docs — a tag `<aside>` tem role implicita `complementary`.

Isso significa que ao escrever HTML semantico, voce pode testar com `getByRole` sem precisar adicionar atributos `role` explicitos. E um ciclo virtuoso: HTML semantico → melhor acessibilidade → testes mais resilientes.

## Estrutura de arquivos de teste

O instrutor segue um padrao especifico:
- Testes ficam em `test/components/sidebar/sidebar-content.spec.tsx`
- Espelham a estrutura do codigo fonte: `components/sidebar/sidebar-content.tsx`
- Extensao `.spec.tsx` (nao `.test.tsx`)

## Por que testar renderizacao?

O primeiro teste parece simples — "o botao esta visivel?" — mas o instrutor explica que isso ja garante que:
1. A sidebar esta sendo renderizada
2. O botao "novo prompt" existe dentro dela
3. As dependencias externas estao sendo resolvidas corretamente
4. O componente nao quebra na montagem

Se qualquer uma dessas coisas falhar, o teste falha. E a base sobre a qual testes mais complexos (interacao, navegacao) serao construidos.

## toBeVisible vs toBeInTheDocument

O instrutor menciona ambos como opcoes validas. `toBeVisible()` e mais restritivo — verifica que o elemento esta no DOM E visivel (nao escondido por CSS). `toBeInTheDocument()` apenas verifica presenca no DOM. Para componentes de UI, `toBeVisible()` e geralmente mais apropriado.