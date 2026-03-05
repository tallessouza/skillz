# Deep Explanation: Iniciando Um Repositório Git

## O que `git init` realmente faz

Quando voce executa `git init`, o Git cria uma pasta oculta chamada `.git/` dentro do seu projeto. Essa pasta contem toda a estrutura necessaria para o versionamento:

- `objects/` — onde o Git armazena os snapshots dos arquivos
- `refs/` — referencias para branches e tags
- `HEAD` — ponteiro para o branch atual
- `config` — configuracoes locais do repositorio

Visualmente nada muda no projeto. Os arquivos continuam os mesmos. Mas agora o Git esta "observando" aquela pasta, pronto para rastrear mudancas.

## Navegacao no terminal: por que e fundamental

O instrutor enfatiza que saber navegar no terminal e **pre-requisito** para usar Git. Nao importa qual terminal voce usa, se e colorido ou nao, se tem informacoes extras — o que importa e chegar na pasta certa.

### O comando `cd`

`cd` significa **change directory** (mude de diretorio). E o comando universal para navegacao:
- Funciona no Mac, Linux e Git Bash no Windows
- Recebe como argumento o caminho da pasta destino
- Pode ser caminho absoluto (`/Users/mike/projeto`) ou relativo (`../outra-pasta`)

### O comando `pwd`

`pwd` significa **print working directory**. Ele confirma onde voce esta. O instrutor recomenda usar sempre antes de executar `git init` para garantir que esta no lugar certo.

### Diferenca de caminhos por sistema operacional

O instrutor destaca que cada SO tem sua convencao:
- **Mac/Linux (Unix):** Raiz e `/`, caminhos usam `/`. Ex: `/Users/mike/Desktop/git-aula`
- **Windows:** Raiz e geralmente `C:\`, caminhos usam `\`. Ex: `C:\git-aula`
- **Git Bash no Windows:** Converte para formato Unix. Ex: `/c/git-aula`

### Dica do instrutor (Mac)

No Mac, voce pode arrastar a pasta do Finder direto para o terminal, e ele preenche o caminho automaticamente. Isso nao funciona em todos os sistemas operacionais, por isso e importante saber o caminho manualmente.

## Simplicidade intencional

O instrutor enfatiza que o processo e "o jeito mais simples do mundo". Dois comandos:
1. `cd` para chegar na pasta
2. `git init` para iniciar

Nao precisa de configuracao extra, nao precisa de conta em nenhum servico, nao precisa de internet. E 100% local.

## O que NAO acontece com `git init`

- Nao cria commits automaticamente
- Nao rastreia arquivos automaticamente (precisa de `git add`)
- Nao conecta com GitHub ou qualquer remoto
- Nao altera nenhum arquivo do projeto