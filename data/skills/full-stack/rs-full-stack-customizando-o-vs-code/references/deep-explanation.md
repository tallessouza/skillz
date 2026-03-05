# Deep Explanation: Configuracao do VSCode

## Filosofia do instrutor

O Mayk (instrutor) segue uma filosofia clara: **quanto menos informacao visual na tela, melhor o foco**. Ele remove sistematicamente tudo que nao contribui diretamente para a escrita de codigo:

- Minimap: ocupa espaco lateral sem beneficio real para iniciantes
- Glyph margin: so serve para breakpoints de debug, recurso avancado
- Tabs multiplas: distraem, melhor navegar com `Ctrl+P`/`Cmd+P`
- Fullscreen no Zen Mode: ele prefere ainda ter acesso ao sistema

> "Eu gosto de espaco. Quando vou codar, meu editor e mais humilde, limpo, leve, porque eu gosto de espaco. Nao gosto de muita coisa na tela, me atrapalha, me tira o foco."

## Por que fontSize 20?

Nao e porque a fonte precisa ser grande. A estrategia e: fonte grande no editor permite **reduzir o zoom da interface** (`Ctrl-`), ganhando mais espaco de tela enquanto o texto continua legivel. E uma tecnica especialmente util para streaming e aulas.

## WordWrap: quebra visual vs quebra real

Ponto critico que confunde iniciantes: quando `wordWrap` esta "on", o editor **mostra** o texto em multiplas linhas visuais, mas o arquivo continua com uma unica linha. Observe os numeros de linha — se mostra "5" e depois "6" pula para outra posicao, o conteudo entre eles e a mesma linha 5 quebrando visualmente.

> "Essa e a linha 5. Automaticamente ele deu uma quebrinha aqui, e continuou. Mas ainda e a linha 5. Nao tenho 6 aqui, porque isso nao e uma linha nova."

Isso e especialmente util em aulas: todo o codigo fica visivel sem scroll horizontal, e quem assiste consegue ver tudo na tela.

## AutoSave: seguranca para iniciantes

O instrutor destaca que iniciantes **sofrem bastante** por esquecer de salvar. Com `afterDelay`, apos ~1 segundo sem digitar, o arquivo salva automaticamente. A bolinha no nome da aba (indicando alteracoes nao salvas) desaparece sozinha.

## Glyph Margin e Breakpoints

A glyph margin e o espaco a esquerda dos numeros de linha onde voce clica para colocar breakpoints (pontos vermelhos para debug). O instrutor reconhece que e util mas diz que para iniciantes no nivel da aula, debug com breakpoints nao e relevante:

> "Isso aqui serve para colocar um pontinho, que e Breakpoint. Mas bem no futuro, quando voce ficar estudando sobre Debug."

## Zen Mode: foco total

O Zen Mode e ativado via Command Palette. A configuracao do instrutor:
- **Sem fullscreen**: para ainda acessar o sistema
- **Sem center layout**: aproveitar toda a largura da tela
- **Single tab**: ver apenas o arquivo atual, navegar com `Ctrl+P`

Para trocar rapido entre arquivos no Zen Mode: segurar `Ctrl`/`Cmd` e pressionar `P` repetidamente para alternar entre os ultimos arquivos abertos.

## Alerta importante do instrutor

O instrutor faz questao de dizer que essa configuracao e **pessoal** e **opcional**:

> "Voce nao e obrigatorio fazer essa aula. Se voce nao quiser mexer no seu VSCode, tranquilo."

E recomenda fortemente fazer backup antes de qualquer alteracao:

> "Salva o arquivo que voce tem aqui. Salva essas informacoes em algum lugar, para que voce possa recupera-las depois."

## Atalhos adicionais mencionados

- **Split editor**: o botao no canto superior direito permite abrir mais de um arquivo lado a lado, util quando precisa consultar multiplos arquivos
- **Source Control**: a aba de controle de versao no sidebar permite gerenciar Git sem abrir terminal separado
- **Extensions**: a aba de extensoes para instalar plugins (nao abordado em detalhe nesta aula)