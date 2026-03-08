# Deep Explanation: Desconectando Usuário

## Por que `window.location.assign("/")` e não `navigate("/")`?

O instrutor usa `window.location.assign("/")` deliberadamente. Quando o usuário faz logout, você quer garantir que **todo o estado em memória do React seja descartado**. Se usar `navigate("/")` do React Router, o React mantém o estado dos componentes montados — contextos, stores, refs — tudo continua vivo. Com `window.location.assign`, o browser faz uma navegação completa, o React desmonta tudo e remonta do zero, garantindo que nenhum dado sensível persista em memória.

Isso é especialmente importante em aplicações com múltiplos perfis de usuário (como no exemplo: Rodrigo como manager e Anderson como membro). Se o estado não for completamente limpo, dados do usuário anterior podem vazar para a sessão do próximo.

## Limpeza consistente: estado + storage

O instrutor enfatiza que logout precisa de **duas ações complementares**:

1. **`setSession(null)`** — Limpa o estado React imediatamente. Componentes que dependem de `session` vão re-renderizar com valor null.
2. **`localStorage.removeItem`** — Limpa a persistência. Sem isso, ao recarregar a página, o app poderia tentar restaurar uma sessão inválida.

A ordem importa: primeiro limpe o estado (feedback imediato), depois o storage (persistência), depois redirecione (navegação).

## Por que remover chaves individualmente?

O instrutor remove `"user"` e `"token"` separadamente ao invés de usar `localStorage.clear()`. Isso porque `clear()` remove **tudo** do localStorage, incluindo preferências do usuário, temas, configurações de UI que não têm relação com autenticação. Remover chaves específicas é cirúrgico e seguro.

## Tipagem `() => void` no contexto

Quando o instrutor adiciona `remove` ao provider value, TypeScript inicialmente não reconhece o método. Isso porque a interface do contexto não foi atualizada. A solução é adicionar `remove: () => void` na interface `AuthContextData`.

O tipo `void` indica que:
- A função não recebe parâmetros (parênteses vazios)
- Não retorna nada (void)

Isso é importante para que qualquer componente que consuma o contexto saiba exatamente como chamar o método.

## Exibição dinâmica do nome do usuário

O instrutor demonstra que o contexto não serve apenas para funções — serve também para dados. No Header, `auth.session?.user.name` exibe o nome do usuário logado dinamicamente.

O optional chaining (`?.`) é obrigatório porque `session` pode ser `null` (estado inicial antes do login). Sem ele, a aplicação quebraria ao tentar acessar `.user` de `null`.

## Fluxo completo de autenticação demonstrado

A aula mostra o ciclo completo:
1. **Login** → `save()` armazena sessão no estado + localStorage
2. **Navegação** → Dashboard (manager) ou Solicitações (membro) baseado no role
3. **Exibição** → Nome do usuário no Header via contexto
4. **Logout** → `remove()` limpa tudo e redireciona

Esse padrão de contexto com `save`/`remove` é reutilizável em qualquer aplicação React com autenticação client-side.

## Múltiplos perfis de usuário

O instrutor demonstra trocando entre Rodrigo (manager) e Anderson (membro). Após logout de um e login de outro, o nome exibido no Header muda automaticamente porque vem do contexto. Isso valida que o fluxo de limpeza está funcionando corretamente — se dados do Rodrigo aparecessem na sessão do Anderson, seria um bug de segurança.