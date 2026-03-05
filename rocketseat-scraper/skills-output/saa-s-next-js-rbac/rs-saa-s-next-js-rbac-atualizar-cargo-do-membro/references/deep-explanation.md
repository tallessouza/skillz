# Deep Explanation: Atualizar Cargo do Membro

## Por que um componente isolado?

O Diego cria o `UpdateMemberRoleSelect` como componente separado por uma razao pratica: ele precisa ser `'use client'` (por causa do `onValueChange` com funcao async), mas a lista de membros pode continuar sendo server component. Isolar o client boundary no menor componente possivel e um padrao recorrente no Next.js App Router — mantém o maximo de codigo no servidor.

## Composicao com ComponentProps

O pattern `extends ComponentProps<typeof Select>` e elegante porque:
- Permite passar `value`, `disabled`, `defaultValue` e qualquer outra prop do Radix Select
- O componente pai (MemberList) controla o estado visual (qual role esta selecionada, se esta desabilitado)
- O componente filho so adiciona `memberId` e a logica de mutacao

Isso segue o principio de inversao de controle — quem sabe as regras de negocio (MemberList com acesso ao CASL ability) controla o comportamento, quem sabe a UI (UpdateMemberRoleSelect) renderiza.

## Tres condicoes de disabled

O Diego destaca tres casos onde o select deve ser desabilitado:

1. **`member.role === 'OWNER'`** — o dono da organizacao nao pode ter sua role alterada via select
2. **`member.userId === currentUserId`** — usuario nao pode alterar a propria role (evita lock-out acidental)
3. **`cannot('update', 'User')`** — permissao CASL, se o usuario logado nao tem permissao de update em User, todos os selects ficam desabilitados

Essas tres condicoes cobrem cenarios diferentes de seguranca e UX.

## Server action vs API route

O Diego usa server action em vez de chamar a API diretamente do cliente. A vantagem:
- `revalidateTag` funciona nativamente — apos o PUT, a tag de membros e invalidada e a lista recarrega
- A reordenacao por role acontece automaticamente porque o fetch da lista roda de novo no servidor
- Nao precisa de `useState` + `useEffect` + loading state no cliente

## Realidade do dia a dia

O Diego faz questao de mostrar problemas reais durante a gravacao:
- TypeScript dando erro por importacao com `type` keyword incorreta
- Turbo atualizando versao no meio do desenvolvimento e quebrando dependencias
- Necessidade de restart do VS Code quando o language server "se perde"

A mensagem e clara: **"programacao e assim pra todo mundo"** — problemas de tooling sao normais e nao devem paralisar o desenvolvedor.

## onValueChange sem confirmacao

A escolha de disparar a action direto no `onValueChange` (sem modal de confirmacao) e intencional para roles. Trocar uma role e:
- Facilmente reversivel (basta selecionar outra)
- Nao destrutiva (nao deleta nada)
- Imediata no feedback (o select ja mostra o novo valor)

Para operacoes destrutivas (como remover membro), o padrao seria diferente — com dialog de confirmacao.