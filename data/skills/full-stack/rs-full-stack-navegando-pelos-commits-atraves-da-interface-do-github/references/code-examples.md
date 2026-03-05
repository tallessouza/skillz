# Code Examples: Navegando Pelos Commits na Interface do GitHub

## Comandos CLI equivalentes

### Ver historico de commits (equivalente a clicar em "Commits" no GitHub)

```bash
# No terminal
git log

# Saida tipica
commit abc1234 (HEAD -> main)
Author: Mike <mike@email.com>
Date:   Mon Jan 15 10:30:00 2026

    resgatando arquivo

commit def5678
Author: Mike <mike@email.com>
Date:   Mon Jan 15 10:00:00 2026

    deletando arquivo

commit 789abcd
Author: Mike <mike@email.com>
Date:   Mon Jan 15 09:30:00 2026

    primeiro commit
```

Na interface do GitHub, cada linha acima e um item clicavel na lista de commits.

### Ver alteracoes de um commit (equivalente a clicar no commit)

```bash
# No terminal
git show abc1234

# Mostra o diff com linhas + e -
```

Na interface, o GitHub renderiza isso como blocos vermelhos (removido) e verdes (adicionado).

### Navegar para um momento especifico (equivalente a "Browse files")

```bash
# No terminal — vai para o estado do projeto naquele commit
git checkout def5678

# Voce entra em "detached HEAD" — esta no passado
```

Na interface, clicar no icone `<>` (Browse files) faz o equivalente sem o conceito de detached HEAD.

### Voltar ao presente (equivalente a selecionar "main" no dropdown)

```bash
# No terminal
git checkout main
```

## Cenarios de navegacao na interface

### Cenario 1: Encontrar quando um arquivo foi deletado

1. Ir em "Commits"
2. Procurar o commit com mensagem de delecao
3. Clicar no commit → arquivo aparece todo em vermelho
4. Para ver o arquivo antes da delecao: voltar um commit e usar "Browse files"

### Cenario 2: Ver o projeto em um estado anterior

1. Ir em "Commits"
2. Clicar no commit desejado
3. Clicar no icone "Browse files" (`<>`)
4. Navegar pelos arquivos como se fosse o projeto naquele momento
5. Para voltar: selecionar "main" no seletor de branch

### Cenario 3: Entender uma modificacao confusa

1. Clicar no commit
2. Ver o diff linha a linha
3. Lembrar: linha "modificada" = remocao da antiga + adicao da nova
4. Qualquer caractere diferente gera um bloco novo no diff

### Cenario 4: Navegar entre branches

1. No seletor de branch (dropdown no topo do repositorio)
2. Selecionar a branch desejada
3. A visualizacao muda para o estado mais recente daquela branch
4. Commits mostrarao apenas o historico daquela branch