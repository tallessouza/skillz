# Deep Explanation: Navegando Pelos Commits na Interface do GitHub

## Contexto do instrutor

O instrutor (Mike/Maicao) apresenta a interface do GitHub como uma alternativa visual ao terminal para quem esta aprendendo git. A abordagem e pratica: ele navega por commits reais feitos durante o curso, mostrando delecoes, resgates e modificacoes de arquivo.

## Por que a interface importa

Quando multiplas pessoas trabalham no mesmo repositorio e enviam commits para o GitHub, a interface web se torna o ponto central de visibilidade. Voce nao precisa clonar o repositorio ou abrir o terminal para entender o que aconteceu — basta navegar pelos commits na web.

## O modelo mental de "viagem no tempo"

O instrutor usa implicitamente a analogia de viagem no tempo:
- **git log / lista de commits** = linha do tempo do projeto
- **Clicar em um commit** = ver o que mudou naquele momento
- **Browse files (`<>`)** = "teletransportar" para aquele momento e ver o projeto inteiro
- **Selecionar main** = voltar ao presente

A limitacao importante: quando voce esta no passado, so pode ir mais para o passado. Nao existe "proximo commit" na interface. O unico caminho de volta e selecionar a branch main no dropdown.

## Como o git mostra diferencas

O instrutor destaca um ponto que confunde iniciantes: quando voce modifica uma linha, o git nao mostra "linha editada". Ele mostra a linha antiga removida (vermelho) e a linha nova adicionada (verde). Isso acontece porque o git trabalha no nivel de linhas — qualquer caractere diferente faz o git tratar como um bloco completamente novo.

Exemplo do instrutor: uma linha parecia identica, mas tinha um caractere diferente, e o git mostrou como remocao + adicao completa.

## Commits de delecao e resgate

O instrutor mostra dois momentos especificos:
1. **Commit de delecao**: todo o conteudo do arquivo aparece em vermelho (removido)
2. **Commit de resgate**: todo o conteudo aparece em verde (adicionado de volta)

Ao usar "Browse files" no commit de delecao, o projeto aparece vazio (sem o arquivo). Ao navegar para o commit anterior, o arquivo ainda existe.

## Branches e tags na interface

O seletor de branch/tag permite:
- **Branches**: navegar entre diferentes linhas de desenvolvimento
- **Tags**: navegar para versoes marcadas (releases)
- O instrutor menciona que tags sao "outra conversa" — nao e o foco da aula

## Equivalencia CLI ↔ Interface (insight do instrutor)

O instrutor faz questao de conectar cada acao na interface ao comando git correspondente:
- "git checkout id — e isso que eu estou fazendo ao clicar aqui"
- "git checkout main — e isso aqui"
- "git log — e esse cara aqui"

Essa conexao e pedagogicamente importante: a interface nao e magica, ela executa os mesmos conceitos do terminal.