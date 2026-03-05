# Deep Explanation: Listagem de Membros com RBAC

## Por que Promise.all e nao requests sequenciais

O instrutor destaca explicitamente: "como uma request não é dependente da outra, eu posso fazer um Promise.all, para ele fazer todas as requisições ao mesmo tempo". Em server components do Next.js, cada `await` bloqueia a execucao. Com 3 requests independentes (membership, members, organization), executar sequencialmente triplica o tempo de espera. Promise.all dispara todas simultaneamente e espera a mais lenta.

## O padrao de "highlighting" do usuario logado

O instrutor menciona: "eu já vi isso em outros projetinhos, que ele mostra qual membro sou eu, pra eu saber". Isso resolve um problema real de UX — em listas longas de membros, o usuario precisa se localizar rapidamente. A comparacao `member.userId === membership.userId` usa o membership (relacao do usuario com a org) obtido via `getMembership()`.

## Parse do organization com schema de auth

Um ponto sutil mas critico: o objeto `organization` retornado pela API tem um formato diferente do esperado pelo pacote de autorizacao (CASL/permissions). O instrutor resolve com `organizationSchema.parse(organization)`, que valida e transforma o objeto no formato correto. Sem isso, a checagem `can('transfer_ownership', organization)` pode falhar silenciosamente ou retornar resultados incorretos.

O instrutor explica: "esse organization que eu estou pegando aqui em cima, ele não tem o mesmo formato que eu espero aqui dentro do meu pacote de autorização". Isso acontece porque o schema de autorizacao define campos especificos (como `ownerId` tipado) que precisam ser parseados do formato raw da API.

## Permissao granular vs generica

Para `transfer_ownership`, nao basta checar se o usuario "pode transferir organizacoes em geral". E preciso checar se ele pode transferir ESTA organizacao especifica. O CASL permite passar o subject (instancia) ao inves de apenas o tipo (string), e as regras avaliam campos do subject (como `ownerId === userId`).

## Configuracao de imagens remotas no Next.js

O componente `<Image>` do Next.js otimiza imagens mas exige que hostnames externos sejam explicitamente permitidos. O instrutor nota: "eu estou usando um endereço do github aqui como imagem, então esse hostname precisa estar configurado lá no meu nextconfig". Nas versoes mais recentes do Next.js, nao e necessario reiniciar o servidor apos essa mudanca.

## Separacao em componentes por permissao

A pagina principal renderiza `<Invites />` e `<MemberList />` como componentes separados, cada um gatilhado por uma permissao diferente. Isso permite que:
- Admin veja ambos
- Membro veja apenas a MemberList
- A logica de cada secao fique isolada

O instrutor demonstra: "como eu sou admin, eu vou ver tanto invites quanto member list, se eu entro como membro, eu só consigo ver a member list".

## Import cuidadoso — shadcn vs lucide

O instrutor alerta explicitamente: "cuidar pra importar do shadcn, não importar ali do lucid, que tem um componente chamado Table". Lucide React tem um icone `Table` que conflita com o componente `Table` do shadcn/ui. Importar o errado causa erros sutis.