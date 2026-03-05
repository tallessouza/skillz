# Deep Explanation: Pagina de Configuracoes da Org

## Arquitetura de permissoes na UI

O instrutor segue um padrao consistente: cada secao da pagina de settings e envolvida por uma verificacao de permissao. Isso cria uma UI adaptativa onde diferentes roles veem diferentes secoes da mesma pagina.

O padrao e:
1. Buscar dados da org e membership atual
2. Construir o ability object (CASL/similar)
3. Para cada secao: `if (can('action', 'Subject'))` renderiza

Isso e importante porque a pagina de settings e uma unica rota, mas o conteudo visivel varia por role. Um admin ve tudo (update, billing, delete), enquanto um member pode nao ver nada.

## Reutilizacao de formularios

O instrutor demonstra um insight pratico: o `OrganizationForm` foi originalmente criado dentro de `create-organization`, mas ao perceber que o mesmo form seria necessario na pagina de settings (para editar), ele move o componente para uma pasta compartilhada (`org/`).

Ele menciona que o form ainda precisa ser adaptado para:
- Preencher com dados existentes (modo edicao)
- Chamar update ao inves de create no submit

Mas a estrutura do form (campos, validacao) e a mesma — justificando a reutilizacao.

## Server actions para operacoes destrutivas

O padrao usado:
1. Funcao `async` com `'use server'` directive
2. Busca o contexto atual (org slug)
3. Executa a operacao (DELETE request)
4. Redireciona para pagina segura

Encapsular em `<form action={}>` ao inves de `onClick` garante:
- Progressive enhancement (funciona sem JS)
- Semantica correta de formulario
- Integracao nativa com React Server Components

## Non-null assertion consciente

O instrutor usa `currentOrg!` com consciencia: ele sabe que o botao so existe em paginas com org na URL, entao o valor nunca sera null nesse contexto. Ele reconhece o "errinho" do TypeScript mas justifica a decisao.

## Falta intencional de confirmacao

O instrutor apaga a org direto, sem confirmacao, e comenta que "seria muito melhor botar uma confirmacao". Ele escolhe nao implementar porque o foco da aula e a logica, nao a UX completa. Em producao, sempre adicione um dialog de confirmacao para operacoes destrutivas.