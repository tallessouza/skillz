# Deep Explanation: Alterando e Commitando

## O fluxo mental do Git: modificar → verificar → staged → commit

O instrutor enfatiza que o mais importante nao e decorar cada detalhe da saida dos comandos, mas **entender o fluxo**. O Git funciona como um gerenciador de historico — cada commit e um "ponto na historia" do seu projeto.

### Por que o Git rastreia automaticamente?

Quando voce faz `git add` de um arquivo pela primeira vez, o Git comeca a rastrear esse arquivo. A partir desse momento, **qualquer modificacao** e detectada automaticamente pelo `git status`. Voce nao precisa "registrar" o arquivo novamente — so precisa decidir se quer colocar a mudanca no staged ou nao.

O instrutor destaca: "Olha que legal, voce nao precisa mais ficar colocando o arquivo em algum lugar do git pra ele entender. O git ja esta rastreando esse arquivo, qualquer modificacao ele ja avisa aqui pra voce."

### Staged area como filtro intencional

O staged area e o "filtro" entre modificar e commitar. Existem dois caminhos apos modificar:

1. **Satisfeito com as mudancas** → `git add arquivo` → coloca no staged → pronto para commit
2. **Insatisfeito com as mudancas** → `git restore arquivo` → volta ao estado do ultimo commit

O proprio Git sugere esses dois caminhos na saida do `git status`. Isso e o que o instrutor chama de "gerenciador" — voce tem controle total sobre o que entra e o que nao entra na historia.

### A saida do commit: nao precisa decorar tudo

Quando voce faz um commit, o Git mostra:
- Um novo ID (hash do commit)
- Quantos arquivos foram modificados
- Quantas insercoes e delecoes

O instrutor explica: "Essa mensagem, voce nao precisa ficar tentando adivinhar o que ela e." Ele menciona que as insercoes e delecoes correspondem as linhas adicionadas/removidas, mas que **entender o fluxo** e mais importante do que interpretar cada numero.

### Por que adicionar arquivos especificos?

O instrutor mostra explicitamente que ao ter um `.DS_Store` nao rastreado, ele escolhe **nao** adicionar todos os arquivos. Ele diz: "Nao quero adicionar todos, o DSStore eu nao quero adicionar." Isso ensina a pratica de staging seletivo — voce decide arquivo por arquivo o que entra no commit.

### O conceito de "ponto na historia"

O instrutor usa a metafora de "criar um ponto na historia" para explicar commits. Cada commit e um snapshot do estado dos seus arquivos naquele momento. A mensagem do commit descreve o que aconteceu naquele ponto especifico.

### Controle de versao como gerenciador

A conclusao do instrutor: "Isso e um gerenciador, e assim que voce vai tendo um rastreamento de todos os seus arquivos, gerenciando legal, e pra isso que serve um controle de versao."

O valor do Git nao e so salvar arquivos — e ter visibilidade e controle sobre cada mudanca, poder decidir o que entra e o que nao entra, e poder voltar atras quando necessario.