# Deep Explanation: GitHub como Editor via github.dev

## Como funciona o atalho do ponto

O atalho `.` (ponto final) é um shortcut nativo do GitHub. Ao pressionar essa tecla em qualquer página de repositório, o GitHub redireciona automaticamente de `github.com` para `github.dev`, que hospeda uma versão web do Visual Studio Code.

Esse editor é o mesmo motor do VS Code (Monaco Editor), então a interface é praticamente idêntica ao que você teria localmente. Isso inclui:
- Explorador de arquivos
- Painel de controle de versão (Source Control)
- Terminal limitado (sem execução de código)
- Extensões básicas

## O editor é uma cópia do VS Code

O instrutor enfatiza que "esse editor de código aqui é o editor semelhante ao VS Code". O painel de controle de versão que aparece na barra lateral é o mesmo que vem embutido no VS Code local. Então, se você já usa VS Code no computador, pode usar o mesmo fluxo de stage/commit pela interface gráfica.

## Indicadores visuais de mudanças

O Git trabalha com linhas. O editor mostra visualmente o que mudou:

- **Verde (linha nova):** uma linha que não existia antes foi adicionada
- **Amarelo (modificada):** o conteúdo de uma linha existente foi alterado
- **Vermelho (deletada):** uma linha foi removida — aparece como uma seta vermelha na margem; ao clicar, mostra o conteúdo original

O `M` ao lado do nome do arquivo significa "Modified". Quando você deleta um arquivo, ele aparece riscado no painel.

## Commit & Push simultâneo

No github.dev, o processo é simplificado: ao clicar "Commit & Push", ambas as operações acontecem juntas. Não há separação entre commit local e push remoto, porque você já está trabalhando diretamente no repositório remoto.

O instrutor demonstra que, para arquivos no staging area, basta escrever a mensagem e confirmar. Para arquivos que ainda não estão no stage, o editor é "inteligente o suficiente" para automaticamente fazer stage → commit → push em uma operação.

## Deletar permanentemente vs Restore

Ao deletar um arquivo com "Delete Permanently":
- O arquivo some do explorador
- Aparece no painel de versão com indicador de deleção
- **Antes do commit**, é possível restaurar clicando na seta de restore (equivalente ao `git restore` que se aprende no terminal)
- **Após commit & push**, a deleção é definitiva no branch atual

## Cenário de uso: sem ambiente local

O instrutor propõe o cenário de estar em viagem, sem computador próprio, com acesso apenas ao navegador. O github.dev permite fazer alterações completas nesse cenário. Ele alerta que "é muito perigoso porque você vai colocar senha e tudo mais" — referindo-se ao risco de usar credenciais em máquinas que não são suas.

## Filosofia do instrutor sobre evolução tecnológica

"Quanto mais a tecnologia vai crescendo, mais coisas vão existindo e mais soluções a gente vai encontrando." O ponto central é que ferramentas como github.dev não existiam antes, e estudar continuamente permite descobrir soluções que simplificam o fluxo de trabalho. Não é para se preocupar com ter sempre coisas novas para aprender — isso é positivo, traz "energia nova" e "soluções diferentes".