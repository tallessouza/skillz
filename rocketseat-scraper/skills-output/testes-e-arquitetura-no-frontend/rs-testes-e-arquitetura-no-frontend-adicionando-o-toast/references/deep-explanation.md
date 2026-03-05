# Deep Explanation: Toast Feedback e Testes de Repository Prisma

## Por que toasts e nao alerts ou console.log?

O instrutor destaca que a aplicacao estava funcionando — o prompt era criado, aparecia na sidebar — mas o usuario nao recebia nenhum feedback visual imediato. O `console.log` so e visivel para desenvolvedores. O toast e uma notificacao nao-intrusiva que aparece e desaparece automaticamente, sem bloquear a interacao do usuario (diferente de `window.alert`).

A escolha do **Sonner** como biblioteca de toast e pragmatica: e leve, tem API simples (`toast.error()`, `toast.success()`), e requer configuracao minima (um `<Toaster />` no layout).

## Posicionamento do Toaster

O instrutor escolhe `position="top-right"` deliberadamente — e o padrao mais comum em aplicacoes web modernas, porque o canto superior direito nao interfere com o conteudo principal e e onde o olho do usuario naturalmente busca notificacoes.

O `<Toaster />` vai dentro do `<body>` no layout raiz (`app/layout.tsx`) porque precisa estar disponivel para qualquer pagina da aplicacao. Se colocasse em uma pagina especifica, so funcionaria naquela rota.

## Estrategia de testes para repository

O instrutor segue um padrao claro para testar metodos de repository que dependem do Prisma:

### 1. Mock tipado do delegate

Cada metodo do delegate Prisma recebe um tipo explicito via `jest.MockedFunction<>`. Isso garante que:
- O TypeScript valida os argumentos do mock
- Se o contrato do Prisma mudar, o teste quebra em compilacao (nao em runtime)
- A leitura do teste documenta exatamente o que cada metodo espera e retorna

### 2. Padrao de teste: input → call → assert

Todos os testes seguem a mesma estrutura:
1. Definir `input` como constante
2. Chamar o metodo do repository
3. Verificar que o Prisma foi chamado com os argumentos corretos
4. (Quando ha retorno) Verificar que o resultado e o esperado

### 3. Por que testar "se foi chamado com os dados corretos"?

O instrutor enfatiza o uso de `toHaveBeenCalledWith` ao inves de apenas `toHaveBeenCalled`. A razao: o repository e uma camada de traducao entre o dominio e o Prisma. Se ele traduz errado (por exemplo, passa `{ title }` quando deveria passar `{ where: { title } }`), o teste com `toHaveBeenCalled` passaria mas o codigo estaria quebrado.

### 4. MockResolvedValue para simular retorno do banco

No teste do `findByTitle`, o instrutor usa `mockResolvedValue` para simular o que o Prisma retornaria. Isso permite testar a logica do repository sem precisar de um banco de dados real. O `Pick<Prompt, 'id' | 'title' | 'content'>` garante que o mock retorna exatamente os campos que o metodo real retornaria.

## Progressao dos testes

O instrutor mostra uma progressao natural:
1. Ja existiam testes para `findMany` e `searchMany`
2. Novos metodos `create` e `findByTitle` foram adicionados ao repository
3. Testes foram criados seguindo o mesmo padrao dos existentes
4. Todos os testes rodam juntos e passam

Essa progressao reforça o principio: **quando adicionar um metodo ao repository, adicione o teste correspondente imediatamente**.