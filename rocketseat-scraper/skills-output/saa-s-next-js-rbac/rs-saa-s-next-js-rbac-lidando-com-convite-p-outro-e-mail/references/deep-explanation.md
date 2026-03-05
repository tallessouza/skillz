# Deep Explanation: Lidando com Convite para Outro E-mail

## Por que verificar o e-mail importa

Em sistemas SaaS multi-tenant com RBAC, um convite e vinculado a um e-mail especifico. Aceitar com outra conta quebraria a cadeia de permissoes — o convite pode ter role de `ADMIN` para o usuario X, mas o usuario Y logado nao deveria herdar esse papel.

## O problema do prefetch do Next Link

O instrutor destaca um bug sutil: ao usar `<Link>` do Next.js para a rota `/api/auth/sign-out`, o Next faz prefetch automatico da rota. Como essa rota executa o logout no servidor, o simples ato de renderizar o componente (sem clicar) ja deslogava o usuario.

A solucao e usar `<a>` nativa do HTML, que nao faz prefetch. Essa e uma armadilha comum em Next.js — rotas de API com side effects nunca devem ser prefetchadas.

### Quando usar `<a>` vs `<Link>` em Next.js

- **`<Link>`**: navegacao entre paginas da aplicacao (prefetch e desejado)
- **`<a>`**: rotas de API com side effects (sign-out, webhooks, downloads)

## Fluxo completo do convite

1. Admin convida usuario pelo e-mail na pagina de members
2. Convite fica salvo no banco com status pendente
3. Usuario acessa `/invite/{id}`
4. Sistema verifica:
   - Nao logado → mostra opcao de login/cadastro
   - Logado com e-mail correto → mostra botao aceitar
   - Logado com e-mail errado → mostra mismatch UI
5. Apos aceitar, usuario passa a fazer parte da organizacao

## Convites pendentes no dashboard

O instrutor menciona que e importante nao depender de e-mail externo para notificar convites. O dashboard deve listar convites pendentes diretamente, consultando a tabela de invites filtrando pelo e-mail do usuario logado.

## Estilizacao da mensagem de mismatch

As classes usadas seguem o padrao shadcn/ui:
- `text-balance`: distribui texto uniformemente entre linhas
- `text-muted-foreground`: cor secundaria para texto contextual
- `text-foreground font-medium`: destaque visual nos e-mails
- `space-y-2` e `space-y-4`: espacamento vertical consistente
- `w-full`: botoes ocupam largura total para clareza