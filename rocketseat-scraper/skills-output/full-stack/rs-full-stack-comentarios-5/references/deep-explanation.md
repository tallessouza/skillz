# Deep Explanation: Comentarios em JavaScript

## O que sao comentarios

Comentarios sao anotacoes no codigo que o navegador (ou runtime) ignora completamente durante a execucao. Quando o interpretador JavaScript encontra `//` ou `/* */`, ele sabe que aquele trecho e destinado ao desenvolvedor, nao a maquina.

## A evolucao natural dos comentarios

O instrutor compartilha uma observacao importante baseada em experiencia propria: no inicio da carreira, ele comentava extensivamente — explicando o que cada funcao fazia, como chegou em determinado raciocinio, porque tinha medo de nao lembrar depois de um ou dois meses.

Com o tempo, o codigo vai ficando mais **auto-explicativo**:
- Nomes de variaveis descritivos substituem comentarios
- Funcoes pequenas e focadas dispensam explicacao
- Padroes conhecidos sao reconhecidos instantaneamente

Essa e uma progressao natural: **mais comentarios no inicio, menos com experiencia**. Nao e que comentarios sejam ruins — e que codigo bom precisa de menos deles.

## Quando comentarios agregam valor real

1. **Fixacao de aprendizado** — Enquanto estuda, escrever comentarios ajuda a processar e memorizar conceitos. E como fazer anotacoes em um caderno.

2. **Raciocinio nao obvio** — Quando a solucao exigiu um workaround ou decisao nao intuitiva, o comentario preserva o "porquê" para o futuro.

3. **Contexto de negocio** — O codigo mostra o "como", mas regras de negocio especificas (exigencias contratuais, limites regulatorios) precisam de contexto escrito.

4. **TODOs e lembretes** — Marcacoes temporarias sobre melhorias planejadas.

## Quando comentarios atrapalham

- **Comentarios obvios** — `// incrementa i` acima de `i++` adiciona ruido visual sem informacao
- **Comentarios desatualizados** — Pior que nenhum comentario, porque mentem sobre o que o codigo faz
- **Codigo comentado** — Linhas de codigo desativadas com `//` poluem o arquivo; o controle de versao (git) ja guarda todo historico

## Sintaxe detalhada

### Uma linha: `//`

Tudo apos `//` ate o final da linha e ignorado. Pode conter acentos, numeros, caracteres especiais — qualquer texto livre.

Posicionamento:
- **Acima da linha**: para contexto geral
- **Ao lado da linha**: para anotacao especifica daquele comando

### Multiplas linhas: `/* */`

Tudo entre `/*` e `*/` e ignorado, incluindo quebras de linha. Ideal para blocos explicativos maiores, cabecalhos de secao, ou documentacao inline mais extensa.

Dentro do bloco, voce pode usar qualquer formatacao: bullets, listas, paragrafos.

## Analogia do instrutor

Comentarios sao como post-its no caderno de estudos. No inicio voce cola muitos para lembrar de tudo. Conforme domina o assunto, os post-its vao sumindo porque o conhecimento ja esta internalizado. O codigo segue a mesma logica.