# Deep Explanation: Pagina Aceitar Convite

## Por que a rota fica fora do layout autenticado

O instrutor explica que ao criar a pagina de invite inicialmente dentro de `(app)/`, o Next.js redirecionava o usuario porque o layout daquela pasta verifica autenticacao. O invite precisa ser acessivel por usuarios que ainda nao estao logados — eles receberam um link por email e podem nao ter conta ainda.

A solucao e mover a rota para fora da pasta `(app)`, ficando em `app/invite/[id]/page.tsx` diretamente. Assim ela nao herda o layout que valida sessao.

## Fluxo real do convite

1. Um usuario da organizacao convida alguem (ex: `asso@asso.com`)
2. Se o email nao pertence ao mesmo dominio da organizacao, o convite e "externo" e precisa de aceitacao manual
3. No ideal, um email seria enviado com link contendo o ID do convite na URL
4. O backend atual apenas cria o convite e retorna o ID — nao envia email
5. A pagina e construida como se o ID ja viesse na URL (via link do email)

## Os tres estados de autenticacao

O instrutor destaca que esse e o ponto mais critico da pagina:

1. **Nao autenticado**: usuario clicou no link do email sem estar logado. Mostrar opcao de autenticacao.
2. **Autenticado com mesmo email**: usuario ja esta logado com o email que foi convidado. Basta mostrar botao "Aceitar convite".
3. **Autenticado com email diferente**: usuario esta logado, mas com conta diferente da convidada. Precisa deslogar e logar com o email correto.

Essa logica seria implementada na aula seguinte.

## Detalhe do text-balance

O instrutor mostra visualmente o efeito de `text-balance`: sem ele, uma linha pode ter muito texto e a seguinte muito pouco. Com `text-balance`, o CSS distribui os caracteres de forma mais uniforme entre as linhas, melhorando a legibilidade em textos curtos centralizados.

## Estrutura de destaque no texto

Para nomes (do autor e da organizacao) dentro do paragrafo descritivo, o instrutor usa `<span className="font-medium text-foreground">` para criar contraste visual contra o `text-muted-foreground` do paragrafo. Isso guia o olho do usuario para as informacoes mais importantes.

## Prisma Studio para debug

O instrutor usa `prisma studio` para acessar o banco e copiar o ID do invite manualmente, simulando o que seria o link recebido por email em producao.