# Deep Explanation: Action Aceitar Convite

## Por que cookies e nao query params?

O instrutor escolhe cookies deliberadamente porque o fluxo de aceitacao de convite cruza multiplas paginas e redirects. Query params se perdem facilmente em redirects intermediarios (especialmente com OAuth que redireciona para provider externo e volta). O cookie persiste independente de quantos redirects acontecam.

## O padrao "silent accept"

O try/catch vazio parece estranho, mas tem logica: quando o usuario loga apos ser convidado, o sistema tenta aceitar o convite automaticamente. Se falhar (por exemplo, o usuario logou com outra conta cujo email nao bate), nao ha motivo para mostrar erro — o usuario simplesmente nao vera a organizacao na lista. A API do backend (`acceptInvite`) ja valida se o email do usuario autenticado bate com o email do convite.

## Tres estados, tres UIs

O instrutor mapeia explicitamente tres cenarios:

1. **Nao autenticado**: Mostra botao "Sign in to accept the invite". Ao clicar, salva inviteId em cookie e redireciona para sign-in com email pre-preenchido via searchParams.

2. **Autenticado com mesmo email**: Mostra botao "Join {org name}". Ao clicar, chama `acceptInvite` direto e redireciona para o dashboard da organizacao.

3. **Autenticado com email diferente**: O usuario esta logado mas com uma conta diferente do email do convite. Precisa de tratamento especial (mostrar mensagem ou botao de logout).

## Server actions inline

O instrutor cria server actions diretamente dentro do componente usando `'use server'` no corpo da funcao. Isso e valido no Next.js e preferivel quando a action so e usada naquele componente. Evita criar arquivos separados para actions simples.

## Multiplos pontos de entrada

O aceite do convite e replicado em tres lugares:
- **Sign-in action** (login por email/senha)
- **OAuth callback** (login por GitHub)
- **Pagina de convite** (quando ja autenticado com email correto)

Isso porque o usuario pode chegar ao login por qualquer caminho. O cookie de inviteId garante que qualquer que seja o caminho, o convite sera aceito.

## Pre-preenchimento do email

Ao redirecionar para sign-in, o email do convite vai como searchParam. O formulario de sign-in usa `useSearchParams()` para pegar esse valor e setar como `defaultValue` no input de email. Isso reduz friccao — o usuario so precisa digitar a senha.

## Funcao acceptInvite no HTTP client

O instrutor cria a funcao `acceptInvite` no modulo HTTP seguindo o mesmo padrao das outras chamadas API. A rota e `POST /invite/{inviteId}/accept`. A funcao recebe apenas o inviteId como parametro e nao retorna nada (o accept e fire-and-forget do ponto de vista do frontend).