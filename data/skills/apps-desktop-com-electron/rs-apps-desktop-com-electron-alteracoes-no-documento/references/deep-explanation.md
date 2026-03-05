# Deep Explanation: Alteracoes no Documento

## Por que getHTML() e nao getJSON()?

O instrutor Diego explorou ambas as opcoes ao vivo. Com `getJSON()`, o editor retorna uma estrutura onde o primeiro item do array `content` e o heading (titulo). Isso facilitaria extrair o titulo, mas o restante do conteudo fica fragmentado em multiplos items no array — cada paragrafo vira um objeto separado. Nao existe um metodo simples para converter esse "restante" de volta para HTML.

Com `getHTML()`, voce recebe uma string unica. O titulo esta dentro de `<h1>`, o resto e o conteudo. Um simples regex resolve a separacao. O tradeoff e claro: regex em HTML e mais simples neste caso especifico porque a estrutura e controlada (sempre `<h1>` seguido de conteudo).

## Regex com grupos nomeados — por que importa

Diego mostrou que sem grupos nomeados, o resultado do `.match()` retorna um array onde:
- Posicao 0: regex completa
- Posicao 1: regex completa (redundante neste caso)
- Posicao 2: titulo
- Posicao 3: conteudo

O comentario do instrutor: "2 e 3 nao significa nada para quem for dar manutencao nesse codigo, e meio ruim." Ao usar `(?<title>...)` e `(?<content>...)`, o resultado fica em `parsed.groups.title` e `parsed.groups.content` — autodocumentado.

## Extensao recomendada: Regex Previewer

Diego recomendou instalar a extensao "Regex Previewer" no VS Code. Ela permite testar a regex em tempo real conforme voce digita, mostrando os matches lado a lado. Ele usou essa extensao para validar tres cenarios:
1. Titulo + um paragrafo de conteudo
2. Titulo sem conteudo (caso vazio)
3. Titulo + multiplos paragrafos

O caso 2 e crucial: sem o `?` no grupo de conteudo, a regex para de funcionar quando nao ha conteudo apos o H1.

## Componente puro vs componente conectado

A decisao de manter o editor sem mutations e uma escolha arquitetural explicita. O instrutor explicou: "esse componente editor, do jeito que ele esta construido, ele pode ser reaproveitado para outros lugares que eu vou ter editor." A callback `onContentUpdated` transforma o editor em componente puro — ele emite eventos, o pai decide o que fazer.

A funcao intermediaria `handleEditorContentUpdated` existe como "middleware" ou "interceptador". Diego mencionou: "pra um dia caso a gente queira mudar o comportamento de como que e salvo, as vezes fazer algum processo de validacao." E uma camada de indirection proposital.

## Atualizacao otimista da sidebar

Ao salvar o documento, ao inves de refazer a query de listagem, o `onSuccess` da mutation atualiza o cache local do React Query. O detalhe importante: apenas o titulo e atualizado no cache, porque a sidebar so exibe titulos. O conteudo nao precisa estar no cache da listagem.

Diego usou `variables` (nao `data`) no `onSuccess` porque a funcao `saveDocument` retorna `void` — nao ha dados de retorno. As `variables` contem os parametros que a mutation recebeu (titulo e conteudo).

## Conflito de nomes de import

Um problema pratico encontrado ao vivo: o componente da pagina se chama `Document`, e o type importado do IPC tambem se chamava `Document` (que conflita com `Document` da Web API). A solucao foi renomear o type para `IpcDocument` para evitar shadowing.