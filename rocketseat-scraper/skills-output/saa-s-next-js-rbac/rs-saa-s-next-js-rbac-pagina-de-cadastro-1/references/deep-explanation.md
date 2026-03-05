# Deep Explanation: Paginas de Cadastro e Recuperacao

## Por que reutilizar a estrutura do sign-in?

O instrutor demonstra que as paginas de autenticacao (sign-in, sign-up, forgot-password) compartilham 80% da mesma estrutura. Em vez de criar cada pagina do zero, ele copia a pagina de sign-in e faz ajustes minimos:

- **Sign-up:** adiciona campo `name` e `password_confirmation`, muda texto do botao para "Create account", muda OAuth para "Sign up with GitHub"
- **Forgot-password:** remove tudo exceto o campo de email, muda botao para "Recover password", remove separador e OAuth

Essa abordagem garante consistencia visual e reduz a chance de divergencia entre paginas.

## O padrao `asChild` do Radix UI / shadcn

O conceito central demonstrado e o prop `asChild`. Quando voce quer que um elemento tenha a **estilizacao** de um componente (ex: Button) mas a **semantica** de outro (ex: Link/ancora), `asChild` repassa todos os estilos para o primeiro filho.

Sem `asChild`:
```tsx
// Renderiza um <button> — semanticamente errado para navegacao
<Button variant="link" onClick={() => router.push('/sign-in')}>Sign in</Button>
```

Com `asChild`:
```tsx
// Renderiza um <a> — semanticamente correto
<Button variant="link" asChild>
  <Link href="/auth/sign-in">Sign in</Link>
</Button>
```

O resultado no DOM e uma tag `<a>` com as classes CSS do Button. Isso importa para:
- Acessibilidade (leitores de tela distinguem links de botoes)
- SEO (crawlers seguem ancoras, nao botoes)
- Comportamento nativo (ctrl+click abre em nova aba)

## Login com GitHub no signup

O instrutor explica que o botao "Sign up with GitHub" usa o mesmo fluxo de "Sign in with GitHub", porque o processo de OAuth com GitHub automaticamente cria uma conta caso o usuario nao tenha uma. Nao e necessario um fluxo separado de registro via OAuth — o mesmo endpoint serve para ambos os casos.

## Hierarquia visual com `size="sm"`

Os botoes secundarios (links de navegacao entre paginas) usam `size="sm"` para criar hierarquia visual clara:
- Botao primario (submit): tamanho padrao, destaque total
- Botao secundario (navegacao): `variant="link"` + `size="sm"`, menor e menos proeminente

## Campos removidos por contexto

O instrutor remove deliberadamente:
- **Link "forgot password" do signup:** porque o usuario esta criando uma senha nova, nao recuperando uma existente
- **Separador e OAuth do forgot-password:** porque recuperacao de senha so faz sentido com email, nao com provedor externo