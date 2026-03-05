# Deep Explanation: Comentarios vs Documentacao

## O insight central do Diego Fernandes

A confusao entre comentarios e documentacao eh um dos erros mais comuns. Sao coisas fundamentalmente diferentes:

- **Comentario** = aviso para o proximo desenvolvedor sobre POR QUE algo foi feito de forma especifica
- **Documentacao** = explicacao estruturada sobre regras de negocio, fluxos, arquitetura (pertence a ferramentas dedicadas)

## Por que documentacao em comentarios falha

Diego destaca um problema pratico inevitavel: **documentacao ja eh dificil de manter em ferramentas dedicadas. Documentacao em comentarios eh praticamente impossivel de manter.**

O ciclo de morte:
1. Dev A escreve comentario-documentacao detalhado
2. Dev B altera o codigo mas nao atualiza o comentario
3. Comentario fica desatualizado
4. Dev C le o comentario desatualizado, fica confuso
5. Dev D remove o comentario por frustacao
6. Ninguem mais entende o codigo

## Nao seja extremista

Diego faz questao de abrir com esse ponto: ele ja viu gente defender que codigo NUNCA pode ter comentario (deve ser "autodocumentado"). Isso eh tao errado quanto comentar tudo.

A posicao equilibrada: codigo deve ser autoexplicativo sobre O QUE faz (via bons nomes), mas comentarios sao bem-vindos para explicar POR QUE algo foi feito de uma forma especifica.

## O caso classico: workaround de biblioteca

O exemplo mais comum em codebases grandes, segundo Diego:
- Voce usa uma biblioteca
- Uma funcionalidade tem um bug ou limitacao
- Voce precisa contornar o problema escrevendo codigo "estranho"
- Sem comentario, o proximo dev vai achar que eh ma pratica e tentar "corrigir"

A solucao ideal:
```
// Este codigo foi escrito assim porque a biblioteca X ainda nao suporta Y
// Ref: https://github.com/lib/repo/issues/123
```

O proximo dev pode:
1. Entender que nao foi erro
2. Verificar se a issue ja foi resolvida
3. Atualizar a biblioteca e remover o workaround

## Regras de negocio complexas

Para regras de negocio complexas, Diego recomenda documentacao dedicada:
- Diagramas de sequencia
- Diagramas de caso de uso
- Documentacao estruturada separada

Colocar isso em comentarios eh tentar usar a ferramenta errada para o trabalho.