# Deep Explanation: Perfil de Viagens — Setup do Projeto

## Projeto original vs duplicado no Figma

O instrutor destaca uma nuance importante: o link oficial da Skillz abre o projeto **original**, que contem uma aba **Properties** nos elementos. Quando voce duplica o projeto (clicando em Duplicate), essa aba desaparece ou muda de comportamento.

Isso significa que:
- No projeto original: voce ve Properties com informacoes detalhadas de cada elemento (cores, tamanhos, espacamentos)
- No projeto duplicado: voce perde algumas dessas propriedades automaticas

O instrutor comeca trabalhando no projeto original e depois faz a copia para continuar. Ele avisa isso no inicio para evitar confusao quando o aluno perceber a diferenca visual na interface do Figma.

**Dica:** Se o link fornecido ja duplicou automaticamente, esta tudo certo. Se nao, duplique manualmente. A diferenca na aba Properties nao impede o desenvolvimento — apenas muda como voce inspeciona os valores.

## Zen Mode no VS Code

O Zen Mode e um recurso nativo do VS Code que:
- Remove todas as barras laterais
- Esconde a barra de status
- Maximiza o editor para tela cheia
- Ideal para foco total durante o coding

O atalho padrao no Mac e `Cmd+K Z` (sequencia de teclas, nao simultaneas). No Windows/Linux pode variar — o instrutor recomenda buscar via Command Palette digitando "Toggle Zen Mode".

## Live Server — Por que desabilitar mensagens

O plugin Live Server, ao ser ativado, mostra notificacoes informativas (porta utilizada, status do servidor, etc). O instrutor adicionou a configuracao `"liveServer.settings.donotShowInfoMsg": true` para eliminar essas notificacoes e manter o ambiente limpo.

Isso e uma preferencia pessoal, nao um requisito. Se voce prefere ver as mensagens, pode omitir essa configuracao.

## Conceitos principais do projeto

O instrutor lista os conceitos que serao explorados:

1. **Display Flex** — o "mais top de todos", usado para consolidar estudos de layout
2. **Variaveis CSS** — aplicacao pratica usando o Style Guide como referencia
3. **Style Guide** — primeira vez que o curso usa um Style Guide formal do Figma

Esses conceitos serao abordados nas aulas seguintes, nao nesta aula de apresentacao.