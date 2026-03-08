# Deep Explanation: Página de Confirmação com Guard de Rota

## Por que proteger a página de confirmação?

O instrutor demonstra um cenário comum: após o envio de um formulário, o usuário é redirecionado para uma página de confirmação. O problema é que, sem proteção, qualquer pessoa pode acessar `/confirm` diretamente pela URL do navegador, sem ter passado pelo formulário.

Isso é um problema de UX — o usuário vê uma mensagem de "solicitação enviada" sem ter enviado nada. Pode causar confusão e dar a impressão de que algo foi processado quando não foi.

## O mecanismo: estado na navegação

O React Router permite passar um objeto `state` junto com a navegação:

```tsx
navigate("/confirm", { state: { fromSubmit: true } })
```

Esse estado **não aparece na URL** — ele é armazenado internamente pelo React Router no histórico de navegação do browser. Isso significa que:

1. Se o usuário navega via `navigate()` com estado → `location.state` contém o objeto
2. Se o usuário digita a URL diretamente → `location.state` é `null`
3. Se o usuário recarrega a página → o estado pode persistir (depende do browser)

## O componente Navigate vs useNavigate

O instrutor usa duas ferramentas diferentes para dois propósitos:

- **`useNavigate()` (hook)** — usado dentro de event handlers (imperativo). Exemplo: após o submit do formulário, chama `navigate("/confirm")`.
- **`<Navigate to="/" />` (componente)** — usado no JSX para redirecionamento declarativo. Exemplo: retornado antes do render quando o guard falha.

A escolha é deliberada: dentro do `onSubmit` você precisa de código imperativo (hook). No guard da página, você quer um redirecionamento que acontece durante o render (componente).

## O padrão do guard

```tsx
if (!location.state?.fromSubmit) {
  return <Navigate to="/" />
}
```

Esse `return` antes do render principal é o padrão de "early return guard". Ele:

1. Verifica se o estado existe (`?.` porque `state` pode ser `null`)
2. Verifica se `fromSubmit` é truthy
3. Se falhar, retorna imediatamente com redirecionamento
4. Se passar, continua para o render normal da página

O optional chaining (`?.`) é essencial porque quando o usuário acessa diretamente pela URL, `location.state` é `null`, e `null.fromSubmit` causaria um erro de runtime.

## Fluxo completo

1. Usuário preenche formulário e clica "Enviar"
2. `onSubmit` é chamado → processa dados → `navigate("/confirm", { state: { fromSubmit: true } })`
3. React Router navega para `/confirm` com estado
4. Componente `Confirm` renderiza → `location.state.fromSubmit` é `true` → guard passa
5. Página de confirmação é exibida

Fluxo alternativo (acesso direto):
1. Usuário digita `/confirm` na barra de endereço
2. React Router navega para `/confirm` sem estado
3. Componente `Confirm` renderiza → `location.state` é `null` → guard falha
4. `<Navigate to="/" />` redireciona para a raiz

## Registro de rotas

O instrutor lembra de registrar a nova rota no arquivo de rotas antes de usá-la. Sem isso, a navegação resulta em 404 ou na página de fallback. A rota `/confirm` é adicionada dentro do mesmo grupo de layout (`employee`) para manter a estrutura visual consistente.

## Limitações

- O estado de navegação não é criptografado — não use para proteção de segurança real (autenticação/autorização)
- Em alguns browsers, o estado pode persistir após reload, permitindo acesso mesmo sem novo submit
- Para proteção robusta, combine com verificação server-side (ex: token de sessão)