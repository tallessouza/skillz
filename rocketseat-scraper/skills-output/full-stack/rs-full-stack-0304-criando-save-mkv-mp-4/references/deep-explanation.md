# Deep Explanation: Salvando Dados de Autenticação no Contexto

## O fluxo completo: API → Estado → Rotas

O instrutor demonstra um padrão fundamental de aplicações React com autenticação: a **cadeia reativa** onde salvar dados no estado automaticamente muda o que o usuário vê.

### A cadeia é:

```
Login (SignIn) → API retorna dados → save(response.data) → setSession(data) → session muda →
→ componente de rotas re-renderiza → switch avalia session.user.role → rota correta é exibida
```

O ponto-chave é que **não existe redirecionamento manual**. Não há `navigate("/dashboard")` após o login. O componente de rotas já está observando o estado `session` via contexto. Quando `session` muda de `null` para um objeto com `user.role`, o React re-renderiza o componente de rotas, o switch/case avalia o novo valor, e a rota correta aparece automaticamente.

### Por que isso é poderoso

O instrutor demonstra isso de forma visual: ele muda o valor inicial do `useState` no contexto de `null` para `{ user: { role: "manager" } }` e a página muda instantaneamente para o dashboard de manager. Troca para `"employee"` e muda para a página de employee. Volta para `null` e vai para sign-in.

Isso prova que o estado é a **única fonte de verdade** para decidir qual interface mostrar. Não importa como o estado mudou (manualmente no código ou via API), o resultado é o mesmo.

## A função save como contrato

A função `save` não é apenas um setter. Ela é um **contrato tipado** que:

1. Recebe exatamente `UserApiResponse` (não `any`, não um subset)
2. Não retorna nada (`void`)
3. É compartilhada via contexto para qualquer componente que precise salvar dados de autenticação

O instrutor enfatiza que a tipagem deve ser definida primeiro na interface do contexto, antes de implementar a função. Isso garante que qualquer componente que consuma o contexto sabe exatamente o que `save` espera.

## Transição de mock para estado real

Um ponto importante da aula: o instrutor tinha uma constante de teste (`const session = { ... }`) simulando um usuário logado. Ele remove essa constante e substitui pelo estado real do contexto.

Essa transição é significativa porque:
- A constante era útil durante o desenvolvimento das rotas
- Mas agora que o contexto está pronto, ela se torna código morto
- Manter ambos (constante e estado) causaria confusão sobre qual é a fonte de verdade

## Switch/case como estratégia de roteamento

O instrutor usa o termo "estratégia de rotas" — o switch/case no componente de rotas é uma **decision tree** que avalia o perfil:

- `"manager"` → rotas de gerente (dashboard de solicitações)
- `"employee"` → rotas de funcionário (criar solicitação)
- `default` (null/undefined/outro) → rotas de autenticação (sign-in, sign-up)

O `default` captura tanto o caso de "não logado" (`session` é null) quanto qualquer role desconhecida, garantindo que o usuário sempre caia em alguma rota válida.

## Demonstração prática do instrutor

O instrutor demonstra o fluxo completo:
1. Muda o perfil para "employee" no banco → faz login → vai para rota de employee
2. Muda para "manager" → recarrega → faz login → vai para rota de manager
3. Com sessão null → mostra tela de sign-in

Isso valida que o mesmo código de rotas funciona para qualquer perfil, sem lógica condicional espalhada pela aplicação.